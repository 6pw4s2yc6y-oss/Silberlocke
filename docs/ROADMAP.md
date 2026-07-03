# VΛAΛV – Master-Roadmap (fusioniert, 128+ Punkte)

> Fusion aus der **Sprint-Logik & den 128 VΛAΛV-Punkten** und der **ungeschönten
> technischen Realität** des Codes (Vanilla JS/HTML/CSS, PWA auf GitHub Pages).
> Kein Wunschzettel – ein Arbeitsdokument mit **echtem Status, Stand v43**.
>
> Nordstern: ein unbestechliches Lebens-Betriebssystem. Erst Fitness/Disziplin,
> dann erweitern. Vier verdiente Stufen (Light → Hard → Expert → Master),
> radikale Gleichheit, Wahrheit vor Komfort. Daten getrennt von Logik
> (`data/` vs `js/`), jede Woche liefern, jede Version zählt hoch.

## ⚠️ Realitäts-Abgleich (Stand v43 – bitte lesen)
Damit die Roadmap ehrlich bleibt, hier die Punkte, an denen Anspruch ≠ Code ist:

1. **Marke:** ✅ **erledigt (v44).** Rebrand SILBERLOCKE → **VΛAΛV** und Währung
   „SilberStaub" → **„Punkte"** in allen sichtbaren Strings + PWA-Manifest umgesetzt.
   Interne `sl_`-Speicher-Keys und Variablennamen bewusst unangetastet → **keine
   Nutzerdaten verloren** (Punktestand bleibt erhalten). Nur die GitHub-Pages-URL
   trägt noch den Repo-Namen „Silberlocke" (Pfad, kein Anzeigetext).
2. **Betreiber-Vorschau aktiv:** `PREVIEW_UNLOCK_ALL = true` (js/main.js, Z. 300)
   hebelt aktuell die Verdien-Logik aus – **alles ist offen**, App startet in Master.
   Bewusst für die Test-/Kontrollphase. **Vor Launch auf `false`** (eine Zeile), sonst
   sind (4) radikale Gleichheit & (19) Progressive Disclosure faktisch umgangen.
3. **Identitäts-Onboarding (5)** ist seit **v42 live** – in der eingereichten Liste
   noch als 🔨 geführt. Hier auf ✅ korrigiert (Fixed-Choice-Buttons, kein Freitext →
   aktuell **keine** Input-Sanitization nötig; erst bei Freitext-Eingabe relevant).
4. Neue Punkte **111–128** und **WinterArc (129–132)** existieren im Code noch nicht –
   realistischer Status unten (meist 🔨 Frontend oder 🔵 Backend).

**Legende:** ✅ live (im Code) · 🟡 teil-live (Struktur steht, Feinschliff/Inhalte fehlen) ·
🔨 jetzt baubar (Frontend-Only, ohne Backend) · 🔵 Phase 3 (Backend/DB/Recht/Externe) ·
⚠️ nur mit Schutz-Auflagen · 🅿️ bewusst geparkt · ❓ mit Betreiber klären

---

