let locations = []; 
let addMarkerMode = false;
let pendingMarkerPosition = null;

const map = document.getElementById('map');
const detailsPanel = document.getElementById('detailsPanel');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

let scale = 1;
let isDragging = false;
let startX, startY;
let currentX = 0;
let currentY = 0;

async function loadLocations() {
  const savedData = localStorage.getItem('myMapLocations');
  
  if (savedData) {
    locations = JSON.parse(savedData);
    createMarkers(locations);
  } else {
    try {
      const response = await fetch('locations.json');
      if (response.ok) {
        locations = await response.json();
        createMarkers(locations);
      }
    } catch (error) {
      console.warn('File locations.json not found. Starting with an empty map.');
      createMarkers([]);
    }
  }
}

async function loadNew() {
  try {
      const response = await fetch('locations.json');
      if (response.ok) {
        locations = await response.json();
        createMarkers(locations);
        localStorage.setItem('myMapLocations', JSON.stringify(locations));
      }
    } catch (error) {
      console.warn('File locations.json not found. Starting with an empty map.');
      createMarkers([]);
    }
}

function createMarkers(data) {
  const existingMarkers = map.querySelectorAll('.marker');
  existingMarkers.forEach(m => m.remove());

  data.forEach((location, index) => {
    const marker = document.createElement('div');
    marker.classList.add('marker', location.type);
    
    marker.style.left = location.x + '%';
    marker.style.top = location.y + '%';

    marker.addEventListener('click', (e) => {
      e.stopPropagation();
      showDetails(location, index);
    });

    map.appendChild(marker);
  });
}

function openMarkerForm() {
  addMarkerMode = true;
  detailsPanel.innerHTML = `
    <h2 style="color:#ff9f43;">Add mode</h2>
    <p>Click anywhere on the map to indicate the position of the new point.</p>
    <button class="filter-btn" onclick="cancelAddMode()">Cancel</button>
  `;
}

function cancelAddMode() {
  addMarkerMode = false;
  pendingMarkerPosition = null;
  document.getElementById('markerForm').style.display = 'none';
  detailsPanel.innerHTML = '<h2>Details</h2><p>Click the marker on the map.</p>';
}

function saveMarker() {
  const nameInput = document.getElementById('markerName');
  const typeInput = document.getElementById('markerType');
  const descInput = document.getElementById('markerDescription');

  if (!pendingMarkerPosition) {
    alert('First click on a place on the map!');
    return;
  }

  const newLocation = {
    name: nameInput.value || "Untitled",
    type: typeInput.value,
    x: parseFloat(pendingMarkerPosition.x),
    y: parseFloat(pendingMarkerPosition.y),
    description: descInput.value || ""
  };

  locations.push(newLocation);
  
  localStorage.setItem('myMapLocations', JSON.stringify(locations));

  createMarkers(locations);

  nameInput.value = '';
  descInput.value = '';
  cancelAddMode();
}

function showDetails(location, index) {
  detailsPanel.innerHTML = `
    <h2>${location.name}</h2>
    <p><strong>Typ:</strong> ${location.type}</p>
    <p>${location.description}</p>
    <p><small>x:${location.x} / y:${location.y}</small></p>
    <hr style="border:0; border-top:1px solid #444; margin:15px 0;">
    <button onclick="deleteMarker(${index})" style="background:#ff4444; color:white; border:none; padding:8px; width:100%; cursor:pointer; border-radius:5px; font-weight:bold;">
      Remove the point
    </button>
  `;
}

function deleteMarker(index) {
  if (confirm("Are you sure you want to permanently delete this marker?")) {
    locations.splice(index, 1);
    localStorage.setItem('myMapLocations', JSON.stringify(locations));
    createMarkers(locations);
    detailsPanel.innerHTML = '<h2>Deleted</h2><p>Choose another point.</p>';
  }
}

map.addEventListener('click', (e) => {
  if (!addMarkerMode) return;

  const rect = map.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
  const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);

  pendingMarkerPosition = { x, y };

  document.getElementById('markerForm').style.display = 'block';
  detailsPanel.innerHTML = `
    <h2 style="color:#ff9f43;">Selected item</h2>
    <p><strong>${x}% / ${y}%</strong></p>
    <p>Fill in the form and click Save.</p>
  `;
});

map.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomSpeed = 0.1;
  if (e.deltaY < 0) {
    scale += zoomSpeed;
  } else {
    scale -= zoomSpeed;
  }
  scale = Math.min(Math.max(0.5, scale), 4);
  updateMapTransform();
}, { passive: false });

// Przesuwanie (Drag)
map.addEventListener('mousedown', (e) => {
  if (addMarkerMode) return;
  isDragging = true;
  startX = e.clientX - currentX;
  startY = e.clientY - currentY;
  map.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  currentX = e.clientX - startX;
  currentY = e.clientY - startY;
  updateMapTransform();
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  map.style.cursor = 'grab';
});

function updateMapTransform() {
  map.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}

function filterMarkers(type) {
  if (type === 'all') {
    createMarkers(locations);
  } else {
    const filtered = locations.filter(l => l.type === type);
    createMarkers(filtered);
  }
}

searchInput.addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();
  const filtered = locations.filter(l => l.name.toLowerCase().includes(value));
  createMarkers(filtered);

  searchResults.innerHTML = '';
  if (value.length > 0) {
    filtered.forEach(loc => {
      const item = document.createElement('div');
      item.style.cssText = "background:#333; padding:8px; margin-top:5px; border-radius:5px; cursor:pointer; font-size:0.9em;";
      item.innerHTML = `<strong>${loc.name}</strong> <small>(${loc.type})</small>`;
      item.onclick = () => showDetails(loc, locations.indexOf(loc));
      searchResults.appendChild(item);
    });
  }
});

loadLocations();