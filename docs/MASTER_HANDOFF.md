# MASTER HANDOFF & ROADMAP: VΛAΛV3

> **Maßgebliches Arbeitsdokument.** Ersetzt `docs/ROADMAP.md` als führende Roadmap
> (die alte Datei bleibt als Status-Referenz der Vanilla-JS-PWA erhalten).
> Hinterlegt am 2026-07-07. Gemäß Regel 4 (Handoff-Loop) wird dieses Dokument am
> Ende jeder Coding-Session aktualisiert.

## 1. Projekt-Übersicht & Core Identity

- **Projektname:** VΛAΛV (ehemals STΛTUS)
- **Philosophie:** Kompromisslose Werkbank für physische und mentale Disziplin. Keine VIP-Vorteile, keine Ausreden. Die App ist der Türsteher, das Tribunal und der Coach.
- **Architektur-Entscheidung (Schmerz als Feature):** Wir verzichten in Phase 1 bewusst auf Komfort-APIs (Open Banking, Apple Health, Auto-Syncs). Das manuelle Eintragen von Ausgaben, Laborwerten oder Trainingsdaten (Watt, Schlaf) ist ein zwingendes, disziplinierendes Ritual für den Nutzer und garantiert gleichzeitig ein hochstabiles, autarkes System ohne fehleranfällige Drittanbieter-Abhängigkeiten.

## 2. Systemarchitektur & Tech-Stack

- **Frontend (Mobile App):** React Native (Expo)
- **Backend / API:** Next.js
- **Datenbank:** Supabase (Isolierte Nährwert-Masterdatenbank, serverseitige Truth-Engine)
- **Repository-Struktur:** Strikte Trennung in zwei Repositories (`vaaav-mobile` und `vaaav-backend`).

## 3. UNUMSTÖSSLICHE KI-ARBEITSREGELN (System-Guardrails)

> ⚠️ **WICHTIGE INFO FÜR DIE KI (WORKFLOW):** Ich entwickle komplett ohne lokalen PC. Unsere Pipeline läuft streng über GitHub. Das Next.js-Backend deployen wir später auf Vercel. Für das React Native Frontend richte bitte direkt zu Beginn eine GitHub Action für 'Expo EAS Update' ein, damit jeder Commit automatisch zu Expo gepusht wird und ich die App über den QR-Code im Expo-Dashboard via Expo Go testen kann. Halte den Code extrem modular und gib immer exakte Dateipfade an!

1. **Component-Driven Development:** Baue IMMER zuerst das visuelle UI mit harten Mock-Daten. Schreibe niemals Backend-Routing oder State-Management (Redux/Zustand), bevor der visuelle Screen vom User freigegeben wurde.
2. **Single Source of Truth (Styling):** Nutze niemals hardcodierte Farben oder Schatten in den Komponenten. Alle Werte aus der VΛAΛV Design-Matrix müssen zwingend aus einer zentralen `theme.ts` oder einem globalen Stylesheet geladen werden.
3. **Absolutes Emoji-Verbot:** Emojis im UI der App sind strikt untersagt. Nutze ausschließlich hochwertige, abstrakte Vektor-Icons (Lucide-Icons / Expo-Vector-Icons).
4. **Handoff-Loop:** Aktualisiere am Ende jeder Coding-Session unaufgefordert die Sektionen „Aktueller Status" und „Aktuelles Todo", damit dieser Handoff für die nächste Session valide bleibt.
5. **Legacy-Code Respektieren (Die v60-Blaupause):** Bei der Migration auf React Native wird das UI visuell komplett neu nach der Design-Matrix aufgebaut. Die zugrundeliegende Logik, Mathematik und Datenstruktur darf jedoch unter keinen Umständen neu erfunden werden. Der alte Vanilla-JS-Code (v60) dient als absolute Referenz. Logik muss 1:1 extrahiert und in den neuen React-State übersetzt werden.

## 4. DIE „VΛAΛV CORE BAR" (Das dynamische Herzstück)

Das visuelle und funktionale Zentrum der App ist nicht die Standard-Notch, sondern ein eigener, unabhängiger UI-Organismus: Die VΛAΛV Core Bar.

