// Add data caching to avoid multiple fetches
let cachedUserData = null;
let cachedRepos = null;
let isFetching = false;

/**
 * Preload GitHub data without rendering
 * @returns {Promise} Promise that resolves when data is loaded
 */
export function preloadGitHubData() {
    // Skip if we already have data or are currently fetching
    if ((cachedUserData && cachedRepos) || isFetching) {
        return Promise.resolve();
    }

    isFetching = true;

    return Promise.all([
        fetch('https://api.github.com/users/emilanderss0n'),
        fetch('https://api.github.com/users/emilanderss0n/repos?sort=updated')
    ])
        .then(([userResponse, reposResponse]) =>
            Promise.all([userResponse.json(), reposResponse.json()])
        )
        .then(([userData, repos]) => {
            cachedUserData = userData;
            cachedRepos = repos;
            isFetching = false;
        })
        .catch(error => {
            console.warn('Failed to preload GitHub data:', error);
            isFetching = false;
        });
}

/**
 * Render GitHub data in the container
 * @param {HTMLElement} container The container to render GitHub data into
 */
export async function loadGitHubRepositories(container) {
    if (!container) return;

    container.innerHTML = '<div class="loading-repos">Loading repositories...</div>';

    // If we're already loading, wait for it to complete
    if (isFetching) {
        const waitForLoad = async () => {
            while (isFetching) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        };
        await waitForLoad();
    }

    try {
        // Use cached data if available, otherwise fetch it
        let userData = cachedUserData;
        let repos = cachedRepos;

        if (!userData || !repos) {
            isFetching = true;

            const [userResponse, reposResponse] = await Promise.all([
                fetch('https://api.github.com/users/emilanderss0n'),
                fetch('https://api.github.com/users/emilanderss0n/repos?sort=updated&per_page=6')
            ]);

            userData = await userResponse.json();
            repos = await reposResponse.json();

            // Update cache
            cachedUserData = userData;
            cachedRepos = repos;
            isFetching = false;
        }

        if (repos.length === 0) {
            container.innerHTML = '<p>No public repositories found.</p>';
            return;
        }

        // Render the data
        const userBadge = `
            <div class="github-header">
                <div class="user-badge">
                    <div class="github-brand">
                        <i class="bi bi-github"></i>
                        <span>GitHub Repositories</span>
                    </div>
                    <div class="github-user">
                        <img class="avatar" src="${userData.avatar_url}" alt="Profile picture" />
                        <a href="${userData.html_url}" target="_blank">emilanderss0n</a>
                    </div>
                </div>
            </div>`;

        let reposHtml = '';

        repos.forEach(repo => {
            reposHtml += `
            <a class="repo-item ${repo.language === 'C#' ? 'csharp' : (repo.language || 'Misc')}" href="${repo.html_url}" target="_blank">
                <div class="repo-content">
                    <h4>${repo.name}</h4>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="repo-details">
                        <span class="tag sm"><i class="bi bi-code-slash"></i> ${repo.language || 'Misc'}</span>
                    </div>
                </div>
            </a>
            `;
        });

        container.innerHTML = userBadge + reposHtml;

    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        container.innerHTML = '<p>Failed to load GitHub repositories. Please try again later.</p>';
    }
}

/**
 * Reset GitHub data cache
 */
export function clearGitHubCache() {
    cachedUserData = null;
    cachedRepos = null;
    isFetching = false;
}
