/* ============================================
   BARAMATI TOURISM PORTAL – Hotels Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('hotelSort');
    const catBtns = document.querySelectorAll('.cat-btn');
    const grid = document.getElementById('hotelsGrid');
    
    let hotelsData = [];
    let activeCategory = 'all';

    async function loadHotels() {
        try {
            const response = await fetch('data/data.json');
            const data = await response.json();
            hotelsData = data.hotels;
            renderHotels();
        } catch (error) {
            console.error('Error loading hotels:', error);
        }
    }

    function renderHotels() {
        if (!grid) return;
        
        let filtered = hotelsData.filter(h => activeCategory === 'all' || h.category === activeCategory);
        
        const sortBy = sortSelect.value;
        filtered.sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'distance') return a.distance - b.distance;
            return 0;
        });

        grid.innerHTML = filtered.map(hotel => `
            <div class="card hotel-card reveal">
                <div class="card-img-wrapper">
                    <img src="${hotel.image}" alt="${hotel.title}" class="card-img">
                    <div class="price-tag">From ₹${hotel.price}</div>
                </div>
                <div class="card-body">
                    <div class="hotel-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div class="stars">
                            ${generateStars(hotel.rating)}
                        </div>
                        <span class="tag ${hotel.category === 'hotel' ? '' : 'tag-teal'}">${hotel.category}</span>
                    </div>
                    <h3>${hotel.title}</h3>
                    <p>${hotel.description}</p>
                    <ul class="amenities">
                        <li><i class="fas fa-map-marker-alt"></i> ${hotel.location || 'Baramati'}</li>
                        <li><i class="fas fa-wifi"></i> Free Wi-Fi</li>
                        ${hotel.category === 'hotel' ? '<li><i class="fas fa-parking"></i> Parking</li>' : '<li><i class="fas fa-leaf"></i> Veg/Non-Veg</li>'}
                    </ul>
                    <div class="card-actions">
                         <a href="tel:${hotel.phone || '#'}" class="btn btn-outline btn-sm"><i class="fas fa-phone"></i> Call</a>
                        <button class="btn btn-primary btn-sm">Book Room</button>
                    </div>
                </div>
            </div>
        `).join('');

        if (window.initScrollReveal) initScrollReveal();
    }

    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    sortSelect.addEventListener('change', renderHotels);

    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.cat;
            renderHotels();
        });
    });

    loadHotels();
});
