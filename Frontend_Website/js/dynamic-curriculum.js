document.addEventListener('DOMContentLoaded', () => {
    fetchCurriculum();
});

const API_URL = 'http://localhost/Yoga_Web/Yoga_Backend/curriculum';

async function fetchCurriculum() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (Array.isArray(data)) {
            renderCurriculum(data);
        }
    } catch (error) {
        console.error('Error fetching curriculum:', error);
        document.getElementById('curriculum-grid').innerHTML = '<p style="text-align:center; grid-column:1/-1;">Failed to load curriculum.</p>';
    }
}

function renderCurriculum(items) {
    const grid = document.getElementById('curriculum-grid');
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">No curriculum data available.</p>';
        return;
    }

    grid.innerHTML = items.map((item, index) => {
        const themeClasses = ['art', 'dance', 'music'];
        const themeClass = themeClasses[index % themeClasses.length];

        return `
        <div class="curriculum-card">
            <div class="card-header ${themeClass}">
                <h3 style="margin: 0; font-size: 1.5rem;">${item.discipline_name}</h3>
                <span class="icon" style="font-size: 2rem;">${item.icon}</span>
            </div>
            <div class="card-body">
                <ul>
                    ${item.levels_data.map(lvl => `
                        <li>
                            <span class="level">${lvl.level}</span>
                            <span class="desc">${lvl.desc}</span>
                            ${lvl.link ? `<a href="${lvl.link}" class="link" target="_blank">View Syllabus</a>` : ''}
                        </li>
                    `).join('')}
                </ul>
                ${item.full_pdf_url ? `<a href="${item.full_pdf_url}" class="btn-full-curriculum" target="_blank" download>Download Full PDF</a>` : ''}
            </div>
        </div>
        `;
    }).join('');
}
