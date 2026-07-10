# MASTER HANDOFF & ROADMAP: VΛAΛV

> **Maßgebliches Arbeitsdokument** (`docs/MASTER_HANDOFF.md` im `Silberlocke`-Repo — genau der Pfad, auf den `vaaav-mobile`/`README.md` und `vaaav-mobile`/`CLAUDE.md` verweisen). Ersetzt `docs/ROADMAP.md` als führende Roadmap (die alte Datei bleibt als Status-Referenz der Vanilla-JS-PWA erhalten). Finalisiert am 2026-07-10 nach direktem Code-Audit **beider** Repos. Gemäß Regel 4 (Handoff-Loop) aktualisiere dieses Dokument am Ende jeder Coding-Session und pushe es.
>
> Jedes Feature besitzt eine feste ID (1–171) — verweise darauf per „Claude, lass uns heute Feature X bauen".

---

## 0. REALITÄTS-ABGLEICH (Code-Audit, Stand 2026-07-10) — ZUERST LESEN

Dieses Kapitel trennt unbestechlich, was **im Code verifiziert** ist, von dem, was **nur behauptet** wurde. Übernimm keinen Status als „erledigt", der hier nicht bestätigt ist.

### 0.1 Repo-Realität (beide Repos am 2026-07-10 direkt gegen den Code auditiert)
*   **`Silberlocke`** ist die **Vanilla-JS-PWA (v60)** — die Blaupause. 50 Commits, CI grün (Syntax-Check, Daten-Validierung, **23/23 Unit-Tests** in `tests/calculator.test.mjs` und `tests/timeline.test.mjs`). Logik-Module: `js/modules/calculator.js`, `timeline.js`, `storage.js`, `ui.js`, `dataFetcher.js`; Daten strikt getrennt in `data/` (app, health, nutrition, studies, supplements, training).
*   **`vaaav-mobile`** ist das **aktive Entwicklungs-Repo** (Expo SDK 54/57, React Native 0.81, TypeScript, react-native-reanimated 4). Am 2026-07-10 geklont und geprüft: **271/271 Logik-Tests grün** (`npm test`, 37 Test-Dateien), **~30 Logik-Module** in `src/logic/`, **27 Screens** in `src/screens/`, Core Bar + Theme-Kontext + Onboarding vorhanden. Stand: HEAD-Commit „Sprint 12". **Der reale Fortschritt liegt weit über dem alten Session-2-Statusblock** (siehe 0.3). CI (`.github/workflows/ci.yml`): Typecheck + Logik-Tests bei jedem Push; Auto-Publish via `eas-update.yml`.
*   **`vaaav-backend`** existiert **noch nicht** (nicht im Repo-Bestand). Alle Backend-/Next.js-Punkte bleiben Phase-3-Parkplatz, bis das Repo angelegt wird.

### 0.2 Korrigierte Status (Entwurf war veralteter als der Code — Positiv-Befunde)
Folgende Punkte führte der Entwurf als 🔨 „baubar", sie sind in der PWA jedoch **bereits live** (per Commit + Versionshistorie verifiziert):

| ID | Feature | Verifiziert |
| :--- | :--- | :--- |
| (5) | Identitäts-Onboarding | ✅ v42 |
| (114/115/116) | Phase Zero (Dicke-Plan, Ektomorph-Plan, Schatten-Tracking) | ✅ v45 |
| (64) | Wasser-/Elektrolyt-Schnellzugriff | ✅ v47 |
| (113) | „Brennende Batterie" (Tages-Batterie + Glut-Balken) | ✅ v48 |
| (80) | Kauf-Wahrheit (Pseudo-Rabatte/MHD) | ✅ v49 |
| (74) | Split-Screen Marketing vs. Realität | ✅ v50 |
| (123) | Medikamenten-Interaktions-Disclaimer | ✅⚠️ v51 |
| (48) | Einheiten-Vorbereitung | ✅ v52 |
| (49) | Pulver-/Wasser-Berechnung pro Einheit | ✅ v54 |
| (122) | Clash-Detection Trainings- vs. Ruhetag | ✅ v55 |
| (17) | Budget-Stufe „King" (Synergien) | ✅ v56 |
| (62) | Halal-Modus | 🟡 Halal-/Vegan-Check bei jedem Produkt live (v57/v60); Gebetszeiten offen |

