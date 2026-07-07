// ── Mock-Daten für den Master-Screen ────────────────────────────────────────
// Regel 1 (Component-Driven Development): Das UI wird zuerst mit harten
// Mock-Daten gebaut. Diese Datei wird später durch die 1:1 aus der
// v60/v61-Blaupause (Silberlocke-Repo) extrahierte Logik ersetzt (Regel 5).

export const mockDashboard = {
  /** Aktueller Nutzer-Modus (steuert später das Design-Level) */
  mode: 'HARD' as const,
  /** Fortschritt zum nächsten Modus (Core Bar, Default-State) 0–1 */
  nextModeProgress: 0.72,
  nextModeLabel: 'EXPERT',

  /** VΛAΛV Atomuhr: die unbestechliche Lebenszeit-Bilanz */
  atomClock: {
    /** Start der aktuellen Reise (für den sekundengenauen Zähler) */
    journeyStartIso: '2026-02-16T05:30:00',
    daysDisciplined: 128,
    daysWasted: 13,
  },

  cards: {
    uebersicht: { stat: '87%', sub: 'Disziplin-Score · Woche 21' },
    deinTag: { stat: '4/7', sub: 'Blöcke abgehakt · nächster 17:30' },
    deinKoerper: { stat: '82.4', sub: 'kg · Truth-Check in 2 Tagen' },
    werkzeuge: { stat: '9', sub: 'Module freigeschaltet' },
  },
};
