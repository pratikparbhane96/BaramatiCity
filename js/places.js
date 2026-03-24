/* ============================================
   BARAMATI TOURISM PORTAL – Places Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.place-card');
    const searchInput = document.getElementById('placeSearch');
    const noResults = document.getElementById('noResults');

    let activeFilter = 'all';
    let searchQuery = '';
    let placesData = [];

    // --- Fetch Data ---
    async function loadData() {
        try {
            const response = await fetch('data/data.json');
            const data = await response.json();
            placesData = data.places;
            renderPlaces(placesData);
            initDetailButtons();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    function renderPlaces(places) {
        const container = document.getElementById('placesGrid');
        if (!container) return;
        
        // If there are no static cards, or we are filtering, we might want to re-render.
        // For now, let's just make sure we don't break existing static cards if it's the first load.
        if (placesData.length > 0 && container.children.length <= 1) { // 1 is for #noResults maybe? No, #noResults is sibling.
             container.innerHTML = '';
             places.forEach(place => {
                const card = document.createElement('div');
                card.className = 'card place-card reveal';
                card.dataset.category = place.category;
                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <img src="${place.image}" alt="${place.title}" class="card-img">
                        <div class="card-overlay"></div>
                    </div>
                    <div class="card-body">
                        <span class="tag">${place.category.charAt(0).toUpperCase() + place.category.slice(1)}</span>
                        <h3>${place.title}</h3>
                        <p>${place.description.substring(0, 120)}...</p>
                        <div class="card-info">
                            <p><i class="fas fa-map-marker-alt"></i> ${place.location}</p>
                            <p><i class="fas fa-clock"></i> ${place.time}</p>
                        </div>
                        <a href="#" class="btn btn-outline btn-sm w-full">View Details</a>
                    </div>
                `;
                container.appendChild(card);
            });
        }
    }

    function filterPlaces() {
        searchQuery = searchInput.value.toLowerCase();
        const filtered = placesData.filter(place => {
            const matchesFilter = activeFilter === 'all' || place.category === activeFilter;
            const matchesSearch = place.title.toLowerCase().includes(searchQuery) || 
                                 place.description.toLowerCase().includes(searchQuery);
            return matchesFilter && matchesSearch;
        });

        // For filtering, we DO want to re-render
        const container = document.getElementById('placesGrid');
        container.innerHTML = '';
        filtered.forEach(place => {
            const card = document.createElement('div');
            card.className = 'card place-card reveal revealed'; // Already revealed if filtered
            card.dataset.category = place.category;
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${place.image}" alt="${place.title}" class="card-img">
                    <div class="card-overlay"></div>
                </div>
                <div class="card-body">
                    <span class="tag">${place.category.charAt(0).toUpperCase() + place.category.slice(1)}</span>
                    <h3>${place.title}</h3>
                    <p>${place.description.substring(0, 120)}...</p>
                    <div class="card-info">
                        <p><i class="fas fa-map-marker-alt"></i> ${place.location}</p>
                        <p><i class="fas fa-clock"></i> ${place.time}</p>
                    </div>
                    <a href="#" class="btn btn-outline btn-sm w-full">View Details</a>
                </div>
            `;
            container.appendChild(card);
        });

        initDetailButtons();
        noResults.style.display = filtered.length === 0 ? 'block' : 'none';
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            filterPlaces();
        });
    });

    searchInput.addEventListener('input', filterPlaces);

    // --- Modal Logic ---
    const modal = document.getElementById('detailsModal');
    const modalClose = modal.querySelector('.modal-close');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalGallery = document.getElementById('modalGallery');
    
    function openModal(title) {
        const data = placesData.find(p => p.title === title) || placesData.find(p => title.includes(p.title));
        if (!data) return;

        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalMainDesc').textContent = data.description;
        document.getElementById('modalCategory').innerHTML = `<i class="fas fa-layer-group"></i> ${data.category.charAt(0).toUpperCase() + data.category.slice(1)}`;
        document.getElementById('modalBadge').textContent = data.tag || 'Must Visit';
        document.getElementById('modalLoc').textContent = data.location;
        document.getElementById('modalTime').textContent = data.time;
        document.getElementById('modalImg').src = data.image;

        // Load Gallery
        renderGallery(data.gallery || [data.image]);

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function renderGallery(images) {
        if (!images || images.length === 0) {
            modalGallery.innerHTML = `
                <div class="photo-placeholder">
                    <i class="fas fa-camera"></i>
                    <p>No community photos yet. Be the first to share!</p>
                </div>`;
            return;
        }

        modalGallery.innerHTML = images.map(src => {
            const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');
            return `
                <div class="gallery-item">
                    ${isVideo ? `<video src="${src}" muted loop></video>` : `<img src="${src}" alt="Gallery Item">`}
                </div>`;
        }).join('');

        // Add hover play for videos
        modalGallery.querySelectorAll('video').forEach(v => {
            v.parentElement.addEventListener('mouseenter', () => v.play());
            v.parentElement.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
        });
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // --- Upload Feature (Simulation) ---
    const uploadBtn = document.getElementById('uploadBtn');
    const photoUpload = document.getElementById('photoUpload');

    if (uploadBtn && photoUpload) {
        uploadBtn.addEventListener('click', () => photoUpload.click());

        photoUpload.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                // In a real app, you'd upload these to a server.
                // Here we simulate it by adding them to the current modal gallery.
                Array.from(files).forEach(file => {
                    const url = URL.createObjectURL(file);
                    const isVideo = file.type.startsWith('video/');
                    
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = isVideo ? `<video src="${url}" muted loop></video>` : `<img src="${url}" alt="User Upload">`;
                    
                    // Remove placeholder if it exists
                    const placeholder = modalGallery.querySelector('.photo-placeholder');
                    if (placeholder) placeholder.remove();

                    modalGallery.prepend(item);

                    if (isVideo) {
                        item.addEventListener('mouseenter', () => item.querySelector('video').play());
                        item.addEventListener('mouseleave', () => { 
                            const v = item.querySelector('video');
                            v.pause(); 
                            v.currentTime = 0; 
                        });
                    }
                });
                
                // Show success message (simple alert for now)
                alert('Thank you! Your photos/videos have been shared with the community.');
            }
        });
    }

    // Initial event listener for View Details buttons
    function initDetailButtons() {
        const detailBtns = document.querySelectorAll('.place-card .btn');
        detailBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = btn.closest('.place-card');
                const title = card.querySelector('h3').textContent;
                openModal(title);
            });
        });
    }

    loadData();
});
