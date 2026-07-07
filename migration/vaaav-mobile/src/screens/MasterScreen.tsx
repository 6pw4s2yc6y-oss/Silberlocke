// ── Master-Screen (Dashboard-Prototyp) ──────────────────────────────────────
// Master-Handoff, TODO 5–9: das v60-Dashboard (Übersicht · Dein Tag ·
// Dein Körper · Werkzeuge) als reiner UI-Prototyp – Premium-Cards
// (Neomorphismus + Liquid Glass), technische Typografie, Atomuhr.
// Harte Mock-Daten, kein State-Management, kein Routing (Regel 1).
// System-Stopp (TODO 10): Nach diesem Screen ist visuelle Freigabe nötig,
// bevor Logik/Daten-Migration/State implementiert wird.

import { Activity, CalendarClock, LayoutGrid, Wrench } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AtomClock } from '../components/AtomClock';
import { CoreBar } from '../components/core-bar/CoreBar';
import { PremiumCard } from '../components/cards/PremiumCard';
import { mockDashboard as mock } from '../mock/dashboard';
import { theme } from '../theme/theme';

const ICON_SIZE = 16;

export function MasterScreen() {
  const insets = useSafeAreaInsets();
  const coreBarSpace = insets.top + theme.coreBar.marginTop + theme.coreBar.height;

  return (
    <View style={styles.screen}>
      {/* Schwebende Core Bar (Default-State: Kompass zum nächsten Modus) */}
      <CoreBar progress={mock.nextModeProgress} nextModeLabel={mock.nextModeLabel} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: coreBarSpace + theme.spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Kopfzeile: Bereich + Modus-Chip */}
        <View style={styles.headRow}>
          <Text style={styles.headTitle}>Übersicht</Text>
          <View style={styles.modeChip}>
            <View style={styles.modeDot} />
            <Text style={styles.modeChipText}>{mock.mode} MODE</Text>
          </View>
        </View>

        {/* Atomuhr als breite Premium-Fläche */}
        <View style={styles.clockCard}>
          <AtomClock
            journeyStartIso={mock.atomClock.journeyStartIso}
            daysDisciplined={mock.atomClock.daysDisciplined}
            daysWasted={mock.atomClock.daysWasted}
          />
        </View>

        {/* Karten-Register (v60-Dashboard) */}
        <View style={styles.grid}>
          <PremiumCard
            icon={<LayoutGrid size={ICON_SIZE} color={theme.colors.accent} />}
            title="Übersicht"
            stat={mock.cards.uebersicht.stat}
            sub={mock.cards.uebersicht.sub}
            glowColor={theme.colors.accent}
          />
          <PremiumCard
            icon={<CalendarClock size={ICON_SIZE} color={theme.colors.accentCalm} />}
            title="Dein Tag"
            stat={mock.cards.deinTag.stat}
            sub={mock.cards.deinTag.sub}
            glowColor={theme.colors.accentCalm}
          />
          <PremiumCard
            icon={<Activity size={ICON_SIZE} color={theme.colors.accentAlt} />}
            title="Dein Körper"
            stat={mock.cards.deinKoerper.stat}
            sub={mock.cards.deinKoerper.sub}
            glowColor={theme.colors.accentAlt}
          />
          <PremiumCard
            icon={<Wrench size={ICON_SIZE} color={theme.colors.textMuted} />}
            title="Werkzeuge"
            stat={mock.cards.werkzeuge.stat}
            sub={mock.cards.werkzeuge.sub}
            glowColor={theme.colors.textMuted}
          />
        </View>

        <Text style={styles.footerNote}>UI-PROTOTYP · MOCK-DATEN · WARTET AUF VISUELLE FREIGABE</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headTitle: {
    fontFamily: theme.typography.sansBold,
    fontSize: 22,
    color: theme.colors.text,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radii.chip,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  modeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent,
    boxShadow: `0px 0px 8px ${theme.colors.accent}`,
  },
  modeChipText: {
    fontFamily: theme.typography.sansMedium,
    fontSize: 10,
    letterSpacing: 1.6,
    color: theme.colors.text,
  },
  clockCard: {
    borderRadius: theme.radii.card,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    boxShadow: theme.neomorph.raised,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  footerNote: {
    fontFamily: theme.typography.sans,
    fontSize: 8.5,
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});
