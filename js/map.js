/* ============================================
   BARAMATI TOURISM PORTAL – Leaflet Map Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    async function loadMapData() {
        try {
            const response = await fetch('data/data.json');
            const data = await response.json();
            initBaramatiMap(data.places, data.hotels);
        } catch (error) {
            console.error('Error loading map data:', error);
        }
    }

    function initBaramatiMap(places, hotels) {
        try {
            console.log("Initializing Baramati Map with", (places.length + (hotels ? hotels.length : 0)), "locations");
            const baramatiCoord = [18.1506, 74.5771];

            const map = L.map('map', {
                zoomControl: false
            }).setView(baramatiCoord, 12);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            L.control.zoom({ position: 'bottomright' }).addTo(map);

            const markers = [];

            // Add custom markers from places
            places.forEach(place => {
                const marker = L.marker([place.lat, place.lng]).addTo(map);
                marker.bindPopup(`
                    <div class="custom-popup">
                        <strong>${place.title}</strong><br>
                        ${place.category.charAt(0).toUpperCase() + place.category.slice(1)}<br>
                        <a href="places.html">Details</a>
                    </div>
                `);
                markers.push({ id: place.id, marker, category: place.category, lat: place.lat, lng: place.lng });
            });

            // Add markers for hotels/restaurants
            if (hotels) {
                hotels.forEach(hotel => {
                    if (hotel.lat && hotel.lng) {
                        const marker = L.marker([hotel.lat, hotel.lng]).addTo(map);
                        marker.bindPopup(`
                            <div class="custom-popup">
                                <strong>${hotel.title}</strong><br>
                                ${hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}<br>
                                <a href="hotels.html">Details</a>
                            </div>
                        `);
                        // map to 'accommodation' category for sidebar filtering
                        markers.push({ id: hotel.id, marker, category: 'accommodation', lat: hotel.lat, lng: hotel.lng });
                    }
                });
            }

            // Sidebar interactions
            const locationItems = document.querySelectorAll('.location-item');
            locationItems.forEach(item => {
                item.addEventListener('click', () => {
                    const lat = parseFloat(item.dataset.lat);
                    const lng = parseFloat(item.dataset.lng);

                    map.flyTo([lat, lng], 15, { duration: 1.5 });

                    // Open popup for this marker
                    const match = markers.find(m => m.lat === lat && m.lng === lng);
                    if (match) match.marker.openPopup();

                    // Highlight active in sidebar
                    locationItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                });
            });

            // Filtering
            const catBtns = document.querySelectorAll('.m-cat');
            catBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const type = btn.dataset.type;
                    catBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    markers.forEach(item => {
                        if (type === 'all' || item.category === type) {
                            map.addLayer(item.marker);
                        } else {
                            map.removeLayer(item.marker);
                        }
                    });

                    // Also filter sidebar items
                    locationItems.forEach(el => {
                        if (type === 'all' || el.dataset.type === type) {
                            el.style.display = 'flex';
                        } else {
                            el.style.display = 'none';
                        }
                    });
                });
            });

            setTimeout(() => map.invalidateSize(), 500);
            window.addEventListener('resize', () => map.invalidateSize());

        } catch (e) {
            console.error("Leaflet initialization failed: ", e);
        }
    }

    loadMapData();
});
