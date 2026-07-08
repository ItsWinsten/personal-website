// Build-time only cache for ORCID publications.
// Astro prerenders the Research page, so this fetch runs during the Cloudflare
// Workers build and the resulting links/data are embedded into static HTML.
// The deployed Worker serves that HTML without calling ORCID at request time.

interface OrcidWork {
  title: string;
  year: number;
  type: string;
  doi?: string;
  url?: string;
  journal?: string;
}

interface CacheData {
  publications: OrcidWork[];
  fetchError: string | null;
  lastUpdated: string;
}

const buildTimeCache = new Map<string, CacheData>();
const inFlightFetches = new Map<string, Promise<CacheData>>();

async function fetchOrcidData(orcidId: string): Promise<{ publications: OrcidWork[]; fetchError: string | null }> {
  let publications: OrcidWork[] = [];
  let fetchError: string | null = null;

  try {
    console.log(`Fetching ORCID data for ${orcidId}...`);
    const response = await fetch(
      `https://pub.orcid.org/v3.0/${orcidId}/works`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json() as any;
      
      if (data.group) {
        publications = data.group.map((group: any) => {
          const workSummary = group['work-summary']?.[0];
          if (!workSummary) return null;

          const title = workSummary.title?.title?.value || 'Untitled';
          const year = workSummary['publication-date']?.year?.value || 'N/A';
          const type = workSummary.type || 'publication';
          
          let doi = null;
          let url = null;
          
          if (workSummary['external-ids']?.['external-id']) {
            const externalIds = workSummary['external-ids']['external-id'];
            const doiEntry = externalIds.find((id: any) => id['external-id-type'] === 'doi');
            if (doiEntry) {
              doi = doiEntry['external-id-value'];
              url = `https://doi.org/${doi}`;
            }
          }
          
          const journal = workSummary['journal-title']?.value;

          return {
            title,
            year: parseInt(year) || 0,
            type,
            doi,
            url,
            journal,
          };
        }).filter(Boolean);

        publications.sort((a, b) => b.year - a.year);
      }
      console.log(`Successfully fetched ${publications.length} publications`);
    } else {
      fetchError = `Failed to fetch from ORCID (Status: ${response.status})`;
      console.error(fetchError);
    }
  } catch (error) {
    fetchError = `Error fetching publications: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error('ORCID fetch error:', error);
  }

  return { publications, fetchError };
}

export async function getOrcidPublications(orcidId: string): Promise<CacheData> {
  const cached = buildTimeCache.get(orcidId);
  if (cached) {
    console.log(`Using build-time cached ORCID data for ${orcidId}`);
    return cached;
  }

  const inFlightFetch = inFlightFetches.get(orcidId);
  if (inFlightFetch) {
    console.log(`Using in-flight ORCID build fetch for ${orcidId}`);
    return inFlightFetch;
  }

  console.log('Fetching ORCID data for build...');
  const fetchPromise = (async () => {
    const { publications, fetchError } = await fetchOrcidData(orcidId);

    const cacheData: CacheData = {
      publications,
      fetchError,
      lastUpdated: new Date().toISOString(),
    };

    buildTimeCache.set(orcidId, cacheData);
    return cacheData;
  })();

  inFlightFetches.set(orcidId, fetchPromise);

  try {
    return await fetchPromise;
  } finally {
    inFlightFetches.delete(orcidId);
  }
}

export type { OrcidWork, CacheData };
