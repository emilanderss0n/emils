import './bootstrap';

// Scroll Reveal

const sr = ScrollReveal({
    origin: 'bottom',
    distance: '50px',
    duration: 1000,
    reset: false,
    viewFactor: 0.25,
})

sr.reveal('.presentation h1', {})
sr.reveal('.presentation p', { delay: 200 })
sr.reveal('.hero-actions', { delay: 400 })
sr.reveal('.hero-image', {})

sr.reveal('.front-portfolio-top', {})
sr.reveal('.front-portfolio-list', { delay: 200 })

sr.reveal('.services-grid', { beforeReveal: revealDone })

sr.reveal('.front-blog-top', { delay: 0 })
sr.reveal('.front-blog-list', { delay: 200 })
sr.reveal('.call-content', { delay: 400 })

sr.reveal('.portfolio-top', { delay: 0 })
sr.reveal('.portfolio-grid', { delay: 200 })

sr.reveal('.blog-header', { delay: 0 })
sr.reveal('.blog-grid', { delay: 200 })

sr.reveal('.contact-layout', { delay: 0 })

sr.reveal('.work-detail-header', { delay: 0 })
sr.reveal('.work-content-body', { delay: 200 })
sr.reveal('.work-images', { delay: 200 })

sr.reveal('.blog-post-header', { delay: 0 })
sr.reveal('.blog-content', { delay: 200 })
sr.reveal('.blog-footer', { delay: 0 })

sr.reveal('.header-profile', { delay: 0 })

function revealDone(el) {
    el.classList.add('revealed');
}

// Search Overlay Functionality
document.addEventListener('DOMContentLoaded', function () {
    const searchTrigger = document.getElementById('search-trigger');
    const searchClose = document.getElementById('search-close');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('dynamic-search-input');
    const searchResults = document.getElementById('search-results');
    let searchTimeout;

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
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const mobileNavTrigger = document.getElementById('nav-mobile');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');

    mobileNavTrigger.addEventListener('click', function () {
        if (mobileNav.classList.contains('open')) {
            // Close mobile menu
            mobileNavTrigger.classList.remove('open');
            mobileNavTrigger.classList.add('close-now');
            mobileNav.classList.remove('open');
            document.body.classList.remove('no-scroll');

            // Reset classes after animation completes
            setTimeout(() => {
                mobileNavTrigger.classList.remove('close-now');
                mobileNavContainer.classList.remove('animateIn');
            }, 400);
        } else {
            // Open mobile menu
            mobileNavTrigger.classList.add('open');
            mobileNav.classList.add('open');
            mobileNavContainer.classList.add('animateIn');
            document.body.classList.add('no-scroll');
        }
    });

});