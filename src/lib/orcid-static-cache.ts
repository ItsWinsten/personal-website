// Build-time only cache for ORCID publications
// Data is fetched ONCE during build and embedded into the static site
// To update: rebuild and redeploy

import fs from 'node:fs';
import path from 'node:path';

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

const CACHE_DIR = path.join(process.cwd(), '.astro', 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'orcid-data.json');

let buildTimeCache: CacheData | null = null;

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
  if (buildTimeCache !== null) {
    console.log('Using build-time cached ORCID data');
    return buildTimeCache;
  }

  if (fs.existsSync(CACHE_FILE)) {
    try {
      const cacheContent = fs.readFileSync(CACHE_FILE, 'utf-8');
      const cached: CacheData = JSON.parse(cacheContent);
      console.log(`Using file cached ORCID data from ${cached.lastUpdated}`);
      buildTimeCache = cached;
      return cached;
    } catch (error) {
      console.warn('Failed to read cache, fetching fresh data:', error);
    }
  } else {
    console.log('No cache found, fetching fresh data...');
  }

  console.log('Fetching ORCID data for build...');
  const { publications, fetchError } = await fetchOrcidData(orcidId);
  
  const cacheData: CacheData = {
    publications,
    fetchError,
    lastUpdated: new Date().toISOString(),
  };

  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    console.log('Cache saved successfully');
  } catch (error) {
    console.warn('Failed to write cache:', error);
  }

  buildTimeCache = cacheData;
  
  return cacheData;
}

export type { OrcidWork, CacheData };
