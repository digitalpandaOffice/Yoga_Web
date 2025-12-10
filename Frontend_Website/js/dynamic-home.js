document.addEventListener('DOMContentLoaded', () => {
    fetchHomeContent();
});

const API_URL = 'http://localhost/Yoga_Web/Yoga_Backend/content/home';

async function fetchHomeContent() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data) {
            updateHero(data.hero);
            updateAbout(data.about);
            updateStats(data.stats);
            updateFeatures(data.features);
            updateValues(data.values);
            updateHighlights(data.highlights);
            updateAuthority(data.authority);
            updateFooter(data.footer);
            updateNotifications(data.notifications);
        }
    } catch (error) {
    }
}

function updateHero(hero) {
    if (!hero) return;
    if (hero.title) {
        const titleEl = document.getElementById('hero-title');
        if (titleEl) titleEl.textContent = hero.title;
    }
    if (hero.subtitle) {
        const subtitleEl = document.getElementById('hero-subtitle');
        if (subtitleEl) subtitleEl.textContent = hero.subtitle;
    }
    if (hero.ctaText) {
        const ctaEl = document.getElementById('hero-cta-link');
        if (ctaEl) ctaEl.textContent = hero.ctaText;
    }
    if (hero.ctaLink) {
        const ctaLinkEl = document.getElementById('hero-cta-link');
        if (ctaLinkEl) ctaLinkEl.setAttribute('href', hero.ctaLink);
    }

    // Update background
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        if (hero.backgroundImages && Array.isArray(hero.backgroundImages) && hero.backgroundImages.length > 0) {
            // Slideshow mode
            heroSection.style.backgroundImage = 'none';

            let slideshowContainer = heroSection.querySelector('.hero-slideshow');
            if (!slideshowContainer) {
                slideshowContainer = document.createElement('div');
                slideshowContainer.className = 'hero-slideshow';
                const overlay = heroSection.querySelector('.hero-overlay');
                if (overlay) {
                    heroSection.insertBefore(slideshowContainer, overlay);
                } else {
                    heroSection.prepend(slideshowContainer);
                }
            }

            // Only update if images changed (simple check) or just rebuild
            slideshowContainer.innerHTML = hero.backgroundImages.map((img, index) =>
                `<div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${img}')"></div>`
            ).join('');

            // Start rotation
            if (heroSection._slideInterval) clearInterval(heroSection._slideInterval);

            const slides = slideshowContainer.querySelectorAll('.hero-slide');
            let currentSlide = 0;

            if (slides.length > 1) {
                heroSection._slideInterval = setInterval(() => {
                    slides[currentSlide].classList.remove('active');
                    currentSlide = (currentSlide + 1) % slides.length;
                    slides[currentSlide].classList.add('active');
                }, 5000);
            }

        } else if (hero.backgroundImage) {
            // Single image mode
            heroSection.style.backgroundImage = `url('${hero.backgroundImage}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';

            // Cleanup slideshow if exists
            const existingSlideshow = heroSection.querySelector('.hero-slideshow');
            if (existingSlideshow) existingSlideshow.remove();
            if (heroSection._slideInterval) clearInterval(heroSection._slideInterval);
        }
    }
}

function updateAbout(about) {
    if (!about) return;
    if (about.title) document.getElementById('about-title').textContent = about.title;
    if (about.subtitle) document.getElementById('about-subtitle').textContent = about.subtitle;
    if (about.story) document.getElementById('about-story').innerHTML = about.story; // Using innerHTML for bold tags
    if (about.vision) document.getElementById('about-vision').textContent = about.vision;
    if (about.mission) document.getElementById('about-mission').textContent = about.mission;
}

function updateStats(stats) {
    if (!stats) return;
    const container = document.getElementById('stats-grid');
    if (!container) return;

    // We can either update existing items if they have IDs, or rebuild the list.
    // Since the CMS allows adding/removing, rebuilding is safer.
    // However, the current CMS structure for stats is fixed fields (students, faculty, years, awards).
    // So we can just update the numbers if we map them correctly.
    // But the HTML structure is a list. Let's rebuild it to be safe and consistent with other lists.

    // Actually, the CMS statsData is an object: { students, faculty, years, awards }
    // So let's map these keys to labels.

    const statItems = [
        { value: stats.students, label: 'Students Trained', suffix: '+' },
        { value: stats.faculty, label: 'Expert Faculty', suffix: '+' },
        { value: stats.years, label: 'Years of Excellence', suffix: '+' },
        { value: stats.awards, label: 'Awards Won', suffix: '+' }
    ];

    container.innerHTML = statItems.map(item => `
        <div class="stat-item">
            <div class="stat-number">${item.value}${item.suffix}</div>
            <div class="stat-label">${item.label}</div>
        </div>
    `).join('');
}

function updateFeatures(features) {
    if (!features || !Array.isArray(features)) return;
    const container = document.getElementById('features-grid');
    if (!container) return;

    container.innerHTML = features.map(item => `
        <div class="feature-item">
            <div class="feature-icon">${item.icon}</div>
            <h5>${item.title}</h5>
            <p>${item.description}</p>
        </div>
    `).join('');
}

function updateValues(values) {
    if (!values || !Array.isArray(values)) return;
    const container = document.getElementById('values-grid');
    if (!container) return;

    container.innerHTML = values.map(item => `
        <div class="value-item">
            <div class="value-icon">${item.icon}</div>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
        </div>
    `).join('');
}

function updateHighlights(highlights) {
    if (!highlights || !Array.isArray(highlights)) return;
    const container = document.getElementById('highlights-grid');
    if (!container) return;

    const itemsHtml = highlights.map(item => `
        <figure class="highlight-item">
            <img src="${item.image}" alt="${item.title}">
            <figcaption>
                <strong>${item.title}</strong>
                <span>${item.date} • ${item.location}</span>
            </figcaption>
        </figure>
    `).join('');

    // Add the "See more" button at the end
    const moreBtnHtml = `
        <figure class="highlight-item more">
            <a class="btn outline" href="gallarysection.html">See more events</a>
        </figure>
    `;

    container.innerHTML = itemsHtml + moreBtnHtml;
}

function updateFooter(footer) {
    if (!footer) return;

    const contactP = document.getElementById('footer-contact');
    if (contactP) {
        contactP.innerHTML = `${footer.address}<br />Phone: ${footer.phone}<br />Email: ${footer.email}`;
    }

    const socialUl = document.getElementById('footer-social');
    if (socialUl) {
        let socialHtml = '';
        if (footer.facebook) socialHtml += `<li><a href="${footer.facebook}" aria-label="Facebook">Facebook</a></li>`;
        if (footer.instagram) socialHtml += `<li><a href="${footer.instagram}" aria-label="Instagram">Instagram</a></li>`;
        if (footer.youtube) socialHtml += `<li><a href="${footer.youtube}" aria-label="YouTube">YouTube</a></li>`;
        socialUl.innerHTML = socialHtml;
    }
}

function updateAuthority(authority) {
    if (!authority || !Array.isArray(authority)) return;
    const container = document.querySelector('.authority-grid');
    if (!container) return;

    container.innerHTML = authority.map(item => `
        <div class="authority-card">
            <img src="${item.image}" alt="${item.name}">
            <div class="authority-content">
                <h3>${item.name}</h3>
                <span class="role">${item.role}</span>
                <p>${item.bio}</p>
            </div>
        </div>
        </div>
    `).join('');
}

function updateNotifications(notifications) {
    if (!notifications || !Array.isArray(notifications) || notifications.length === 0) return;
    const container = document.getElementById('notifications-content');
    if (!container) return;

    // Build html: <span class="ticker-item"><a href="...">Text</a></span><span class="separator">|</span>...
    let html = '';
    notifications.forEach((item, index) => {
        let content = item.text;
        if (item.link) {
            content = `<a href="${item.link}" style="color: inherit; text-decoration: none; cursor: pointer;">${item.text}</a>`;
        }

        html += `<span class="ticker-item">${content}</span>`;
        if (index < notifications.length - 1) {
            html += `<span class="separator">|</span>`;
        }
    });

    // Make it loop seamlessly by duplicating content if needed, but for now simple list
    container.innerHTML = html;
}
