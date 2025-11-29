document.addEventListener('DOMContentLoaded', () => {
    fetchSyllabusContent();
});

const API_URL = 'http://localhost/Yoga_Web/Yoga_Backend/content/syllabus';

async function fetchSyllabusContent() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data) {
            updateHero(data.hero);
            updateSyllabusCards(data.syllabus_cards);
        }
    } catch (error) {
        console.error('Error fetching syllabus content:', error);
    }
}

function updateHero(hero) {
    if (!hero) return;
    if (hero.title) {
        const titleEl = document.getElementById('syllabus-hero-title');
        if (titleEl) titleEl.textContent = hero.title;
    }
    if (hero.subtitle) {
        const subtitleEl = document.getElementById('syllabus-hero-subtitle');
        if (subtitleEl) subtitleEl.textContent = hero.subtitle;
    }
    if (hero.backgroundImage) {
        const heroSection = document.getElementById('syllabus-hero');
        if (heroSection) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(11, 37, 69, 0.7), rgba(11, 37, 69, 0.8)), url('${hero.backgroundImage}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        }
    }
}

function updateSyllabusCards(cards) {
    if (!cards || !Array.isArray(cards)) return;
    const container = document.getElementById('syllabus-grid');
    if (!container) return;

    if (cards.length === 0) {
        container.innerHTML = '<div style="text-align: center; grid-column: 1/-1;">No syllabus available at the moment.</div>';
        return;
    }

    container.innerHTML = cards.map(item => `
        <div class="syllabus-card">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="syllabus-meta">
                <span>Year: ${item.year}</span>
                <span>Level: ${item.level}</span>
            </div>
            <a href="${item.downloadLink}" class="download-btn" target="_blank">
                Download PDF <span>↓</span>
            </a>
        </div>
    `).join('');
}
