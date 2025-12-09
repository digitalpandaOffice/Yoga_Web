document.addEventListener('DOMContentLoaded', () => {
    fetchPolicies();
});

const API_BASE_URL = 'http://localhost/Yoga_Web/Yoga_Backend';

async function fetchPolicies() {
    const navContainer = document.getElementById('policies-nav-list');
    const contentContainer = document.getElementById('policies-content-container');

    try {
        const response = await fetch(`${API_BASE_URL}/policy`);
        const policies = await response.json();

        if (!Array.isArray(policies) || policies.length === 0) {
            navContainer.innerHTML = '<li>No policies found.</li>';
            contentContainer.innerHTML = '<p style="padding: 20px;">No policies have been published yet.</p>';
            return;
        }

        // 1. Build Navigation
        navContainer.innerHTML = policies.map((policy, index) => {
            const anchorId = `policy-${policy.id}`;
            const activeClass = index === 0 ? 'class="active"' : '';
            return `<li><a href="#${anchorId}" ${activeClass}>${policy.title}</a></li>`;
        }).join('');

        // 2. Build Content
        contentContainer.innerHTML = policies.map((policy, index) => {
            const anchorId = `policy-${policy.id}`;
            return `
                <article id="${anchorId}" class="policy-section">
                    <h2>${policy.title}</h2>
                    <div class="policy-body">
                        ${policy.content}
                    </div>
                </article>
            `;
        }).join('');

        // 3. Re-initialize Sticky Nav Logic from original inline script
        initStickyNav();

    } catch (error) {
        console.error('Error fetching policies:', error);
        contentContainer.innerHTML = '<p style="color:red; padding: 20px;">Failed to load policies. Please try again later.</p>';
        navContainer.innerHTML = '';
    }
}

function initStickyNav() {
    const links = document.querySelectorAll('.policies-nav a');

    // Add click event for smooth scroll (optional, but good UX)
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Spy Logic
    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('.policy-section').forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}
