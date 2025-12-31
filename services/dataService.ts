
import { AppData } from '../types.ts';
import { MOCK_DATA } from '../constants.ts';

const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/username/repo/main/tournaments.json';

export const fetchAppData = async (): Promise<AppData> => {
  try {
    const localRes = await fetch('/tournaments.json');
    if (localRes.ok) return await localRes.json();
    
    const githubRes = await fetch(GITHUB_JSON_URL);
    if (githubRes.ok) return await githubRes.json();
    
    console.warn('Using mock data as fail-safe');
    return MOCK_DATA;
  } catch (error) {
    console.error('Fetch failed, using mock data', error);
    return MOCK_DATA;
  }
};
