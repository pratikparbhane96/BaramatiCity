/* ============================================
   BARAMATI TOURISM PORTAL – Events Interaction
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const eventsGrid = document.querySelector('.events-list');
    
    async function loadEvents() {
        try {
            const response = await fetch('data/data.json');
            const data = await response.json();
            renderEvents(data.events);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    function renderEvents(events) {
        if (!eventsGrid) return;
        
        eventsGrid.innerHTML = events.map(event => {
            const dateParts = event.date.split(' ');
            const day = dateParts[0] || '??';
            const month = dateParts[1] || '???';
            const year = dateParts[2] || '';

            return `
                <div class="event-card reveal">
                    <div class="event-img">
                        <img src="${event.image}" alt="${event.title}">
                        <div class="event-date">
                            <span class="day">${day}</span>
                            <span class="month">${month}</span>
                            ${year ? `<span class="year" style="font-size: 0.7rem; opacity: 0.8;">${year}</span>` : ''}
                        </div>
                    </div>
                    <div class="event-content" style="padding: 25px; display: flex; flex-direction: column; flex-grow: 1;">
                        <div class="event-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <div class="event-cat" style="font-size: 0.8rem; color: var(--primary); font-weight: 700; text-transform: uppercase;">${event.category || 'Special Event'}</div>
                            ${event.status ? `<span class="tag" style="background: rgba(26,141,141,0.1); color: var(--secondary); font-size: 0.7rem;">${event.status}</span>` : ''}
                        </div>
                        <h3 style="margin-bottom: 10px;">${event.title}</h3>
                        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px; flex-grow: 1;">${event.description}</p>
                        <div class="event-info" style="display: flex; gap: 15px; font-size: 0.85rem; color: var(--text-dark); margin-bottom: 20px; font-weight: 500;">
                            <span><i class="fas fa-map-marker-alt" style="color: var(--primary);"></i> ${event.location || 'Baramati'}</span>
                            <span><i class="fas fa-clock" style="color: var(--primary);"></i> ${event.time || 'All Day'}</span>
                        </div>
                        <button class="btn btn-outline btn-sm" style="width: 100%;">Get Tickets</button>
                    </div>
                </div>
            `;
        }).join('');

        if (window.initScrollReveal) initScrollReveal();
    }

    loadEvents();
});
