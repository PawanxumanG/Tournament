
import { AppData } from '../types';
import { MOCK_DATA } from '../constants';

const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/username/repo/main/tournaments.json'; // Users should replace this

export const fetchAppData = async (): Promise<AppData> => {
  try {
    // 1. Try local origin
    const localRes = await fetch('/tournaments.json');
    if (localRes.ok) return await localRes.json();
    
    // 2. Try GitHub
    const githubRes = await fetch(GITHUB_JSON_URL);
    if (githubRes.ok) return await githubRes.json();
    
    // 3. Fallback to mock
    console.warn('Using mock data as fail-safe');
    return MOCK_DATA;
  } catch (error) {
    console.error('Fetch failed, using mock data', error);
    return MOCK_DATA;
  }
};
