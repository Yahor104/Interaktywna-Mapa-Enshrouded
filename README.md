# Plan Projektu: Interaktywna Mapa Enshrouded

## Tytuł roboczy
**EmberMap – Interaktywna Mapa świata gry**

---

## 1. Architektura
- **Typ aplikacji:** SPA (Single Page Application), frontendowy monolit (HTML + JS)  
- **Backend:** opcjonalnie PHP/Node.js do zarządzania danymi i użytkownikami  
- **API:** REST API (opcjonalnie)  
- **Wzorzec projektowy:** MVC (Model – View – Controller)  
  - Model → dane mapy (JSON)  
  - View → interfejs (HTML + CSS)  
  - Controller → logika JS  

---

## 2. Stack technologiczny
- **Języki:** HTML, CSS, JavaScript, JSON, PHP (opcjonalnie)  
- **Biblioteki:** Leaflet.js / canvas, marked.js, opcjonalnie Axios, Express.js  
- **Narzędzia developerskie:** Node.js, Vite  

---

## 3. Tokeny / klucze API
- GitHub API, Map tiles API, CI/CD  
- Przechowywanie w `.env` lub zmiennych środowiskowych  

---

## 4. Logika biznesowa
- Przeglądanie mapy, filtrowanie punktów, wyszukiwanie lokalizacji  
- Dodawanie własnych znaczników (opcjonalnie)  
- Zapisywanie stanu użytkownika (localStorage/backend)  

**Przykład danych JSON:**
```json
{
  "id": "boss_01",
  "name": "Boss Example",
  "type": "boss",
  "coordinates": { "x": 1234, "y": 5678 },
  "description": "Opis w markdown",
  "icon": "boss.png"
}
```

## 5. Przepływy UX/UI
- **Mapa:** zoom, przeciąganie, responsywność  
- **Filtrowanie:** checkboxy dla bossów, skrzyń, surowców  
- **Szczegóły:** kliknięcie markera → panel boczny z opisem  
- **Wyszukiwarka:** live search, autouzupełnianie  
- **Tryb użytkownika (opcjonalnie):** logowanie, prywatne znaczniki, eksport JSON  

## 6. Grupa docelowa
- Gracze, twórcy poradników, społeczność modderska  
- **Potrzeby:** szybki dostęp do lokalizacji, czytelność, responsywność  
- **Oczekiwania:** intuicyjny interfejs, brak reklam, aktualność danych  

## 7. Wymagania techniczne
- **Minimalne:** przeglądarka ES6, RWD, obsługa touch  
- **Wydajnościowe:** lazy loading, kompresja assetów, optymalizacja map  

## 8. Struktura katalogów
/project-root
├─ /public → mapy, ikony
├─ /src → models, views, controllers, services, main.js
├─ /data → locations.json
├─ /docs → dokumentacja
├─ .env
├─ package.json
└─ README.md
