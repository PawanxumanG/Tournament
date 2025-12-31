import { AppData } from '../types.ts';
import { MOCK_DATA } from '../constants.ts';
import { getGitHubConfig } from './githubService.ts';

export const fetchAppData = async (): Promise<AppData> => {
  try {
    // Force cache refresh to ensure users don't see old tournaments
    const localRes = await fetch('./tournaments.json', { cache: 'no-cache' });
    if (localRes.ok) return await localRes.json();
    
    // Try fetching from the configured GitHub repository
    const ghConfig = getGitHubConfig();
    if (ghConfig && ghConfig.owner && ghConfig.repo) {
      const githubUrl = `https://raw.githubusercontent.com/${ghConfig.owner}/${ghConfig.repo}/${ghConfig.branch}/${ghConfig.path}`;
      const githubRes = await fetch(githubUrl);
      if (githubRes.ok) return await githubRes.json();
    }
    
    return MOCK_DATA;
  } catch (error) {
    console.warn('Sync failed, using defaults:', error);
    return MOCK_DATA;
  }
};