document.addEventListener('DOMContentLoaded', () => {
    fetchExamSchedules();
    fetchPageContent();
});

const API_URL = 'http://localhost/Yoga_Web/Yoga_Backend/ExamDates';
const CONTENT_API_URL = 'http://localhost/Yoga_Web/Yoga_Backend/content/examDates';

async function fetchExamSchedules() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (Array.isArray(data)) {
            renderSchedules(data);
        }
    } catch (error) {
        console.error('Error fetching exam schedules:', error);
        document.getElementById('schedule-container').innerHTML = '<p style="text-align:center;">Failed to load schedules.</p>';
    }
}

async function fetchPageContent() {
    try {
        const response = await fetch(CONTENT_API_URL);
        const data = await response.json();
        if (data) renderPageContent(data);
    } catch (error) {
        console.error('Error fetching page content:', error);
    }
}

function renderPageContent(data) {
    // Hero
    if (data.hero) {
        const heroTitle = document.querySelector('.page-hero h1');
        const heroSubtitle = document.querySelector('.page-hero p');
        if (heroTitle) heroTitle.textContent = data.hero.title;
        if (heroSubtitle) heroSubtitle.textContent = data.hero.subtitle;
    }
    // Schedule Header
    if (data.schedule_header) {
        const headerTitle = document.querySelector('.section-header-center h2');
        const headerDesc = document.querySelector('.section-header-center p');
        if (headerTitle) headerTitle.textContent = data.schedule_header.title;
        if (headerDesc) headerDesc.textContent = data.schedule_header.description;
    }
    // Download Section
    if (data.download_section) {
        const dlTitle = document.querySelector('.download-schedule h3');
        const dlText = document.querySelector('.download-schedule p');
        const dlBtn = document.querySelector('.btn-download-pdf');

        if (dlTitle) dlTitle.textContent = data.download_section.title;
        if (dlText) dlText.textContent = data.download_section.text;
        if (dlBtn) dlBtn.href = data.download_section.pdf_url || '#';
    }
}

function renderSchedules(items) {
    const container = document.getElementById('schedule-container');
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = '<p style="text-align:center;">No examination schedules available.</p>';
        return;
    }

    container.innerHTML = items.map((item, index) => {
        const isOpen = index === 0 ? 'open' : ''; // Open first item by default

        return `
        <details class="course-accordion" ${isOpen}>
            <summary class="accordion-trigger">
                <div class="trigger-content">
                    <div class="course-icon">${item.icon}</div>
                    <div class="course-details">
                        <h3>${item.course_name}</h3>
                        <span class="meta-text">${item.description}</span>
                    </div>
                </div>
                <span class="icon-toggle"></span>
            </summary>
            <div class="accordion-body">
                ${item.batches_data.map(batch => `
                    <div class="batch-block">
                        <div class="batch-header">
                            <h4>${batch.batch_name}</h4>
                            <span class="batch-status ${batch.status.toLowerCase()}">${batch.status}</span>
                        </div>
                        <div class="table-responsive">
                            <table class="schedule-table">
                                <thead>
                                    <tr>
                                        <th>Paper Code</th>
                                        <th>Subject</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${batch.exams.map(exam => `
                                        <tr>
                                            <td>${exam.code}</td>
                                            <td>${exam.subject}</td>
                                            <td>${exam.date}</td>
                                            <td>${exam.time}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `).join('')}
            </div>
        </details>
        `;
    }).join('');
}
