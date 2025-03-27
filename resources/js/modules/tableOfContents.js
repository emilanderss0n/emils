/**
 * Generate and set up table of contents for blog posts
 */
export function generateTableOfContents() {
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

/**
 * Update active TOC item based on scroll position
 */
export function updateActiveTocItem() {
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
