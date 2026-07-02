import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeTargets, thermoAudit } from '../js/modules/calculator.js';

test('männlich, 30 J, 180 cm, 80 kg, aktiv, halten → Mifflin-St-Jeor', () => {
    const t = computeTargets({ age: '30', height: '180', weight: '80', gender: 'm', activity: 'aktiv', goal: 'halten' });
    assert.equal(t.bmr, 1780);          // 10*80 + 6.25*180 - 5*30 + 5
    assert.equal(t.maintenance, 2759);  // round(1780 * 1.55)
    assert.equal(t.tdee, 2759);         // halten = ×1.0
    assert.equal(t.proteinMin, 128);    // 80 * 1.6
    assert.equal(t.proteinMax, 160);    // 80 * 2.0
    assert.deepEqual(t.assumptions, []); // alle Angaben vorhanden
});

test('weiblich nutzt −161-Offset', () => {
    const t = computeTargets({ age: '30', height: '170', weight: '65', gender: 'w', activity: 'maessig', goal: 'halten' });
    // BMR = 10*65 + 6.25*170 - 5*30 - 161 = 650 + 1062.5 - 150 - 161 = 1401.5 → round 1402
    assert.equal(t.bmr, 1402);
    assert.equal(t.maintenance, Math.round(1401.5 * 1.375)); // 1927
});

test('divers nutzt −78-Offset', () => {
    const t = computeTargets({ age: '30', height: '175', weight: '70', gender: 'd', activity: 'maessig', goal: 'halten' });
    // BMR = 10*70 + 6.25*175 - 5*30 - 78 = 700 + 1093.75 - 150 - 78 = 1565.75 → 1566
    assert.equal(t.bmr, 1566);
});

test('Ziel-Faktoren wirken auf TDEE', () => {
    const base = { age: '30', height: '180', weight: '80', gender: 'm', activity: 'aktiv' };
    const halten = computeTargets({ ...base, goal: 'halten' });
    assert.equal(computeTargets({ ...base, goal: 'abnehmen' }).tdee, Math.round(halten.maintenance * 0.80));
    assert.equal(computeTargets({ ...base, goal: 'performance' }).tdee, Math.round(halten.maintenance * 1.05));
    assert.equal(computeTargets({ ...base, goal: 'aufbauen' }).tdee, Math.round(halten.maintenance * 1.15));
});

test('Abnehmen hebt Eiweiß an (Muskelerhalt)', () => {
    const t = computeTargets({ age: '30', height: '180', weight: '80', gender: 'm', activity: 'aktiv', goal: 'abnehmen' });
    assert.equal(t.proteinMin, Math.round(80 * 2.0)); // max(1.6, 2.0)
    assert.equal(t.proteinMax, Math.round(80 * 2.4)); // max(2.0, 2.4)
});

test('fehlende Pflichtangaben → null', () => {
    assert.equal(computeTargets({ age: '', height: '180', weight: '80', gender: 'm' }), null);
    assert.equal(computeTargets({ age: '30', height: '', weight: '80', gender: 'm' }), null);
    assert.equal(computeTargets({ age: '30', height: '180', weight: '', gender: 'm' }), null);
    assert.equal(computeTargets({ age: '30', height: '180', weight: '80', gender: '' }), null);
});

test('Komma als Dezimaltrenner wird akzeptiert', () => {
    const t = computeTargets({ age: '30', height: '180', weight: '80,5', gender: 'm', activity: 'aktiv', goal: 'halten' });
    assert.ok(t && t.weight === 80.5);
});

test('fehlendes Ziel/Aktivität landet in assumptions', () => {
    const t = computeTargets({ age: '30', height: '180', weight: '80', gender: 'm' });
    assert.ok(t.assumptions.includes('Aktivität'));
    assert.ok(t.assumptions.includes('Ziel'));
});

// ── Thermodynamik-Audit ──────────────────────────────────────────────────────
const PROF = { age: '30', height: '180', weight: '80', gender: 'm', activity: 'aktiv', goal: 'halten' };

test('auditAdj verschiebt TDEE und wird auf ±500 begrenzt', () => {
    const base = computeTargets(PROF);
    assert.equal(computeTargets({ ...PROF, auditAdj: '-250' }).tdee, base.tdee - 250);
    assert.equal(computeTargets({ ...PROF, auditAdj: '-900' }).tdee, base.tdee - 500);  // Clamp
    assert.equal(computeTargets({ ...PROF, auditAdj: '900' }).tdee, base.tdee + 500);   // Clamp
    assert.equal(computeTargets({ ...PROF, auditAdj: 'quatsch' }).tdee, base.tdee);     // ungültig → 0
});

test('Audit: zu wenige Daten → insufficient', () => {
    const t = computeTargets(PROF);
    assert.equal(thermoAudit([], t).status, 'insufficient');
    assert.equal(thermoAudit([{ date: '2026-07-01', kg: 80 }], t).status, 'insufficient');
    // 2 Messungen, aber nur 3 Tage auseinander
    assert.equal(thermoAudit([{ date: '2026-07-01', kg: 80 }, { date: '2026-07-04', kg: 80.2 }], t).status, 'insufficient');
});

test('Audit: stabile Kurve bei „halten" → ok', () => {
    const t = computeTargets(PROF);
    const a = thermoAudit([{ date: '2026-06-24', kg: 80 }, { date: '2026-07-01', kg: 80.1 }], t);
    assert.equal(a.status, 'ok');
    assert.equal(a.suggestedAdj, 0);
});

test('Audit: Zunahme trotz „halten" → over mit negativem kcal-Vorschlag', () => {
    const t = computeTargets(PROF);
    const a = thermoAudit([{ date: '2026-06-24', kg: 80 }, { date: '2026-07-01', kg: 80.8 }], t);
    assert.equal(a.status, 'over');            // +0,8 kg/Woche bei Soll 0
    assert.ok(a.suggestedAdj < 0);
    assert.ok(a.suggestedAdj >= -400);          // pro Übernahme gedeckelt
    assert.ok(a.suggestedAdj % 50 === 0);       // auf 50er gerundet (−0-sicher)
});

test('Audit: Verlust schneller als kalkuliert → under mit positivem Vorschlag', () => {
    const t = computeTargets({ ...PROF, goal: 'abnehmen' });
    // Soll bei −20 %: ≈ −0,5 kg/Woche · Ist: −1,4 kg/Woche → deutlich zu schnell
    const a = thermoAudit([{ date: '2026-06-24', kg: 80 }, { date: '2026-07-01', kg: 78.6 }], t);
    assert.equal(a.status, 'under');
    assert.ok(a.suggestedAdj > 0);
});

test('Audit: > 1,5 kg/Woche → extreme (keine Auto-Korrektur)', () => {
    const t = computeTargets(PROF);
    const a = thermoAudit([{ date: '2026-06-24', kg: 80 }, { date: '2026-07-01', kg: 83 }], t);
    assert.equal(a.status, 'extreme');
    assert.equal(a.suggestedAdj, 0);
});

test('Audit: Aufbau-Ziel mit passender Zunahme → ok', () => {
    const t = computeTargets({ ...PROF, goal: 'aufbauen' });
    // Soll bei +15 %: ≈ +0,38 kg/Woche · Ist: +0,4 → passt
    const a = thermoAudit([{ date: '2026-06-24', kg: 80 }, { date: '2026-07-01', kg: 80.4 }], t);
    assert.equal(a.status, 'ok');
});