- **Positionierung:** Ein eigenständiger, schwebender Balken direkt unterhalb der OS-Sensoren/Safe-Area. Plattformunabhängig (identisch auf iOS und Android).
- **Technik:** Zwingend mit `react-native-reanimated` aufzubauen, um flüssige, hardwarebeschleunigte 60-FPS-Morphing-Animationen (Breite, Farbe, Inhalt) zu garantieren.
- **Stealth-Branding & Logo-Integration:**
  - **Der Morphing-Anker:** Auf der linken Seite der Core Bar steht das mittlere „Λ" von VΛAΛV als permanentes, scharfes UI-Icon. Wechselt der Nutzer den Tab (z. B. Schlaf), morpht das „Λ" flüssig in das jeweilige Kontext-Icon (z. B. Mond) und beim Verlassen des Tabs wieder zurück in das „Λ".
  - **Die 3D-Glasgravur (Wasserzeichen):** Der Schriftzug „VΛAΛV" ist mittig per Inset-Shadow in das Glas gefräst (ohne eigene Farbe). Er wird nur sichtbar, wenn der leuchtende Disziplin-Balken (Neon-Treibstoff) dahinter entlangläuft und die Kanten der Buchstaben von hinten zum Leuchten bringt.
- **Die 4 dynamischen Zustände:**
  1. **Default-State (Der Kompass):** Auf dem Dashboard aktiv. Zeigt den Makro-Fortschritt bis zum Erreichen des nächsten Modus mit konstantem Glow in der Modus-Farbe.
  2. **Context-State (Das Mikroskop):** Beim Wechsel in einen Detail-Tab morpht der Balken sanft um. Er zeigt nun den kontextuellen Treibstoff an: Im ZNS-Tab den Nervensystem-Status, im Schlaf-Tab das Erholungs-Konto, im Muskel-Tab die Regeneration.
  3. **Action-State (Die Brennende Batterie):** Beim aktiven Eintragen/Tracken pulsiert ein Energie-Glow durch den Balken, um den erfolgreichen Input zu visualisieren, bevor er in den Default-State zurückkehrt.
  4. **(🆕) Recovery-State (Das Defizit):** Nach harten Apex-Einheiten (z. B. >100 km Rad) blockiert die Bar im tiefroten Warnbereich. Sie morpht nicht passiv durch Zeit, sondern nur durch aktive Disziplin (eingetragene Kcal-Deckung, Rehydrierung, Schlaf) schrittweise zurück zu Grün (Einsatzbereit).

## 5. DAS AKTUELLE TODO (Startpunkt der Session)

**Ziel:** Definition der visuellen VΛAΛV-Designsprache durch die Core Bar und den isolierten „Master-Screen" (Dashboard).

