// ── VΛAΛV Core Bar ──────────────────────────────────────────────────────────
// Das dynamische Herzstück (Master-Handoff, Abschnitt 4): ein eigenständiger,
// schwebender Glas-Balken direkt unter der Safe-Area – identisch auf iOS und
// Android. Aufgebaut mit react-native-reanimated (60-FPS-Worklets).
//
// Dieser Prototyp implementiert den DEFAULT-STATE („Der Kompass"):
//   · Makro-Fortschritt bis zum nächsten Modus als Neon-Treibstoff-Füllung
//   · konstanter Glow in der Modus-Farbe
//   · Licht-Sweep, der hinter der Glasgravur entlangläuft und die Kanten
//     der VΛAΛV-Buchstaben von hinten zum Leuchten bringt
// Die weiteren Zustände (Context / Action / Recovery) docken über die Props
// state/contextIcon an dieselbe Struktur an.

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode, useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { absFill, theme } from '../../theme/theme';
import { GlassEngraving } from './GlassEngraving';
import { MorphAnchor } from './MorphAnchor';

export type CoreBarState = 'default' | 'context' | 'action' | 'recovery';

interface Props {
  /** Fortschritt zum nächsten Modus, 0–1 (Default-State: „Der Kompass") */
  progress: number;
  /** Label des Ziels, z. B. "EXPERT" */
  nextModeLabel: string;
  /** Aktueller Zustand der Bar (Prototyp rendert 'default') */
  state?: CoreBarState;
  /** Kontext-Icon für den Context-State (morpht den Λ-Anker) */
  contextIcon?: ReactNode;
}

export function CoreBar({ progress, nextModeLabel, state = 'default', contextIcon }: Props) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const accent = state === 'recovery' ? theme.colors.danger : theme.colors.accent;

  // Treibstoff-Füllstand (animiert bei Änderung)
  const fill = useSharedValue(0);
  useEffect(() => {
    fill.value = withTiming(Math.min(Math.max(progress, 0), 1), {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, fill]);

  // Licht-Sweep: läuft endlos durch den gefüllten Bereich (hinter der Gravur)
  const sweep = useSharedValue(0);
  useEffect(() => {
    sweep.value = withRepeat(
      withTiming(1, { duration: theme.coreBar.sweepDurationMs, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    );
  }, [sweep]);

  const fillStyle = useAnimatedStyle(() => ({
    width: barWidth * fill.value,
  }));
  const sweepStyle = useAnimatedStyle(() => {
    const sweepW = barWidth * theme.coreBar.sweepWidthRatio;
    return {
      width: sweepW,
      transform: [{ translateX: -sweepW + (barWidth + sweepW) * sweep.value }],
    };
  });

  const onLayout = (e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width);

  return (
    <View style={[styles.floatWrap, { top: insets.top + theme.coreBar.marginTop }]} pointerEvents="box-none">
      <View style={styles.bar} onLayout={onLayout}>
        {/* Glas-Körper */}
        <BlurView intensity={theme.glass.blurIntensity} tint={theme.glass.tint} style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.glassTint]} />

        {/* Neon-Treibstoff: Füllstand = Fortschritt zum nächsten Modus */}
        <Animated.View style={[styles.fuel, fillStyle]}>
          <LinearGradient
            colors={[`${accent}00`, `${accent}55`, `${accent}2E`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Treibstoff-Vorderkante */}
          <View style={[styles.fuelEdge, { backgroundColor: accent, shadowColor: accent }]} />
        </Animated.View>

        {/* Licht-Sweep hinter der Gravur */}
        <Animated.View style={[styles.sweep, sweepStyle]} pointerEvents="none">
          <LinearGradient
            colors={['transparent', `${accent}66`, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Inhalt: Λ-Anker · Gravur · Fortschritt */}
        <View style={styles.content}>
          <MorphAnchor contextIcon={contextIcon} color={accent} />
          <View style={styles.center} pointerEvents="none">
            <GlassEngraving />
          </View>
          <View style={styles.right}>
            <Text style={[styles.pct, { color: accent }]}>{Math.round(progress * 100)}%</Text>
            <Text style={styles.pctLabel}>{nextModeLabel}</Text>
          </View>
        </View>

        {/* Gefräste Innenkante des Glases */}
        <View style={[StyleSheet.absoluteFill, styles.innerEdge]} pointerEvents="none" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: theme.coreBar.marginHorizontal,
  },
  bar: {
    height: theme.coreBar.height,
    borderRadius: theme.coreBar.radius,
    overflow: 'hidden',
    justifyContent: 'center',
    boxShadow: theme.neomorph.raised,
  },
  glassTint: {
    backgroundColor: theme.colors.glass,
  },
  innerEdge: {
    borderRadius: theme.coreBar.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    boxShadow: theme.glass.innerEdge,
  },
  fuel: {
    ...absFill,
    right: undefined,
    overflow: 'hidden',
    borderTopLeftRadius: theme.coreBar.radius,
    borderBottomLeftRadius: theme.coreBar.radius,
  },
  fuelEdge: {
    position: 'absolute',
    right: 0,
    top: 6,
    bottom: 6,
    width: 2,
    borderRadius: 1,
    opacity: theme.coreBar.glowOpacity,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  sweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    alignItems: 'flex-end',
    minWidth: 52,
  },
  pct: {
    fontFamily: theme.typography.mono,
    fontSize: 15,
    fontWeight: '700',
  },
  pctLabel: {
    fontFamily: theme.typography.sans,
    fontSize: 8,
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
});
