import DOMPurify from './purify.es.mjs';
import { createMarkers } from './markers.js';
import { saveToStorage } from './storage.js';

const detailsPanel  = document.getElementById('detailsPanel');
const searchInput   = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const markerForm    = document.getElementById('markerForm');

// Współdzielony stan — przekazywany z zewnątrz przez init()
let _locations = [];
let _addMarkerMode = false;
let _pendingPos    = null;

export function init(locations) {
  _locations = locations;
}

// ── Szczegóły markera ────────────────────────────────────────────
export function showDetails(location, index) {
  detailsPanel.innerHTML = DOMPurify.sanitize(`
    <h2>${location.name}</h2>
    <p><strong>Typ:</strong> ${location.type}</p>
    <p>${location.description}</p>
    <p><small>x:${location.x} / y:${location.y}</small></p>
    <hr style="border:0; border-top:1px solid #444; margin:15px 0;">
    <button
      id="deleteMarkerBtn"
      style="background:#ff4444; color:white; border:none; padding:8px;
             width:100%; cursor:pointer; border-radius:5px; font-weight:bold;">
      Usuń punkt
    </button>
  `);

  document.getElementById('deleteMarkerBtn')
    .addEventListener('click', () => deleteMarker(index));
}

// ── Usuwanie ─────────────────────────────────────────────────────
function deleteMarker(index) {
  if (!confirm('Na pewno chcesz trwale usunąć ten marker?')) return;
  _locations.splice(index, 1);
  saveToStorage(_locations);
  createMarkers(_locations);
  detailsPanel.innerHTML = DOMPurify.sanitize('<h2>Usunięto</h2><p>Wybierz inny punkt.</p>');
}

// ── Tryb dodawania ───────────────────────────────────────────────
export function openMarkerForm() {
  _addMarkerMode = true;
  detailsPanel.innerHTML = DOMPurify.sanitize(`
    <h2 style="color:#ff9f43;">Tryb dodawania</h2>
    <p>Kliknij dowolne miejsce na mapie, aby wskazać pozycję nowego punktu.</p>
    <button class="filter-btn" id="cancelAddBtn">Anuluj</button>
  `);
  document.getElementById('cancelAddBtn').addEventListener('click', cancelAddMode);
}

export function cancelAddMode() {
  _addMarkerMode = false;
  _pendingPos    = null;
  markerForm.style.display = 'none';
  detailsPanel.innerHTML = DOMPurify.sanitize('<h2>Szczegóły</h2><p>Kliknij marker na mapie.</p>');
}

export function saveMarker() {
  if (!_pendingPos) { alert('Najpierw kliknij miejsce na mapie!'); return; }

  const newLocation = {
    name:        document.getElementById('markerName').value || 'Bez nazwy',
    type:        document.getElementById('markerType').value,
    x:           parseFloat(_pendingPos.x),
    y:           parseFloat(_pendingPos.y),
    description: document.getElementById('markerDescription').value || '',
  };

  _locations.push(newLocation);
  saveToStorage(_locations);
  createMarkers(_locations);

  document.getElementById('markerName').value        = '';
  document.getElementById('markerDescription').value = '';
  cancelAddMode();
}

// ── Klik na mapę (obsługa z map.js) ─────────────────────────────
export function isAddMarkerMode()  { return _addMarkerMode; }

export function handleMapClick(x, y) {
  _pendingPos = { x, y };
  markerForm.style.display = 'block';
  detailsPanel.innerHTML = DOMPurify.sanitize(`
    <h2 style="color:#ff9f43;">Wybrano miejsce</h2>
    <p><strong>${x}% / ${y}%</strong></p>
    <p>Uzupełnij formularz i kliknij Zapisz.</p>
  `);
}

// ── Wyszukiwarka ─────────────────────────────────────────────────
export function initSearch() {
  searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = _locations.filter(l => l.name.toLowerCase().includes(value));
    createMarkers(filtered);

    searchResults.innerHTML = '';
    if (value.length > 0) {
      filtered.forEach(loc => {
        const item = document.createElement('div');
        item.style.cssText = 'background:#333; padding:8px; margin-top:5px; border-radius:5px; cursor:pointer; font-size:0.9em;';
        item.innerHTML = DOMPurify.sanitize(`<strong>${loc.name}</strong> <small>(${loc.type})</small>`);
        item.onclick = () => showDetails(loc, _locations.indexOf(loc));
        searchResults.appendChild(item);
      });
    }
  });
}
