/* ============================================
   BARAMATI TOURISM PORTAL – Home Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    async function loadHomeData() {
        try {
            const response = await fetch('data/data.json');
            const data = await response.json();
            
            renderAttractions(data.places.slice(0, 6));
            renderTemples(data.places.filter(p => p.category === 'temple').slice(0, 3));
            renderHotels(data.hotels.slice(0, 4));
            renderEvents(data.events.slice(0, 3));
            
            // Re-initialize ScrollReveal after dynamic content
            if (window.initScrollReveal) initScrollReveal();
            
        } catch (error) {
            console.error('Error loading home data:', error);
        }
    }

    function renderAttractions(places) {
        const container = document.getElementById('featuredAttractions');
        if (!container) return;
        container.innerHTML = places.map(place => `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${place.image}" alt="${place.title}" class="card-img">
                    <div class="card-overlay"></div>
                </div>
                <div class="card-body">
                    <span class="tag">${place.category.charAt(0).toUpperCase() + place.category.slice(1)}</span>
                    <h3>${place.title}</h3>
                    <p>${place.description.substring(0, 100)}...</p>
                    <div class="card-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${place.location}</span>
                    </div>
                    <a href="places.html" class="btn btn-outline btn-sm">View Details</a>
                </div>
            </div>
        `).join('');
    }

    function renderTemples(places) {
        const container = document.getElementById('popularTemples');
        if (!container) return;
        container.innerHTML = places.map(place => `
            <div class="card card-horizontal">
                <img src="${place.image}" alt="${place.title}">
                <div class="card-body">
                    <span class="tag tag-teal">${place.tag || 'Ancient'}</span>
                    <h3>${place.title}</h3>
                    <p>${place.description.substring(0, 120)}...</p>
                    <div class="card-meta">
                        <span><i class="fas fa-road"></i> Near Center</span>
                    </div>
                    <a href="places.html" class="btn btn-primary btn-sm">Visit Now</a>
                </div>
            </div>
        `).join('');
    }

    function renderHotels(hotels) {
        const container = document.querySelector('#hotels .grid-4');
        if (!container) return;
        container.innerHTML = hotels.map(hotel => `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${hotel.image}" alt="${hotel.title}" class="card-img">
                </div>
                <div class="card-body">
                    <div class="stars">
                        ${generateStars(hotel.rating)}
                    </div>
                    <h3>${hotel.title}</h3>
                    <p>${hotel.description}</p>
                    <div class="card-meta">
                        <span><i class="fas fa-phone"></i> ${hotel.phone}</span>
                    </div>
                    <a href="hotels.html" class="btn btn-outline btn-sm w-full">Book Now</a>
                </div>
            </div>
        `).join('');
    }

    function renderEvents(events) {
        const container = document.querySelector('#events .grid-3');
        if (!container) return;
        container.innerHTML = events.map(event => `
            <div class="card event-card">
                <div class="date-badge">${event.date.split(' ')[0]} <span>${event.date.split(' ')[1]}</span></div>
                <img src="${event.image}" alt="${event.title}" class="card-img">
                <div class="card-body">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <div class="card-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                    </div>
                </div>
            </div>
        `).join('');
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

    loadHomeData();
});
