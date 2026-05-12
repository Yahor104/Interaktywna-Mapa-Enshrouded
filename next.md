# Refaktoryzacja kodu JavaScript i bezpieczna manipulacja DOM

W ramach dalszego rozwoju projektu konieczne jest wprowadzenie dwóch zmian, które poprawią czytelność, skalowalność i bezpieczeństwo aplikacji.

---

## 1. Podział kodu JavaScript na moduły

Aktualnie logika znajduje się w jednym pliku, co utrudnia:
- utrzymanie kodu,
- testowanie,
- ponowne wykorzystanie funkcji,
- rozwój projektu.

### Zalecenie
Rozdzielić kod na kilka plików, dzięki temu kod stanie się bardziej przejrzysty i łatwiejszy do rozwijania.

---

## 2. Zastąpienie `innerHTML` biblioteką DOMPurify

Używanie `innerHTML` bez filtracji danych naraża aplikację na ataki XSS.  
Aby temu zapobiec, należy użyć biblioteki **DOMPurify**, która oczyszcza dane przed wstawieniem ich do DOM.

### Przykład

```js
// Zamiast:
element.innerHTML = userInput;

// Należy:
const clean = DOMPurify.sanitize(userInput);
element.innerHTML = clean;
