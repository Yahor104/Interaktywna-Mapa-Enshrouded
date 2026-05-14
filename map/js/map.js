import { isAddMarkerMode, handleMapClick } from './ui.js';

const map = document.getElementById('map');

let scale    = 1;
let isDragging = false;
let startX, startY;
let currentX = 0;
let currentY = 0;

function updateMapTransform() {
  map.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}

// ── Zoom ──────────────────────────────────────────────────────────
map.addEventListener('wheel', (e) => {
  e.preventDefault();
  scale += e.deltaY < 0 ? 0.1 : -0.1;
  scale = Math.min(Math.max(0.5, scale), 4);
  updateMapTransform();
}, { passive: false });

// ── Drag ──────────────────────────────────────────────────────────
map.addEventListener('mousedown', (e) => {
  if (isAddMarkerMode()) return;
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

// ── Klik – dodawanie markera ──────────────────────────────────────
map.addEventListener('click', (e) => {
  if (!isAddMarkerMode()) return;
  const rect = map.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
  const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
  handleMapClick(x, y);
});
