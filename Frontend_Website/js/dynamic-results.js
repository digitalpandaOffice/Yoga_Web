document.addEventListener('DOMContentLoaded', () => {
    fetchResultsContent();
    setupResultForm();
});

const API_BASE = 'http://localhost/Yoga_Web/Yoga_Backend';
const CONTENT_URL = `${API_BASE}/content/results`;
const CHECK_URL = `${API_BASE}/results/check`;

async function fetchResultsContent() {
    try {
        const response = await fetch(CONTENT_URL);
        const data = await response.json();

        if (data) {
            updateHero(data.hero);
            updateFormOptions(data.form_options);
        }
    } catch (error) {
        console.error('Error fetching results content:', error);
    }
}

function updateHero(hero) {
    if (!hero) return;
    if (hero.title) {
        const titleEl = document.getElementById('results-hero-title');
        if (titleEl) titleEl.textContent = hero.title;
    }
    if (hero.subtitle) {
        const subtitleEl = document.getElementById('results-hero-subtitle');
        if (subtitleEl) subtitleEl.textContent = hero.subtitle;
    }
    if (hero.backgroundImage) {
        const heroSection = document.getElementById('results-hero');
        if (heroSection) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${hero.backgroundImage}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        }
    }
}

function updateFormOptions(options) {
    if (!options) return;

    if (options.courses && Array.isArray(options.courses)) {
        const courseSelect = document.getElementById('courseSelect');
        if (courseSelect) {
            courseSelect.innerHTML = '<option value="">-- Select Course --</option>' +
                options.courses.map(item => `<option value="${item.value}">${item.label}</option>`).join('');
        }
    }

    if (options.years && Array.isArray(options.years)) {
        const yearSelect = document.getElementById('yearSelect');
        if (yearSelect) {
            yearSelect.innerHTML = '<option value="">-- Select Year --</option>' +
                options.years.map(item => `<option value="${item.value}">${item.label}</option>`).join('');
        }
    }
}

function setupResultForm() {
    const form = document.getElementById('resultForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const courseId = document.getElementById('courseSelect').value;
        const year = document.getElementById('yearSelect').value;
        const rollNumber = document.getElementById('rollNumber').value;
        const btn = form.querySelector('.btn-check');
        const resultDisplay = document.getElementById('resultDisplay');

        if (!courseId || !year || !rollNumber) {
            alert('Please fill in all fields');
            return;
        }

        // UI Loading State
        const originalText = btn.textContent;
        btn.textContent = 'Searching...';
        btn.disabled = true;
        resultDisplay.style.display = 'none';

        try {
            const response = await fetch(CHECK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ course_id: courseId, year: year, roll_number: rollNumber })
            });

            const data = await response.json();

            if (response.ok) {
                displayResult(data);
            } else {
                alert(data.error || 'Result not found. Please check your details.');
            }
        } catch (error) {
            console.error('Error checking result:', error);
            alert('Failed to connect to the server. Please try again later.');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

function displayResult(data) {
    const resultDisplay = document.getElementById('resultDisplay');

    // Basic Info
    document.getElementById('studentName').textContent = data.student_name;
    document.getElementById('displayRoll').textContent = data.roll_number;

    // Get Course Label from select if possible, else use ID
    const courseSelect = document.getElementById('courseSelect');
    const courseLabel = courseSelect.options[courseSelect.selectedIndex]?.text || data.course_id;
    document.getElementById('displayCourse').textContent = courseLabel;

    document.getElementById('displayYear').textContent = data.year;

    // Status Badge
    const badge = resultDisplay.querySelector('.result-badge');
    badge.textContent = data.status;
    if (data.status === 'FAIL') {
        badge.classList.add('fail');
        badge.style.background = '#fee2e2';
        badge.style.color = '#991b1b';
    } else {
        badge.classList.remove('fail');
        badge.style.background = '#dcfce7';
        badge.style.color = '#166534';
    }

    // Marks Table
    const tbody = resultDisplay.querySelector('.marks-table tbody');
    let rowsHtml = '';

    if (data.marks_data && Array.isArray(data.marks_data)) {
        data.marks_data.forEach((subject, index) => {
            rowsHtml += `
                <tr>
                    <td>SUB-${index + 101}</td>
                    <td>${subject.subject}</td>
                    <td>${subject.max_marks}</td>
                    <td>${subject.marks}</td>
                </tr>
            `;
        });
    }

    // Total Row
    rowsHtml += `
        <tr class="total-row">
            <td colspan="2">Total</td>
            <td>${data.total_marks}</td>
            <td>${data.obtained_marks} (${parseFloat(data.percentage).toFixed(2)}%)</td>
        </tr>
    `;

    // Add Grade Row
    rowsHtml += `
        <tr class="total-row" style="background: #fff; border-top: 2px solid #eee;">
            <td colspan="3" style="text-align: right;">Grade</td>
            <td style="color: var(--deep-blue); font-size: 1.1rem;">${data.grade}</td>
        </tr>
    `;

    tbody.innerHTML = rowsHtml;

    // Show Result
    resultDisplay.style.display = 'block';
    resultDisplay.scrollIntoView({ behavior: 'smooth' });
}
