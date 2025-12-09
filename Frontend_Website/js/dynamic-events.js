document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
    fetchPageContent();
});

const API_BASE_URL = 'http://localhost/Yoga_Web/Yoga_Backend';

// --- Events List ---
async function fetchEvents() {
    const container = document.getElementById('events-container');

    try {
        const response = await fetch(`${API_BASE_URL}/event`);
        const events = await response.json();

        if (!Array.isArray(events) || events.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <h3>No upcoming events currently.</h3>
                    <p>Please check back later.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = events.map(event => createEventCard(event)).join('');

    } catch (error) {
        console.error('Error fetching events:', error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: red;">
                <p>Failed to load events. Please try again later.</p>
            </div>
        `;
    }
}

function createEventCard(event) {
    // Format date
    const dateObj = new Date(event.event_date);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Default image fallback
    const imageUrl = event.image_url ? event.image_url : 'https://placehold.co/600x400/e2e8f0/1e293b?text=Event';

    return `
        <div class="event-card">
            <img src="${imageUrl}" alt="${event.title}" class="event-image" onerror="this.src='https://placehold.co/600x400/e2e8f0/1e293b?text=Image+Not+Found'">
            <div class="event-content">
                <span class="event-date">${dateStr}</span>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-location">📍 ${event.location || 'TBA'}</div>
                <p class="event-description">${event.description || ''}</p>
            </div>
        </div>
    `;
}

// --- Page Content ---
async function fetchPageContent() {
    try {
        const response = await fetch(`${API_BASE_URL}/content/events`);
        const data = await response.json();

        if (data && data.hero) {
            updateHero(data.hero);
        }
    } catch (error) {
        console.error('Error fetching page content:', error);
    }
}

function updateHero(hero) {
    if (hero.title) {
        const titleEl = document.getElementById('page-hero-title');
        if (titleEl) titleEl.textContent = hero.title;
    }
    if (hero.subtitle) {
        const subEl = document.getElementById('page-hero-subtitle');
        if (subEl) subEl.textContent = hero.subtitle;
    }
    if (hero.backgroundImage) {
        const heroSection = document.getElementById('page-hero');
        if (heroSection) {
            // Apply linear gradient + image
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${hero.backgroundImage}')`;
        }
    }
}
