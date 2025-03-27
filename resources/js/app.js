import './bootstrap';
import { initScrollReveal } from './modules/scrollAnimations';
import { initSearch } from './modules/search';
import { initNavigation } from './modules/navigation';
import { generateTableOfContents, updateActiveTocItem } from './modules/tableOfContents';
import { initInfiniteScrollAnimation } from './modules/infiniteScroller';

document.addEventListener('DOMContentLoaded', function () {
    // Initialize scroll animations
    initScrollReveal();

    // Initialize navigation
    initNavigation();

    // Add blog item hover effects
    const blogItems = document.querySelectorAll(".front-blog-item");
    blogItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            blogItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector(".article__thumbnail").style.opacity = "0.5";
                }
            });
        });

        item.addEventListener("mouseleave", () => {
            blogItems.forEach(otherItem => {
                otherItem.querySelector(".article__thumbnail").style.opacity = "1";
            });
        });
    });

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

    // Add line animation to blog links
    const blogLinks = document.querySelectorAll('.blog-content a');
    blogLinks.forEach(link => {
        // Check if the link contains only text (no other HTML elements)
        if (link.childElementCount === 0) {
            link.classList.add('line-ani');
        }
    });

    // Conditionally load GitHub repositories only on work page
    const currentPath = window.location.pathname;
    const githubReposContainer = document.querySelector('#githubContent');
    if (currentPath === '/work' && githubReposContainer) {
        // Dynamically import GitHub repositories module
        import('./modules/githubRepositories').then(({ preloadGitHubData, loadGitHubRepositories }) => {
            preloadGitHubData().then(() => {
                loadGitHubRepositories(githubReposContainer);
            });
        }).catch(err => {
            console.warn('Could not load GitHub repositories:', err);
            if (githubReposContainer) {
                githubReposContainer.innerHTML = '<p>Could not load GitHub repositories. Please try again later.</p>';
            }
        });
    }

    // Initialize search functionality
    initSearch();

    // Generate table of contents for blog posts
    const blogPost = document.querySelector('.blog-post');
    if (blogPost) {
        generateTableOfContents();
        setTimeout(updateActiveTocItem, 500);
    }

    // Conditionally initialize shader gradient only on home and contact pages
    if (currentPath === '/' || currentPath === '/contact') {
        // Dynamically import the shaderGradient module only when needed
        import('./shaderGradient').then(({ initShaderGradient }) => {
            initShaderGradient('threeGradient', {
                color1: '#de139e',  // Red
                color2: '#000a88',  // Green
                color3: '#1636ab'   // Blue
            });
        }).catch(err => {
            console.warn('Could not load shader gradient:', err);
        });
    }

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Initialize infinite scroll animation for portfolio
    initInfiniteScrollAnimation();
});