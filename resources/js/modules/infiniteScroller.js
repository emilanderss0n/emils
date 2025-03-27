/**
 * Initialize infinite scroll animation for portfolio items
 */
export function initInfiniteScrollAnimation() {
    const scroller = document.querySelector('.portfolio-grid-scroller');
    const scrollerInner = document.querySelector('.portfolio-grid-wrapper');
    if (!scrollerInner || !scroller) return;

    // Clear any existing animation configuration
    if (scrollerInner._scrollAnimation) {
        if (scrollerInner._scrollAnimation.rafId) {
            cancelAnimationFrame(scrollerInner._scrollAnimation.rafId);
        }
        scrollerInner._scrollAnimation = null;
    }

    // First remove any existing clones to start fresh
    scrollerInner.querySelectorAll('[aria-hidden="true"]').forEach(clone => clone.remove());

    // Get the original items
    const scrollerContent = Array.from(scrollerInner.children);

    // Calculate dimensions
    const scrollerWidth = scroller.offsetWidth;
    const totalItemWidth = scrollerContent.reduce((total, item) => {
        const style = window.getComputedStyle(item);
        const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        const gapValue = 2 * 16; // The 2rem gap value in pixels
        return total + item.offsetWidth + margin + gapValue;
    }, 0);

    // Calculate how many full sets we need to cover the screen at least twice
    // This ensures we always have enough items visible
    const setsNeeded = Math.ceil((scrollerWidth * 2) / totalItemWidth) + 1;

    // Add clones to ensure no gaps
    for (let i = 0; i < setsNeeded; i++) {
        scrollerContent.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            scrollerInner.appendChild(clone);
        });
    }

    // Setup animation configuration
    const config = {
        pixelsPerSecond: 100, // Adjust speed as needed (pixels per second)
        currentPosition: 0,
        isPaused: false,
        lastTimestamp: 0,
        rafId: null
    };

    // Store animation config on element for access in event handlers
    scrollerInner._scrollAnimation = config;

    // Calculate the width of one set of original items
    const itemSetWidth = totalItemWidth;

    // Use requestAnimationFrame for smooth animation
    function step(timestamp) {
        if (!scrollerInner._scrollAnimation) return; // Animation was stopped

        // Skip first frame initialization
        if (!config.lastTimestamp) {
            config.lastTimestamp = timestamp;
            config.rafId = requestAnimationFrame(step);
            return;
        }

        // Calculate elapsed time and move only if not paused
        const elapsed = timestamp - config.lastTimestamp;
        if (!config.isPaused) {
            // Move based on elapsed time for consistent speed
            const pixelsToMove = (config.pixelsPerSecond * elapsed) / 1000;
            config.currentPosition -= pixelsToMove;

            // Reset position when we've scrolled the width of the original content
            if (Math.abs(config.currentPosition) >= itemSetWidth) {
                config.currentPosition += itemSetWidth;
            }

            // Apply the transform
            scrollerInner.style.transform = `translateX(${config.currentPosition}px)`;
        }

        config.lastTimestamp = timestamp;
        config.rafId = requestAnimationFrame(step);
    }

    // Start the animation
    config.rafId = requestAnimationFrame(step);

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (scrollerInner._scrollAnimation && scrollerInner._scrollAnimation.rafId) {
            cancelAnimationFrame(scrollerInner._scrollAnimation.rafId);
            scrollerInner._scrollAnimation = null;
        }
    });
}
