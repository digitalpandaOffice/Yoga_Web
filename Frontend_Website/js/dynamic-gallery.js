document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost/Yoga_Web/Yoga_Backend';
    const grid = document.getElementById('galleryGrid');
    const filtersContainer = document.querySelector('.gallery-filters');

    // Fetch Page Content
    fetch(`${API_BASE_URL}/content/gallerySection`)
        .then(res => res.json())
        .then(data => {
            // Hero
            if (data.hero) {
                const title = document.getElementById('hero-title') || document.querySelector('.gallery-header h1');
                const subtitle = document.getElementById('hero-subtitle') || document.querySelector('.gallery-header p');
                if (title) title.textContent = data.hero.title;
                if (subtitle) subtitle.textContent = data.hero.subtitle;
            }

            // Stats
            if (data.stats) {
                const statsContainer = document.querySelector('.stats-grid');
                if (statsContainer) {
                    statsContainer.innerHTML = Object.values(data.stats).map(stat => `
                        <div class="stat-item">
                            <h3>${stat.number}</h3>
                            <p>${stat.label}</p>
                        </div>
                    `).join('');
                }
            }

            // Featured
            if (data.featured) {
                const featuredTitle = document.querySelector('.featured-section h2');
                if (featuredTitle) featuredTitle.textContent = data.featured.title;

                const featuredGrid = document.querySelector('.featured-grid');
                if (featuredGrid) {
                    // Filter out the 'title' key which is a string, keep objects
                    const items = Object.values(data.featured).filter(i => typeof i === 'object');

                    featuredGrid.innerHTML = items.map((item, index) => `
                        <div class="featured-item">
                            <img src="${item.image || 'https://via.placeholder.com/400'}" alt="${item.title}">
                            <div class="featured-item-content">
                                <h4>${item.title}</h4>
                                <p>${item.desc}</p>
                            </div>
                        </div>
                    `).join('');
                }
            }
        })
        .catch(err => console.error('Content error:', err));

    // Define Categories
    const categories = ['All', 'Events', 'Campus', 'Workshops', 'Students', 'Other'];

    // Render Filters
    if (filtersContainer) {
        filtersContainer.innerHTML = categories.map(cat =>
            `<button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-filter="${cat}">${cat}</button>`
        ).join('');
    }

    // Fetch Images
    fetch(`${API_BASE_URL}/Gallery`)
        .then(res => res.json())
        .then(images => {
            if (!Array.isArray(images)) return;

            window.allImages = images;
            window.currentView = images;

            renderGallery(images);
            setupFilters();
        })
        .catch(err => {
            console.error(err);
            if (grid) grid.innerHTML = '<p style="text-align:center; width:100%;">Failed to load gallery.</p>';
        });

    function renderGallery(images) {
        if (!grid) return;
        if (images.length === 0) {
            grid.innerHTML = '<p style="text-align:center; width:100%; grid-column:1/-1;">No images found.</p>';
            return;
        }
        grid.innerHTML = images.map((img, index) => `
            <div class="gallery-item" onclick="openLightbox(${index})">
                <img src="${img.image_url}" alt="${img.title}">
                <div class="gallery-category">${img.category}</div>
                <div class="gallery-item-content">
                    <h3>${img.title}</h3>
                    <div class="date">${new Date(img.created_at).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    }

    function setupFilters() {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                window.currentView = filter === 'All'
                    ? window.allImages
                    : window.allImages.filter(img => img.category === filter);

                renderGallery(window.currentView);
            });
        });
    }

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lbImage = document.getElementById('lightboxImage');
    const lbTitle = document.getElementById('lightboxTitle');
    const lbDesc = document.getElementById('lightboxDescription');
    const lbDate = document.getElementById('lightboxDate');
    const lbClose = document.getElementById('lightboxClose');
    const lbNext = document.getElementById('lightboxNext');
    const lbPrev = document.getElementById('lightboxPrev');

    window.openLightbox = (index) => {
        if (!lightbox) return;
        window.currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function updateLightbox() {
        if (!window.currentView || !window.currentView[window.currentIndex]) return;
        const img = window.currentView[window.currentIndex];

        if (lbImage) lbImage.src = img.image_url;
        if (lbTitle) lbTitle.textContent = img.title;
        if (lbDesc) lbDesc.textContent = '';
        if (lbDate) lbDate.textContent = new Date(img.created_at).toLocaleDateString();
    }

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function nextImage() {
        if (!window.currentView) return;
        window.currentIndex = (window.currentIndex + 1) % window.currentView.length;
        updateLightbox();
    }

    function prevImage() {
        if (!window.currentView) return;
        window.currentIndex = (window.currentIndex - 1 + window.currentView.length) % window.currentView.length;
        updateLightbox();
    }

    // Event Listeners
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbNext) lbNext.addEventListener('click', nextImage);
    if (lbPrev) lbPrev.addEventListener('click', prevImage);

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
});
