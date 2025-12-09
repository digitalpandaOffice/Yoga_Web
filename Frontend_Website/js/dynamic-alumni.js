document.addEventListener('DOMContentLoaded', () => {
    fetchAlumni();
});

const API_BASE_URL = 'http://localhost/Yoga_Web/Yoga_Backend';

async function fetchAlumni() {
    const container = document.getElementById('alumni-grid');

    try {
        const response = await fetch(`${API_BASE_URL}/alumni`);
        const alumni = await response.json();

        if (!Array.isArray(alumni) || alumni.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <h3>No alumni profiles to display yet.</h3>
                </div>
            `;
            return;
        }

        container.innerHTML = alumni.map(alum => {
            const imageUrl = alum.image_url ? alum.image_url : 'https://placehold.co/600x600?text=No+Image';

            // Handle background image style securely
            // We use inline style for background-image as per original design
            return `
                <div class="alumni-card">
                    <div class="alumni-img" style="background-image: url('${imageUrl}');"></div>
                    <div class="alumni-info">
                        <h3>${alum.name}</h3>
                        <span class="batch">Class of ${alum.batch_year}</span>
                        <p class="designation">${alum.achievement || ''}</p>
                        <p class="bio">${alum.testimonial || ''}</p>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error fetching alumni:', error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: red;">
                <p>Failed to load alumni profiles.</p>
            </div>
        `;
    }
}
