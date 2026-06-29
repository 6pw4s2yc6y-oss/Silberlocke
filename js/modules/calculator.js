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
    const tdee = Math.round(maintenance * (GOAL_KCAL[goal] || 1));
    // Eiweiß: Aktivitätsbasis, im Defizit/Aufbau höher
    let pf = PROTEIN_GKG[act] || [1.4, 1.7];
    if (goal === 'abnehmen') pf = [Math.max(pf[0], 2.0), Math.max(pf[1], 2.4)];
    else if (goal === 'aufbauen') pf = [Math.max(pf[0], 1.6), Math.max(pf[1], 2.2)];
    // Welche Angaben fehlen → Werte werden ungenauer
    const assumptions = [];
    if (!ACTIVITY_PAL[act])     assumptions.push('Aktivität');
    if (!GOAL_KCAL[userProfile.goal]) assumptions.push('Ziel');
    return {
        bmr: Math.round(bmr), tdee, maintenance, goal,
        proteinMin: Math.round(w * pf[0]), proteinMax: Math.round(w * pf[1]),
        gkgMin: pf[0], gkgMax: pf[1], weight: w, assumptions
    };
}
