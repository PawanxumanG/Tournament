
export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  path: string;
  branch: string;
}

export const saveGitHubConfig = (config: GitHubConfig) => {
  localStorage.setItem('gh_config', JSON.stringify(config));
};

export const getGitHubConfig = (): GitHubConfig | null => {
  const saved = localStorage.getItem('gh_config');
  return saved ? JSON.parse(saved) : null;
};

export const pushToGitHub = async (data: any): Promise<{ success: boolean; message: string }> => {
  const config = getGitHubConfig();
  if (!config || !config.token) {
    return { success: false, message: 'GitHub configuration is missing.' };
  }

  try {
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
    
    // 1. Get the current file to get the SHA (required for updates)
    const getRes = await fetch(`${url}?ref=${config.branch}`, {
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let sha = '';
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    } else if (getRes.status !== 404) {
      return { success: false, message: 'Failed to fetch existing file metadata.' };
    }

    // 2. Push the updated content
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Update tournaments via Admin Panel [${new Date().toLocaleString()}]`,
        content: content,
        sha: sha || undefined,
        branch: config.branch
      })
    });

    if (putRes.ok) {
      return { success: true, message: 'Successfully published to GitHub!' };
    } else {
      const error = await putRes.json();
      return { success: false, message: error.message || 'Failed to update GitHub.' };
    }
  } catch (error) {
    return { success: false, message: 'An unexpected error occurred during sync.' };
  }
};