1. Initialisiere das Expo React Native Projekt.
2. Erstelle eine zentrale `theme.ts`-Datei, welche die Parameter für Neomorphismus-Schatten und Liquid Glass (Blur-Effekte) definiert.
3. Baue die schwebende VΛAΛV Core Bar (Default-State) direkt unter der Safe-Area mit `react-native-reanimated`.
4. Integriere das Stealth-Branding in die Core Bar: Den Morphing-Anker („Λ" links) und die 3D-Glasgravur (Inset-Shadow-Schriftzug mittig).
5. Baue das v60-Dashboard (Übersicht, Dein Tag, Dein Körper, Werkzeuge) als reinen UI-Prototypen nach.
6. Transformiere die flachen Boxen des Dashboards in physisch greifbare Premium-Cards (Neomorphismus).
7. Integriere den „Liquid Glass"-Effekt für die Hauptkarten: Mattiertes dunkles Glas mit einem subtilen, von hinten durchscheinenden Neon-Glow in der jeweiligen Statusfarbe.
8. Ersetze alte Text-Statistiken durch technische Typografie (z. B. Inter, SF Pro, Monospace).
9. Integriere die „VΛAΛV Atomuhr": Platziere einen unbestechlichen Zähler prominent auf der Startseite, der die absoluten Tage visualisiert: „Tage durchgezogen" vs. „Tage verschwendet".
10. **(System-Stopp:** Warte nach Erstellung dieses Master-Screens auf die ausdrückliche Freigabe des visuellen Looks, bevor Logik, Daten-Migration aus v60 oder State implementiert wird!)

## 6. DIE VΛAΛV DESIGN-MATRIX & UI-REGELWERK

Die App passt ihr UI-Design dynamisch an den aktuellen Modus des Nutzers an.

- **Level 1: Phase Zero & Light Mode:** Klinischer, sauberer Neomorphismus. Helle Töne (Ice-Blue, sanftes Grau), weiche Schatten. Die App wirkt strukturiert und greifbar.
- **Level 2: Hard Mode & Expert Mode (Standard-Werkbank):** Matte Dark Theme. Tiefes Anthrazit, aufgeraute Texturen. Harte Neon-Akzente (Orange, Grün, Lila) glühen aus dem Hintergrund oder bei aktiven Fortschrittsbalken.
- **Level 3: Tribunal & Tabu-Börse:** Glassmorphismus in satten, warnenden Rot-/Burgundertönen. Optisch streng, bedrohlich und kompromisslos.
- **Level 4: Master Mode / Eternity Mode:** Liquid Glass kombiniert mit edlen, greifbaren Texturen (Leder-Optik, Titan/Metall-Einflüsse). Visueller Luxus als digitale Entsprechung echter physischer VΛAΛV-Gravuren.

## 7. DIE KOMPLETTE MASTER-ROADMAP (Zur Kontext-Orientierung)

### Legende & Entwicklungs-Realität

- ✅ **Live:** In v41 auf Vanilla JS/HTML/CSS-Basis bereits integriert.
- 🟡 **Teil-Live:** Grundstruktur steht, Inhalte/Feinschliff fehlen.
- 🔨 **Jetzt baubar:** Nächste Sprints im aktuellen Setup.
- 🔵 **Phase 3:** Zwingend Backend/Datenbank/Recht erforderlich.
- ⚠️ **Schutz-Auflage:** Nur mit gesundheitlichen/rechtlichen Leitplanken umsetzbar.
- 🅿️ **Geparkt:** Bewusst verschoben, bis die Systemgrenzen es erzwingen.
- 🆕 **Neue Integration:** Zusätzliche Features aus dem WinterArc/Status-Update.

### Sprint 1: Fundament, Architektur & Identität (Das Set-up)

- (1) ✅ VΛAΛV als neuer, sauberer Markenname etabliert.
- (2) ✅ Das 18-Punkte-Manifest ist fest in der Übersicht verankert.
- (3) ✅ Die App fungiert als ablenkungsfreie, minimalistische Werkbank.
- (4) ✅ Radikale Gleichheit: Keine kaufbaren VIP-Vorteile, jeder startet gleich.
- (6) ✅ Die Entwicklung erfolgt komplett im Stealth-Modus.
- (8) ✅ Die grundlegende Tracking-Werkbank bleibt zwingend 100 % kostenlos.
- (97) ✅ Eine modulare Architektur trennt Vanilla-JS-Logik von Daten.
- (105) 🟡 Juristische Absicherung (Impressum-Platzhalter live; AGB, DPMA-Marke offen).
- (96) 🅿️ Architektonischer Framework-Sprung auf Next.js/React (**AKTUELL IN ARBEIT**).
- (7) 🔵 Der offizielle Startschuss via YouTube.
- (103) 🔵 Backend-Kapselung zur Absicherung der Straf-Logik (Supabase/DB).
- (104) 🅿️ Code-Obfuscation und Cloudflare-Blocker (Geparkt).

### Sprint 2: Onboarding & Phase Zero (Der Türsteher)

- (11) ✅ Zwei-Achsen-Matrix kreuzt Erfahrungsmodus mit Budgetmodus.
- (18) 🟡 Interaktives 3-Schritte-Setup generiert das Dashboard.
- (5) 🔨 Identitäts-Onboarding prüft die mentale Bereitschaft zur Unterordnung.
- (🆕) 🔨 Fokus-Matrix (Hybrid-Profiling): Präzise Abfrage der Ziel-Hierarchie. Der Nutzer definiert klar sein Primärziel (z. B. Bodybuilding/Hypertrophie) und sein Sekundärziel (z. B. Hobby-Rennrad) – oder umgekehrt. Die App passt sich dieser Identität an.
- (114) 🔨 Der „Dicke-Plan" (Phase Zero) für Übergewichtige im ersten Monat (ohne Strafen).
- (115) 🔨 Der „Ektomorph-Plan" für Untergewichtige (Fokus auf Magendehnung).
- (116) 🔨 „Schatten-Tracking": Verwehrt im ersten Monat Kcal-Zahlen zur Baseline-Ermittlung.
- (45) 🔵 Vergleichs-Matching schlägt Neulingen identische Veteranen-Profile vor.
- (🆕) 🔵 Prognose-Engine: Berechnet ungeschönt, wo der Nutzer körperlich/gesundheitlich in 10 Jahren ist.

### Sprint 3: Chronobiologie, UI & Tägliche Werkbank (Die Dashboards)

- (19) ✅ Progressive Disclosure: Komplexe Funktionen wochenweise freigeschaltet.
- (34) ✅ „Body-IQ" Quizzes erziehen zum Biologie-Experten.
- (99) ✅ Design-Matrix aktiviert (Neomorphismus, Liquid Glass).
- (101) ✅ Dashboard-Widget mit tageswechselnden Optimierungs-Insights.
- (57) 🟡 Dynamische Einnahmefenster basierend auf 10:00 Uhr Tages-Taktung.
- (58) 🟡 Basis-Routinen als Standard-Mahlzeiten-Logik.
- (63) 🟡 Circadianer Sleep Mode.
- (62) 🔨 Beten/Halal-Modus integriert Gebetszeiten.
- (64) 🔨 Schnellzugriff-Button für Wasser und Elektrolyte.
- (100) 🔨 Anpassbare Gaming-Themen (Vibes gemäß Design-Matrix).
- (113) 🔨 „Brennende Batterie": Echtzeit-Animation in der VΛAΛV Core Bar beim Tracken.
- (🆕) 🔨 VΛAΛV Atomuhr (Startseite): Ein unbestechlicher, fortlaufender Counter. Visualisiert auf die Sekunde genau die Lebenszeit-Bilanz: „Tage durchgezogen" vs. „Tage verschwendet".
- (🆕) 🔨 Tags Zähler: „Tatsächlich durchgezogene Trainings" vs. Ausfälle.
- (🆕) 🔨 Resilienz-Engine (Mindset-Support): Wenn der Algorithmus ein „Tief" (z. B. verpasstes Training, verfallener Disziplin-Score) erkennt, aktiviert VΛAΛV automatisch den „Resilienz-Modus".
- (🆕) 🔨 Universelle Weisheits-Datenbank: Blendet bei echtem Bedarf ausgewählte Koran-Verse ein, die universelle Prinzipien von Geduld (Sabr), Standhaftigkeit und innerer Reinigung lehren.
- (🆕) 🔨 Neutrales Wording: Verse werden als „Prinzipien der Stärke" betitelt. Sie erscheinen Trigger-basiert nur bei negativen Tagebuch-Einträgen oder Disziplin-Lücken. Begleitet von einem haptischen Grounding (Herzschlag-Vibration).
- (127) 🔨 Financial-Hub (Manuelle Eingabe der Ausgaben).
- (128) 🔵 Medical-Terminal als hochsicheres Archiv für Befunde.
- (🆕) (130) 🔨 Datenbasiertes Budget-Planning: Sobald über den Financial-Hub ausreichend manuelle Ausgabendaten gesammelt wurden, erstellt die App automatisch proaktive Budget-Pläne und Limits.
- (61) 🅿️ Rigoroser „Aleman Trink-Timer" via native Smartphone-Alarme.

### Sprint 4: Trainings-Matrix & Leistungssteuerung (Die Mechanik)

- (47) ✅ Autarker Wochenplan-Baukasten für Trainingszyklen.
- (54) ✅ Zwingende Pre-Workout-Schranke bei ZNS-Ermüdung/Schlafmangel.
- (46) 🟡 „All-in-One Clash Detection" (Schlaf-Sperre live).
- (52) 🟡 Hypertrophie-Fokus.
- (53) 🟡 Systemische Ego-Bremsen drosseln Training bei Überlastung.
- (🆕) 🔨 Thermodynamisches Recovery-Fenster: Visualisierung der Regenerationsschuld nach extremen Belastungen. Das UI schaltet in den roten Defizit-Modus. Dieser füllt sich nicht passiv durch Zeit, sondern nur aktiv: Die berechneten Kcal für die Gewebereparatur und Energiebereitstellung müssen zu 100 % getrackt werden, bevor die App auf „Grün" (Einsatzbereit) springt.
- (🆕) 🔨 Adaptives Hybrid-Routing: Basierend auf der Onboarding-Fokus-Matrix berechnet die App das Volumen cross-funktional. Ist Radsport nur das Hobby, deckelt die App die ZNS-Belastung auf dem Rad, damit der primäre Bodybuilding-Plan nicht sabotiert wird (und vice versa).
- (🆕) 🔨 Mikrozyklen-Spezifizierung (Stimulus-Fokus): Zwingende Abfrage des aktuellen Trainingsreizes: Kraftausdauer, Hypertrophie oder reine Muskelausdauer. Das UI und die Pläne passen sich entsprechend an; physiologisch widersprüchliche Belastungsmuster werden blockiert.
- (48) 🔨 „Geplante Einheit Vorbereitung" visualisiert das nächste Workout.
- (49) 🔨 Automatische Berechnung von Pulver/Wasser pro Trainingseinheit.
- (50) 🔨 Rennrad-Fokus mit spezialisierten Trainingsplänen.
- (🆕) 🔨 „Pro-Peloton" Benchmark (Tour de France): Vergleicht die manuell getrackten Leistungswerte (FTP, Watt/kg, Höhenmeter, Dauer) ungeschönt mit den absoluten Anforderungen eines Tour-de-France-Profis. Visualisiert als prozentualer Reality-Check den Abstand zur Weltklasse.
- (🆕) 🔵 Dedizierter Fahrrad-Bereich: Spezieller Bereich innerhalb des Columbus Modes für Ausfahrten.
- (🆕) 🔨 Geräte-Inventar (Gear-Setup): Einmaliges Anlegen des Equipments (Radcomputer, Powermeter, Beleuchtung).
- (🆕) 🔨 Pre-Tour Gear Checklist: Interaktive Vorbereitungs-Liste (Schläuche, CO2, Nutrition), die am Vorabend einer Tour getriggert wird.
- (🆕) 🔨 Charge-Check (Elektronik-Status): „Auf laden"-Checkliste für alle Geräte. Erinnert rechtzeitig daran, Radcomputer und elektronische Schaltung ans Netz zu hängen.
- (122) 🔨 Clash-Detection unterscheidet exakt zwischen Trainings- und Ruhetag.
- (51) 🔨 Watt-Tracking (Manuelle Eingabe der Metriken).
- (60) 🔨 Schlaf- & Gesundheits-Metriken (Manuelle Übertragung).
- (55) 🅿️ App-Sperre in den Satzpausen (Blockiert Social Media).
- (56) 🔵 Live-Wetter-Tracking passt Hydration an.

### Sprint 5: Supplement-Datenbank & Science (Die Wirkstoff-Wahrheit)

- (72) ✅ Datenbank bewertet unbestechlich nach Fakten.
- (75) ✅ Wissenschaftliche Studien-Werte sind strikt von User-Meinungen getrennt.
- (76) ✅ Harte rechtliche Disclaimer statt Wirkversprechen.
- (81) ✅ UX-Makro-Block-Bündelung (z. B. Morgen-Stack).
- (82) ✅ Efficiency Filter warnt vor überdosierten Vitaminen.
- (77) 🟡 „No-Bullshit" Geschmackstester.
- (78) 🟡 Farbliche Codes für Studie vs. User-Erfahrung.
- (79) 🟡 Warnflagge bei verschlechterten Rezepturen.
- (74) 🔨 Split-Screen vergleicht Marketing-Dose mit harter VΛAΛV-Realität.
- (80) 🔨 Entlarvung von Pseudo-Rabatten und nahendem MHD.
- (121) 🔨 Erweiterung um spezifische Molekülverbindungen (z. B. Bisglycinat vs. Oxid).
- (123) 🔨 Harte Disclaimer-Labels für Interaktionen mit Medikamenten.
- (73) 🅿️ Produktdaten werden offiziell bei Herstellern eingeholt.

### Sprint 6: Gamification, Strafen & Tabu-Börse (Das Punkte-System)

- (12) ✅ Light Mode: Einsteigerstufe mit Zeit-Toleranz.
- (20) ✅ Gatekeeper-Algorithmus: Aufstieg erfordert >90 % Disziplin-Score.
- (23) ✅ Animierter Disziplin-Balken triggert Verlustaversion.
- (24) ✅ 24-h-Schreibschutz-Lock (Fehlende Tage = Null-Runde).
- (25) ✅ „Training-Steuer" verhängt Pflicht-Zusatz-Workouts bei Lücken.
- (29) ✅ Punkte nur durch Tracking verdienbar.
- (30) ✅ Starterpaket an Punkten schützt Anfänger.
- (31) ✅ „Liebloses Essen" (Cheat-Tage) im Shop freischaltbar.
- (32) ✅ Strategisches Pre-Booking für vorhersehbare Ausfälle.
- (33) ✅ Mathematisches Jokersystem (Cap 3 pro Woche).
- (13) 🟡 Hard Mode: Exaktes Gramm-Tracking.
- (14) 🟡 Expert Mode: Minutengenaues Timing.
- (21) 🟡 Truth-Engine entzieht Betrügern Punkte.
- (26) 🔨⚠️ Degradierungs-Automatik: Zurückstufen bei Verstößen.
- (28) 🔨 Verbindliche Therapie-Verträge blockieren Laster (lokal).
- (111) 🔨 Tabu-Börse (Anti-Stockpiling Regel): Sünden-Produkte legal mit Punkten freischalten. Die eiserne Regel: Nichts darf zuhause auf Vorrat gelagert werden!
- (🆕) 🔨 Supermarkt-Walk-Tracking: Wer etwas aus der Tabu-Börse konsumiert, muss aktiv zum Supermarkt laufen. Der Fußweg wird getrackt und als Beweis aktiver Willenskraft gewertet.
- (112) 🔨 Schatten-Kompensation webt Kalorienausgleich für Tabus in Alltag ein.
- (🆕) 🔨 Belohnungs-System für strukturierte Tagebuch-Einträge.
- (🆕) 🔨 VΛAΛV Wallpaper-Bar: Ein Fortschrittsbalken über die Woche. Erreicht man das Ziel, wird am Wochenende ein exklusives, ikonisches Smartphone-Wallpaper (Liquid Glass / Neomorphismus) freigeschaltet.
- (27) ❓ Pacing-Mechanik: Alle 3 Tage bei erfolgreich absolviertem Tag ein neues Element / Tool freischalten, um den Nutzer nicht zu überfordern und durch den Überraschungseffekt die Motivation hochzuhalten.

### Sprint 7: Hardware-Locks & Anti-Schummel-Eskalation (Das Tribunal)

- (108) ✅ Ehrlichkeits-Kompensation führt zu Pflicht-Cardio statt Degradierung.
- (59) 🟡 Wöchentlicher „Truth-Check" auf der Waage.
- (109) 🟡⚠️ Thermodynamik-Audit entlarvt Lügen.
- (110) 🔨⚠️ System-Tribunal: Einfrieren der App + Arzt-Verweis bei mathematischem Kollaps.
- (22) 🔵 Integritäts-Audit erkennt Manipulationen (Serverseitig).
- (102) 🔵⚠️ Lokaler Foto-Tresor für Vorher-Nachher-Bilder (Kryptiert).
- (106) 🔵⚠️ Audit-Kamera verlangt flüchtigen Foto-Beweis beim Essen.
- (107) 🔵⚠️ Waagen-Pflicht-Foto im Elite-Modus.

### Sprint 8: Die Soziale Arena & Squads (Multiplayer-Modus)

- (35) ✅ Sichtbare, seltene Profil-Medaillen für Meilensteine.
- (36) 🔵 „VΛAΛV-Arena" bildet 4er-Arbeits-Squads.
- (37) 🔵 „Team-Karma": Schummeln eines Mitglieds senkt Squad-Punkte.
- (38) 🔵 Demokratischer Team-Ausschluss für Saboteure.
- (39) 🔵 Belohnungs-Boost für fehlerfreie Squads.
- (40) 🔵 System-Ranking der längsten historischen Serien.
- (41) 🔵 Leaderboard nach Fleiß deklassiert Genetik-Profis.
- (42) 🔵 1-gegen-1-Duelle um die längste Disziplin-Strähne.
- (43) 🔵 „Likes" für extrem hart getrackte Workouts der Squad-Mitglieder.
- (44) 🔵 Support-Punkte für das Motivieren anderer.

### Sprint 9: E-Commerce & Monetarisierung (Das Geschäft)

- (83) ✅ Smart-Replacement bei ausverkauften Produkten.
- (91) ✅ Affiliate-Links zwingend mit wissenschaftlichen Studien unterfüttert.
- (92) ✅ Automatische Link-Entfernung bei Qualitätsverlust.
- (94) ✅ Firmenkooperationen verändern niemals die harte Nährwert-Bewertung.
- (16) 🟡 Budget-Stufe „Warrior" fokussiert auf günstige Basis-Rohstoffe.
- (87) 🟡 Survival-Automatik streicht Luxus-Supplements bei Geldmangel.
- (90) 🟡 Kontextuelles Affiliate.
- (95) 🟡 „Savings Insight" entlarvt Marken-Aufschläge.
- (17) 🔨 Budget-Stufe „King" schaltet Premium-Stacks frei.
- (93) 🔨 Transparente Kommunikation bei Top-Produkten ohne Affiliate-Link.
- (117) 🔨 Trophäen-Basis: Physische Trophäen (zum Selbstkostenpreis) + Gravur-Upgrades als einzige Monetarisierung.
- (118) 🔨 Material-Ehre: Beilage eines Spezifikations-Zettels in der Acryl-Box.
- (124) 🔨 Die „Stille Münze": Physische VΛAΛV-Münze als Geschenk.
- (85) 🔨 Trash-Ausgaben-Analyse (Manuelle Eingabe).
- (125) 🔨 Apex-Leistungen (Manuelle Übertragung von Highlight-Daten ins System).
- (🆕) 🔨 Hintergrund-Vorratstracker (Inventory Engine): Ein unsichtbarer Supplement- und Ernährungsrechner, der basierend auf dem täglich getrackten Konsum (z. B. 100 g Haferflocken, 40 g Eiweißpulver) exakt den physischen Füllstand der Dosen und Vorräte zu Hause berechnet.
- (🆕) 🔨 Zero-Stock Warnsystem: Die App meldet sich proaktiv, kurz bevor ein essenzielles Produkt leer ist, um Ausfälle in der Ernährung logistisch zu verhindern.
- (🆕) 🔨 Wöchentlicher Master-Bestellplan: Bündelt alle zur Neige gehenden Produkte intelligent zu einer fertigen, wöchentlichen Einkaufs- und Nachbestell-Liste, sodass der Nutzer nur noch im Supermarkt abhaken oder gesammelt online bestellen muss.
- (🆕) (129) 🔨 Voraussichtliche Einkaufskalkulation: Berechnet auf Basis des Vorratstrackers und historischer Preisdaten im Voraus die exakten voraussichtlichen Kosten für den nächsten (Wochenen-)Einkauf.
- (84) 🔵 Verifizierte Amazon/Google-Bewertungen einbinden.
- (88) 🔵 Schmerzhafte Umrechnung: Fast-Food-Geld vs. Premium-Supplements.
- (89) 🔵 Predictive Finance berechnet Zeitpunkt für Jahresvorrat-Kauf.
- (126) 🔵 Exklusives Recht auf GPS-Routendaten-Gravur in Acryl für Highlight-Strecken.

### Sprint 10: Biohacking-Recovery & Master Mode (Der Abschluss)

- (15) ✅ Master Mode: Nur durch fehlerfreie Langzeit-Quest erreichbar.
- (66) ✅ Manuelles Drosseln bei eingepflegten Befunden.
- (65) 🟡 Deep-Recovery Modus schaltet auf Heilung um.
- (71) 🟡 Master Mode analysiert manuell eingetragene Labor-Blutwerte und gleicht ab.
- (68) 🔨 Lückenloses Schlafen/Trinken zählt als „Workout" bei Krankheit.
- (70) 🔨 App generiert schonenden Wiedereinstiegs-Plan nach Krankheit.
- (119) 🔨 „VΛAΛV-Paradoxon": Die Perfektions-Falle.
- (120) 🔨 Eternity Mode: Entlässt den Nutzer in die lebenslange Freiheit.
- (🆕) 🔵⚠️ Ärztliches OK: Zwingende Bestätigungsschranke nach dem Recovery-Mode.
- (9) 🔵 Freiwilliges Spendenmodell für Serverfinanzierung (exklusiv für Absolventen).
- (10) 🔵 Erfolgreiche Absolventen geben „Legacy-Profile" frei.
- (67) 🔵 Doctor-ID-Schnittstelle synchronisiert Gesundheitsdaten.
- (69) 🔵 Squad-Mitglieder senden anonyme Genesungsnachrichten.

### Sprint 11: The WinterArc & Columbus Mode (Offline Events & Trips) 🆕

- (🆕) 🔵 Columbus Mode: Entdeckung und Freischaltung physischer Gebiete und Events.
- (🆕) 🔵 Neue Aktivitäten entdecken: App inspiriert, den Alltag zu verlassen.
- (🆕) 🔵 Freizeit-Integration: Anzeige von lokalen Events, Hobbys direkt buchbar.
- (🆕) 🔵 Individueller Columbus-Foto-Tresor: Integration von privaten Fotos zur persönlichen Erlebnis-Dokumentation.
- (🆕) 🔵 Ethisches Geschäftsmodell: Buchung über Partner mit neutraler Provision. Maximale Transparenz.
- (🆕) 🔵 WinterArc Newsletter: Qualität statt Quantität mit relevanten Empfehlungen.
- (🆕) 🔨 Survival Mode (Camper, lange Touren & Trips): Spezieller autarker Modus für mehrtägige Touren abseits der Zivilisation. Pausiert reguläre Gym-/Alltags-Strafen und trackt stattdessen Survival-Metriken (Rationierung, Kilometer, Höhenmeter, Outdoor-Schlaf).
- (🆕) 🔨 Tägliche Befindlichkeits-Abfrage: Dreimal tägliche (Morgen, Mittag, Abend) strukturierte Abfrage von Wohlbefinden und schnellen Notizen im Wertebefinden-Bereich.
- (🆕) 🔨 Tagebuch-Struktur & Deep Focus Timer: Automatisierter Abschluss des Tages. Ein Timer für fokussiertes Arbeiten/Lesen (Shadow Phase) fließt als stilles Wachstum mit ein.
- (🆕) 🔵 „VΛAΛV Individual Book" & Physische Coins: Kommerzielle Option für Nutzer, eigene Notizen und Erfolge als hochwertiges Buch zu erwerben. Titan-Coins mit Laser-Gravur („Veteranen-Narbe") für den absolvierten WinterArc.
- (🆕) 🔨 Biometrische Resilienz-Kopplung: Die Engine gleicht „Tiefs" mit physischen Daten (wenig Schlaf, harte Rad-Einheiten) ab. Ändert das Wording bei physischer Überlastung von „Push harder" zu „Erholung ist Teil des Prozesses".

