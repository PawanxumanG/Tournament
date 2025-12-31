
import { AppData } from '../types.ts';
import { MOCK_DATA } from '../constants.ts';
import { getGitHubConfig } from './githubService.ts';

export const fetchAppData = async (): Promise<AppData> => {
  try {
    // Determine the base path for relative fetches
    const pathParts = window.location.pathname.split('/');
    const isSubfolder = pathParts.length > 2;
    const jsonPath = isSubfolder ? `./tournaments.json` : 'tournaments.json';

    // 1. Fetch local tournaments.json
    const localRes = await fetch(jsonPath);
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
