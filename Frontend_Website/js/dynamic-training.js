document.addEventListener('DOMContentLoaded', () => {
    fetchTrainings();
});

const API_URL = 'http://localhost/Yoga_Web/Yoga_Backend/training';

async function fetchTrainings() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (Array.isArray(data)) {
            renderTrainings(data);
        }
    } catch (error) {
        console.error('Error fetching trainings:', error);
        document.getElementById('training-list').innerHTML = '<p style="text-align:center;">Failed to load workshops.</p>';
    }
}

function renderTrainings(items) {
    const list = document.getElementById('training-list');
    if (!list) return;

    if (items.length === 0) {
        list.innerHTML = '<p style="text-align:center;">No upcoming workshops scheduled.</p>';
        return;
    }

    list.innerHTML = items.map(item => {
        const dateObj = new Date(item.training_date);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' });

        return `
        <div class="training-card">
            <div class="date-box">
                <span class="day">${day}</span>
                <span class="month">${month}</span>
            </div>
            <div class="training-content">
                <h3>${item.title}</h3>
                <p class="meta">Duration: ${item.duration} • Mode: ${item.mode} (${item.location})</p>
                <p class="desc">${item.description}</p>
                <div class="tags">
                    ${item.tags ? item.tags.split(',').map(tag => `<span>${tag.trim()}</span>`).join('') : ''}
                </div>
            </div>
            <div class="training-action">
                <a href="${item.registration_link || '#'}" class="btn-register">Register Now</a>
            </div>
        </div>
        `;
    }).join('');
}
