import { AppData } from '../types.ts';
import { MOCK_DATA } from '../constants.ts';
import { getGitHubConfig } from './githubService.ts';

export const fetchAppData = async (): Promise<AppData> => {
  try {
    // 1. Fetch local tournaments.json relative to the current script
    // Browsers resolve 'tournaments.json' relative to the HTML location
    const localRes = await fetch('tournaments.json');
    if (localRes.ok) return await localRes.json();
    
    // 2. Try fetching from the configured GitHub repository
    const ghConfig = getGitHubConfig();
    if (ghConfig && ghConfig.owner && ghConfig.repo) {
      const githubUrl = `https://raw.githubusercontent.com/${ghConfig.owner}/${ghConfig.repo}/${ghConfig.branch}/${ghConfig.path}`;
      const githubRes = await fetch(githubUrl);
      if (githubRes.ok) return await githubRes.json();
    }
    
    return MOCK_DATA;
  } catch (error) {
    console.error('Data sync failed:', error);
    return MOCK_DATA;
  }
};