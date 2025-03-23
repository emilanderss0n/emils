import './bootstrap';
import { initThree } from './three';
import { initShaderGradient } from './shaderGradient';

// Scroll Reveal

const sr = ScrollReveal({
    origin: 'bottom',
    distance: '50px',
    duration: 1000,
    reset: false
})

sr.reveal('.presentation h1', {})
sr.reveal('.presentation p', { delay: 200 })
sr.reveal('.hero-actions', { delay: 400 })
sr.reveal('.hero-image', {})

sr.reveal('.front-portfolio-top', {})

const frontWorkItems = document.querySelectorAll('.front-portfolio-item');
frontWorkItems.forEach((item, index) => {
    sr.reveal(item, {
        delay: 200 + (index * 100),
        distance: '50px',
        origin: 'bottom',
        opacity: 0,
        duration: 600,
        reset: false,
        mobile: true
    });
});

sr.reveal('.services-grid', { beforeReveal: revealDone })

sr.reveal('.front-blog-top', { delay: 0 })

const frontBlogItems = document.querySelectorAll('.front-blog-item');
frontBlogItems.forEach((item, index) => {
    sr.reveal(item, {
        delay: 200 + (index * 100),
        distance: '50px',
        origin: 'bottom',
        opacity: 0,
        duration: 600,
        reset: false,
        mobile: true
    });
});

sr.reveal('.call-content', { delay: 0 })

sr.reveal('.portfolio-top', { delay: 0 })

const workItems = document.querySelectorAll('.portfolio-grid-item');
workItems.forEach((item, index) => {
    sr.reveal(item, {
        delay: 0 + (index * 100),
        distance: '50px',
        origin: 'bottom',
        opacity: 0,
        duration: 600,
        reset: false,
        mobile: true
    });
});

sr.reveal('.blog-header', { delay: 0 })

const blogItems = document.querySelectorAll('.blog-grid .blog-item');
blogItems.forEach((item, index) => {
    sr.reveal(item, {
        delay: 0 + (index * 100),
        distance: '50px',
        origin: 'bottom',
        opacity: 0,
        duration: 600,
        reset: false,
        mobile: true
    });
});

sr.reveal('.pagination', { delay: 200 })

sr.reveal('.contact-layout', { delay: 0 })

sr.reveal('.work-detail-header', { delay: 0 })
sr.reveal('.work-content-body', { delay: 200 })
sr.reveal('.work-images', { delay: 200 })

sr.reveal('.blog-post', { delay: 0 })
sr.reveal('.blog-footer', { delay: 0 })

sr.reveal('.header-profile', { delay: 0 })

function revealDone(el) {
    el.classList.add('revealed');
}

// Portfolio animation function
window.reinitializePortfolioAnimation = function () {
    if (typeof sr === 'undefined') return;

    sr.clean('.portfolio-grid');
    sr.clean('.portfolio-grid-item');

    sr.reveal('.portfolio-grid', {
        delay: 0,
        distance: '50px',
        duration: 800,
        opacity: 0,
        easing: 'ease-out',
        reset: true,
        mobile: true,
        beforeReveal: revealDone
    });

    const items = document.querySelectorAll('.portfolio-grid-item');
    items.forEach((item, index) => {
        sr.reveal(item, {
            delay: 200 + (index * 100),
            distance: '50px',
            origin: 'bottom',
            opacity: 0,
            duration: 600,
            reset: false,
            mobile: true
        });
    });
};

// Add data caching to avoid multiple fetches
let cachedUserData = null;
let cachedRepos = null;
let isFetching = false;

/**
 * Preload GitHub data without rendering
 * @returns {Promise} Promise that resolves when data is loaded
 */
