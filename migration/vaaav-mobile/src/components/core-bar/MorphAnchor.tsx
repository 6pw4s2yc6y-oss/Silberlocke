// ── MorphAnchor ─────────────────────────────────────────────────────────────
// Der Morphing-Anker der Core Bar (Master-Handoff, Abschnitt 4):
// links steht permanent das mittlere „Λ" von VΛAΛV. Beim Tab-Wechsel morpht
// es per Cross-Fade/Scale in das Kontext-Icon und zurück.
// Default-State: kein contextIcon → das Λ steht scharf mit ruhigem Glow.

import React, { ReactNode, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { absFill, theme } from '../../theme/theme';

interface Props {
  /** Kontext-Icon des aktiven Tabs (Lucide). null/undefined = Default (Λ). */
  contextIcon?: ReactNode;
  /** Akzentfarbe des aktuellen Zustands (Default: Modus-Farbe). */
  color?: string;
}

const MORPH_MS = 320;

export function MorphAnchor({ contextIcon, color = theme.colors.accent }: Props) {
  // 0 = Λ sichtbar · 1 = Kontext-Icon sichtbar
  const morph = useSharedValue(0);

  useEffect(() => {
    morph.value = withTiming(contextIcon ? 1 : 0, { duration: MORPH_MS });
  }, [contextIcon, morph]);

  const lambdaStyle = useAnimatedStyle(() => ({
    opacity: 1 - morph.value,
    transform: [{ scale: 1 - 0.35 * morph.value }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    opacity: morph.value,
    transform: [{ scale: 0.65 + 0.35 * morph.value }],
  }));

  return (
    <View style={styles.slot}>
      <Animated.View style={[styles.layer, lambdaStyle]}>
        <Text style={[styles.lambda, { color, textShadowColor: color }]}>Λ</Text>
      </Animated.View>
      {contextIcon ? (
        <Animated.View style={[styles.layer, iconStyle]}>{contextIcon}</Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: theme.coreBar.height - 18,
    height: theme.coreBar.height - 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    ...absFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lambda: {
    fontFamily: theme.typography.sansBlack,
    fontSize: 22,
    lineHeight: 26,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});
