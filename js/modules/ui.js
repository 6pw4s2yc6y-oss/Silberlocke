// ── ui.js ──────────────────────────────────────────────────────────────────
// Präsentation/Render-Bausteine. Erzeugt HTML aus reiner Logik (calculator).

import { computeTargets, GOAL_LABEL } from './calculator.js';

// Baut die Bedarfs-Box (kcal & Eiweiß). forApp=true → kompakte Variante in der App.
export function buildTargetsHtml(userProfile, forApp) {
    const t = computeTargets(userProfile);
    if (!t) {
        return forApp ? '' : `<div class="targets-hint">Trage Alter, Größe, Gewicht & Geschlecht ein – dann berechne ich deinen Bedarf.</div>`;
    }
    const goalLbl = GOAL_LABEL[t.goal] || GOAL_LABEL.halten;
    const goalBadge = t.goal && t.goal !== 'halten'
        ? `<div class="targets-goal">🎯 ${goalLbl} <span style="color:#64748b;">(Erhalt: ${t.maintenance.toLocaleString('de-DE')} kcal)</span></div>`
        : `<div class="targets-goal">🎯 ${goalLbl}</div>`;
    const accuracy = t.assumptions.length === 0
        ? `<div class="targets-accuracy ok">✓ Genau berechnet – alle Angaben vorhanden.</div>`
        : `<div class="targets-accuracy warn">⚠️ Geschätzt: ${t.assumptions.join(' & ')} fehlt – die Werte werden mit jedem übersprungenen Schritt ungenauer.</div>`;
    return `<div class="targets-box">
                <div class="targets-title">📊 Dein täglicher Bedarf</div>
                <div class="targets-grid">
                    <div class="targets-cell">
                        <div class="targets-val" style="color:#a5b4fc;">${t.tdee.toLocaleString('de-DE')}</div>
                        <div class="targets-lbl">kcal / Tag</div>
                    </div>
                    <div class="targets-cell">
                        <div class="targets-val" style="color:#4ade80;">${t.proteinMin}–${t.proteinMax} g</div>
                        <div class="targets-lbl">Eiweiß / Tag</div>
                    </div>
                </div>
                ${goalBadge}
                ${accuracy}
                <div class="targets-formula">Kalorien: Mifflin-St-Jeor × Aktivität × Ziel (BMR ${t.bmr} kcal) · Eiweiß: ${String(t.gkgMin).replace('.', ',')}–${String(t.gkgMax).replace('.', ',')} g/kg KG (Morton et al. 2018 / ISSN 2017). Richtwerte – kein medizinischer Rat.</div>
            </div>`;
}
