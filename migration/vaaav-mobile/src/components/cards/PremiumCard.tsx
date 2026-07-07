// ── PremiumCard ─────────────────────────────────────────────────────────────
// Physisch greifbare Karte (Master-Handoff, TODO 6+7): Neomorphismus-Schatten
// + Liquid Glass (mattiertes dunkles Glas) mit einem subtilen, von hinten
// durchscheinenden Neon-Glow in der jeweiligen Statusfarbe.
// Reine UI-Komponente mit Mock-Daten – kein State, kein Routing (Regel 1).

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme/theme';

interface Props {
  /** Lucide-Icon der Karte (Regel 3: keine Emojis) */
  icon: ReactNode;
  title: string;
  /** Große Kennzahl (Monospace) */
  stat: string;
  /** Kontextzeile unter der Kennzahl */
  sub: string;
  /** Statusfarbe des Neon-Glows (Default: Modus-Akzent) */
  glowColor?: string;
  /** volle Breite statt Grid-Hälfte */
  wide?: boolean;
  onPress?: () => void;
}

export function PremiumCard({ icon, title, stat, sub, glowColor = theme.colors.accent, wide, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.card, wide && styles.wide]}>
      <BlurView intensity={theme.glass.blurIntensity} tint={theme.glass.tint} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.tint]} />

      {/* Neon-Glow: scheint von hinten/unten durch das Glas */}
      <LinearGradient
        colors={['transparent', `${glowColor}30`]}
        start={{ x: 0.5, y: 0.15 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.glowLine, { backgroundColor: glowColor, shadowColor: glowColor }]} />

      <View style={styles.head}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.stat, { color: theme.colors.text }]}>{stat}</Text>
      <Text style={styles.sub}>{sub}</Text>

      <View style={[StyleSheet.absoluteFill, styles.edge]} pointerEvents="none" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    flexGrow: 1,
    borderRadius: theme.radii.card,
    overflow: 'hidden',
    padding: theme.spacing.lg,
    minHeight: 118,
    boxShadow: theme.neomorph.raised,
  },
  wide: {
    flexBasis: '100%',
  },
  tint: {
    backgroundColor: theme.colors.glass,
  },
  edge: {
    borderRadius: theme.radii.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    boxShadow: theme.glass.innerEdge,
  },
  glowLine: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    bottom: 0,
    height: 2,
    borderRadius: 1,
    opacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.sansMedium,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.textMuted,
  },
  stat: {
    fontFamily: theme.typography.mono,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  sub: {
    fontFamily: theme.typography.sans,
    fontSize: 11.5,
    color: theme.colors.textMuted,
  },
});
