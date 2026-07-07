// ── VΛAΛV Atomuhr ───────────────────────────────────────────────────────────
// Der unbestechliche Zähler auf der Startseite (Master-Handoff, TODO 9):
// visualisiert sekundengenau die Lebenszeit-Bilanz –
// „Tage durchgezogen" vs. „Tage verschwendet".
// Prototyp mit Mock-Startdatum; die echte Bilanz kommt später 1:1 aus der
// Fortschritts-Logik der v60/v61-Blaupause.

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';

interface Props {
  journeyStartIso: string;
  daysDisciplined: number;
  daysWasted: number;
}

function elapsed(fromIso: string): string {
  const ms = Math.max(0, Date.now() - new Date(fromIso).getTime());
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hh = String(Math.floor((s % 86400) / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${days}d ${hh}:${mm}:${ss}`;
}

export function AtomClock({ journeyStartIso, daysDisciplined, daysWasted }: Props) {
  const [clock, setClock] = useState(() => elapsed(journeyStartIso));

  useEffect(() => {
    const t = setInterval(() => setClock(elapsed(journeyStartIso)), 1000);
    return () => clearInterval(t);
  }, [journeyStartIso]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>VΛAΛV ATOMUHR</Text>
      <Text style={styles.clock}>{clock}</Text>
      <View style={styles.split}>
        <View style={styles.cell}>
          <Text style={[styles.num, { color: theme.colors.ready }]}>{daysDisciplined}</Text>
          <Text style={styles.cellLabel}>TAGE DURCHGEZOGEN</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.cell}>
          <Text style={[styles.num, { color: theme.colors.danger }]}>{daysWasted}</Text>
          <Text style={styles.cellLabel}>TAGE VERSCHWENDET</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  label: {
    fontFamily: theme.typography.sansMedium,
    fontSize: 10,
    letterSpacing: 2.4,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  clock: {
    fontFamily: theme.typography.mono,
    fontSize: 30,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontVariant: ['tabular-nums'],
  },
  split: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  num: {
    fontFamily: theme.typography.mono,
    fontSize: 22,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  cellLabel: {
    fontFamily: theme.typography.sans,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
});
