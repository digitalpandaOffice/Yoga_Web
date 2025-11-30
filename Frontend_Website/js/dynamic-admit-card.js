document.addEventListener('DOMContentLoaded', () => {
    fetchContent();
    setupForm();
});

const CONTENT_API_URL = 'http://localhost/Yoga_Web/Yoga_Backend/content/admitCard';
const SEARCH_API_URL = 'http://localhost/Yoga_Web/Yoga_Backend/AdmitCards/search';

async function fetchContent() {
    try {
        const response = await fetch(CONTENT_API_URL);
        const data = await response.json();
        if (data) renderContent(data);
    } catch (error) {
        console.error('Error fetching content:', error);
    }
}

function renderContent(data) {
    if (data.hero) {
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        if (heroTitle) heroTitle.textContent = data.hero.title;
        if (heroSubtitle) heroSubtitle.textContent = data.hero.subtitle;
    }

    if (data.instructions) {
        const formTitle = document.getElementById('form-title');
        const formNote = document.getElementById('form-note');
        if (formTitle) formTitle.textContent = data.instructions.title;
        if (formNote) formNote.textContent = data.instructions.note;
    }
}

function setupForm() {
    const form = document.getElementById('admitCardForm');
    const msg = document.getElementById('message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            msg.style.display = 'block';
            msg.style.color = 'blue';
            msg.textContent = 'Searching...';

            const regNum = document.getElementById('regNumber').value.trim();
            const dob = document.getElementById('dob').value;

            try {
                const res = await fetch(SEARCH_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ registration_number: regNum, dob: dob })
                });

                const data = await res.json();

                if (res.ok) {
                    // Store data for the view page
                    localStorage.setItem('admitCardData', JSON.stringify(data));

                    msg.style.color = 'green';
                    msg.innerHTML = `
                        <p><strong>Admit Card Found!</strong></p>
                        <p>Student: ${data.student_name}</p>
                        <p>Course: ${data.course_name} (${data.exam_session})</p>
                        <a href="view_admit_card.html" target="_blank" class="btn-download" style="margin-top:10px; display:inline-block;">View Admit Card</a>
                    `;
                } else {
                    msg.style.color = 'red';
                    let errorText = data.error || 'Admit card not found.';
                    if (data.debug_received) {
                        errorText += ` (Searched: ${data.debug_received.reg}, ${data.debug_received.dob})`;
                    }
                    msg.textContent = errorText;
                }
            } catch (err) {
                msg.style.color = 'red';
                msg.textContent = 'Network error. Please try again.';
            }
        });
    }
}
