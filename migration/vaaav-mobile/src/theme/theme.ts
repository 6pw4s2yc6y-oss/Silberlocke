// ── VΛAΛV theme.ts ──────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH für alle visuellen Werte (Master-Handoff, Regel 2).
// Komponenten dürfen KEINE Farben, Schatten oder Blur-Werte hardcoden –
// alles kommt aus diesem Modul. Die Design-Matrix (Handoff, Abschnitt 6)
// definiert vier Level; das UI wählt das Level anhand des Nutzer-Modus.

import { Platform } from 'react-native';

// ── Design-Matrix: die vier visuellen Level ─────────────────────────────────
export type DesignLevel = 'phaseZero' | 'workbench' | 'tribunal' | 'master';

export interface LevelPalette {
  /** Bildschirm-Hintergrund (matte Basis) */
  background: string;
  /** Kartenfläche (Neomorphismus-Basis, minimal heller als der Grund) */
  surface: string;
  /** Glas-Fläche (Liquid Glass, halbtransparent über Blur) */
  glass: string;
  /** Feine Kante auf Glas/Karten */
  border: string;
  /** Primärtext */
  text: string;
  /** Sekundärtext / Labels */
  textMuted: string;
  /** Primärer Neon-Akzent des Levels */
  accent: string;
  /** Sekundäre Neon-Akzente */
  accentAlt: string;
  accentCalm: string;
  /** Warn-/Defizit-Farbe (Recovery-State der Core Bar) */
  danger: string;
  /** Erfolgs-/Einsatzbereit-Farbe */
  ready: string;
}

export const palettes: Record<DesignLevel, LevelPalette> = {
  // Level 1 – Phase Zero & Light Mode: klinischer, heller Neomorphismus
  phaseZero: {
    background: '#E8EDF2',
    surface: '#E8EDF2',
    glass: 'rgba(255,255,255,0.55)',
    border: 'rgba(255,255,255,0.65)',
    text: '#1E2A36',
    textMuted: '#5C6B7A',
    accent: '#4FA3D9',       // Ice-Blue
    accentAlt: '#7FB6A4',
    accentCalm: '#8FA3B8',
    danger: '#C0564F',
    ready: '#4E9E6F',
  },
  // Level 2 – Hard/Expert (Standard-Werkbank): mattes Anthrazit + Neon
  workbench: {
    background: '#0C0E11',
    surface: '#14171C',
    glass: 'rgba(20,23,28,0.72)',
    border: 'rgba(255,255,255,0.07)',
    text: '#E8EBEF',
    textMuted: '#8A94A2',
    accent: '#FF7A1A',       // Neon-Orange (Disziplin/Treibstoff)
    accentAlt: '#39D98A',    // Neon-Grün (Recovery/Gesundheit)
    accentCalm: '#9D7BFF',   // Neon-Lila (Wissen/Analyse)
    danger: '#FF3B4E',
    ready: '#39D98A',
  },
  // Level 3 – Tribunal & Tabu-Börse: warnender Rot-/Burgunder-Glassmorphismus
  tribunal: {
    background: '#160A0D',
    surface: '#1F0F13',
    glass: 'rgba(64,16,24,0.55)',
    border: 'rgba(255,80,96,0.25)',
    text: '#F4E3E5',
    textMuted: '#B58A90',
    accent: '#FF3B4E',
    accentAlt: '#C22B3C',
    accentCalm: '#8A4B55',
    danger: '#FF3B4E',
    ready: '#39D98A',
  },
  // Level 4 – Master/Eternity: Liquid Glass + edle Titan-/Leder-Anmutung
  master: {
    background: '#0B0B0D',
    surface: '#131316',
    glass: 'rgba(24,24,28,0.6)',
    border: 'rgba(212,190,140,0.22)',
    text: '#EFEAE0',
    textMuted: '#9C948A',
    accent: '#D4BE8C',       // Titan-Gold
    accentAlt: '#B8C4CC',    // Titan-Silber
    accentCalm: '#7C7468',
    danger: '#C0564F',
    ready: '#7FB08A',
  },
};