### 0.3 Verifikation des alten Session-2-Statusblocks (am 2026-07-10 aufgelöst)
*   **Der frühere „Session 2 / 65 Tests / 5 Module"-Status ist überholt — zugunsten der Realität.** Der direkte Klon von `vaaav-mobile` zeigt einen **weit fortgeschritteneren** Stand: 271/271 Tests grün (statt 65), ~30 Logik-Module (statt 5), 27 Screens, HEAD bei „Sprint 12". Die einzelnen Commit-Hashes des alten Blocks (`5f97cb5` u. a.) waren aus dem Squash-/History-Verlauf nicht mehr auflösbar, sind aber gegenstandslos: die zugehörigen Features existieren als Module **und Tests** im Code (u. a. `discipline.ts`, `supplements.ts`, `money.ts`, `focus.ts`, `hybridRouting.ts`, `bloodwork.ts`, `analytics.ts`, `medals.ts`, `findings.ts`). Abschnitt 7 spiegelt jetzt diesen verifizierten Stand.
*   **`security-audit.yml`:** ✅ **In `vaaav-mobile` live** (PR #1, 2026-07-10). Drei Jobs grün verifiziert: Gitleaks (als MIT-Binary — hart blockierend), `npm audit --audit-level=high` (keine High-CVEs) und Semgrep (`p/javascript p/typescript p/react p/secrets`). Audit + Semgrep laufen zunächst als `continue-on-error` (informativ), bis der RN-Rauschpegel bereinigt ist; danach die Zeilen entfernen, um sie ebenfalls blockierend zu schalten. In `vaaav-backend` als ersten Commit anlegen, sobald es existiert.

### 0.4 Aktive Technik-Schulden (Launch-Blocker)
*   ⚠️ **`vaaav-mobile`: `DAYS_PER_STAGE = 5`** (`src/logic/discipline.ts:18`, Kommentar „DEV: reduziert für schnellere Stage-Tests") verkürzt die Aufstiegs-Zyklen künstlich. **Setze den Wert vor Launch auf den echten Produktionswert** (Blaupausen-Taktung), sonst ist Progressive Disclosure (#19) ausgehebelt.
*   ⚠️ **`Silberlocke` (PWA): `PREVIEW_UNLOCK_ALL = true`** (`js/main.js:301`) hebelt die komplette Verdien-Logik aus (radikale Gleichheit #4 und Progressive Disclosure #19 faktisch offen). Bewusst für die Betreiber-Testphase. **Vor Launch zwingend auf `false`.**
*   `js/main.js` (~4.400 Zeilen) weiter in Module zerlegen (Kandidaten: progress, week, body).
*   Icons/OG-Image tragen noch den alten Look; GitHub-Pages-URL trägt noch den Repo-Namen „Silberlocke" (Pfad, kein Anzeigetext).
*   Recht (105): Impressum-Platzhalter live; echte Betreiberdaten, AGB, DPMA-Marke offen.
*   **Doku-Drift:** `vaaav-mobile/README.md` beschreibt noch „UI-Prototyp, System-Stopp aktiv" — das ist überholt (271 Tests, 27 Screens). Beim nächsten `vaaav-mobile`-Commit die Status-Zeile der README nachziehen.

### 0.5 Bereinigte ID-Kollision
Die alte `docs/ROADMAP.md` nutzte 129–132 für WinterArc. **Verbindlich ab jetzt:** (129) = Voraussichtliche Einkaufskalkulation (Sprint 9); WinterArc/Columbus belegt die IDs (154)–(164).

---

## 1. Projekt-Übersicht & Core Identity

*   **Projektname:** VΛAΛV (ehemals STΛTUS / SILBERLOCKE)
*   **Philosophie:** Kompromisslose Werkbank für physische und mentale Disziplin. Keine VIP-Vorteile, keine Ausreden. Die App ist der Türsteher, das Tribunal und der Coach.
*   **Monetarisierung (Ethik-First):** Halte die Tracking-Werkbank dauerhaft kostenlos. Finanziere über Spenden und neutrale Affiliate-Datenvergleiche. Monetarisiere ausschließlich über physische Trophäen (Selbstkostenpreis + Gravur-Upgrades), „Individual Books" und den „Eternity Mode" (Abo).
*   **Architektur-Entscheidung (Schmerz als Feature):** Verzichte in Phase 1 bewusst auf Komfort-APIs (Open Banking, Apple Health, Auto-Syncs). Das manuelle Eintragen von Ausgaben, Laborwerten oder Trainingsdaten (Watt, Schlaf) ist ein zwingendes, disziplinierendes Ritual und garantiert ein hochstabiles, autarkes System ohne fehleranfällige Drittanbieter-Abhängigkeiten.
*   **Finale-Parkplatz-Regel:** Einige Features (🔵/🅿️) sind aktuell nicht machbar und bleiben bewusst im Dokument. Baue sie **erst im Finale**, wenn alles bisher Machbare (🔨/🟡) fertiggestellt ist. Lösche sie nicht.

---

## 2. Systemarchitektur & Tech-Stack

*   **Frontend (Mobile App):** React Native (Expo)
*   **Backend / API / Admin:** Next.js (Deployment: Vercel)
*   **Datenbank:** Supabase (isolierte Nährwert-Masterdatenbank, serverseitige Truth-Engine)
*   **Repository-Struktur:** Halte die strikte Trennung in zwei Repositories ein: `vaaav-mobile` und `vaaav-backend`. Dieses Repo (`Silberlocke`) bleibt die unantastbare v60-Referenz-Blaupause.

---

## 3. UNUMSTÖSSLICHE KI-ARBEITSREGELN (System-Guardrails)

> ⚠️ **WORKFLOW-INFO FÜR DIE KI:** Ich entwickle komplett ohne lokalen PC. Die Pipeline läuft streng über GitHub. Deploye das Next.js-Backend auf Vercel. Richte für das React-Native-Frontend direkt zu Beginn eine GitHub Action für „Expo EAS Update" ein, damit jeder Commit automatisch zu Expo gepusht wird und ich die App über den QR-Code im Expo-Dashboard via Expo Go teste. Halte den Code extrem modular und gib immer exakte Dateipfade an!

1.  **Component-Driven Development:** Baue IMMER zuerst das visuelle UI mit harten Mock-Daten. Schreibe niemals Backend-Routing oder State-Management (Redux/Zustand), bevor der visuelle Screen vom User freigegeben wurde.
2.  **Single Source of Truth (Styling):** Nutze niemals hardcodierte Farben oder Schatten in Komponenten. Lade alle Werte der VΛAΛV Design-Matrix zwingend aus einer zentralen `theme.ts` (bzw. einem globalen Stylesheet).
3.  **Absolutes Emoji-Verbot:** Emojis im UI der App sind strikt untersagt. Nutze ausschließlich hochwertige, abstrakte Vektor-Icons (Lucide-Icons / Expo-Vector-Icons).
4.  **Handoff-Loop:** Aktualisiere am Ende jeder Coding-Session unaufgefordert die Sektionen „Aktueller Status" (7) und „Aktuelles Todo" (8) und pushe das Dokument.
5.  **Legacy-Code respektieren (die v60-Blaupause):** Baue das UI bei der Migration visuell komplett neu nach der Design-Matrix. Erfinde die zugrundeliegende Logik, Mathematik und Datenstruktur unter keinen Umständen neu. Der Vanilla-JS-Code (v60, dieses Repo) ist die absolute Referenz — extrahiere die Logik 1:1 und übersetze sie in den React-State.

---

## 4. DIE „VΛAΛV CORE BAR" (Das dynamische Herzstück)

Das visuelle und funktionale Zentrum der App ist nicht die Standard-Notch, sondern ein eigener, unabhängiger UI-Organismus.

*   **Positionierung:** Baue einen eigenständigen, schwebenden Balken direkt unterhalb der OS-Sensoren/Safe-Area. Plattformunabhängig (identisch auf iOS und Android).
*   **Technik:** Baue die Bar zwingend mit `react-native-reanimated`, um flüssige, hardwarebeschleunigte 60-FPS-Morphing-Animationen (Breite, Farbe, Inhalt) zu garantieren.
*   **Stealth-Branding & Logo-Integration:**
    *   **Der Morphing-Anker:** Platziere links das mittlere „Λ" von VΛAΛV als permanentes, scharfes UI-Icon. Wechselt der Nutzer den Tab (z. B. Schlaf), morpht das „Λ" flüssig in das jeweilige Kontext-Icon (z. B. Mond) — und beim Verlassen zurück ins „Λ".
    *   **Die 3D-Glasgravur (Wasserzeichen):** Fräse den Schriftzug „VΛAΛV" mittig per Inset-Shadow ins Glas (ohne eigene Farbe). Er wird nur sichtbar, wenn der leuchtende Disziplin-Balken (Neon-Treibstoff) dahinter entlangläuft und die Buchstabenkanten von hinten zum Leuchten bringt.
*   **Die 4 dynamischen Zustände:**
    1.  **Default-State (Der Kompass):** Auf dem Dashboard aktiv. Zeige den Makro-Fortschritt bis zum nächsten Modus mit konstantem Glow in der Modus-Farbe.
    2.  **Context-State (Das Mikroskop):** Morphe beim Wechsel in einen Detail-Tab sanft um und zeige den kontextuellen Treibstoff: im ZNS-Tab den Nervensystem-Status, im Schlaf-Tab das Erholungs-Konto, im Muskel-Tab die Regeneration.
    3.  **Action-State (Die Brennende Batterie):** Lasse beim aktiven Eintragen/Tracken einen Energie-Glow durch den Balken pulsieren, bevor er in den Default-State zurückkehrt.
    4.  **Recovery-State (Das Defizit / Pacing-Lock):** Blockiere die Bar nach harten Apex-Einheiten (z. B. >100 km Rad) im tiefroten Warnbereich. Sie morpht nicht passiv durch Zeit, sondern nur durch aktive Disziplin (eingetragene Kcal-Deckung, Rehydrierung, Schlaf) schrittweise zurück zu Grün. In Krankheitsphasen schalte alle Tools sukzessive frei (Pacing-Logik, siehe #170).

---

## 5. DIE VΛAΛV DESIGN-MATRIX & UI-REGELWERK

Passe das UI-Design dynamisch an den aktuellen Modus des Nutzers an:

*   **Level 1 — Phase Zero & Light Mode:** Klinischer, sauberer Neomorphismus. Helle Töne (Ice-Blue, sanftes Grau), weiche Schatten. Die App wirkt strukturiert und greifbar.
*   **Level 2 — Hard/Expert Mode (Standard-Werkbank):** Matte Dark Theme. Tiefes Anthrazit, aufgeraute Texturen. Harte Neon-Akzente (Orange, Grün, Lila) glühen aus dem Hintergrund und bei aktiven Fortschrittsbalken.
*   **Level 3 — Tribunal & Tabu-Börse:** Glassmorphismus in satten, warnenden Rot-/Burgundertönen. Optisch streng, bedrohlich, kompromisslos.
*   **Level 4 — Master/Eternity Mode:** Liquid Glass kombiniert mit edlen, greifbaren Texturen (Leder-Optik, Titan/Metall). Visueller Luxus als digitale Entsprechung der physischen VΛAΛV-Gravuren.

---

## 6. DIE KOMPLETTE MASTER-ROADMAP (IDs 1–171)

**Legende:** ✅ Live (im Code dieses Repos verifiziert) · 🟡 Teil-Live · 🔨 Jetzt baubar · 🔵 Phase 3 (Backend/DB/Recht/Extern — Finale-Parkplatz) · ⚠️ Nur mit Schutz-Auflagen · 🅿️ Bewusst geparkt · ❓ Mit Betreiber klären

### Sprint 1: Fundament, Architektur & Identität
*   (1) ✅ VΛAΛV als Markenname etabliert (v44, inkl. Währung „Punkte", ohne Datenverlust).
*   (2) ✅ 18-Punkte-Manifest fest verankert (v41; seit v46 im Profil/Ich-Bereich).
*   (3) ✅ App fungiert als ablenkungsfreie Werkbank.
*   (4) ✅⚠️ Radikale Gleichheit: keine kaufbaren VIP-Vorteile. *Aktuell durch `PREVIEW_UNLOCK_ALL` ausgehebelt — vor Launch schließen.*
*   (6) ✅ Entwicklung im Stealth-Modus.
*   (8) ✅ Tracking-Werkbank 100 % kostenlos.
*   (97) ✅ Modulare Architektur trennt Logik (`js/`) von Daten (`data/`).
*   (98) ✅ Offline-fähige PWA (GitHub Pages, atomare Versions-Pakete).
*   (105) 🟡 Juristische Absicherung (Impressum-Platzhalter live; Betreiberdaten, AGB, DPMA-Marke offen).
*   (7) 🔵 Startschuss via YouTube + VΛAΛV-Domain.
*   (96) 🅿️ Framework-Sprung auf Next.js/React Native (AKTUELL IN ARBEIT — extern in `vaaav-mobile`, siehe 7B).
*   (103) 🔵 Backend-Kapselung der Straf-Logik (Supabase/RLS).
*   (104) 🅿️ Code-Obfuscation und Cloudflare-Blocker.

### Sprint 2: Onboarding & Phase Zero (Der Türsteher)
*   (11) ✅ Zwei-Achsen-Matrix: Erfahrungsmodus × Budgetmodus.
*   (5) ✅ Identitäts-Onboarding prüft mentale Bereitschaft (v42; Fixed-Choice-Buttons, kein Freitext → keine Injection-Fläche).
*   (114) ✅ „Dicke-Plan" (Phase Zero) für Übergewichtige — erster Monat straffrei (v45).
*   (115) ✅ „Ektomorph-Plan" für Untergewichtige — Fokus Magendehnung/Aufbau (v45).
*   (116) ✅ „Schatten-Tracking": verwehrt im ersten Monat Kcal-Zahlen zur Baseline-Ermittlung (v45).
*   (18) 🟡 Interaktives 3-Schritte-Setup generiert das Dashboard (Treibstoff-Puffer offen).
*   (132) 🔨 Fokus-Matrix (Hybrid-Profiling): Primärziel (z. B. Bodybuilding) vs. Sekundärziel (z. B. Rennrad). Die App passt sich dieser Identität an.
*   (45) 🔵 Vergleichs-Matching (identische Veteranen-Profile).
*   (133) 🔵 Prognose-Engine: berechnet ungeschönt, wo der Nutzer in 10 Jahren steht (siehe Abschnitt 15).

### Sprint 3: Chronobiologie, UI & Tägliche Werkbank
*   (19) ✅⚠️ Progressive Disclosure (7/14/21/28-Tage-Fahrplan). *Aktuell durch Vorschau-Schalter offen.*
*   (34) ✅ „Body-IQ"-Quizzes (v40, 15 Fragen, nicht farmbar).
*   (99) ✅ Dark-Mode-Design mit Neon-Akzenten.
*   (101) ✅ Dashboard-Widget mit tageswechselnden Optimierungs-Insights (v38).
*   (64) ✅ Schnellzugriff-Button für Wasser und Elektrolyte (v47).
*   (113) ✅ „Brennende Batterie": Echtzeit-Animation beim Tracken (v48; in RN in die Core Bar überführen).
*   (57) 🟡 Dynamische Einnahmefenster (Taktung ab individueller Aufwachzeit).
*   (58) 🟡 Basis-Routinen als Standard-Mahlzeiten-Logik.
*   (63) 🟡 Circadianer Sleep Mode.
*   (62) 🟡 Beten/Halal-Modus: Halal-/Vegan-Check bei JEDEM Produkt live (v57/v60); Gebetszeiten-Integration offen.
*   (137) 🔨 Universelle Weisheits-Datenbank: binde Koran-Verse in Halal-Modus/Werkbank ein (Prinzipien von Geduld/Sabr, Standhaftigkeit, innerer Reinigung).
*   (138) 🔨 Neutrales Wording: betitele Verse als „Prinzipien der Stärke". Zeige sie Trigger-basiert nur bei negativen Tagebuch-Einträgen oder Disziplin-Lücken, begleitet von haptischem Grounding (Herzschlag-Vibration).
*   (100) 🔨 Anpassbare Gaming-Themen (Vibes gemäß Design-Matrix).
*   (134) 🔨 VΛAΛV Atomuhr (Startseite): unbestechlicher Counter „Tage durchgezogen" vs. „Tage verschwendet".
*   (135) 🔨 Tage-Zähler: „tatsächlich durchgezogene Trainings" vs. Ausfälle.
*   (136) 🔨 Resilienz-Engine (Mindset-Support): aktiviere bei erkannten „Tiefs" automatisch den Resilienz-Modus.
*   (130) 🔨 Datenbasiertes Budget-Planning: erstelle aus gesammelten Financial-Hub-Daten proaktive Budget-Pläne und Limits.
*   (131) 🔨 Regressions-Frühwarnsystem (Muster- & Depressions-Tracking).
*   (127) 🔨 Financial-Hub (Phase 1: manuelle Eingabe der Ausgaben; Open-Banking-Sync erst Phase 3, #85).
*   (128) 🔵 Medical-Terminal als hochsicheres, verschlüsseltes Archiv für Befunde (siehe Abschnitt 19).
*   (61) 🅿️ Rigoroser „Aleman Trink-Timer" (native Alarme — PWA-Limits).

### Sprint 4: Trainings-Matrix & Leistungssteuerung
*   (47) ✅ Autarker Wochenplan-Baukasten.
*   (54) ✅ Zwingende Pre-Workout-Schranke bei ZNS-Ermüdung/Schlafmangel.
*   (48) ✅ „Geplante Einheit Vorbereitung" visualisiert das nächste Workout (v52).
*   (49) ✅ Automatische Berechnung Pulver/Wasser pro Einheit (v54).
*   (122) ✅ Clash-Detection: unterscheidet Trainings- vs. Ruhetag, Ein-Tipp-Korrektur (v55).
*   (46) 🟡 „All-in-One Clash Detection" (Schlaf-Sperre live).
*   (52) 🟡 Hypertrophie-Fokus (Pläne live, Volumen-Tracking offen).
*   (53) 🟡 Systemische Ego-Bremsen drosseln bei Überlastung.
*   (50) 🔨 Rennrad-Fokus mit spezialisierten Plänen (als Daten).
*   (139) 🔨 Thermodynamisches Recovery-Fenster: roter Defizit-Modus. Er füllt sich nicht passiv durch Zeit, sondern nur aktiv — tracke die berechneten Kcal für Gewebereparatur/Energie zu 100 %, bevor die App auf „Grün" springt.
*   (140) 🔨 Adaptives Hybrid-Routing: berechne Volumen cross-funktional aus der Fokus-Matrix. Ist Radsport nur Hobby, deckle die ZNS-Belastung auf dem Rad, damit der primäre Bodybuilding-Plan nicht sabotiert wird (und umgekehrt).
*   (141) 🔨 Mikrozyklen-Spezifizierung (Stimulus-Fokus): frage den Trainingsreiz zwingend ab (Kraftausdauer, Hypertrophie, Muskelausdauer). Blockiere physiologisch widersprüchliche Belastungsmuster.
*   (142) 🔨 „Pro-Peloton"-Benchmark (Tour de France): vergleiche manuell getrackte Leistungswerte (FTP, Watt/kg, Höhenmeter, Dauer) ungeschönt mit Profi-Anforderungen. Visualisiere den Abstand zur Weltklasse als prozentualen Reality-Check.
*   (144) 🔨 Geräte-Inventar (Gear-Setup): lege Equipment einmalig an (Radcomputer, Powermeter, Beleuchtung).
*   (145) 🔨 Pre-Tour Gear Checklist: triggere am Vorabend einer Tour eine interaktive Vorbereitungs-Liste (Schläuche, CO2, Nutrition).
*   (146) 🔨 Charge-Check (Elektronik-Status): „Auflade"-Checkliste für alle Geräte (Radcomputer, elektronische Schaltung).
*   (51) 🔨 Watt-Tracking (Phase 1: manuelle Eingabe; Hardware/BLE erst mit Ingestion Engine, Abschnitt 11).
*   (60) 🔨 Schlaf-/Gesundheits-Metriken (Phase 1: manuelle Übertragung; Apple Health/Health Connect Sync erst Phase 3).
*   (143) 🔵 Dedizierter Fahrrad-Bereich (innerhalb des Columbus Mode).
*   (56) 🔵 Live-Wetter-Tracking passt Hydration an.
*   (55) 🅿️ App-Sperre in Satzpausen (Social-Media-Blocker).

### Sprint 5: Supplement-Datenbank & Science
*   (72) ✅ Datenbank bewertet unbestechlich nach Fakten.
*   (75) ✅ Wissenschaftliche Studien-Werte strikt getrennt von User-Meinungen.
*   (76) ✅ Harte rechtliche Disclaimer statt Wirkversprechen.
*   (81) ✅ UX-Makro-Block-Bündelung (z. B. Morgen-Stack).
*   (82) ✅ Efficiency-Filter warnt vor Überdosierung (ab 500/1000 % NRV, v37).
*   (74) ✅ Split-Screen: Marketing-Dose vs. harte VΛAΛV-Realität (v50).
*   (80) ✅ Entlarvung von Pseudo-Rabatten / MHD („Kauf-Wahrheit", v49).
*   (123) ✅⚠️ Harte Disclaimer-Labels für Medikamenten-Interaktionen (nur gut belegte; immer „Arzt/Apotheker"; v51).
*   (77) 🟡 „No-Bullshit"-Geschmackstester (Schema live, Werte fehlen).
*   (78) 🟡 Farbliche Codes für Studie vs. User-Erfahrung.
*   (79) 🟡 Warnflagge bei verschlechterten Rezepturen (Schema live).
*   (121) 🔨 Erweiterung um spezifische Molekülverbindungen (z. B. Bisglycinat vs. Oxid, als Daten).
*   (73) 🅿️ Produktdaten offiziell bei Herstellern einholen.

### Sprint 6: Gamification, Strafen & Tabu-Börse
*   (12) ✅ Light Mode: Einsteigerstufe mit Zeit-Toleranz (v34).
*   (20) ✅ Gatekeeper-Algorithmus: Aufstieg erfordert Disziplin ≥ 90 % (v36).
*   (23) ✅ Animierter Disziplin-Balken (Verlustaversion).
*   (24) ✅ 24-h-Schreibschutz-Lock (fehlende Tage = Null-Runde, v33).
*   (25) ✅ „Training-Steuer" verhängt Pflicht-Zusatz-Workouts bei Lücken (v33).
*   (29) ✅ Punkte nur durch Tracking verdienbar.
*   (30) ✅ Starterpaket an Punkten schützt Anfänger (1 Joker, Score 60).
*   (31) ✅ „Liebloses Essen" (Cheat-Tage) im Shop freischaltbar (v35).
*   (32) ✅ Strategisches Pre-Booking für vorhersehbare Ausfälle (v35).
*   (33) ✅ Mathematisches Jokersystem (Cap 3 pro Woche, v35).
*   (13) 🟡 Hard Mode: exaktes Gramm-Tracking.
*   (14) 🟡 Expert Mode: minutengenaues Timing.
*   (21) 🟡 Truth-Engine entzieht Betrügern Punkte.
*   (26) 🔨⚠️ Degradierungs-Automatik: stufe bei Verstößen zurück (Regeln sauber definieren; siehe Abschnitt 15).
*   (28) 🔨 Verbindliche Therapie-Verträge blockieren Laster (lokal).
*   (111) ✅ Tabu-Börse (Anti-Stockpiling) in `vaaav-mobile`: Sünden-Produkte legal mit Punkten freischalten, 7-Tage-Sperre pro Produkt. Eiserne Regel: **Nichts auf Vorrat.** (`tabuBoerse.ts`, TabuScreen)
*   (112) ✅ Schatten-Kompensation in `vaaav-mobile`: stiller Kalorienausgleich für Tabu-Käufe (`shadowCompensationNote`).
*   (147) ✅ Supermarkt-Walk-Tracking in `vaaav-mobile` (PR #3): jeder Tabu-Kauf erzeugt eine offene Fußweg-Schuld (FIFO), manuell als Micro-Workout/Willenskraft-Beweis bestätigt — ohne Punktevergabe (#29). 4 Tests, 275/275 grün.
*   (148) 🔨 Belohnungs-System für strukturierte Tagebuch-Einträge (Journaling; siehe Abschnitt 15).
*   (149) ✅ VΛAΛV Wallpaper-Bar in `vaaav-mobile` (PR #5): Mo-Fr-Fortschrittsbalken schaltet am Wochenende ein Wallpaper frei (live aus theme.ts-Palette gerendert, deterministische Wochen-Rotation, nicht käuflich). 12 Tests, 296/296 grün. Offen: Kamera-Roll-Export (`expo-media-library`, braucht Geräte-Verifikation). (`wallpaperBar.ts`, WallpaperBarScreen)
*   (171) ✅ Wissens-Feed „Mythos oder Fakt" in `vaaav-mobile` (PR #4): Ja/Nein-Kartenstapel, max. 20/Tag, deterministische Tages-Rotation, ohne Punktevergabe (#29). 24 Karten, 9 Tests (284/284 grün). (`knowledgeFeed.ts`, KnowledgeFeedScreen)
*   (27) ❓ Pacing-Mechanik: schalte alle 3 erfolgreich absolvierten Tage ein neues Element/Tool frei (Überforderung vermeiden, Überraschungseffekt nutzen). *Mit Betreiber final klären.*

### Sprint 7: Hardware-Locks & Anti-Schummel-Eskalation (Das Tribunal)
*   (108) ✅ Ehrlichkeits-Kompensation (Confession Loop): Beichte führt zu Pflicht-Cardio statt Degradierung (v33).
*   (59) 🟡 Wöchentlicher „Truth-Check" auf der Waage (manuell live).
*   (109) 🟡⚠️ Thermodynamik-Audit entlarvt Lügen (±500-kcal-Deckel; >1,5 kg/Woche → Arzt-Verweis).
*   (110) 🔨⚠️ System-Tribunal: friere die App ein + verweise an den Arzt bei mathematischem Kollaps (respektvoll formulieren).
*   (22) 🔵 Integritäts-Audit erkennt Manipulationen (echt nur serverseitig).
*   (102) 🔵⚠️ Lokaler Foto-Tresor für Vorher-Nachher-Bilder (verschlüsselt).
*   (106) 🔵⚠️ Audit-Kamera verlangt flüchtigen Foto-Beweis beim Essen (Zero-Retention).
*   (107) 🔵⚠️ Waagen-Pflicht-Foto im Elite-Modus.

### Sprint 8: Die Soziale Arena & Squads (alles Phase 3/Backend)
*   (35) ✅ Sichtbare, seltene Profil-Medaillen (v39, lokal — später serverseitig).
*   (36) 🔵 „VΛAΛV-Arena" bildet 4er-Arbeits-Squads.
*   (37) 🔵 „Team-Karma": Schummeln eines Mitglieds senkt Squad-Punkte.
*   (38) 🔵 Demokratischer Team-Ausschluss für Saboteure.
*   (39) 🔵 Belohnungs-Boost für fehlerfreie Squads.
*   (40) 🔵 System-Ranking historischer Serien.
*   (41) 🔵 Leaderboard nach Fleiß deklassiert Genetik-Profis.
*   (42) 🔵 1-gegen-1-Duelle um die längste Disziplin-Strähne.
*   (43) 🔵 „Likes" für extrem hart getrackte Workouts.
*   (44) 🔵 Support-Punkte für Motivation.

### Sprint 9: E-Commerce, Finanzen & Monetarisierung
*   (83) ✅ Smart-Replacement bei ausverkauften Produkten.
*   (91) ✅ Affiliate-Links zwingend mit wissenschaftlichen Studien unterfüttert.
*   (92) ✅ Automatische Link-Entfernung bei Qualitätsverlust (Prinzip).
*   (94) ✅ Firmenkooperationen verändern niemals die harte Nährwert-Bewertung.
*   (17) ✅ Budget-Stufe „King": Premium-Stacks/Synergien (belegte Wirkstoff-Kombis, v56).
*   (16) 🟡 Budget-Stufe „Warrior" fokussiert auf günstige Basis-Rohstoffe.
*   (87) 🟡 Survival-Automatik streicht Luxus-Supplements bei Geldmangel (manuell live).
*   (90) 🟡 Kontextuelles Affiliate (Schema live).
*   (95) 🟡 „Savings Insight" entlarvt Marken-Aufschläge (€/100 g offen).
*   (93) 🔨 Transparente Kommunikation bei Top-Produkten ohne Affiliate-Link.
*   (117) 🔨 Trophäen-Basis: physische Trophäen zum Selbstkostenpreis + Gravur-Upgrades als einzige Monetarisierung (operativ; siehe Abschnitte 16/18).
*   (118) 🔨 Material-Ehre: lege einen Spezifikations-Zettel bei („Schmiedeguss, kratzeranfällig, ein ehrlicher Alltagsbegleiter").
*   (124) 🔨 Die „Stille Münze": physische VΛAΛV-Münze als unangekündigtes Geschenk bei Bestellungen.
*   (125) 🔨 Apex-Leistungen (Phase 1: manuelle Übertragung von Highlight-Daten; Strava-Sync erst Phase 3).
*   (129) 🔨 Voraussichtliche Einkaufskalkulation: berechne aus Vorratstracker + historischen Preisen die exakten Kosten des nächsten Einkaufs im Voraus.
*   (150) 🔨 Hintergrund-Vorratstracker (Inventory Engine): berechne aus dem täglich getrackten Konsum (z. B. 100 g Haferflocken, 40 g Eiweißpulver) den physischen Füllstand der Vorräte.
*   (151) 🔨 Zero-Stock-Warnsystem: melde dich proaktiv, kurz bevor ein essenzielles Produkt leer ist.
*   (152) 🔨 Wöchentlicher Master-Bestellplan: bündle alle zur Neige gehenden Produkte zu einer fertigen Einkaufs-/Nachbestell-Liste.
*   (166) 🔨 Individual Book: verkaufe personalisierte Erfolgs-Historien als gedrucktes Buch (siehe Abschnitt 17).
*   (168) 🔨 Shop-Incentive: schalte bei Bestellung physischer Ware den „Eternity Mode" bis zur Lieferung frei.
*   (169) 🔨 Disziplin-Fallback: stufe bei Scoring-Abfall automatisch auf Light Mode zurück.
*   (84) 🔵 Verifizierte Amazon/Google-Bewertungen einbinden.
*   (85) 🔵 Open-Banking-Schnittstelle (FinAPI/Tink).
*   (86) 🔵 Trash-Ausgaben-Analyse (Lieferdienste = Disziplin-Schwäche).
*   (88) 🔵 Schmerzhafte Umrechnung: Fast-Food-Geld vs. Premium-Supplements.
*   (89) 🔵 Predictive Finance (Zeitpunkt für Jahresvorrat-Kauf).
*   (126) 🔵 Exklusives Recht auf GPS-Routendaten-Gravur in Acryl für Highlight-Strecken.
*   (165) 🔵 Ethischer Affiliate-Vergleich (4 Marken, absolute Neutralität).
*   (167) 🔵 Eternity Mode (Abo): 19,99 €/Monat für vollen Zugriff (Apple-konform via IAP, siehe Abschnitt 10).

### Sprint 10: Biohacking-Recovery & Master Mode
*   (15) ✅ Master Mode: Endziel, nicht wählbar — nur durch fehlerfreie Langzeit-Quest erspielbar.
*   (66) ✅ Manuelles Drosseln bei eingepflegten Befunden.
*   (65) 🟡 Deep-Recovery-Modus schaltet auf Heilung um.
*   (71) 🟡 Master Mode analysiert manuell eingetragene Labor-Blutwerte und gleicht sie mit dem Stack ab.
*   (68) 🔨 Lückenloses Schlafen/Trinken zählt als „Workout" bei Krankheit.
*   (70) 🔨 Generiere einen schonenden Wiedereinstiegs-Plan nach Krankheit (algorithmischer Ramp-Up).
*   (119) 🔨 „VΛAΛV-Paradoxon": die Perfektions-Falle — Mikromanagement wird obsolet.
*   (120) 🔨 Eternity Mode (Endgame): entlasse den Nutzer in lebenslange, straffreie Freiheit.
*   (170) 🔨 Recovery-Lock-Pacing: schalte Tools während des Recovery-Modus sukzessive frei.
*   (153) 🔵⚠️ Ärztliches OK: zwingende Bestätigungsschranke nach dem Recovery-Mode.
*   (9) 🔵 Freiwilliges Spendenmodell für Serverfinanzierung (exklusiv für Absolventen).
*   (10) 🔵 Erfolgreiche Absolventen geben „Legacy-Profile" frei.
*   (67) 🔵 Doctor-ID-Schnittstelle synchronisiert Gesundheitsdaten.
*   (69) 🔵 Squad-Mitglieder senden anonyme Genesungsnachrichten.

### Sprint 11: The WinterArc & Columbus Mode (Reale Welt)
*   (160) 🔨 Survival Mode (Camper, lange Touren & Trips): autarker Modus für mehrtägige Touren abseits der Zivilisation. Pausiere reguläre Gym-/Alltags-Strafen und tracke stattdessen Survival-Metriken (Rationierung, Kilometer, Höhenmeter, Outdoor-Schlaf).
*   (161) 🔨 Tägliche Befindlichkeits-Abfrage: dreimal täglich (Morgen, Mittag, Abend) strukturierte Abfrage von Wohlbefinden und schnellen Notizen.
*   (162) 🔨 Tagebuch-Struktur & Deep Focus Timer: automatisierter Tagesabschluss — alle Notizen, Daten und Ziele fließen hier zusammen. Ein Timer für fokussiertes Arbeiten/Lesen („Shadow Phase") fließt als stilles Wachstum ein.
*   (164) 🔨 Biometrische Resilienz-Kopplung: gleiche „Tiefs" mit physischen Daten ab (wenig Schlaf, harte Rad-Einheiten). Ändere das Wording bei physischer Überlastung von „Push harder" zu „Erholung ist Teil des Prozesses".
*   (154) 🔵 Columbus Mode: Entdeckung und Freischaltung physischer Gebiete und Events.
*   (155) 🔵 Neue Aktivitäten entdecken: inspiriere, den Alltag zu verlassen („Der Frankfurt Ironman findet nächstes Jahr statt").
*   (156) 🔵 Freizeit-Integration: zeige lokale Events und Hobbys (Klettern, Tanzen, Kajak, Fotografie, Kochkurse) direkt buchbar an.
*   (157) 🔵 Individueller Columbus-Foto-Tresor: private Fotos direkt in der Columbus-Logik.
*   (158) 🔵 Ethisches Geschäftsmodell: Buchung über Partner mit neutraler Provision. Keine Bevorzugung durch höhere Provision.
*   (159) 🔵 WinterArc-Newsletter: keine Spam-Flut — Qualität statt Quantität.
*   (163) 🔵 „VΛAΛV Individual Book" & physische Coins: eigene Notizen/Daten als gedrucktes Buch; Titan-Coins mit Laser-Gravur („Veteranen-Narbe") für den absolvierten WinterArc.

---

## 7. AKTUELLER STATUS (Handoff-Loop, Stand 2026-07-10)

### 7A. Verifiziert: Vanilla-JS-PWA (dieses Repo, v60)
*   50 Commits, CI grün: Syntax-Check, Daten-Validierung, **23/23 Unit-Tests** (calculator, timeline). Deploy via GitHub Pages mit Retry-Härtung.
*   Versionshistorie (Auszug): v33 Confession Loop + Training-Steuer · v35 Punkte-Shop (Cheat-Tag + Pre-Booking) · v36 Gatekeeper · v37 Efficiency-Filter · v40 Body-IQ · v41 Manifest · v42 Identitäts-Frage · v44 Rebrand VΛAΛV · v45 Phase Zero · v46 Profil/Ich-Bereich · v47 Wasser/Elektrolyte · v48 Brennende Batterie · v49 Kauf-Wahrheit · v50 Split-Screen · v51 Medikamenten-Disclaimer · v52 Einheiten-Vorbereitung · v54 Pulver/Wasser · v55 Clash-Detection · v56 König-Synergien · v57–v60 Halal-/Vegan-Transparenz + Produkt-Detail-Refactor.
*   ⚠️ Betreiber-Vorschau aktiv: `PREVIEW_UNLOCK_ALL = true` (`js/main.js:301`) — vor Launch auf `false`.

### 7B. VERIFIZIERT: React-Native-App (`vaaav-mobile`, direkt gegen den Code, 2026-07-10)
> Repo am 2026-07-10 geklont, `npm test` ausgeführt: **271/271 Logik-Tests grün** (37 Test-Dateien). HEAD-Commit „Sprint 12". Der frühere „Session 2 / 65 Tests"-Block ist damit überholt — der reale Stand ist deutlich weiter.

*   **Fundament:** Expo SDK 54/57, React Native 0.81, TypeScript, react-native-reanimated 4. `App.tsx` (Fonts/SafeArea/StatusBar), `src/navigation/RootNavigator.tsx`, `src/theme/theme.ts` als Single Source of Truth (Design-Matrix, Neomorphismus, Liquid Glass). CI (`ci.yml`): Typecheck + Logik-Tests; Auto-Publish (`eas-update.yml`).
*   **Core Bar & Marke:** `src/components/core-bar/` — `CoreBar.tsx`, `MorphAnchor.tsx` (Λ-Anker), `GlassEngraving.tsx` (3D-Glasgravur). Plus `AtomClock.tsx` (Atomuhr #134), `PremiumCard.tsx` (Neomorph/Glas), `Toast.tsx`, `ScreenShell.tsx`.
*   **Logik-Kern (`src/logic/`, ~30 Module, alle mit Tests):** `calculator.ts`, `timeline.ts`, `dayplan.ts`, `dayArchitecture.ts`, `discipline.ts`, `tracking.ts`, `weekPlan.ts`, `sportplan.ts`, `macroPlanning.ts`, `mealtracking.ts`, `nutrition`, `supplements.ts`, `money.ts`, `medals.ts`, `confession.ts`, `identity.ts`, `focus.ts`, `hybridRouting.ts`, `bloodwork.ts`, `findings.ts`, `analytics.ts`, `monitoring.ts`, `injuryHub.ts`, `tabuBoerse.ts`, `ramadanMode.ts`, `arcMode.ts`, `bodyAtlas.ts`, `drivetrain.ts`, `gearing.ts`, `knowledge.ts`.
*   **Screens (`src/screens/`, 27):** u. a. `MasterScreen`, `DayScreen`, `DayArchitectureScreen`, `WeeklyPlanScreen`, `ToolsScreen`, `NutritionScreen`, `StackScreen`, `ProductsScreen`, `ShopScreen`, `TabuScreen`, `MoneyScreen`, `BloodworkScreen`, `FindingsScreen`, `BodyAtlasScreen`, `BodyScreen`, `RecoveryModeScreen`, `RamadanModeScreen`, `MonitoringScreen`, `InjuryHubScreen`, `AnalyticsScreen`, `MedalsScreen`, `ManifestScreen`, `QuizScreen`, `FocusScreen`, `GearingScreen`, `DrivetrainScreen`, `onboarding/OnboardingFlow`.
*   **State (`src/state/`):** `DisciplineContext`, `ProfileContext`, `StackContext`, `ArcModeContext`, `storage.ts` (AsyncStorage, `sl_`-Keys). Theme-Wechsel via `ThemeContext` (Light/Hard/Expert/Master).
*   **CI/Security:** `ci.yml` (Typecheck + Logik-Tests) **und** `security-audit.yml` (Gitleaks blockierend, npm audit + Semgrep informativ) — beide grün. Auto-Publish via `eas-update.yml`.
*   **E2E:** Detox ist konfiguriert (`.detoxrc.json`, `e2e/firstTest.e2e.js`, `weekly-planner-stack-e2e.mjs`) — **noch nicht auf einem Gerät/Build ausgeführt** (siehe TODO 2).
*   ⚠️ **DEV-Flag offen:** `DAYS_PER_STAGE = 5` (`src/logic/discipline.ts:18`) — vor Launch auf den Produktionswert setzen (siehe 0.4).
*   **Migrations-Restliste — Stand:** Studien/Disclaimer/Efficiency (75/76/82), Zwei-Achsen-Matrix (11), Training-Steuer (25) + Confession Loop (108), Profil-Medaillen (35), Befund-Drosselung (66), Fokus-Matrix (132), Hybrid-Routing (140), Blutwerte-Modul, Analytics-Dashboard **sind als Module + Tests im Code vorhanden**. Offen: E-Commerce/Affiliate (83/91/92, Phase 3), Detox-Lauf auf Gerät, `security-audit.yml`.

---

## 8. AKTUELLES TODO (Nächste Prioritäten — Befehlsform)

1.  ~~**Security-Pipeline in `vaaav-mobile`**~~ ✅ **erledigt** (PR #1, 2026-07-10): Gitleaks (blockierend) + npm audit + Semgrep, alle grün. Nächster Feinschliff: nach ein paar sauberen Läufen `continue-on-error` bei audit/semgrep entfernen (scharf schalten).
2.  **Führe die Detox-E2E-Suite tatsächlich auf einem Build aus** (Konfiguration + Tests liegen bereits: `.detoxrc.json`, `e2e/`): `npm run test:e2e:build:ios` bzw. `:android`, dann `npm run test:e2e`. Szenarien absichern: DayScreen Block-Toggle, WeeklyPlan-Selektion, Money Add/Remove. Build via EAS.
3.  **Ziehe die `vaaav-mobile/README.md`-Statuszeile nach** („UI-Prototyp" → realer Stand: 271 Tests, 27 Screens) beim nächsten Mobile-Commit.
4.  **Baue die nächsten 🔨-Features** (kein Backend nötig): Fokus-Matrix-Ausbau (Goal-Ranking per Drag-and-Drop, Auto-Setup), Trend-Grafik für Blutwerte über die Zeit. ~~Tabu-Börse (#111/#112/#147)~~ ✅ (PR #3) · ~~Wissens-Feed (#171)~~ ✅ (PR #4) · ~~Wallpaper-Bar (#149)~~ ✅ (PR #5).
7b. **Kamera-Roll-Export für die Wallpaper-Bar nachrüsten** (`expo-media-library`), sobald eine Session mit echtem Geräte-/Simulator-Zugriff verfügbar ist – neue native Module dürfen nicht ungetestet bleiben.
5.  **Setze vor Launch die DEV-Flags zurück:** `DAYS_PER_STAGE` (mobile) auf Produktionswert, `PREVIEW_UNLOCK_ALL = false` (PWA).
6.  **`vaaav-backend` anlegen**, sobald der erste echte Backend-Punkt ansteht (E-Commerce/Affiliate 83/91/92, Konten/Sync 103, Squads 36–45). Dann dort ebenfalls `security-audit.yml` als ersten Commit.
7.  **PWA-Pflege (`Silberlocke`):** `js/main.js` weiter in Module zerlegen; `APP_VERSION`/`CACHE_VERSION` bei jedem Deploy hochzählen.

---

## 9. 🛡️ VΛAΛV MASTER SECURITY & ARCHITECTURE (PARANOIA-MODUS)

**System-Anweisung für die KI:** Agiere ab sofort als Lead Security Architect und extrem strenger Apple App Store Reviewer für VΛAΛV. Der Stack besteht aus React Native, Next.js und TypeScript. Sicherheit, absolute Datenhoheit (GPS, BLE-Sensoren, Gesundheitsdaten) und Apple-Compliance haben oberste Priorität. Es gibt keine Ausnahmen, keine Platzhalter und keine „Beta"-Mentalität.

### TEIL 1: DIE 5 EXTREMEN SICHERHEITSGEBOTE (ZERO TOLERANCE)

**01. Secrets & Keys (Absolute Null-Toleranz)**
*   Generiere niemals hartkodierte API-Keys oder Secrets im Quellcode. Prüfe vor jedem Push: `grep -rn 'sk-\|api_key\|password\|secret' .`
*   Frontend (React Native): Nutze ausschließlich `process.env.EXPO_PUBLIC_...`.
*   Backend (Next.js): Nutze ausschließlich sichere Environment Variables (`process.env.DEIN_SECRET`). In Produktion: Vercel Env, Doppler oder AWS Secrets Manager. Lokal: `.env` zwingend in `.gitignore`.
*   Token-Speicher: Speichere sensible Tokens (Auth) im Frontend zwingend über `expo-secure-store` (hardwaregestützte Keychain/Keystore). `AsyncStorage` ist hierfür strikt verboten.

**02. Authentifizierung & Zugriff (Zero Trust)**
*   Sichere jede API-Route (Next.js) durch eine Auth-Middleware (Principle of Least Privilege). Das Backend vertraut dem Frontend zu 0 %.
*   Setze striktes Rate Limiting auf sensible Endpunkte (`/login`, `/register`, `/api/ai`, `/forgot-password`) via `express-rate-limit` oder Cloudflare.
*   Anti-IDOR: Verifiziere bei jedem Abruf sensibler Daten (Befunde, Laborwerte, GPS-Tracks) zwingend serverseitig, ob die Ressourcen-ID exakt der `userId` des anfragenden Nutzers gehört.
*   Biometrie: Verlange für sensible Aktionen (z. B. Ansicht von Laborwerten) einen erneuten Check via `expo-local-authentication` (FaceID/TouchID).

**03. Input-Validierung (Aggressive Filterung)**
*   Zod-Pflicht: Leite jeden Input (GPS-Rohdaten im `.fit`-Format, Shop-Bestellungen, Nutzerprofile) im Backend durch strikte `zod`-Schemas (bzw. `pydantic`).
*   Verwerfung: Weise alles, was nicht exakt dem Schema entspricht, kommentarlos mit `400 Bad Request` ab. Nutze ausschließlich Parameterized Queries (SQL-Injection). Escape dynamische Daten konsequent (XSS); `dangerouslySetInnerHTML` ist strikt untersagt.
*   Gamification-Schutz: Berechne Prestige-Level und physische Medaillen (Holz, Titan, Gold) ausschließlich serverseitig. Akzeptiere niemals Parameter wie `isEligible=true` oder `price=0` aus dem Client. Führe Server-Side Sanity Checks vor jedem Checkout durch.

**04. Konfiguration & Netzwerk-Schilde**
*   CORS: Keine Wildcards (`*`). Lasse ausschließlich die exakte Produktionsdomain zu (`cors({ origin: 'https://deinedomain.de' })`). Reflektiere niemals ungeprüfte Origin-Header.
*   Headers: Nutze im Backend zwingend `helmet` für robuste Security-Header (CSP, HSTS; Schutz vor XSS, Clickjacking, MIME-Sniffing). HTTPS überall, ohne Ausnahme.
*   Apple Compliance: Nutze Stripe ausschließlich für physische Güter. Wickle digitale Freischaltungen über Apple In-App-Purchases (IAP) ab. Strikt isoliert, kein Cross-Selling. „Sign In With Apple" ist bei OAuth absolute Pflicht.

**05. Data at Rest & Abhängigkeiten**
*   Verschlüsselung: Verschlüssele Gesundheitsdaten und Befunde auf Applikationsebene (AES-256-GCM), **bevor** sie in die Datenbank oder den S3-Bucket geschrieben werden.
*   Log-Hygiene: Schreibe niemals PII, Gesundheitsdaten oder Klartext-Passwörter in Logs (`console.log`). Sende in Produktion niemals Stack-Traces an den Client.
*   Passwörter: Hashe zwingend mit `bcrypt` (min. 12 Rounds). MD5 oder Klartext sind inakzeptabel.
*   Audits: Führe nach jeder Installation und regelmäßig `npm audit` aus.

### TEIL 2: PFLICHT-AUDITS (RED-TEAM-PROTOKOLL & PROMPT PACK)

**Anweisung an die KI:** Bevor du in einer Session Code generierst oder anpasst, jage deinen eigenen Code mental durch diese 5 Filter. Nutze die Prompts auch einzeln als dedizierte Audit-Aufträge:

1.  **Close ORM-level injection vectors:** "Review how my ORM or query builder is used and find places where its raw-query, raw-fragment, or dynamic-condition features are fed user input unsafely. Replace unsafe raw fragments with parameterized equivalents."
2.  **Trim over-exposed fields in responses:** "Audit my API responses for excessive data exposure, where endpoints return more fields than the client needs. Strip internal flags, security-relevant fields, and other users' data."
3.  **Prevent server-side request forgery (SSRF):** "Audit any feature where my server fetches a URL based on user input. Validate and restrict the target so it cannot reach internal addresses, loopback, or cloud metadata endpoints."
4.  **Prevent stored XSS in content:** "Audit the paths where user-submitted content is saved and later displayed for stored cross-site scripting. Ensure content is validated and consistently encoded."
5.  **Configure CORS without dangerous wildcards:** "Review my CORS configuration. Replace wildcard origins with an explicit allowlist of trusted origins. Never reflect incoming Origin header back without validating."

⚠️ **Zwingende Code-Ausgabe:** Hänge bei jeder neuen API-Route oder Auth-Logik einen Abschnitt **„🔴 RED TEAM AUDIT"** an: Zeige 2–3 konkrete Angriffswege auf und erkläre, wie der Code sie abwehrt. Garantiere, dass die 5 Audits angewendet wurden.

### Analytische Bedrohungsbewertung (Merkliste)
*   **IDOR:** *Katastrophal.* Eingeloggter Nutzer manipuliert die API-ID (Dokumente/Befunde) → fremde Daten. Gegenmaßnahme: Owner-ID gegen Session-ID prüfen.
*   **Token Hijacking & API-Missbrauch:** *Sehr hoch.* Gestohlenes Strava-/Auth-Token erlaubt private Bewegungsprofile.
*   **Gamification-Manipulation:** *Hoch.* Abgefangene Payloads erschleichen physische Rewards. Gegenmaßnahme: Server-Side Sanity Checks vor jedem Checkout.
*   **KI-gestützte Sicherheitslücken:** *Kritisch.* LLMs deaktivieren bei fehlendem Kontext oft Berechtigungsprüfungen — ohne manuelle Audits schleichen sich „stille" Lücken ein.
*   **Data at Rest:** *Systemkritisch.* Medizinische Befunde (Kreatinin, Leber, Niere) niemals im Klartext in der DB.

### TEIL 3: SECURITY-REFERENZ-CODE

**A. Der IDOR-sichere API-Endpunkt (Next.js)**
```typescript
// pages/api/befunde/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id: documentId } = req.query;

  // ANTI-IDOR CHECK: Hole Dokument UND prüfe Besitzer in EINER Abfrage!
  const document = await prisma.medicalRecord.findFirst({
    where: {
      id: String(documentId),
      userId: session.user.id, // <-- KRITISCHER TEIL
    },
  });

  if (!document) {
    return res.status(404).json({ error: 'Dokument nicht gefunden oder Zugriff verweigert.' });
  }

  return res.status(200).json(document);
}
```

**B. Rate Limiting für kritische Routen (Next.js)**
```typescript
// Middleware oder API-Route
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 5, // Maximal 5 Versuche pro IP
  message: 'Zu viele Anfragen. Bitte versuche es in 15 Minuten erneut.',
});
```

**C. Sicheres Speichern sensibler Tokens (Expo / React Native)**
```typescript
// services/authStore.ts
import * as SecureStore from 'expo-secure-store';

export async function saveStravaToken(token: string) {
  // Hardwaregestützte Keychain (iOS) / Keystore (Android)
  await SecureStore.setItemAsync('strava_access_token', token);
}

export async function getStravaToken() {
  return await SecureStore.getItemAsync('strava_access_token');
}
```

**D. CI/CD GitHub Actions Pipeline — `.github/workflows/security-audit.yml`**
Lege diese Datei in `vaaav-mobile` und `vaaav-backend` ab dem ersten Commit an. Sie blockiert Pushes/PRs bei geleakten Secrets (Gitleaks), bekannten CVEs (npm audit) und XSS-/Injection-Risiken (Semgrep):

```yaml
name: VΛAΛV Absolute Security Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  # 1. Blockiert Pushes mit geleakten API-Keys (Stripe, Strava)
  secret-scanner:
    name: Secret Scanning (Gitleaks)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # 2. Prüft npm-Pakete auf bekannte CVEs
  dependency-audit:
    name: Dependency Security Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install Dependencies
        run: npm ci
      - name: Run npm audit (Fail on High/Critical)
        run: npm audit --audit-level=high

  # 3. Statische Code-Analyse (SAST) – SQL-Injection, XSS, Krypto
  sast-semgrep:
    name: Static Analysis (Semgrep)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      - name: Run Semgrep CI
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/javascript
            p/typescript
            p/react
            p/nextjs
            p/secrets
```

---

## 10. APPLE COMPLIANCE & ZERO-TOLERANCE-PROTOKOLL

> 🍎 **APPLE COMPLIANCE OVERRIDE (für die KI):** Behandle jede Code-Zeile so, als würde sie von einem feindseligen Apple-Reviewer manuell geprüft.

1.  **Die „Eiserne Mauer" für Gamification & Zahlungen:**
    *   Keine 30-%-IAP-Umgehung: Isoliere den Checkout für physische Rewards (Titan-Medaillen, Laser-Gravuren via Stripe) visuell und programmatisch zu 100 % von digitalen Käufen (Apple IAP). Physische Produkte existieren ausschließlich in einem eigenen Shop-Tab.
    *   Kein Cross-Selling / keine externen Kauf-Links: Im digitalen Coin Book darf kein Link existieren, der den Nutzer für Käufe aus der App leitet.
2.  **Der „Zero-Knowledge"-Gesundheits-Tresor:**
    *   Third-Party-Verbot: Auf Seiten mit Befunden (Kreatinin, Leberwerte) oder GPS-/Strava-Daten sind Analyse-Tools (Google Analytics, Firebase, Meta Pixel) strengstens verboten.
    *   Paranoide Permissions (Info.plist): Deklariere Kamerazugriffe hyper-spezifisch: „Wird ausschließlich lokal verwendet, um medizinische Befunde zu scannen und verschlüsselt in deinem VΛAΛV-Profil abzulegen. Daten werden niemals zu Werbezwecken geteilt."
    *   HealthKit-Firewall: Sende kein Byte aus Apple HealthKit an die eigenen Server, sofern es nicht essenziell ist und explizit vom Nutzer bestätigt wurde.
3.  **„Apple-First"-Authentifizierung & Hard-Deletes:**
    *   Login-Hierarchie: Platziere den „Mit Apple anmelden"-Button optisch auf exakt derselben Hierarchiestufe, Größe und Gewichtung wie Drittanbieter-Logins (z. B. Strava OAuth).
    *   1-Klick-Oblivion: Die Account-Löschung darf kein Support-Ticket öffnen. Ein Klick löst eine sofortige Hard-Delete-Kaskade im Next.js-Backend aus (Tokens, Laborwerte, Profil, Coin Book werden physisch gelöscht — nicht nur `isActive: false`).
4.  **Visuelle Integrität (Anti-Beta-Regel):**
    *   Liefere für das anspruchsvolle UI (Neomorphismus, Liquid Glass) garantierte 60 fps. Mangelhafte Performance wertet Apple als Richtlinienverstoß (4.2).
    *   Lasse vor jedem TestFlight-Build ein Skript nach Platzhaltern („Lorem Ipsum", „TODO") scannen. Bei Fund: sofortiger Hard-Fail des Builds.

---

## 11. DIE EIGENE DATA INGESTION ENGINE (Strava-Unabhängigkeit)

Kappe die Nabelschnur zu Drittanbietern: VΛAΛV agiert nicht als Daten-Visualisierer, sondern als primäre Data Ingestion Engine — lückenlose, batteriefreundliche Aufzeichnung und Verarbeitung von High-End-Sensordaten.

### 11.1 Native Sensor- & Tracking-Engine (React Native)
*   **Background Geolocation:** Standard-GPS-Pakete sind unzureichend. Setze eine native Background-Task-Implementierung voraus (saubere `expo-location`-Hintergrund-Integration oder Enterprise-Lösung wie Transistor Software), um 4-h-Ausfahrten akkuschonend zu loggen. Logge Wegpunkte intelligent adaptiv (hohe Frequenz in Kurven, niedrige auf Geraden).
*   **Bluetooth Low Energy (BLE):** Kopple die Engine via `react-native-ble-plx` nativ und stabil mit externer Hardware: Herzfrequenzgurte, Trittfrequenzsensoren, Powermeter (Watt).

### 11.2 Datenbank-Architektur (Time-Series)
*   **Kein Standard-SQL für Live-Daten:** Presse rohe Sensordaten (Sekundentakt, zehntausende Punkte pro Einheit) niemals in reguläre PostgreSQL-Tabellen.
*   **TSDB-Pflicht:** Leite rohe Leistungsdaten zwingend in eine Time-Series-Database (TimescaleDB als PostgreSQL-Aufsatz oder InfluxDB) — latenzfreie, komplexe Aggregationen in Millisekunden (z. B. Durchschnittsleistung auf Streckenabschnitten).

### 11.3 Universelle Datenstandards (.FIT & .TCX)
*   Erfinde kein isoliertes JSON-Format. Parse und generiere die Industrie-Standards `.fit` (Flexible and Interoperable Data Transfer) und `.tcx` nativ.
*   Migration: Ermögliche den nahtlosen Import historischer Archive von Garmin, Wahoo oder Strava als `.fit`-Dateien.

### 11.4 Die Physik- & Geodaten-Engine (KI-Regel)
> ⚠️ **FÜR CLAUDE:** Bereinige Hardware-Fehler bei der Tracking-Logik im Backend (Next.js) algorithmisch.
*   **Glättung (Smoothing):** Rohe GPS-Daten fluktuieren; reine Distanz-Summierung verfälscht (+10 %). Implementiere serverseitig Kalman-Filter oder den Douglas-Peucker-Algorithmus zur GPS-Glättung.
*   **Höhenmeter-Korrektur:** Barometrische Smartphone-Sensoren sind wetteranfällig. Gleiche rohe GPS-Höhendaten zwingend mit einem digitalen Geländemodell (DEM — Digital Elevation Model) ab, um betrugssichere Höhenmeter für das Coin-Book-System zu verifizieren.

### 11.5 Monetarisierung & Abo-Konsolidierung
*   Positioniere VΛAΛV durch Ersetzung von Strava, TrainingPeaks und MyFitnessPal als zentrales, unersetzliches Cockpit. Tiefe Leistungsanalysen und KI-Auswertung der eigenen Daten rechtfertigen das SaaS-Modell (Eternity Mode, #167).
*   **API-Trennung:** Wickle das digitale Premium-Abo Apple-konform über IAP ab; physische Belohnungen laufen autark über Stripe (siehe Abschnitt 10).

---

## 12. DIE VΛAΛV GARAGE (MBUX-Style Equipment Hub)

Inszeniere Wartung als Check-in eines High-Tech-Rennstalls (Mercedes-MBUX-Vibe) — nicht als Pflicht, sondern als professionellen System-Check.

### 12.1 Die visuelle Zustands-Matrix
1.  **Ruhe-Ansicht (Status Quo):** Rendere das Rennrad als cleanen, metallisch-gläsernen 3D-Körper (Liquid Glass / Chrom) im leeren, dunklen Raum mit minimaler, eleganter Dauerrotation.
2.  **Warn-Modus (Kritischer Verschleiß):** Meldet die Daten-Engine (berechnet aus Tracking-/Wetterdaten), dass ein Bauteil (Kette, Bremsbeläge, Reifen) den Schwellenwert überschreitet, morphe das Material **ausschließlich an diesem Bauteil** von Silber-Glas in tiefes, pulsierendes Neon-Rot.
3.  **Interaktions-Modus (Fokus):** Tippt der Nutzer auf das glühende Teil, fahre die Kamera fließend heran. Öffne ein neomorphes Glas-Panel mit präziser technischer Typografie („Verschleiß bei 95 %. Kritischer Bereich.") inklusive Call-to-Action.

### 12.2 Technische Implementierungs-Strategie
*   **Primär-Route — Spline 3D (spline.design):** Modelliere das Rennrad in Spline mit VΛAΛV-Materialien (Liquid Glass, Titan), definiere Zustands-Variablen und exportiere den React-Native-Komponenten-Code. Übergib die Verschleiß-Daten der Next.js-API als Props — die Kette wechselt vollautomatisch per Signal von „Glas-Silber" auf „Glühend-Rot".
*   **Fallback-Route — SVG Blueprint Architecture:** Bricht die 3D-Performance auf älteren Geräten ein, greife auf eine extrem hochwertige seitliche Vektorgrafik zurück. Jedes Verschleißteil ist eine isolierte Ebene (`<path>`/`<g>`). Färbe kritische Pfade via `react-native-reanimated` rot und versetze sie in eine pulsierende Opacity-Schleife (0.4 → 1.0). Absoluter „Tech-Blueprint"-Look bei ~0 % Rechenlast.

### 12.3 E-Commerce- & Apple-Compliance-Kopplung
*   Führe jeden Call-to-Action im Warn-Panel („Kette bestellen") zwingend über den System-Browser (`Linking.openURL`) nach außen — kein In-App-Kauf für Drittanbieter-Ersatzteile (Apple-IAP-Regel, Abschnitt 10).
*   Parametrisiere Affiliate-Links niemals generisch, sondern auf das spezifische Bike-Profil des Nutzers (11-fach vs. 12-fach Kette aus dem Gear-Setup, #144).

### 12.4 Post-Ride & Ketten-Pflege
*   **Live-Verschleiß-Sync:** Berechne nach jedem hochgeladenen `.fit`-File den Verschleiß der Hardware (Reifen, Bremsen) in Echtzeit neu und visualisiere ihn im 3D-Modell.
*   **Ketten-Management:** Tracke die Kette spezifisch („vor 150 km gewachst/geölt"). Erzwinge Pflege-Erinnerungen basierend auf Laufleistung und Wetter (Regenfahrten potenzieren den Verschleiß-Faktor).

> ⚠️ **FÜR CLAUDE (UI/UX-DIREKTIVE):** Baue das State-Management der `GarageScreen`-Komponente so, dass `wearData` nahtlos als Props an die visuelle Komponente (Spline oder SVG) durchgereicht wird. Kamerafahrten und Farb-Morphings dürfen niemals den UI-Thread blockieren. Nutze für SVGs ausschließlich `react-native-reanimated`. Starte den UI-Aufbau standardmäßig mit einer direkten Fokus-Fahrt von der Totalen ins Detail — nutze die Ladezeit als stilistisches Intro.

---

## 13. HARDWARE- & WORKSTATION-SECURITY (Zero-Compromise Setup)

Die Sicherheit des Ökosystems beginnt am Entwicklungs-Gerät. Ein kompromittiertes lokales Gerät hebelt die härteste Cloud-Sicherheit aus.

1.  **Physische & lokale Sicherheit:** Aktiviere Festplattenverschlüsselung (FileVault/BitLocker) ausnahmslos — bei Diebstahl müssen Repos und lokale Daten unentschlüsselbarer Datenmüll sein. Sperre das System automatisch nach max. 1–2 Minuten Inaktivität (biometrische Entsperrung). Clean Desk: keine Aufkleber/Post-its mit IPs, Passwörtern oder Projektdetails.
2.  **Code- & GitHub-Sicherheit:** Keine Secrets im Quellcode (`.env` in `.gitignore`). Sichere jedes Konto (GitHub, Vercel, Supabase, Apple Developer, E-Mail) mit 2FA — SMS-2FA ist untersagt; nutze Authenticator-Apps oder Hardware-Keys. Kommuniziere mit GitHub/Servern ausschließlich über SSH-Keys mit starker Passphrase.
3.  **Netzwerk:** Arbeite niemals im öffentlichen WLAN ohne vertrauenswürdiges VPN — im Zweifel 5G-Hotspot des Smartphones. Halte die OS-Firewall permanent aktiv (Stealth-Modus). Patche OS, Browser und Toolchain (Node.js, Expo, Docker, IDE) rigoros und ohne Verzögerung.
4.  **Backup (eiserne 3-2-1-Regel):** Halte jederzeit 3 Kopien der kritischen Daten auf 2 Medientypen, davon 1 offsite/Cloud (verschlüsselt; GitHub für Code). **Dieses `MASTER_HANDOFF.md` ist die Single Source of Truth für Projekt-Kontinuität** — aktualisiere und pushe es am Ende jeder Session. Fällt ein Gerät aus, setzt der Import dieses einen Dokuments die Entwicklung lückenlos fort.

---

## 14. DYNAMISCHE LEBENSREALITÄTEN & DUAL-RECOVERY

Bilde die physische und zeitliche Realität des Nutzers exakt ab — Trainingspläne existieren nicht im Vakuum. Moduliere den Druck (ZNS-Load, Kalorien, Zeiten) nach religiösem Fasten, beruflicher Belastung und exaktem Erschöpfungszustand.

### 14.1 Chronobiologische Overrides
*   **Der Ramadan-Modus:** Biete eine dedizierte Abfrage (Onboarding/Settings). Kalibriere alle Zeitfenster neu. **Prep-Mechanik:** Berechne und erzwinge am Vorabend den exakten Stack für Suhoor (Slow-Absorbing Protein/Casein + Elektrolyt-Ladephasen). **Training-Shift:** Verlege intensive ZNS-Einheiten zwingend in die Stunden nach dem Iftar oder plane extrem adaptiertes Erhaltungs-Training kurz vor Sonnenuntergang.
*   **Occupational Load:** Arbeit ist systemischer Stress. Lasse Arbeitszeiten/Schichten manuell eintragen. Werte physische Arbeit und extremen mentalen Stress (Deep Work) als ZNS-Belastung und drossle das Trainingsvolumen des Tages algorithmisch (Overtraining-Prävention).

### 14.2 Das Dual-Recovery-Protokoll
Regeneration ist nicht binär — unterscheide zwingend zwei Szenarien:
1.  **Pathological Recovery (Krank-Modus):** Immunsystem kompromittiert. Sperre Training strikt (App-Lock). Fokussiere zu 100 % auf lückenlosen Schlaf, Rehydrierung und den „Healing Stack" (Vitamin C, Zink, Glutamin). Verlange für den Wiedereinstieg einen algorithmischen Ramp-Up-Plan (#70) und die ärztliche Bestätigungsschranke (#153).
2.  **Apex Recovery (Post-Intensiv):** Körper gesund, aber massiv im Defizit (100-km-Ride, Max-Out-Legday). Schalte die Core Bar tiefrot. Löse den Zustand **nur** durch aktive Deckung des thermodynamischen Defizits (Kalorien/Makros) und protokollierten Schlaf auf (#139).

### 14.3 Kosmetische Prestige-Unlocks
*   Halte die App im Standard extrem clean. Schalte exklusive UI-Themes, Liquid-Glass-Tönungen und Backgrounds ausschließlich über lückenlose Disziplin-Streaks frei (z. B. Wallpaper-Bar #149). Personalisierung ist nicht käuflich — sie ist ein rein leistungsbasiertes Statussymbol.

---

## 15. ERWEITERTE DISZIPLIN- & PSYCHOLOGIE-MECHANIKEN

Die App fungiert als unbestechlicher Spiegel — psychologische Tiefe, schonungslose Konfrontation, Belohnung für absolute Konsistenz.

*   **Die 10-Jahres-Prognose (#133, Reality Check):** Extrapoliere die getrackten Gewohnheiten (Kalorien, Training, Schlaf, Ausgaben) und visualisiere grafisch und textlich, wo der Nutzer physisch und finanziell in exakt 10 Jahren steht. Radikaler Weckruf, ungeschönt.
*   **Degradierungs-Automatik (#26):** Fehlende Konsistenz führt nicht nur zum Stagnieren, sondern zum aktiven Statusverlust. Fällt der Disziplin-Score über einen definierten Zeitraum unter das Stage-Minimum, degradiere algorithmisch auf das vorherige Level — inklusive Verlust der UI-Privilegien.
*   **Tagebuch-Struktur-Belohnung (#148):** Honoriere tiefe Reflexion. Gewähre für strukturierte, qualitative Tagebucheinträge (nicht nur Checkboxen) einen definierten Punkteschub — mentale Klarheit wiegt wie physisches Training.
*   **Die VΛAΛV Wallpaper-Bar (#149):** Fülle einen visuellen Fortschrittsbalken Montag–Freitag durch lückenlose Disziplin. Bei 100 % am Freitag: Schalte am Wochenende ein exklusives, hochauflösendes Wallpaper (Neomorphismus/Liquid Glass) frei — Statussymbol für den Nutzer, organisches Marketing für VΛAΛV.

---

## 16. DAS EXKLUSIVE ENDGAME (Physische E-Commerce-Architektur)

Der Shop für physische Artefakte ist ein geschlossenes System — sichtbar ausschließlich für qualifizierte Absolventen. Trenne ihn programmatisch und visuell zu 100 % vom digitalen Punkte-Shop (Pre-Booking, Cheat-Days), um Apples IAP-Richtlinien und die Markenintegrität zu wahren.

*   **Trophäen-Basis (#117):** Biete physische Trophäen zum reinen Selbstkostenpreis an. Monetarisiere ausschließlich über exklusive Laser-Gravur-Upgrades.
*   **Material-Ehre (#118):** Liefere jede Trophäe mit hartem Beipackzettel: „Schmiedeguss, kratzeranfällig, ein ehrlicher Alltagsbegleiter." Inszeniere Abnutzung als Feature, nicht als Bug.
*   **Die „Stille Münze" (#124):** Bewirb die physische VΛAΛV-Münze nirgendwo in der App. Lege sie qualifizierten Nutzern bei regulären Bestellungen als unerwartetes Easter-Egg bei — extreme Markenbindung.
*   **Apex-Filter (#125/#126):** Filtere eingehende Sensordaten automatisch auf extreme Meilensteine (200-km-Ausfahrten, massive Höhenmeter). Nur algorithmisch validierte Apex-Leistungen berechtigen zur Laser-Gravur der spezifischen GPS-Route in massives Acryl.
*   **Individual Book (#163/#166):** Biete eigene Notizen, Daten und Erfolge als hochwertiges gedrucktes Buch an; Titan-Coins mit Laser-Gravur („Veteranen-Narbe") für den absolvierten WinterArc.
*   **Eternity Mode als Abo (#167):** 19,99 €/Monat für vollen Zugriff — Apple-konform via IAP. **Shop-Incentive (#168):** Schalte bei Bestellung physischer Ware den Eternity Mode bis zur Lieferung frei. **Disziplin-Fallback (#169):** Stufe bei Scoring-Abfall automatisch auf Light Mode zurück.

### 16b. Coin Book — Das Blumen-Achievement-System (Asset-Pack)

Das digitale Coin Book sammelt **freischaltbare Blumen-Assets** als Erfolgs-Trophäen (verknüpft mit #35 Medaillen und den physischen Coins #163). 51 Blumen in vier Tiers, jede an ein Level der Design-Matrix gekoppelt — der Look steigt mit dem Rang.

*   **Katalog (verifiziert, `vaaav-mobile` PR #6):** `src/logic/coinBook.ts` — 51 Blumen (`COIN_FLOWERS`), vier Tiers (`COIN_TIERS`), Prompt-Generator `flowerPrompt()`.
*   **Die vier Tiers:**
    *   **Tier I – Basis** → Design-Level `phaseZero`: Liquid Glass, halbtransparentes Frostglas, kühles Blau (15 Blumen).
    *   **Tier II – Konstanz** → `workbench`: glühendes Laser-Leder, „Veteranen-Narbe" in Feuer-Orange/Rot (14).
    *   **Tier III – High Performance** → `master`: mechanisches Titan mit Gold-Akzenten, Iris-Mechanik (16).
    *   **Tier IV – Prestige & Legacy** → `legacy` (jenseits der 4 UI-Level): massives Gold + Obsidian, majestätisch; „Bibble" ist das Saphir-Easter-Egg (6).
*   **Generierungs-Workflow (First-Principles, wartbar):** Der Betreiber-Prompt-Pack bestand aus 51 fast identischen Midjourney-Prompts. **Verbindlich ab jetzt:** Pflege **eine Vorlage pro Tier** (im Code) statt Einzel-Prompts — `flowerPrompt(flower)` erzeugt den stil-konsistenten Prompt. Das garantiert einen kohärenten Asset-Pack ohne Style-Drift. Aster/Rose reproduzieren den Original-Wortlaut wortgetreu (Test-abgesichert).
*   **Blume → Erfolg-Mapping ✅ (`vaaav-mobile` PR #7):** eine Blume je **7 disziplinierte Tage** (Lifetime-Zähler `disciplinedDays`, nie dekrementierbar), in Katalog-Reihenfolge Tier I → IV (`unlockedFlowerCount`/`coinBookProgress`). 51 × 7 = 357 Tage — Tier IV (Gold) wird bewusst erst nach ~11 Monaten echter Disziplin komplett. Radikale Gleichheit, nicht käuflich.
*   **Coin-Book-Screen ✅ (`vaaav-mobile` PR #7):** Fortschrittsbalken, nächste Blume + Resttage, vier Tier-Sektionen im Grid. Prozedurale `LinearGradient`-Platzhalter live aus der Tier-Palette (`theme.ts`) — dieselbe Strategie wie die Wallpaper-Bar (#149), keine externen Bild-Assets nötig. 12 Coin-Book-Tests gesamt, alle grün.
*   **Offen (bewusst nicht geraten):**
    1.  **Bild-Pipeline:** Keine 8k-Renders ins Repo. Generieren → auf ~512 px komprimieren → lazy-load; erst 4 Hero-Blumen (1/Tier) validieren, bevor alle 51 produziert werden. `imageAsset` bleibt leer, bis reale Renders vorliegen.
    2.  **Backend-Härtung:** Sobald Phase 3 (Backend) ansteht, gehört `disciplinedDays` serverseitig verifiziert wie jede andere Prestige-Berechnung (Zero-Trust-Frontend-Regel) — aktuell rein clientseitig (Phase-1-Architektur).
    3.  Verknüpfung mit Medaillen (#35) / physischen Coins (#163) als zusätzliche Trigger-Quelle — aktuell ausschließlich zeit-/disziplinbasiert.

---

## 17. COLUMBUS MODE & THE WINTERARC (Real-World-Integration)

Greife aktiv in die reale Freizeitgestaltung ein. Zielgruppe: Menschen, die in täglichen Loops feststecken und einen Anstoß für neue Erfahrungen brauchen.

1.  **Event- & Entdeckungs-Engine:** Schlage basierend auf Standort und Jahreszeit (Outdoor im Sommer, Indoor im Winter) lokale Events und neue Hobbys vor (Klettern, Tanzen, Kajak, Fotografie, Kochkurse). Mache Aktivitäten direkt aus dem Columbus Mode buchbar (API-Integration lokaler Anbieter).
2.  **Anti-Spam-Newsletter:** Maxime: Qualität vor Quantität. Sende Push/E-Mails extrem selten und hyper-relevant. Trigger-Beispiel: „Der Frankfurt Ironman findet nächstes Jahr statt. Vielleicht ist jetzt der richtige Zeitpunkt, etwas Neues auszuprobieren und dir ein persönliches Ziel zu setzen." Kommuniziere neutral, herausfordernd, als Katalysator.
3.  **Ethisches Geschäftsmodell (Eiserner Kodex):** Monetarisiere über Buchungs-/Affiliate-Provisionen, aber: **Neutrale Listung ohne Ausnahme.** Keine Bevorzugung oder höheres Ranking wegen höherer Provision. Das Vertrauen in die Unbestechlichkeit der Empfehlungen steht architektonisch und geschäftlich über kurzfristigem Profit.

---

## 18. PHYSISCHE PRODUKT- & VERPACKUNGS-ARCHITEKTUR (Premium Unboxing)

Übertrage den digitalen High-End-Anspruch (Liquid Glass, Neomorphismus) nahtlos in die reale Welt. Schwarz-Gold und holografische Effekte sind die haptische Entsprechung der In-App-Erfahrung.

### 18.1 Zertifikat-Veredelung: Der „Gold-Black-Diamond"-Workflow
Nutze das **Toner-Foil-Transfer-Verfahren** (Heißfolienprägung-Imitat), um tiefschwarzes 300-g/m²-Papier mit metallisch glänzendem Gold und holografischen „Diamant"-Effekten zu veredeln. **Kein Tintenstrahldrucker** — er unterstützt den Toner-Schmelzprozess nicht.

**Das VΛAΛV-Hardware-Setup:**

| Komponente | Spezifikation | Preisrahmen (ca.) |
| :--- | :--- | :--- |
| **Drucker** | Schwarz-Weiß-Laserdrucker (z. B. Brother HL-Serie) | ~100 € |
| **Folie (Gold)** | „Minc Foil" oder „Toner Reactive Foil" (Gold) | ~15 € |
| **Folie (Diamant)** | „Holographic Toner Reactive Foil" (Silver Holo / Cracked Ice) | ~15 € |
| **Laminiergerät** | Einfaches Gerät mit einstellbarer Hitze | ~25 € |
| **Papier** | Schwarzer Premium-Karton (300 g/m² oder stärker) | ~15 € |

**Design- & Produktionsrichtlinien:**
*   **Linienführung:** Ziehe hauchdünne, diagonale Linien, die aus dem Logo nach außen strahlen — sie simulieren den Lichtbruch für maximales „Diamant-Funkeln".
*   **Typografie:** Nutze geometrische, kantige Schriftarten. Die spitzen Winkel in „V" und „Λ" unterstreichen den optischen Lichtbruch eines Diamanten.
*   **Negativ-Fläche:** Lasse ausreichend Raum um das Logo. Das Gold fungiert als „Fassung", das holografische VΛAΛV-Logo bildet als „Diamant" das glitzernde Zentrum.
*   **Workflow:**
    1. Drucke die Veredelungs-Daten (Name, Datum, Metriken, Logo) mit dem Laserdrucker in Schwarz auf den Karton.
    2. Lege die Folien präzise auf (Hologramm auf das Logo, Gold auf Text/Daten).
    3. Fixiere kurzzeitig mit ablösbarem Klebeband gegen Verrutschen.
    4. Führe den Bogen durch das erhitzte Laminiergerät (der Toner schmilzt und bindet die Folie).
    5. Ziehe die Folie nach dem Abkühlen vorsichtig ab.

### 18.2 Premium-Unboxing (Einkaufsliste B2B / Großhandel)

| Komponente | Spezifikation / Suchbegriff | Zweck |
| :--- | :--- | :--- |
| **Seidenpapier** | „Seidenpapier schwarz premium" | Oberflächenschutz & edle Optik |
| **Luftpolsterfolie** | Anti-statisch | Verhindert, dass Acryl Staub anzieht oder zerkratzt |
| **Füllmaterial** | „SizzlePak schwarz Papierfüllmaterial" | Einbettung des Pokals im Karton |
| **Samtbeutel** | „Samtbeutel schwarz 15x20" | Exklusive, haptische Hülle für den Acryl-Pokal |
| **Satinband** | „Satinband gold 10mm" | Optische Akzentuierung der „Founder-Edition" |
| **Versandkarton** | „Versandkarton doppelwandig stabil" | Knickschutz und Transportsicherheit |
| **Eckenschutz** | Kunststoff oder Schaumstoff | Schutz der Rahmenkanten (z. B. A5-Formate) |
| **Siegelaufkleber** | „Logo Aufkleber rund gold / schwarz" | Verschluss des Seidenpapiers (VΛAΛV-Branding-Stempel) |

**Der VΛAΛV-Packprozess (Layering-Strategie, Dual-Set):**
*   **Layer 1 (Basis):** Schwarzes Seidenpapier als Bett im Versandkarton.
*   **Layer 2 (Kern):** Der Acryl-Pokal im schwarzen Samtbeutel, eingebettet in schwarzes SizzlePak.
*   **Layer 3 (Add-ons):** Der A5-Rahmen (gepolstert, mit Eckenschutz) und der Visitenkarten-Aufsteller.
*   **Layer 4 (Abschluss):** Die „Founder-Edition"-Dankeskarte und das Gold-Black-Diamond-Zertifikat obenauf als erster visueller Kontaktpunkt.
*   **Versiegelung:** Verschließe das Seidenpapier mit dem VΛAΛV-Logo-Siegel.

---

## 19. MEDICAL TERMINAL: DER 15-ZONEN KÖRPER-ATLAS (UI/UX-Blueprint)

Exakter Bauplan für die `BodyAtlasScreen`-Komponente. Nutze den folgenden Prompt unverändert:

**PROMPT START**

**Rolle:** Du bist ein Elite-Fullstack-Frontend-Entwickler und UI/UX-Designer. Du baust einen interaktiven High-Fidelity-Prototyp für eine Gesundheits- und Performance-App namens „VΛAΛV". **Framework:** React (Next.js) bzw. React Native (Expo), Tailwind CSS, Framer Motion (Reanimated in der App) für flüssige Zoom-Animationen und einfache Inline-SVGs für die medizinischen Wireframe-Grafiken.

**1. Globale Layout-Architektur & State-Management (Split-Screen):**
1.  **Linke Seite (Selektions-Grid):** 3-Spalten-Raster mit 15 biometrischen Zonen-Karten. Im Hintergrund: subtile Ganzkörper-Silhouette (`opacity-10`).
2.  **Rechte Seite (Zoom- & Daten-Panel):** „Liquid Glass"-Container (`backdrop-blur-xl`, `bg-white/[0.03]`, `border border-white/[0.08]`, `shadow-[0_22px_50px_rgba(0,0,0,0.7)]`). Klick links triggert eine Zoom-Animation (`layoutId="body-zoom"`, 400 ms Ease-in-out). Der virtuelle Körper zentriert die Zone, die Region leuchtet intensiv Rot, der Rest bleibt abgedunkeltes graues Wireframe.
3.  **Disclaimer-Pflicht:** Permanente rote Box (`border-red-500/30 bg-red-500/5`): „Symptome hier sind Hypothesen, keine Diagnosen! Eigentherapie ohne Blutbild birgt Überdosierungsrisiko!"

**State-Management:** `useState(activeZone)` — Standard: `'kopf'`.

**2. Spezifikation der 15 interaktiven Zonen-States (Daten-Mapping):**

1.  **Kopf & Gehirn** — Visuals: Schädel-Profil, Gehirnwindungen, Arteria carotis. Rot: Großhirn & Halsschlagader, Fadenkreuz auf Schläfe. Daten: Neurotransmitter-Status (Dopamin-/Serotonin-Balken). Hypothesen: Magnesium-/Eisenmangel (Spannungskopfschmerz).
2.  **Schulter & Nacken** — Visuals: Rückansicht oberer Torso, HWS (C1–C7), Trapezius. Rot: Schultergelenkkapseln beidseitig & Nackenstrang. Daten: Spannungsindex (Muskeltonus in Mikrovolt). Hypothesen: Magnesiummangel (neuromuskulär), Hydrationsmangel.
3.  **Herz & Kreislauf** — Visuals: Brustkorb zentral, Herz im Querschnitt (Aorta, Kammern). Rot: linke Herzkammer & Aortenbogen (pulsierend). Daten: HRV, Ruhepuls, simulierter Blutdruck. Hypothesen: Kalium-/Coenzym-Q10-Defizit.
4.  **Darm & Verdauung** — Visuals: unterer Torso, Dünn-/Dickdarmwindungen. Rot: Colon transversum (flächig, Entzündungssimulation). Daten: Mikrobiom-Dichte (Bifido-/Laktobakterien-Kreisdiagramm). Hypothesen: Glutamin-, Ballaststoff-, Zink-Mangel (Leaky-Gut).
5.  **Leber & Gallenblase** — Visuals: rechter Oberbauch unter Rippenbogen, Leber und Gallenblase. Rot: rechter Leberlappen & Gallengang. Daten: ALT/AST-Werte (Indikator „Erhöht"). Hypothesen: Cholin-Mangel, Bitterstoff-Defizit, Alpha-Liponsäure.
6.  **Nieren & Harnwege** — Visuals: Rückansicht mittlerer Torso, Nieren & Harnleiter. Rot: Nierenbecken. Daten: eGFR-Wert, Kreatinin-Spiegel. Hypothesen: chronische Dehydration, Elektrolytverschiebung.
7.  **Schilddrüse** — Visuals: Hals-Nahaufnahme, Schmetterlingsform. Rot: komplette Schilddrüse. Daten: Hormon-Achse (TSH, fT3, fT4 als Punkte auf Referenzlinie). Hypothesen: Jod-/Selen-Defizit.
8.  **Knie & Gelenke** — Visuals: Knie lateral (Femur, Tibia, Patella, Menisken). Rot: Gelenkspalt & Patellasehne. Daten: CRP-Tendenz (Pfeil ↗). Hypothesen: Kollagen-/Omega-3-Mangel.
9.  **Muskeln & Kraft** — Visuals: Ganzkörper-Muskel-Anatomie (Bizeps, Quadrizeps, Latissimus). Rot: diffuse rote Flecken (Myalgie-Simulation). Daten: Kreatinkinase-Level (CK erhöht). Hypothesen: Aminosäuren-Mangel (BCAAs), schwerer Magnesiummangel.
10. **Hände, Nägel & Haut** — Visuals: Hand-Detail, Nagelbetten, Epidermis. Rot: Fingerspitzen & Nagelbetten. Daten: Keratin-Synthese-Index (vermindert). Hypothesen: Biotin- (B7), Zink-, Siliziummangel.
11. **Waden & Unterschenkel** — Visuals: Rückansicht Unterschenkel (Musculus gastrocnemius, Achilles). Rot: innerer Wadenmuskelbauch (Krampf-Zone). Daten: (Mikro-)Zirkulations-Index. Hypothesen: Natriumverlust, Magnesium-/Calcium-Mangel.
12. **Haut & Schleimhäute** — Visuals: Querschnitt Hautbarriere/Schleimhautwände. Rot: Barriere-Grenzlinien (feuerrot). Daten: Barriere-Integrität (−35 %). Hypothesen: Vitamin-A-Mangel, Vitamin-B2-/Eisenmangel (Rhagaden).
13. **Immunsystem** — Visuals: lymphatisches System (Milz, Knochenmark, Knoten an Hals/Achseln). Rot: Hals-Lymphknotenstationen & Milz. Daten: Leukozyten-Tendenz, Vitamin-D3-Spiegel (kritisch). Hypothesen: Vitamin-D-/Zink-Mangel.
14. **Nervensystem** — Visuals: ZNS & PNS (Gehirn, Rückenmark, periphere Bahnen). Rot: Rückenmark & periphere Nervenstränge (wie elektrische Blitze). Daten: Sympathikus-Aktivität (chronischer Fight-or-Flight). Hypothesen: Vitamin-B12- (Demyelinisierung), B6- oder Folsäure-Mangel.
15. **Schlaf & Regeneration** — Visuals: Zirbeldrüse (Pineal Gland) + abstrakte zirkadiane Sinuskurve. Rot: Zirbeldrüse & Tiefschlaf-Segment der Kurve. Daten: Schlafarchitektur (REM verkürzt, Melatonin-Rate gedrückt). Hypothesen: Tryptophan-/Magnesiummangel (ZNS-Hyperaktivität).

**Aufgabe:** Generiere jetzt den vollständigen, sauberen React-Code für diese App-Komponente. Baue das interaktive State-Management so auf, dass beim Klicken einer Zone auf der linken Seite die Grafik und die Daten im rechten Panel augenblicklich und fehlerfrei auf die oben definierten Werte umschalten.

**PROMPT ENDE**
