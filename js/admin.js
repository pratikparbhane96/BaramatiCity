/* ============================================
   BARAMATI TOURISM PORTAL – Admin Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Basic Auth Check for Demo
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    let websiteData = null;

    // Load Initial Data
    async function loadAdminData() {
        try {
            const response = await fetch('data/data.json');
            websiteData = await response.json();
            renderAdminPlaces();
            updateStats();
        } catch (error) {
            console.error('Error loading admin data:', error);
        }
    }

    function updateStats() {
        if (!websiteData) return;
        const stats = document.querySelectorAll('.stats-card h3');
        if (stats.length >= 3) {
            stats[0].textContent = websiteData.places.length;
            stats[1].textContent = websiteData.hotels.length;
            stats[2].textContent = websiteData.events.length;
        }
    }

    function renderAdminPlaces() {
        const container = document.querySelector('.admin-content');
        if (!container) return;

        // Clean up previous dynamic content
        const existingPanel = container.querySelector('.admin-data-panel');
        if (existingPanel) existingPanel.remove();

        const section = document.createElement('div');
        section.className = 'admin-panel admin-data-panel mt-20';
        section.innerHTML = `
            <div class="panel-header">
                <h3>Manage Tourist Places</h3>
                <button class="btn btn-primary btn-sm" id="addNewPlace"><i class="fas fa-plus"></i> Add New</button>
            </div>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="placesTableBody">
                    ${websiteData.places.map(place => `
                        <tr>
                            <td><strong>${place.title}</strong></td>
                            <td><span class="tag">${place.category}</span></td>
                            <td>${place.location}</td>
                            <td class="actions">
                                <button class="icon-btn edit" onclick="editPlace('${place.id}')"><i class="fas fa-edit"></i></button>
                                <button class="icon-btn delete" onclick="deletePlace('${place.id}')"><i class="fas fa-trash-alt"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="json-control mt-30">
                <hr>
                <div class="flex justify-between items-center py-20">
                    <div>
                        <h4>JSON Data Control</h4>
                        <p>Changes are visual-only for this demo. Update <code>data/data.json</code> manually to persist changes.</p>
                    </div>
                    <button class="btn btn-outline" id="copyJsonBtn">Copy JSON</button>
                </div>
                <textarea id="jsonDataField" class="json-textarea" readonly>${JSON.stringify(websiteData, null, 4)}</textarea>
            </div>
        `;
        container.appendChild(section);

        // Event listeners after rendering
        document.getElementById('copyJsonBtn').addEventListener('click', copyJSON);
    }

    window.editPlace = (id) => {
        alert("Editing functionality triggered for: " + id + "\nIn a real app, this would open a form to modify JSON fields.");
    };

    window.deletePlace = (id) => {
        if(confirm("Are you sure you want to delete this place?")) {
            websiteData.places = websiteData.places.filter(p => p.id !== id);
            renderAdminPlaces();
            updateStats();
            document.getElementById('jsonDataField').value = JSON.stringify(websiteData, null, 4);
        }
    };

    function copyJSON() {
        const textarea = document.getElementById('jsonDataField');
        textarea.select();
        document.execCommand('copy');
        alert("JSON Data copied to clipboard! You can now send this to Antigravity to update the file.");
    }

    // Logout handling
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isAdminLoggedIn');
            window.location.href = 'login.html';
        });
    }

    loadAdminData();
});
