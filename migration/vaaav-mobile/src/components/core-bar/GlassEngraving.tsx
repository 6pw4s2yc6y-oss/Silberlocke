// ── GlassEngraving ──────────────────────────────────────────────────────────
// Die 3D-Glasgravur der Core Bar (Master-Handoff, Abschnitt 4):
// „VΛAΛV" ist per Inset-Effekt ins Glas gefräst und trägt KEINE eigene Farbe.
// Aufbau: heller Kantenschein (1px versetzt) unter einer dunklen Deckschicht.
// Erst der dahinter entlanglaufende Neon-Treibstoff (FuelSweep in CoreBar)
// bringt die Kanten der Buchstaben zum Leuchten.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme/theme';

const WORDMARK = 'VΛAΛV';

export function GlassEngraving() {
  return (
    <View style={styles.wrap} pointerEvents="none">
      {/* Kantenschein: liegt UNTER der Deckschicht, 1px nach unten versetzt */}
      <Text style={[styles.mark, styles.edge]}>{WORDMARK}</Text>
      {/* Deckschicht: dunkles „Glas" – lässt nur die Kante durchscheinen */}
      <Text style={[styles.mark, styles.top]}>{WORDMARK}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    fontFamily: theme.typography.sansBlack,
    fontSize: 15,
    letterSpacing: theme.engraving.letterSpacing,
    // Optischer Ausgleich für das letterSpacing hinter dem letzten Zeichen
    marginRight: -theme.engraving.letterSpacing,
  },
  edge: {
    color: theme.engraving.edgeColor,
    transform: [{ translateY: theme.engraving.edgeOffset }],
  },
  top: {
    position: 'absolute',
    color: theme.engraving.topColor,
  },
});
