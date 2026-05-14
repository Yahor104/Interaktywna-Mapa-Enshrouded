import { loadFromStorage, loadFromJSON, saveToStorage } from './storage.js';
import { createMarkers, filterMarkers }                from './markers.js';
import { init, openMarkerForm, cancelAddMode, saveMarker, initSearch } from './ui.js';
import './map.js';

let locations = [];

// ── Ładowanie danych ──────────────────────────────────────────────
async function loadLocations() {
  const saved = loadFromStorage();
  if (saved) {
    locations = saved;
  } else {
    try {
      locations = await loadFromJSON('locations.json');
    } catch {
      console.warn('Brak pliku locations.json. Startujemy z pustą mapą.');
      locations = [];
    }
  }
  init(locations);
  createMarkers(locations);
}

// ── Reset mapy ────────────────────────────────────────────────────
async function loadNew() {
  try {
    locations = await loadFromJSON('locations.json');
    saveToStorage(locations);
    init(locations);
    createMarkers(locations);
  } catch {
    console.warn('Brak pliku locations.json.');
    createMarkers([]);
  }
}

// ── Globalny filtr (przyciski w HTML) ─────────────────────────────
function applyFilter(type) {
  createMarkers(filterMarkers(locations, type));
}

// ── Eksport funkcji wywoływanych z HTML (onclick=) ────────────────
window.openMarkerForm = openMarkerForm;
window.cancelAddMode  = cancelAddMode;
window.saveMarker     = saveMarker;
window.loadNew        = loadNew;
window.filterMarkers  = applyFilter;

// ── Start ─────────────────────────────────────────────────────────
loadLocations();
initSearch();
