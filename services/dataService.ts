import { AppData } from '../types.ts';
import { MOCK_DATA } from '../constants.ts';
import { getGitHubConfig } from './githubService.ts';

export const fetchAppData = async (): Promise<AppData> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); 

  try {
    // 1. Try local tournaments.json
    const localRes = await fetch('./tournaments.json', { 
      cache: 'no-cache',
      signal: controller.signal 
    });
    
    if (localRes.ok) {
      const text = await localRes.text();
      try {
        clearTimeout(timeoutId);
        return JSON.parse(text);
      } catch (e) {
        console.warn('tournaments.json is not valid JSON, falling back');
      }
    }
    
    // 2. Try GitHub sync if configured
    const ghConfig = getGitHubConfig();
    if (ghConfig && ghConfig.owner && ghConfig.repo) {
      const githubUrl = `https://raw.githubusercontent.com/${ghConfig.owner}/${ghConfig.repo}/${ghConfig.branch}/${ghConfig.path}`;
      const githubRes = await fetch(githubUrl, { signal: controller.signal });
      if (githubRes.ok) {
        const ghText = await githubRes.text();
        try {
          clearTimeout(timeoutId);
          return JSON.parse(ghText);
        } catch (e) {
          console.warn('GitHub data is not valid JSON');
        }
      }
    }
    
    clearTimeout(timeoutId);
    return MOCK_DATA;
  } catch (error) {
    console.warn('Data fetch failed, using defaults:', error);
    clearTimeout(timeoutId);
    return MOCK_DATA;
  }
};