---

## AKTUELLER STATUS (Handoff-Loop, Stand 2026-07-07, Session 2)

- **TODO 1–9 sind als UI-Prototyp GEBAUT** und warten auf die visuelle Freigabe
  (System-Stopp, TODO 10 – aktiv). Umfang: Expo-Projekt (SDK 57, TypeScript),
  zentrale `src/theme/theme.ts` (Design-Matrix, 4 Level, Neomorphismus- &
  Liquid-Glass-Token, Typografie Inter/Mono), **VΛAΛV Core Bar** im
  Default-State (reanimated: Treibstoff-Füllung, Licht-Sweep, Λ-Morphing-Anker,
  3D-Glasgravur), **Master-Screen** (Atomuhr sekundengenau, 4 Premium-Cards
  Übersicht/Dein Tag/Dein Körper/Werkzeuge mit Lucide-Icons, Mock-Daten),
  GitHub Action `eas-update.yml` (Push auf main → EAS Update, Test via Expo Go).
  Verifiziert: `tsc --noEmit` sauber, Web-Export läuft ohne JS-Fehler, Screenshot
  an Betreiber übergeben.
- **Repo-Trennung vollzogen:** `vaaav-mobile` existiert und enthält den
  Prototyp auf `main` (Initial-Commit; EAS-Workflow aktiv, sobald
  `EXPO_TOKEN`/`EXPO_PROJECT_ID` gesetzt sind). Das Staging-Verzeichnis
  `migration/` in diesem Repo wurde wieder entfernt.
