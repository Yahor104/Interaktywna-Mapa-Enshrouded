import { showDetails } from './ui.js';

const map = document.getElementById('map');

export function createMarkers(locations) {
  map.querySelectorAll('.marker').forEach(m => m.remove());

  locations.forEach((location, index) => {
    const marker = document.createElement('div');
    marker.classList.add('marker', location.type);
    marker.style.left = location.x + '%';
    marker.style.top  = location.y + '%';

    marker.addEventListener('click', (e) => {
      e.stopPropagation();
      showDetails(location, index);
    });

    map.appendChild(marker);
  });
}

export function filterMarkers(locations, type) {
  if (type === 'all') return locations;
  return locations.filter(l => l.type === type);
}
