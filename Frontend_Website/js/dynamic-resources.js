document.addEventListener('DOMContentLoaded', () => {
    fetchResources();
    setupFilters();
});

const API_URL = 'http://localhost/Yoga_Web/Yoga_Backend/resources';
let allResources = [];

async function fetchResources() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (Array.isArray(data)) {
            allResources = data;
            renderResources(allResources);
        }
    } catch (error) {
        console.error('Error fetching resources:', error);
        document.getElementById('resource-grid').innerHTML = '<p style="text-align:center; grid-column:1/-1;">Failed to load resources.</p>';
    }
}

function renderResources(resources) {
    const grid = document.getElementById('resource-grid');
    if (!grid) return;

    if (resources.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">No resources found matching your criteria.</p>';
        return;
    }

    grid.innerHTML = resources.map(res => `
        <div class="resource-card">
            <div class="res-icon ${getIconClass(res.category)}">${getIconEmoji(res.category)}</div>
            <div class="res-content">
                <h3>${res.title}</h3>
                <p>${res.description || 'No description available.'}</p>
                <div class="res-meta">
                    <span>${res.file_type}</span> • <span>${res.file_size}</span>
                </div>
                <a href="${res.file_url}" class="btn-download" target="_blank" download>
                    ${getActionText(res.category)}
                </a>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const buttons = document.querySelectorAll('.cat-btn');
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.resource-search .btn');

    // Category Filter
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const category = btn.textContent;
            filterResources(category, searchInput.value);
        });
    });

    // Search Filter
    searchBtn.addEventListener('click', () => {
        const activeCat = document.querySelector('.cat-btn.active').textContent;
        filterResources(activeCat, searchInput.value);
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const activeCat = document.querySelector('.cat-btn.active').textContent;
            filterResources(activeCat, searchInput.value);
        }
    });
}

function filterResources(category, searchTerm) {
    let filtered = allResources;

    // Filter by Category
    if (category !== 'All') {
        filtered = filtered.filter(res => res.category === category);
    }

    // Filter by Search
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(res =>
            res.title.toLowerCase().includes(term) ||
            (res.description && res.description.toLowerCase().includes(term))
        );
    }

    renderResources(filtered);
}

// Helpers
function getIconClass(category) {
    if (category === 'Video Tutorials') return 'video';
    if (category === 'Audio Tracks') return 'audio';
    return 'pdf';
}

function getIconEmoji(category) {
    if (category === 'Video Tutorials') return '🎥';
    if (category === 'Audio Tracks') return '🎵';
    return '📄';
}

function getActionText(category) {
    if (category === 'Video Tutorials') return 'Watch Now';
    if (category === 'Audio Tracks') return 'Play/Download';
    return 'Download';
}
