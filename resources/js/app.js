import './bootstrap';

// Scroll Reveal

const sr = ScrollReveal({
    origin: 'bottom',
    distance: '50px',
    duration: 1000,
    reset: true
})

sr.reveal('.presentation h1', {})
sr.reveal('.presentation p', { delay: 200 })
sr.reveal('.hero-actions', { delay: 400 })
sr.reveal('.home-social', { delay: 400, })

sr.reveal('.front-portfolio-top', {})
sr.reveal('.front-portfolio-list', { delay: 200 })

sr.reveal('.services-grid', { delay: 0 })
sr.reveal('.front-blog-top', { delay: 0 })
sr.reveal('.front-blog-list', { delay: 200 })
sr.reveal('.call-content', { delay: 400 })

sr.reveal('.portfolio-top', { delay: 0, reset: false })
sr.reveal('.portfolio-grid', { delay: 200, reset: false })

sr.reveal('.blog-header', { delay: 0, reset: false })
sr.reveal('.blog-grid', { delay: 200, reset: false })

sr.reveal('.contact-layout', { delay: 0, reset: false })

sr.reveal('.work-detail-header', { delay: 0, reset: false })
sr.reveal('.work-content-body', { delay: 200, reset: false })
sr.reveal('.work-images', { delay: 200, reset: false })

sr.reveal('.blog-post-header', { delay: 0, reset: false })
sr.reveal('.blog-content', { delay: 200, reset: false })
sr.reveal('.blog-footer', { delay: 0, reset: false })