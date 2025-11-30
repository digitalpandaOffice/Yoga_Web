document.addEventListener('DOMContentLoaded', () => {
    fetchResources();

    // Tab Filtering
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterResources(tab.textContent);
        });
    });
});

const API_URL = 'http://localhost/Yoga_Web/Yoga_Backend/TeacherResources';
let allResources = [];

async function fetchResources() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (Array.isArray(data)) {
            allResources = data;
            // Default filter: Lesson Plans (or show all if needed, but UI implies tabs)
            // Let's default to the first tab "Lesson Plans"
            filterResources('Lesson Plans');
        }
    } catch (error) {
        console.error('Error fetching resources:', error);
        document.getElementById('resource-grid').innerHTML = '<p style="text-align:center; grid-column:1/-1;">Failed to load resources.</p>';
    }
}

function filterResources(category) {
    const filtered = allResources.filter(res => res.category === category);
    renderResources(filtered);
}

function renderResources(items) {
    const grid = document.getElementById('resource-grid');
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">No resources found in this category.</p>';
        return;
    }

    grid.innerHTML = items.map(item => {
        let icon = '📄';
        let iconClass = 'doc';

        const type = item.file_type ? item.file_type.toUpperCase() : '';
        if (['PDF'].includes(type)) { icon = '📘'; iconClass = 'pdf'; }
        else if (['MP4', 'MOV', 'AVI'].includes(type)) { icon = '🎬'; iconClass = 'media'; }
        else if (['MP3', 'WAV'].includes(type)) { icon = '🎵'; iconClass = 'audio'; }
        else if (['XLS', 'XLSX', 'CSV'].includes(type)) { icon = '📊'; iconClass = 'xls'; }
        else if (['DOC', 'DOCX'].includes(type)) { icon = '📝'; iconClass = 'doc'; }

        return `
        <div class="resource-card">
            <div class="card-icon ${iconClass}">${icon}</div>
            <div class="card-content">
                <h3>${item.title}</h3>
                <p>${item.description || ''}</p>
                <div class="meta">${type} • ${item.file_size}</div>
                <a href="${item.file_url}" class="btn-download" target="_blank" download>Download</a>
            </div>
        </div>
        `;
    }).join('');
}
