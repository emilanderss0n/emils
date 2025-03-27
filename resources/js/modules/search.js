let searchTimeout;

/**
 * Initialize search functionality
 */
export function initSearch() {
    const searchTrigger = document.getElementById('search-trigger');
    const searchClose = document.getElementById('search-close');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('dynamic-search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchOverlay || !searchInput || !searchResults) return;

    // Open search overlay
    if (searchTrigger) {
        searchTrigger.addEventListener('click', function () {
            searchOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        });
    }

    // Close search overlay
    if (searchClose) {
        searchClose.addEventListener('click', function () {
            searchOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            searchInput.value = '';
            searchResults.innerHTML = '<div class="search-initial-state"><p>Start typing to see results...</p></div>';
        });
    }

    // Close search overlay on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // Dynamic search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.trim();

            // Clear previous timeout
            clearTimeout(searchTimeout);

            if (query.length < 2) {
                searchResults.innerHTML = '<div class="search-initial-state"><p>Start typing to see results...</p></div>';
                return;
            }

            // Show loading state
            searchResults.innerHTML = '<div class="search-loading"><p>Searching...</p></div>';

            // Debounce the search to avoid too many requests
            searchTimeout = setTimeout(() => {
                fetch(`/api/search?q=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        renderSearchResults(data, query);
                    })
                    .catch(error => {
                        searchResults.innerHTML = '<div class="search-error"><p>Something went wrong. Please try again.</p></div>';
                        console.error('Search error:', error);
                    });
            }, 300);
        });
    }

    function renderSearchResults(data, query) {
        if (data.works.length === 0 && data.posts.length === 0 && data.pages.length === 0) {
            searchResults.innerHTML = `<div class="search-no-results"><p>No results found for "${query}"</p></div>`;
            return;
        }

        let html = '<div class="dynamic-search-results">';

        // Page suggestions
        if (data.pages.length > 0) {
            html += `<div class="search-section"><h3>Pages</h3><div class="pages-grid">`;
            data.pages.forEach(page => {
                html += `
                <a href="${page.route}" class="page-link">
                    <div class="page-card">
                        <i class="bi ${page.icon}"></i>
                        <h4>${page.name}</h4>
                        <p>${page.description}</p>
                    </div>
                </a>`;
            });
            html += '</div></div>';
        }

        if (data.works.length > 0) {
            html += `<div class="search-section"><h3>Works (${data.works.length})</h3><div class="work-grid">`;
            data.works.forEach(work => {
                html += `
                <a href="/work/${work.slug}" class="work-card-link">
                    <article class="work-card">
                        ${work.thumbnail ? `<img src="${work.thumbnail_url}" alt="${work.name}">` : ''}
                        <h4>${work.name}</h4>
                    </article>
                </a>`;
            });
            html += '</div></div>';
        }

        if (data.posts.length > 0) {
            html += `<div class="search-section"><h3>Blog Posts (${data.posts.length})</h3><div class="blog-grid">`;
            data.posts.forEach(post => {
                html += `
                <a href="/blog/${post.slug}" class="blog-card-link">
                    <article class="blog-card">
                        ${post.thumbnail ? `<img src="${post.thumbnail_url}" alt="${post.title}">` : ''}
                        <h4>${post.title}</h4>
                        <p>${post.excerpt}</p>
                    </article>
                </a>`;
            });
            html += '</div></div>';
        }

        html += '</div>';

        searchResults.innerHTML = html;
    }
}