// ── Neomorphismus: physisch greifbare Karten ────────────────────────────────
// RN ≥ 0.76 unterstützt CSS-boxShadow inkl. Mehrfach-Schatten – damit ist
// echter Neomorphismus (dunkler Wurf + heller Gegenschein) plattformübergreifend
// möglich (iOS/Android/Web identisch).
export const neomorph = {
  dark: {
    raised: '0px 10px 24px rgba(0,0,0,0.55), 0px 1px 0px rgba(255,255,255,0.06) inset, 0px -1px 0px rgba(0,0,0,0.5) inset',
    pressed: '0px 2px 8px rgba(0,0,0,0.6), 0px 1px 0px rgba(255,255,255,0.04) inset',
  },
  light: {
    raised: '8px 8px 20px rgba(163,177,198,0.55), -8px -8px 20px rgba(255,255,255,0.9)',
    pressed: '4px 4px 10px rgba(163,177,198,0.5) inset, -4px -4px 10px rgba(255,255,255,0.85) inset',
  },
};

// ── Liquid Glass ────────────────────────────────────────────────────────────
export const glass = {
  /** Blur-Intensität für expo-blur (0–100) */
  blurIntensity: 40,
  /** Zusätzliche Grundtönung über dem Blur (siehe LevelPalette.glass) */
  tint: 'dark' as const,
  /** Innenkante („gefrästes Glas") */
  innerEdge: '0px 1px 0px rgba(255,255,255,0.08) inset, 0px -1px 0px rgba(0,0,0,0.45) inset',
};

// ── 3D-Glasgravur (Core Bar Wasserzeichen) ──────────────────────────────────
// Der Schriftzug hat KEINE eigene Farbe: eine dunkle Deckschicht über einem
// um 1px versetzten hellen Kantenschein erzeugt den Inset-Effekt; sichtbar
// macht ihn erst der dahinter laufende Neon-Treibstoff.
export const engraving = {
  topColor: 'rgba(10,12,15,0.92)',
  edgeColor: 'rgba(255,255,255,0.10)',
  edgeOffset: 1,
  letterSpacing: 6,
};

// ── Core Bar Geometrie & Animation ──────────────────────────────────────────
export const coreBar = {
  height: 54,
  radius: 27,
  marginHorizontal: 16,
  marginTop: 8,
  /** Dauer eines Treibstoff-Durchlaufs (Glow-Sweep) in ms */
  sweepDurationMs: 2600,
  /** Breite des Licht-Streifens relativ zur Bar */
  sweepWidthRatio: 0.35,
  /** Grund-Opazität des konstanten Glows im Default-State */
  glowOpacity: 0.85,
};

// ── Typografie: technisch, präzise (Regel: Inter / Monospace) ───────────────
export const typography = {
  /** UI-Schrift (über expo-font geladen) */
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansBold: 'Inter_700Bold',
  sansBlack: 'Inter_800ExtraBold',
  /** Zahlen/Statistiken: Monospace für unbestechliche Präzision */
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'ui-monospace, Menlo, monospace' }) as string,
};

// ── Raster & Radien ─────────────────────────────────────────────────────────
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radii = { card: 20, chip: 999, inner: 12 } as const;

// Layout-Utility: vollflächige absolute Ebene (Ersatz für das in RN 0.86
// entfernte StyleSheet.absoluteFillObject – als spreadbares Objekt).
export const absFill = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const;

// ── Aktives Theme ───────────────────────────────────────────────────────────
// Der Master-Screen-Prototyp läuft auf Level 2 (Standard-Werkbank).
// Später wählt der Nutzer-Modus das Level (applyDesignLevel im State-Layer).
export const activeLevel: DesignLevel = 'workbench';
export const theme = {
  level: activeLevel,
  colors: palettes[activeLevel],
  neomorph: neomorph.dark,
  glass,
  engraving,
  coreBar,
  typography,
  spacing,
  radii,
};

export type Theme = typeof theme;
