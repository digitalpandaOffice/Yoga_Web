document.addEventListener('DOMContentLoaded', () => {
    fetchCareersContent();
});

const API_URL = 'http://localhost/Yoga_Web/Yoga_Backend/content/careers';

async function fetchCareersContent() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data) {
            updateHeader(data.hero);
            updateIntro(data.intro);
            updateScopes(data.scopes);
            updateSupport(data.support);
            updateCta(data.cta);
        }
    } catch (error) {
        console.error('Error fetching careers content:', error);
    }
}

function updateHeader(hero) {
    if (!hero) return;
    if (hero.title) {
        const titleEl = document.getElementById('careers-header-title');
        if (titleEl) titleEl.textContent = hero.title;
    }
    if (hero.subtitle) {
        const descEl = document.getElementById('careers-header-desc');
        if (descEl) descEl.textContent = hero.subtitle;
    }
}

function updateIntro(intro) {
    if (!intro) return;
    if (intro.title) {
        const titleEl = document.getElementById('intro-title');
        if (titleEl) titleEl.textContent = intro.title;
    }
    if (intro.description) {
        const descEl = document.getElementById('intro-desc');
        if (descEl) descEl.textContent = intro.description;
    }
}

function updateScopes(scopes) {
    if (!scopes || !Array.isArray(scopes)) return;
    const container = document.getElementById('scopes-grid');
    if (!container) return;

    container.innerHTML = scopes.map(item => `
        <div class="perk-item">
            <span class="perk-icon">${item.icon}</span>
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
        </div>
    `).join('');
}

function updateSupport(support) {
    if (!support || !Array.isArray(support)) return;
    const container = document.getElementById('support-list');
    if (!container) return;

    container.innerHTML = support.map(item => `
        <div class="job-card">
            <div class="job-header">
                <h3>${item.title}</h3>
            </div>
            <p class="job-desc">${item.desc}</p>
        </div>
    `).join('');
}

function updateCta(cta) {
    if (!cta) return;
    if (cta.title) {
        const titleEl = document.getElementById('cta-title');
        if (titleEl) titleEl.textContent = cta.title;
    }
    if (cta.text) {
        const textEl = document.getElementById('cta-desc');
        if (textEl) textEl.textContent = cta.text;
    }
    if (cta.buttonText || cta.buttonLink) {
        const btnEl = document.getElementById('cta-btn');
        if (btnEl) {
            if (cta.buttonText) btnEl.textContent = cta.buttonText;
            if (cta.buttonLink) btnEl.setAttribute('href', cta.buttonLink);
        }
    }
}
