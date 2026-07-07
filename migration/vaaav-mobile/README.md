> ⚠️ **STAGING:** Dieses Verzeichnis ist eine Zwischenablage. Sobald das eigene Repo `vaaav-mobile` existiert, wird der Inhalt 1:1 dorthin verschoben und hier gelöscht (Handoff: strikte Zwei-Repo-Trennung).

# VΛAΛV Mobile

React-Native-App (Expo) von VΛAΛV – der kompromisslosen Werkbank für physische
und mentale Disziplin. Maßgebliches Arbeitsdokument: `docs/MASTER_HANDOFF.md`
im Blaupausen-Repo (`Silberlocke`).

## Status

**UI-Prototyp (System-Stopp aktiv):** Core Bar (Default-State) + Master-Screen
mit Mock-Daten. Es wird keine Logik/State/Migration implementiert, bevor der
visuelle Look ausdrücklich freigegeben ist (Handoff, Abschnitt 5, Punkt 10).

## Struktur

```
App.tsx                                Einstieg (Fonts, SafeArea, StatusBar)
src/theme/theme.ts                     SINGLE SOURCE OF TRUTH: Design-Matrix,
                                       Neomorphismus, Liquid Glass, Typografie
src/components/core-bar/CoreBar.tsx    Die VΛAΛV Core Bar (reanimated)
src/components/core-bar/MorphAnchor.tsx  Λ-Anker (morpht zu Kontext-Icons)
src/components/core-bar/GlassEngraving.tsx  3D-Glasgravur "VΛAΛV"
src/components/cards/PremiumCard.tsx   Neomorph-/Glas-Karte mit Neon-Glow
src/components/AtomClock.tsx           VΛAΛV Atomuhr (sekundengenaue Bilanz)
src/screens/MasterScreen.tsx           Dashboard-Prototyp (v60-Blaupause)
src/mock/dashboard.ts                  Harte Mock-Daten (Regel 1)
.github/workflows/eas-update.yml       Auto-Publish zu Expo bei Push auf main
scripts/inject-eas-project.mjs         Injiziert die Expo-Projekt-ID in CI
```

## EAS einrichten (einmalig, komplett im Browser)

1. Auf [expo.dev](https://expo.dev) registrieren und ein Projekt **vaaav-mobile**
   anlegen → die **Project ID** kopieren.
2. Auf expo.dev unter *Account Settings → Access Tokens* ein Token erzeugen.
3. In diesem GitHub-Repo unter *Settings → Secrets and variables → Actions*:
   - Secret **`EXPO_TOKEN`** = das Token
   - Variable **`EXPO_PROJECT_ID`** = die Project ID
4. Fertig. Jeder Push auf `main` veröffentlicht automatisch ein EAS Update.
   Testen: **Expo Go** auf dem Handy installieren → auf expo.dev im Projekt
   den QR-Code des neuesten Updates scannen.

## Regeln (Kurzfassung, verbindlich)

- UI zuerst, mit Mock-Daten; State/Backend erst nach Freigabe.
- Alle visuellen Werte aus `src/theme/theme.ts` – nie hardcoden.
- Keine Emojis im App-UI; nur Vektor-Icons (`lucide-react-native`).
- Logik/Mathematik/Datenstrukturen werden 1:1 aus der v60/v61-Blaupause
  (`Silberlocke`-Repo) extrahiert, niemals neu erfunden.
