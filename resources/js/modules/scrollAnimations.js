/**
 * Initialize ScrollReveal animations
 */
export function initScrollReveal() {
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '50px',
        duration: '1000',
        reset: false
    });

    sr.reveal('.presentation h1', {});
    sr.reveal('.presentation p', { delay: 200 });
    sr.reveal('.hero-actions', { delay: 400 });
    sr.reveal('.hero-image', { delay: 600 });

    sr.reveal('.front-portfolio-top', {});

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

    sr.reveal('.services-grid', { beforeReveal: revealDone });

    sr.reveal('.front-blog-top', { delay: 0 });

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

    sr.reveal('.portfolio-top', { delay: 0 });

    sr.reveal('.portfolio-grid', { delay: 250 });

    sr.reveal('.blog-header', { delay: 0 });

    sr.reveal('.blog-grid', { delay: 250 });

    sr.reveal('.pagination', { delay: 200 });
    sr.reveal('.contact-layout', { delay: 0 });
    sr.reveal('.reason-contact-page .grid', { delay: 200 });
    sr.reveal('.work-detail-header', { delay: 0 });
    sr.reveal('.work-content-body', { delay: 200 });
    sr.reveal('.work-images', { delay: 200 });
    sr.reveal('#githubContent', { delay: 0 });
    sr.reveal('.blog-post', { delay: 0 });
    sr.reveal('.blog-footer', { delay: 0 });
    sr.reveal('.header-profile', { delay: 0 });
    sr.reveal('footer .container', { delay: 200 });
    sr.reveal('footer .info-footer', { delay: 300 });



    // Make sr available for other functions
    window.sr = sr;

    // Add portfolio reinitialization function
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
}

function revealDone(el) {
    el.classList.add('revealed');
}
