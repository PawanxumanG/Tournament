import { AppData } from '../types.ts';
import { MOCK_DATA } from '../constants.ts';
import { getGitHubConfig } from './githubService.ts';

export const fetchAppData = async (): Promise<AppData> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

  try {
    // 1. Try local tournaments.json
    const localRes = await fetch('./tournaments.json', { 
      cache: 'no-cache',
      signal: controller.signal 
    });
    
    if (localRes.ok) {
      clearTimeout(timeoutId);
      return await localRes.json();
    }
    
    // 2. Try GitHub sync if configured
    const ghConfig = getGitHubConfig();
    if (ghConfig && ghConfig.owner && ghConfig.repo) {
      const githubUrl = `https://raw.githubusercontent.com/${ghConfig.owner}/${ghConfig.repo}/${ghConfig.branch}/${ghConfig.path}`;
      const githubRes = await fetch(githubUrl, { signal: controller.signal });
      if (githubRes.ok) {
        clearTimeout(timeoutId);
        return await githubRes.json();
      }
    }
    
    clearTimeout(timeoutId);
    return MOCK_DATA;
  } catch (error) {
    console.warn('Network sync timed out or failed, using defaults:', error);
    clearTimeout(timeoutId);
    return MOCK_DATA;
  }
};