/**
 * Initialize navigation functionality
 */
export function initNavigation() {
    const mobileNavTrigger = document.getElementById('nav-mobile');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');

    if (!mobileNavTrigger || !mobileNav || !mobileNavContainer) return;

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
}
