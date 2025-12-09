document.addEventListener('DOMContentLoaded', () => {
    fetchContactPageContent();
});

const API_BASE_URL = 'http://localhost/Yoga_Web/Yoga_Backend';

async function fetchContactPageContent() {
    try {
        // 1. Fetch Page Specific Content (Hero, Map)
        const contentRes = await fetch(`${API_BASE_URL}/content/contact`);
        const content = await contentRes.json();

        if (content) {
            updateText('page-hero-title', content.hero?.title);
            updateText('page-hero-subtitle', content.hero?.subtitle);
            updateText('info-intro', content.info_intro);

            // Update Hero Background if available (optional extension)
            if (content.hero?.background_image) {
                const hero = document.getElementById('page-hero');
                if (hero) hero.style.backgroundImage = `url('${content.hero.background_image}')`;
            }

            // Update Map
            if (content.map_url) {
                const mapFrame = document.getElementById('contact-map');
                if (mapFrame) mapFrame.src = content.map_url;
            }
        }

        // 2. Fetch Global Settings (Phone, Email, Address)
        const settingsRes = await fetch(`${API_BASE_URL}/settings`);
        const settings = await settingsRes.json();

        if (settings) {
            // Address
            const address = [
                settings.address_line1,
                settings.address_line2,
                settings.address_state_zip
            ].filter(Boolean).join('<br>');
            updateHtml('contact-address', address);

            // Phone
            const phones = [
                settings.contact_phone,
                settings.contact_phone_2
            ].filter(Boolean).join('<br>');
            updateHtml('contact-phone', phones);

            // Email
            const emails = [
                settings.contact_email,
                settings.contact_email_2
            ].filter(Boolean).join('<br>');
            updateHtml('contact-email', emails);

            // Office Hours
            updateHtml('office-hours', settings.office_hours ? settings.office_hours.replace(/\n/g, '<br>') : '');
        }

    } catch (error) {
        console.error('Error loading contact content:', error);
    }
}

function updateText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
}

function updateHtml(id, html) {
    const el = document.getElementById(id);
    if (el && html) el.innerHTML = html;
}

// Form Submission Handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/message/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
            } else {
                alert('Failed to send message: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('A network error occurred. Please try again later.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}
