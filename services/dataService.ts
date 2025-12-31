
import { AppData } from '../types.ts';
import { MOCK_DATA } from '../constants.ts';
import { getGitHubConfig } from './githubService.ts';

export const fetchAppData = async (): Promise<AppData> => {
  try {
    // 1. Use relative path './' to ensure it works in subdirectories on GitHub Pages
    const localRes = await fetch('./tournaments.json');
    if (localRes.ok) return await localRes.json();
    
    // 2. Try fetching from the configured GitHub repository
    const ghConfig = getGitHubConfig();
    if (ghConfig && ghConfig.owner && ghConfig.repo) {
      const githubUrl = `https://raw.githubusercontent.com/${ghConfig.owner}/${ghConfig.repo}/${ghConfig.branch}/${ghConfig.path}`;
      const githubRes = await fetch(githubUrl);
      if (githubRes.ok) return await githubRes.json();
    }
    
    console.warn('Sync sources unavailable, using fallback data');
    return MOCK_DATA;
  } catch (error) {
    console.error('Data sync failed:', error);
    return MOCK_DATA;
  }
};
