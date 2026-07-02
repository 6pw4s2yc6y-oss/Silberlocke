// ── calculator.js ──────────────────────────────────────────────────────────
// Bedarfsberechnung (kcal & Eiweiß). Reine Logik – kein DOM, kein globaler State.
// BMR: Mifflin-St Jeor (1990) · TDEE = BMR × PAL · Eiweiß: Morton et al. 2018 / ISSN 2017

export const ACTIVITY_PAL = { wenig: 1.2, maessig: 1.375, aktiv: 1.55, sehr: 1.725 };
export const PROTEIN_GKG   = { wenig: [1.0, 1.2], maessig: [1.4, 1.7], aktiv: [1.6, 2.0], sehr: [1.8, 2.2] };
// Ziel-Modus: kcal-Faktor auf den Erhaltungsbedarf (TDEE)
export const GOAL_KCAL   = { abnehmen: 0.80, halten: 1.0, performance: 1.05, aufbauen: 1.15 };
export const GOAL_LABEL  = { abnehmen: 'Abnehmen · Defizit −20 %', halten: 'Halten · Erhaltungsniveau', performance: 'Performance · +5 %', aufbauen: 'Aufbauen · Überschuss +15 %' };

export function computeTargets(userProfile) {
    const num = v => parseFloat(String(v || '').replace(',', '.'));
    const age = num(userProfile.age), h = num(userProfile.height), w = num(userProfile.weight);
    const g = userProfile.gender, act = userProfile.activity;
    if (!age || !h || !w || !g) return null;
    // Mifflin-St Jeor BMR
    let bmr = 10 * w + 6.25 * h - 5 * age;
    bmr += (g === 'w') ? -161 : (g === 'd' ? -78 : 5);   // divers = Mittelwert
    const pal = ACTIVITY_PAL[act] || 1.375;
    const maintenance = Math.round(bmr * pal);
    const goal = userProfile.goal || 'halten';
    // Audit-Korrektur (kcal/Tag) aus dem Thermodynamik-Audit, begrenzt auf ±500.
    const rawAdj = num(userProfile.auditAdj);
    const auditAdj = Math.max(-500, Math.min(500, isFinite(rawAdj) ? Math.round(rawAdj) : 0));
    const tdee = Math.round(maintenance * (GOAL_KCAL[goal] || 1)) + auditAdj;
    // Eiweiß: Aktivitätsbasis, im Defizit/Aufbau höher
    let pf = PROTEIN_GKG[act] || [1.4, 1.7];
    if (goal === 'abnehmen') pf = [Math.max(pf[0], 2.0), Math.max(pf[1], 2.4)];
    else if (goal === 'aufbauen') pf = [Math.max(pf[0], 1.6), Math.max(pf[1], 2.2)];
    // Welche Angaben fehlen → Werte werden ungenauer
    const assumptions = [];
    if (!ACTIVITY_PAL[act])     assumptions.push('Aktivität');
    if (!GOAL_KCAL[userProfile.goal]) assumptions.push('Ziel');
    return {
        bmr: Math.round(bmr), tdee, maintenance, goal, auditAdj,
        proteinMin: Math.round(w * pf[0]), proteinMax: Math.round(w * pf[1]),
        gkgMin: pf[0], gkgMax: pf[1], weight: w, assumptions
    };
}

// ── THERMODYNAMIK-AUDIT ──────────────────────────────────────────────────────
// Vergleicht die reale Gewichtskurve mit der kalkulierten Energiebilanz.
// entries: [{ date: 'YYYY-MM-DD', kg: Number }] · targets: computeTargets-Ergebnis.
// Rückgabe-Status: insufficient (zu wenige Daten) · ok (Kurve passt) ·
// over (mehr Energie als kalkuliert) · under (weniger) · extreme (> 1,5 kg/Woche).
export const KCAL_PER_KG = 7700;   // ≈ Energiegehalt von 1 kg Körperfett
export function thermoAudit(entries, targets) {
    if (!targets || !Array.isArray(entries)) return { status: 'insufficient' };
    const es = [...entries]
        .filter(e => e && e.date && isFinite(e.kg))
        .sort((a, b) => a.date.localeCompare(b.date));
    if (es.length < 2) return { status: 'insufficient' };
    const first = es[0], last = es[es.length - 1];
    const days = Math.round((new Date(last.date) - new Date(first.date)) / 864e5);
    if (days < 5) return { status: 'insufficient' };
    const ratePerWeek = (last.kg - first.kg) / days * 7;
    // Erwartete Rate aus der geplanten Bilanz (Ziel-kcal vs. Erhaltung)
    const expectedPerWeek = (targets.tdee - targets.maintenance) * 7 / KCAL_PER_KG;
    const diff = ratePerWeek - expectedPerWeek;
    let status = 'ok';
    if (Math.abs(ratePerWeek) > 1.5) status = 'extreme';
    else if (diff > 0.35) status = 'over';
    else if (diff < -0.35) status = 'under';
    // Vorschlag: Differenz in kcal/Tag (auf 50er gerundet, max ±400 pro Übernahme)
    const suggestedAdj = (status === 'over' || status === 'under')
        ? Math.max(-400, Math.min(400, -Math.round(diff * KCAL_PER_KG / 7 / 50) * 50))
        : 0;
    return { status, ratePerWeek, expectedPerWeek, diff, suggestedAdj, days, deltaKg: last.kg - first.kg };
}