function preloadGitHubData() {
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
async function loadGitHubRepositories(container) {
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
                        <a href="${userData.html_url}" target="_blank">emilanderss0n</a>
                    </div>
                    <img class="avatar" src="${userData.avatar_url}" alt="Profile picture" />
                </div>
            </div>`;

        let reposHtml = '';

        repos.forEach(repo => {
            reposHtml += `
            <div class="repo-item ${repo.language === 'C#' ? 'csharp' : (repo.language || 'Misc')}">
                <div class="repo-content">
                    <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="repo-details">
                        <span class="tag sm"><i class="bi bi-code-slash"></i> ${repo.language || 'Misc'}</span>
                    </div>
                </div>
            </div>
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
function clearGitHubCache() {
    cachedUserData = null;
    cachedRepos = null;
    isFetching = false;
}

document.addEventListener('DOMContentLoaded', function () {
    const searchTrigger = document.getElementById('search-trigger');
    const searchClose = document.getElementById('search-close');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('dynamic-search-input');
    const searchResults = document.getElementById('search-results');
    let searchTimeout;

    const mobileNavTrigger = document.getElementById('nav-mobile');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');

    const blogLinks = document.querySelectorAll('.blog-content a');

    // Add header scroll functionality
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down & past threshold
            header.classList.add('header-hidden');
        } else {
            // Scrolling up
            header.classList.remove('header-hidden');
        }

        lastScrollTop = scrollTop;

        // Update active TOC item on scroll
        updateActiveTocItem();
    });

    // Function to generate and set up table of contents
    function generateTableOfContents() {
        const blogContent = document.querySelector('.blog-content');
        const tocContainer = document.getElementById('table-of-contents');

        if (!blogContent || !tocContainer) return;

        const headings = blogContent.querySelectorAll('h1, h2, h3, h4');
        const tocSection = document.querySelector('.blog-toc');

        // Skip TOC generation if there are 0-2 headings (not worth showing TOC)
        if (headings.length <= 2) {
            if (tocSection) tocSection.style.display = 'none';
            return;
        }

        // Clear the TOC container and create a simple links container
        tocContainer.innerHTML = '';
        const linksContainer = document.createElement('div');
        linksContainer.className = 'toc-links';
        tocContainer.appendChild(linksContainer);

        // Process all headings to add IDs if they don't have them
        headings.forEach((heading, index) => {
            if (!heading.id) {
                // Create an ID from the heading text
                let id = heading.textContent
                    .trim()
                    .toLowerCase()
                    .replace(/[^\w\s]/gi, '')
                    .replace(/\s+/g, '-');

                // Ensure uniqueness by adding index if needed
                if (document.getElementById(id)) {
                    id = `${id}-${index}`;
                }

                heading.id = id;
            }

            // Create link for the TOC
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            link.classList.add(heading.tagName.toLowerCase());

            // Add click handler for smooth scrolling
            link.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Smooth scroll to element
                    window.scrollTo({
                        top: targetElement.offsetTop - 90, // Adjust for header
                        behavior: 'smooth'
                    });

                    // Update URL without reloading page
                    history.pushState(null, null, `#${targetId}`);
                }
            });

            // Add the link to our container
            linksContainer.appendChild(link);
        });

        // Check for a hash in the URL and scroll to that element
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Small delay to ensure everything is loaded
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - 90,
                        behavior: 'smooth'
                    });
                }, 500);
            }
        }
    }

    // Function to update active TOC item based on scroll position
    function updateActiveTocItem() {
        const headings = document.querySelectorAll('.blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4');
        if (headings.length === 0) return;

        const tocLinks = document.querySelectorAll('.toc-links a');
        if (tocLinks.length === 0) return;

        // Get current scroll position with a small offset
        const scrollPosition = window.scrollY + 120;

        // Find the current heading
        let currentHeading = null;

        for (let i = 0; i < headings.length; i++) {
            if (headings[i].offsetTop <= scrollPosition) {
                currentHeading = headings[i];
            } else {
                break;
            }
        }

        // If we found a current heading, highlight it in the TOC
        if (currentHeading) {
            // Remove active class from all links
            tocLinks.forEach(link => link.classList.remove('active'));

            // Add active class to the corresponding TOC link
            const activeLink = document.querySelector(`.toc-links a[href="#${currentHeading.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    // Load GitHub repositories if we're on the about page
    const githubReposContainer = document.querySelector('#githubContent');
    if (githubReposContainer) {
        // Preload GitHub data and then render it
        preloadGitHubData().then(() => {
            loadGitHubRepositories(githubReposContainer);
        });
    }

    // Generate table of contents for blog posts
    const blogPost = document.querySelector('.blog-post');
    if (blogPost) {
        generateTableOfContents();
        // Initial update of active TOC item
        setTimeout(updateActiveTocItem, 500);
    }

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

    // Loop through each link
    blogLinks.forEach(link => {
        // Check if the link contains only text (no other HTML elements)
        if (link.childElementCount === 0) {
            link.classList.add('line-ani');
        }
    });

    // Example usage with custom colors
    initShaderGradient('threeGradient', {
        color1: '#de139e',  // Red
        color2: '#000a88',  // Green
        color3: '#1636ab'   // Blue
    });
});