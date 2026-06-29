# ⚗️ SILBERLOCKE

> Persönlicher Supplement-Tagesplan – getaktet nach Schlaf- und Trainingsrhythmus.

Eine installierbare, offline-fähige Progressive Web App (PWA) in reinem
Vanilla-JavaScript. Berechnet kcal- und Eiweißbedarf nach **Mifflin-St-Jeor**,
plant den Supplement-Stack über den Tag, und bietet Body-Atlas, Nährstoff- und
Sport-Datenbank – komplett im Browser, ohne Backend oder Login.

## ✨ Features

- **Onboarding-Assistent** (Uhrzeiten, Profil, Aktivität, Ziel, Modus, Produkte, Sport)
- **Bedarfsberechnung** kcal & Eiweiß (Mifflin-St-Jeor BMR × PAL × Ziel; Eiweiß n. Morton et al. 2018 / ISSN 2017)
- **Tagesplan** mit nach Aufwach-/Schlaf-/Trainingszeit getakteten Blöcken
- **Mein Stack**, **Money**, **Produkt-Datenbank**, **Nährstoffe**, **Body-Atlas**, **Sport-Pläne**
- **PWA**: installierbar, offline-fähig (Service Worker), App-Icons
- Persistenz über **IndexedDB** (mit localStorage-Fallback)

## 🏗️ Architektur

```
index.html               nur Markup + PWA-/SEO-Head
css/style.css            Styles
js/main.js               Orchestrator + DOM/Events
js/modules/
  calculator.js          kcal/Makro/Eiweiß (reine Logik)
  timeline.js            Zeitfenster-Mathematik (reine Logik)
  ui.js                  Render-Bausteine
  dataFetcher.js         async JSON-Loader
  storage.js             Persistenz (IndexedDB, Cache-First, Migration)
js/vendor/idb-keyval.js  vendored, keine externe Abhängigkeit
data/*.json              Produkte, Timeline, Sport, Body-Zonen, Nährstoffe
service-worker.js        Offline-Cache (App-Shell)
manifest.json            PWA-Manifest
icons/                   App- & Social-Share-Bilder
```

## 🚀 Lokal starten

ES-Module und `fetch()` brauchen einen HTTP-Server (nicht `file://`):

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

## 🧪 Qualität / CI

Ohne externe Abhängigkeiten – nur Node-Bordmittel:

```bash
npm run check:syntax   # node --check über alle App-JS-Dateien
npm run validate:data  # Struktur-/ID-Prüfung der data/*.json
npm test               # Unit-Tests (calculator, timeline)
npm run ci             # alles zusammen
```

GitHub Actions führt diese Pipeline bei jedem Pull Request und Push auf `main` aus.

## 📦 Deployment

Statische Seite – wird über **GitHub Pages** ausgeliefert. Alle internen Pfade
sind relativ, die App läuft daher unter jeder (Unter-)Adresse. Absolute URLs
(canonical, Open Graph, Sitemap) zeigen auf die Pages-Projekt-URL und müssen nur
bei einer eigenen Domain angepasst werden.

## ⚖️ Hinweis

Alle Werte sind Richtwerte und ersetzen keine medizinische oder ernährungs-
wissenschaftliche Beratung.

## 📄 Lizenz

[MIT](LICENSE)