## Sprint 1 · Fundament, Architektur & Identität
1 ✅ **VΛAΛV als Markenname** (ersetzt SILBERLOCKE, v44 – inkl. Währung „Punkte" statt SilberStaub) ·
2 ✅ 18-Punkte-Manifest in der Übersicht (v41) · 3 ✅ Ablenkungsfreie Werkbank ·
4 ✅⚠️ Radikale Gleichheit (jeder startet Light) – *aktuell durch Vorschau-Schalter offen* ·
6 ✅ Stealth-Entwicklung · 8 ✅ Tracking-Kern 100 % kostenlos ·
97 ✅ Modulare Architektur (`js/`-Logik getrennt von `data/`) · 98 ✅ PWA auf GitHub Pages (offline, atomare Versions-Pakete) ·
105 🟡 Recht (Impressum-Platzhalter live; Betreiberdaten, AGB, DPMA-Marke offen) ·
7 🔵 Launch via YouTube + VΛAΛV-Domain · 96 🅿️ Next.js/React-Umbau (geparkt bis Backend zwingt) ·
103 🔵 Backend-Kapselung der Straf-Logik (Supabase/RLS) · 104 🅿️ Obfuscation/Cloudflare-Blocker

## Sprint 2 · Onboarding & Phase Zero (Der Türsteher)
11 ✅ Zwei-Achsen-Matrix (Erfahrungs- × Budget-Modus) · 18 🟡 3-Schritt-Setup baut das Dashboard (Treibstoff-Puffer offen) ·
5 ✅ Identitäts-Onboarding „Wer willst du werden?" (v42, letzter Schritt + Tages-Banner) ·
114 ✅ „Dicke-Plan" (Phase Zero, v45): 1. Monat straffrei, sanfter Gewohnheits-Fokus (BMI ≥ 30) ·
115 ✅ „Ektomorph-Plan" (v45): Aufbau-Start bei BMI < 18,5 (regelmäßig & genug essen) ·
116 ✅ „Schatten-Tracking" (v45): erste 28 disziplinierte Tage ohne kcal-Zahlen (Baseline statt Fixierung) ·
45 🔵 Vergleichs-Matching (identische Veteranen-Profile)

## Sprint 3 · Chronobiologie, UI & tägliche Werkbank
19 ✅⚠️ Progressive Disclosure (7/14/21/28-Tage-Fahrplan) – *aktuell durch Vorschau offen* ·
34 ✅ Body-IQ-Quiz (v40, 15 Fragen, nicht farmbar) · 99 ✅ Dark-Mode (Lila/Grün/Rot) ·
101 ✅ Tipp des Tages (v38, tagesrotierend) · 57 🟡 Dynamische Einnahmefenster (ab individueller Aufwachzeit) ·
58 🟡 Standard-Mahlzeiten (Slots live, Rezept-Routinen offen) · 63 🟡 Sleep Mode (Analyse live, Blaulicht-Anleitung offen) ·
62 🟡 Halal-/Vegan-Check bei JEDEM Produkt (Status grün/gelb/rot/grau; v60) · Gebetszeiten offen · 64 ✅ Wasser-/Elektrolyt-Schnellzugriff (Glas-Zähler, Ziel +2 an Trainingstagen, Elektrolyt-Hinweis; v47) ·
100 🔨 Themes/Vibes · 113 ✅ „Brennende Batterie" (Tages-Batterie in der Tagesansicht + Glut-Balken, flammt beim Abhaken auf; v48) ·
61 🅿️ „Aleman Trink-Timer" (native Alarme – PWA-Limits) · 127 🔵 Financial-Hub (Open-Banking) ·
128 🔵 Medical-Terminal (verschlüsseltes Befund-Archiv)

## Sprint 4 · Trainings-Matrix & Leistungssteuerung
47 ✅ Wochenplan-Baukasten · 54 ✅ Pre-Workout-Schranke (ZNS/Schlaf) ·
46 🟡 Clash Detection (Schlaf-Sperre + Barriere live) · 52 🟡 Hypertrophie (Pläne live, Volumen-Tracking offen) ·
53 🟡 Überlastungs-Bremse (Schlaf + Barriere) · 48 ✅ Einheiten-Vorbereitung (nächste Einheit: Zeitpunkt + Plan-Fokus/Übungen + Vorbereitungs-Checkliste; v52) ·
49 ✅ Pulver-/Wasser-Berechnung pro Einheit (Mix aus Stack-Pulvern + Wasser-Empfehlung im Einheiten-Panel; v54) · 50 🔨 Rennrad-Pläne (als Daten) ·
122 ✅ Clash-Detection: Widerspruch Wochenplan ⇄ Tagestyp mit Ein-Tipp-Korrektur (v55) · 55 🅿️ Satzpausen-App-Sperre (Social-Media-Block) ·
51 🔵 Watt-Tracking (Hardware) · 56 🔵 Wetter/Geo (Hydration) · 60 🔵 Apple Health / Health Connect

## Sprint 5 · Supplement-Datenbank & Science
72 ✅ Datenbank nach Fakten statt Marketing · 75 ✅ Studie strikt getrennt von Meinung (NRV isoliert) ·
76 ✅ Harte Disclaimer statt Wirkversprechen · 81 ✅ Makro-Block-Bündelung (Zeitblöcke) ·
82 ✅ Efficiency-Filter (Überdosis-Warnung ab 500/1000 % NRV, v37) ·
83 ✅ Smart-Replacement (Ersatzvorschlag bei ausverkauften Produkten) ·
77 🟡 No-Bullshit-Geschmackstester (Schema live, Werte fehlen) · 78 🟡 Codes Studie vs. User-Erfahrung ·
79 🟡 Rezeptur-Warnflagge (Schema live) · 74 ✅ Split-Screen der Wahrheit (Werbe-Archetyp je Kategorie vs. VΛAΛV-Realität, pro Produkt überschreibbar; v50) ·
80 ✅ Pseudo-Rabatt-/MHD-Entlarvung („Kauf-Wahrheit" im Overlay: MHD-sensibel je Wirkstofftyp + Rabatt-Check; optionale Betreiber-Felder; v49) · 121 🔨 Molekülverbindungen (z. B. Bisglycinat vs. Oxid, als Daten) ·
123 ✅⚠️ Disclaimer-Labels für Medikamenten-Interaktionen (nur gut belegte, faktisch aus Kategorie/Inhalt; immer „Arzt/Apotheker"; v51) · 73 🅿️ Herstellerdaten manuell einholen

## Sprint 6 · Gamification, Strafen & Tabu-Börse
12 ✅ Light Mode (Routine-Tracker, v34) · 20 ✅ Gatekeeper (Aufstieg ab Disziplin ≥ 90 %, v36) ·
23 ✅ Disziplin-Balken (Loss Aversion) · 24 ✅ 24-h-Schreibschutz (jeder verpasste Tag zählt, v33) ·
25 ✅ Training-Steuer (Pflicht-Zusatz bei Lücken, v33) · 29 ✅ Punkte („SilberStaub", nur durch Tracking) ·
30 ✅ Startpolster (1 Joker, Score 60) · 31 ✅ „Liebloses Essen"-Cheat-Tag im Shop (v35) ·
32 ✅ Pre-Booking für planbare Ausfälle (v35) · 33 ✅ Rolling-Joker (Cap 3/Woche, v35) ·
13 🟡 Hard Mode (Gramm-Tracking) · 14 🟡 Expert Mode (Timing, Mikronährstoffe) · 21 🟡 Truth-Engine (Score-Entzug) ·
26 🔨⚠️ Degradierungs-Automatik (Regeln sauber definieren) · 28 🔨 Therapie-Verträge (lokal) ·
111 🔨 Tabu-Börse (Sünden-Produkte mit Punkten freischalten) · 112 🔨 Schatten-Kompensation (kcal-Ausgleich für Tabus) ·
27 ❓ „Pro Woche 70"-Logik (Bedeutung klären)

## Sprint 7 · Hardware-Locks & Anti-Schummel-Eskalation
108 ✅ Confession Loop (Beichte → Pflicht-Cardio statt Degradierung, v33) ·
59 🟡 Wochen-Wiegen/Truth-Check (manuell live; Auto nur mit Schutzgrenzen) ·
109 🟡⚠️ Thermodynamik-Audit (±500-kcal-Deckel, >1,5 kg/Woche → Arzt-Verweis) ·
110 🔨⚠️ System-Tribunal (Einfrieren + Arzt-Verweis bei math. Widerspruch, respektvoll) ·
22 🔵 Integritäts-Audit (echt nur serverseitig) · 102 🔵⚠️ Foto-Tresor (verschlüsselt) ·
106 🔵⚠️ Audit-Kamera (Zero-Retention) · 107 🔵⚠️ Waagen-Pflicht-Foto (Elite)

## Sprint 8 · Soziale Arena & Squads (alles Phase 3/Backend)
35 ✅ Profil-Medaillen (v39, lokal – später serverseitig) ·
36 🔵 VΛAΛV-Arena (4er-Squads) · 37 🔵 Team-Karma · 38 🔵 Demokratischer Team-Ausschluss ·
39 🔵 Boost für fehlerfreie Squads · 40 🔵 Serien-Ranking · 41 🔵 Fleiß-Leaderboard ·
42 🔵 1-vs-1-Disziplin-Duelle · 43 🔵 „Likes" für harte Workouts · 44 🔵 Support-Punkte

## Sprint 9 · E-Commerce, Open Banking & Monetarisierung
**Budget-Achse (zweite Achse zu #11):**
16 🟡 Warrior-Modus (günstige Basis-Rohstoffe, Alternativen live) · 17 ✅ König-Modus (Synergien im Overlay: belegte Kombis, Gegenstück zu Warrior; v56)
**A. Finanz-Transparenz & Banking**
85 🔵 Open Banking (FinAPI/Tink) · 86 🔵 Trash-Ausgaben-Analyse · 87 🟡 Survival-Automatik (manuell live) ·
88 🔵 Schmerz-Analyse (Fast-Food-Geld vs. Supplement) · 89 🔵 Predictive Finance (Jahresvorrat)
**B. Affiliate-Strategie (Wissenschaft vor Profit)**
90 🟡 Kontextuelles Affiliate (Schema live) · 91 ✅ Wissenschaftliche Basis (Studien-DB) ·
92 ✅ Gatekeeper-Integrität (Link-Entfernung bei Qualitätsverlust – Prinzip) · 93 🔨 Transparenz-Label (Top-Produkt ohne Link) ·
94 ✅ Neutralitäts-Garantie (Kooperationen ändern Bewertung nie) · 95 🟡 Savings-Insight (Alternativen live, €/100 g offen)
**C. Physische Trophäen (getrennt vom digitalen Punkte-Shop, nur für Absolventen)**
117 🔵 Physische Trophäen (Selbstkostenpreis) + Gravur-Upgrades als einzige Monetarisierung ·
118 🔵 Material-Ehre (Spezifikations-Zettel) · 124 🔵 „Stille Münze" (Geschenk in Bestellungen) ·
125 🔵 Strava-Apex-Filter · 126 🔵 Laser-Gravur GPS-Route in Acryl · 84 🔵 Externe Reviews (Amazon/Google)

## Sprint 10 · Recovery, Master Mode & Endgame
15 ✅ Master Mode (nicht wählbar, nur erspielbar) · 66 ✅ Manuelles Drosseln bei Befunden (Gewebereparatur) ·
65 🟡 Deep-Recovery (RecoveryMode + Tagestyp) · 71 🟡 Blutwerte × Stack-Korrelation ·
68 🔨 Faire Rekonvaleszenz (Krankheit: Schlaf+Wasser = Tages-Wertung) · 70 🔨 Wiedereinstiegs-Plan nach Krankheit ·
119 🔨 „VΛAΛV-Paradoxon" (Perfektions-Falle macht Mikromanagement obsolet) ·
120 🔨 „Eternity Mode" (Endgame: Entlassung in die straffreie Freiheit) ·
9 🔵 Spendenmodell (Absolventen) · 10 🔵 Legacy-Profile · 67 🔵 Doctor-ID-Sync · 69 🔵 Squad-Genesungsnachrichten

## Sprint 11 · WinterArc – Inspiration, Events & Newsletter (NEU)
> Menschen aus der Routine holen, Neues wagen – sachlich, nicht aufdringlich.
129 🔨 Lokaler „Inspirations-Impuls" (wie Tipp des Tages, aber Aktivitäten/Sportarten, saisonal, als Daten – Frontend-Teaser sofort baubar) ·
130 🔵 Lokale Events/Veranstaltungen anzeigen (Event-API/Partner) ·
131 🔵 Aktivitäten direkt buchbar (Provision bei Buchung, neutral & transparent) ·
132 🔵 Newsletter (Qualität statt Spam; braucht E-Mail-Infra + DSGVO-Consent)

---

## Deine Vorschläge (meine Empfehlungen, priorisiert)
1. ✅ **Rebrand erledigt (v44):** SILBERLOCKE → VΛAΛV, „SilberStaub" → „Punkte"
   in allen sichtbaren Strings + PWA-Manifest + Cache-Name (`status-v44`). Interne
   Keys/Variablen unangetastet → keine Nutzerdaten verloren. *Offen:* Icons/OG-Image
   tragen noch das alte Logo; GitHub-Repo/URL heißt weiter „Silberlocke" (optional umbenennbar).
2. **Launch-Sicherung:** `PREVIEW_UNLOCK_ALL = false` gehört auf die Launch-Checkliste.
   Für die Testphase bleibt es `true` (du kontrollierst alles).
3. **Nächster Frontend-Sprint mit hohem Wert:** **Sprint 2 · Phase Zero (114–116)** –
   Dicke-/Ektomorph-Plan + Schatten-Tracking. Reines Frontend, stark auf Marke/Ethos,
   spricht echte Einsteiger an.
4. **Aufräumen vor dem Zubauen:** Die Übersicht platzt (Fortschritt, Staub-Shop,
   Medaillen, Body-IQ, Manifest, Finanz, Heute, Körper, Woche, Recovery, Tipp…).
   Empfehlung: Identität (Manifest/Medaillen/Body-IQ/Identitäts-Statement) in einen
   eigenen **„Profil/Ich"-Tab** auslagern → Übersicht bleibt handlungsfokussiert.
5. **WinterArc leichtgewichtig starten (129):** Ein lokaler saisonaler Inspirations-Impuls
   (Daten-getrieben, wie der Tipp) geht sofort – die Event-/Buchungs-/Newsletter-Teile
   (130–132) sind ehrlich Phase 3 (APIs, Partner, DSGVO).
6. **Zu „image_5.png / kaputtes Formular #5":** Punkt 5 ist **fertig & live (v42)** und
   nutzt Auswahl-Buttons (kein Freitext → keine Injection-Fläche). Ich sehe das Bild
   nicht – wenn dort etwas kaputt aussieht, schick mir kurz, was genau (Screenshot/Text),
   dann fixe ich gezielt.

## Phase-3-Schwelle (erst dann Backend/Next.js)
Konten/Sync (103) → Squads/Arena (36–45, 69) → Open Banking (85–89) →
Kamera-Beweise (106/107) → Health-Integrationen (60, 67, 127, 128) →
Events/Newsletter (130–132) → dann Tech-Migration (96).
Voraussetzungen: echte Betreiberdaten im Impressum, AGB, DSGVO-Konzept
(Gesundheits- + ggf. Finanzdaten!), Kostenplan.

## Technik-Schulden (laufend abbauen)
- ⚠️ **Vor Launch:** `PREVIEW_UNLOCK_ALL` (js/main.js) auf `false` – hebelt sonst die Verdien-Logik für jeden aus.
- ✅ Rebrand SILBERLOCKE→VΛAΛV / SilberStaub→Punkte erledigt (v44). Rest: neue Icons/OG-Image im VΛAΛV-Look.
- ✅ Übersicht in „Profil/Ich"-Bereich entlastet (v46): Medaillen/Body-IQ/Manifest/Identität dorthin ausgelagert.
- `js/main.js` weiter in Module zerlegen (Kandidaten: progress, week, body).
- E2E-Tests (Playwright) in die CI aufnehmen.
- APP_VERSION/CACHE_VERSION bei jedem Deploy +1.

## Versionshistorie (Auszug)
v22 Joker · v24 Pre-Workout-Barriere · v25 Thermodynamik-Audit · v26 SilberStaub ·
v27 Recht-Basics · v28 atomare Versions-Pakete · v29 Smart-Produkt-Felder · v30 Warrior/König ·
v31 Studien-DB · v32 Schlaf-Analyse · v33 Confession Loop + Training-Steuer · v34 Light-Routine-Tracker ·
v35 SilberStaub-Shop (Cheat-Tag + Pre-Booking) · v36 Gatekeeper · v37 Efficiency-Filter ·
v38 Tipp des Tages · v39 Profil-Medaillen · v40 Body-IQ-Quiz · v41 Manifest ·
v42 Identitäts-Frage · v43 Betreiber-Vorschau (alles offen) + Deploy-Härtung ·
v44 Rebrand SILBERLOCKE → VΛAΛV (Marke + Währung „Punkte", ohne Datenverlust) ·
v45 Phase Zero (straffreier 1. Monat, Dicke-/Aufbau-Plan, Schatten-Tracking) ·
v46 Profil/Ich-Bereich (Medaillen · Body-IQ · Manifest · Identität gebündelt; Übersicht entlastet) ·
v47 Wasser-/Elektrolyt-Schnellzugriff (#64) ·
v48 „Brennende Batterie" (fühlbarer Tages-Fortschritt beim Abhaken, #113) ·
v49 Kauf-Wahrheit (MHD-Sensibilität & Pseudo-Rabatt-Check, #80) ·
v50 Split-Screen der Wahrheit (Werbe-Sprache vs. Realität, #74) ·
v51 Medikamenten-Wechselwirkungs-Disclaimer (#123) ·
v52 Einheiten-Vorbereitung (#48) ·
v53 Produktname aus dem Code gelöst (eine Konstante, Arbeitstitel VΛAΛV) ·
v54 Pulver-/Wasser-Berechnung pro Einheit (#49) ·
v55 Clash-Detection Trainings- vs. Ruhetag (#122) ·
v56 König-Synergien (#17) ·
v57 Halal-/Vegan-Transparenz (#62) ·
v58 Fix: neue Blöcke auch in den Produkt-Datenbank-Karten ·
v59 Produkt-Detail aufgeräumt (klappbare Abschnitte; Sicherheit bleibt oben offen)
