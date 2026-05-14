const STORAGE_KEY = 'myMapLocations';

export function saveToStorage(locations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
}

export function loadFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

export async function loadFromJSON(path = 'locations.json') {
  const response = await fetch(path);
  if (!response.ok) throw new Error('Failed to fetch ' + path);
  return await response.json();
}
