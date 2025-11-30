document.addEventListener('DOMContentLoaded', () => {
    fetchContent();
});

const CONTENT_API_URL = 'http://localhost/Yoga_Web/Yoga_Backend/content/examEligibility';

async function fetchContent() {
    try {
        const response = await fetch(CONTENT_API_URL);
        const data = await response.json();
        if (data) renderContent(data);
    } catch (error) {
        console.error('Error fetching eligibility content:', error);
        document.getElementById('criteria-grid').innerHTML = '<p style="text-align:center; width:100%;">Failed to load content.</p>';
    }
}

function renderContent(data) {
    // Hero
    if (data.hero) {
        const heroTitle = document.querySelector('.page-hero h1');
        const heroSubtitle = document.querySelector('.page-hero p');
        if (heroTitle) heroTitle.textContent = data.hero.title;
        if (heroSubtitle) heroSubtitle.textContent = data.hero.subtitle;
    }

    // Intro
    if (data.intro) {
        const introTitle = document.querySelector('.eligibility-intro h2');
        const introDesc = document.querySelector('.eligibility-intro p');
        if (introTitle) introTitle.textContent = data.intro.title;
        if (introDesc) introDesc.textContent = data.intro.description;
    }

    // Criteria Cards
    const grid = document.getElementById('criteria-grid');
    if (grid && data.criteria_cards && Array.isArray(data.criteria_cards)) {
        if (data.criteria_cards.length === 0) {
            grid.innerHTML = '<p style="text-align:center; width:100%;">No criteria available.</p>';
        } else {
            grid.innerHTML = data.criteria_cards.map(card => `
                <div class="criteria-card">
                    <div class="icon-box">${card.icon}</div>
                    <h3>${card.title}</h3>
                    <ul>
                        ${Array.isArray(card.items) ? card.items.map(item => `<li>${item}</li>`).join('') : ''}
                    </ul>
                </div>
            `).join('');
        }
    }

    // General Rules
    const rulesList = document.getElementById('rules-list');
    if (rulesList && data.general_rules && Array.isArray(data.general_rules)) {
        if (data.general_rules.length === 0) {
            rulesList.innerHTML = '<p style="text-align:center;">No rules available.</p>';
        } else {
            rulesList.innerHTML = data.general_rules.map((rule, index) => `
                <div class="rule-item">
                    <span class="rule-num">${index + 1}</span>
                    <p>${rule}</p>
                </div>
            `).join('');
        }
    }
}
