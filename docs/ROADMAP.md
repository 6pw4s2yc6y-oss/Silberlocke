# SILBERLOCKE – Produkt-Roadmap

> Nordstern: **Alles in einer Seite** – ein unbestechliches Disziplin- und
> Gesundheits-System. Vier Stufen (Light → Hard → Expert → Master), die man
> sich durch disziplinierte Tage **verdient**; jede Woche schaltet eine
> Funktion frei.
>
> Arbeitsprinzipien: iterativ (ein Schritt nach dem anderen) · Daten strikt
> getrennt von Logik (`data/` vs. `js/`) · jede Woche etwas Sichtbares
> liefern · **kein Big-Bang-Rewrite** – ein Tech-Umstieg (z. B. Next.js/
> TypeScript + Backend) wird erst entschieden, wenn Accounts/Team-Features
> ihn wirklich erzwingen, und dann schrittweise migriert.

## ✅ Live (v1–v21)

- Tagesplan getaktet ab Aufwach-/Schlafzeit, Zeitblöcke (App-Fatigue-Schutz)
- Produkt-DB (55), Mein Stack, Nährstoffe/NRV, Body-Atlas, Sportpläne, Money
- RecoveryMode (Verletzungen, Erste Hilfe, Seelisches, Notruf)
- Blutwerte-Analyse & Überwachungs-Protokoll (Expert)
- kcal/Eiweiß-Bedarf (Mifflin-St-Jeor, Ziele Abnehmen/Halten/Performance/Aufbauen)
- Wochenplan (Mo–So, selbst-anwendend), mehrere Trainingseinheiten (1–3/Tag)
- Schlaf-Limit 6–9 h (unter 6 h: Training gesperrt)
- Tab „Dein Körper" (BMI, BMR, TDEE, Makro-Bilanz)
- **Disziplin-Engine Phase 1:** Abhaken pro Block, disziplinierte Tage,
  Status 0–100, wöchentliche Freischaltung (7/14/21 Tage), Stufen gesperrt
- PWA offline, Update-Banner, sichtbare Versionsnummer

## Phase 2 – Jetzt (in der laufenden App baubar)

1. ✅ **Joker-System** *(live, v22)* – Puffer mit Cap bei 3: ein Joker fängt
   einen verpassten Tag ab (Status bleibt); 1 Joker pro voller Woche verdient.
2. ✅ **Monats-Aufstieg** *(live, v23)* – 28 disziplinierte Tage → nächste
   Stufe; wöchentliche Freischaltungen innerhalb Hard/Expert/Master.
3. ✅ **SilberStaub** *(live, v26)* – verdiente Währung für Disziplin (später eintauschbar).
4. ✅ **FinancialMode Warrior/König** *(live, v30)* – zweite Achse: Warrior = günstige
   Rohstoff-Alternativen statt Marken-Produkte (nutzt Money-Daten).
5. ✅ **Thermodynamik-Audit** *(live, v25)* – wöchentlicher Abgleich reales Gewicht vs.
   kalkulierte kcal; bei Diskrepanz kcal drosseln / Hinweis (kein „Tribunal"
   ohne Arzt – nur Empfehlung + Arzt-Verweis).
6. ✅ **Pre-Workout-Barriere** *(live, v24)* – vor dem Training kurze Abfrage:
   Schlafqualität, Schmerzlevel, Muskelkater, ZNS-Zustand → Training ok /
   angepasst / gesperrt.
7. ✅ **Produkt-Felder** *(live, v29 – Schema komplett, Ratings/Affiliate-Werte liefert der Betreiber)* (`data/supplements/products.json`):
   `noBullshitRating` (Geschmack getrennt von Wirkung), `affiliateUrl`,
   `rezepturAenderungWarning`, `smartReplacementId` (Ersatz bei Ausverkauf).
8. ✅ **Studien-Datenbank** *(live, v31)* (`data/studies/`) – 7 echte Kern-Referenzen (ISSN/IOC/Meta-Analysen), per `studyIds` an Produkte verlinkt, ab Hard sichtbar.
9. **Schlaf-Analyse** (Master-Inhalt) – Trends aus Schlafdauer/-qualität.
10. ✅ **Recht-Basics** *(live, v27)* – Impressum & Datenschutzerklärung als
    Seiten + Footer-Links. ⚠️ Impressum enthält noch Platzhalter – echte
    Betreiber-Daten (Name/Anschrift/E-Mail) müssen ergänzt werden.

## Phase 3 – Braucht Backend, Konten & Rechtsprüfung (später)

- **Accounts & Sync** (z. B. Supabase + RLS) → erst dann Tech-Migration prüfen
- **Team-Squads / anonyme Arenen** (4 Mitglieder, Team-Karma, Sektoren wie
  Raucher-Entzug)
- **Open Banking** (Trash-Ausgaben-Analyse, Budget-Zonen GREEN/YELLOW/RED)
  → hohe DSGVO-/PSD2-Hürden
- **AuditCamera** (flüchtiger Live-Beweis, Zero-Retention; Expert/Master mit
  Küchenwaage) → Kamera-Rechte, Datenschutz-by-Design
- **Hardware-Beweise** (Watt-Tracking Rennrad, Wearables)
- **Medizinische Eskalation** – automatische kcal-Drosselung bei Befund ist
  live-fähig (RecoveryMode+), alles Weitere **nur mit ärztlicher Begleitung**

## Technik-Schulden (laufend abbauen)

- `js/main.js` (~3.200 Zeilen) weiter in Module zerlegen (Muster: `week`,
  `progress`, `body` als Kandidaten)
- E2E-Tests (Playwright) in die CI aufnehmen
- Versionsnummer (APP_VERSION/CACHE_VERSION) bei jedem Deploy +1