- **Dieses Repository (`Silberlocke`)** = Legacy-Blaupause (Regel 5), Stand
  **v61**. Status-Abgleich: Die ✅/🔨-Marker in Abschnitt 7 spiegeln v41; in der
  PWA sind zusätzlich live (Auszug): 5, 17, 48, 49, 62 (ohne Gebetszeiten), 64,
  74, 80, 113, 114–116, 122, 123 – Logik von dort extrahieren.

## AKTUELLES TODO (Handoff-Loop)

1. ✅ Repo `vaaav-mobile` angelegt; Prototyp auf `main` importiert.
2. ✅ EAS-Pipeline GRÜN (Lauf #6): Expo-Projekt-ID `523fcb3c-…` + slug
   `vaaav-mobile-` fest in app.json, Secret `EXPO_TOKEN` gesetzt. Jeder Push
   auf `main` publiziert automatisch; Test via Expo Go (QR auf expo.dev).
   ⚠️ **Projekt ist bewusst auf Expo SDK 54 gepinnt** (expo 54.0.35, RN 0.81.5,
   reanimated 4.1.1): Die iOS-Expo-Go im App Store (54.0.2) unterstützt nur
   SDK 54 – SDK 56/57 lieferten „Project is incompatible". Erst upgraden, wenn
   Expo eine neuere Expo-Go-Version für iOS ausliefert (oder auf EAS
   Development Builds umgestellt wird).
   ⚠️ Sicherheits-Nachtrag: Der Token wurde im Chat geteilt → neuen Token
   erzeugen, Secret-Wert aktualisieren, alten Token löschen.
3. **System-Stopp (TODO 10) per Betreiber-Entscheid ans PROJEKTENDE
   verschoben:** Design, Tabs und Visuals werden am Schluss gesamthaft
   reviewt. Bis dahin: Features/Logik weiterbauen; alle visuellen Werte
   bleiben zentral in `theme.ts` (Regel 2), damit der finale Visual-Pass
   die Logik nicht berührt.
4. ✅ **Logik-Kern extrahiert (Regel 6):** `src/logic/calculator.ts`
   (Bedarf + Thermodynamik-Audit) und `src/logic/timeline.ts`
   (Zeitfenster-Mathematik) 1:1 aus der v61-Blaupause; alle 23
   Blaupausen-Tests portiert und grün; CI-Workflow (Typecheck + Tests)
   aktiv. Master-Screen-Karte „Dein Bedarf" rechnet live über den echten
   Rechner (Profil noch Mock).
5. ✅ **Navigation & erste Bereichs-Screens:** RootNavigator (leichter
   Screen-Wechsler, Framework-Wechsel später trivial); Core Bar lebt als
   persistenter Organismus darüber, **Λ-Anker morpht beim Screen-Wechsel**
   (Context-State). Screens: „Dein Tag" (Timeline live aus
   suggestMeals/suggestTrainTime), „Dein Körper" (Gewicht + Thermo-Audit
   live), „Werkzeuge" (Register der 9 Blaupausen-Module mit
   Migrations-Status). Interaktion per Playwright verifiziert.
6. **Nächste Schritte:** (a) Onboarding-Screens (Profil/Ziel/Zeiten) →
   speist Rechner/Timeline mit echten Daten; (b) Persistenz-Schicht
   (AsyncStorage, Pendant zu storage.js); (c) „Dein Tag" mit echten
   Timeline-Blöcken/Produkten aus `data/` (Daten-Extraktion);
   (d) Core-Bar-Zustände Action/Recovery.
