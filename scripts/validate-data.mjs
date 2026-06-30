// Validiert die data/*.json-Dateien strukturell – ohne externe Abhängigkeit.
// Bricht mit Exit-Code 1 ab, wenn etwas nicht stimmt (für CI).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (msg) => errors.push(msg);

function load(name) {
    try { return JSON.parse(readFileSync(join(root, 'data', name), 'utf8')); }
    catch (e) { fail(`${name}: ungültiges JSON – ${e.message}`); return null; }
}

const products = load('products.json');
const timeline = load('timeline_config.json');
const sport = load('sport_data.json');
const body = load('body_zones.json');
const nutr = load('nutr_data.json');
const blood = load('bloodmarkers.json');
const monitoring = load('monitoring.json');

// ── products ────────────────────────────────────────────────────────────────
const productIds = new Set();
if (!Array.isArray(products)) fail('products.json: muss ein Array sein');
else products.forEach((p, i) => {
    const at = `products[${i}]`;
    ['id', 'cat', 'name', 'icon', 'serving'].forEach(k => {
        if (typeof p[k] !== 'string' || !p[k]) fail(`${at}: "${k}" fehlt oder ist kein String`);
    });
    ['protein', 'carbs', 'fat', 'kcal'].forEach(k => {
        if (typeof p[k] !== 'number' || Number.isNaN(p[k])) fail(`${at} (${p.id}): "${k}" ist keine Zahl`);
    });
    if (p.id) {
        if (productIds.has(p.id)) fail(`${at}: doppelte id "${p.id}"`);
        productIds.add(p.id);
    }
});

// ── timeline_config ─────────────────────────────────────────────────────────
if (!Array.isArray(timeline)) fail('timeline_config.json: muss ein Array sein');
else timeline.forEach((b, i) => {
    const at = `timeline_config[${i}]`;
    if (!Array.isArray(b.productIds)) fail(`${at}: "productIds" fehlt/kein Array`);
    else b.productIds.forEach(pid => {
        if (!productIds.has(pid)) fail(`${at}: productId "${pid}" existiert nicht in products.json`);
    });
});

// ── nutr_data ───────────────────────────────────────────────────────────────
const nutrIds = new Set();
if (!Array.isArray(nutr)) fail('nutr_data.json: muss ein Array sein');
else nutr.forEach((n, i) => {
    const at = `nutr_data[${i}]`;
    ['id', 'name', 'cat'].forEach(k => {
        if (typeof n[k] !== 'string' || !n[k]) fail(`${at}: "${k}" fehlt oder ist kein String`);
    });
    if (n.id) {
        if (nutrIds.has(n.id)) fail(`${at}: doppelte id "${n.id}"`);
        nutrIds.add(n.id);
    }
});

// ── sport_data ──────────────────────────────────────────────────────────────
if (!sport || typeof sport !== 'object' || Array.isArray(sport)) {
    fail('sport_data.json: muss ein Objekt sein');
} else {
    // Jede Sportart-Gruppe muss ihre drei Pläne in den Daten haben (sonst leere Auswahl)
    const SPORTTYPE_PLANS = {
        kraft:    ['maxkraft', 'hyper', 'kausd'],
        ausdauer: ['gla', 'intervall', 'wettkampf'],
        kampf:    ['explosiv', 'kondition', 'technik'],
        mix:      ['hybrid', 'functional', 'ganzkoerper'],
    };
    for (const [type, modes] of Object.entries(SPORTTYPE_PLANS)) {
        modes.forEach(m => { if (!sport[m]) fail(`sport_data.json: Plan "${m}" (Sportart ${type}) fehlt`); });
    }
    for (const [key, plan] of Object.entries(sport)) {
        const at = `sport_data.${key}`;
        ['title', 'icon', 'color', 'bg', 'border', 'desc', 'supplements', 'short'].forEach(f => {
            if (typeof plan[f] !== 'string' || !plan[f]) fail(`${at}: "${f}" fehlt oder kein String`);
        });
        if (!Array.isArray(plan.days) || plan.days.length === 0) { fail(`${at}: "days" fehlt/leer`); continue; }
        plan.days.forEach((day, di) => {
            if (typeof day.day !== 'string' || !day.day) fail(`${at}.days[${di}]: "day" fehlt`);
            if (!Array.isArray(day.exercises) || day.exercises.length === 0) { fail(`${at}.days[${di}]: "exercises" fehlt/leer`); return; }
            day.exercises.forEach((ex, ei) => {
                ['name', 'sets', 'load', 'rest', 'tip'].forEach(f => {
                    if (typeof ex[f] !== 'string' || !ex[f]) fail(`${at}.days[${di}].exercises[${ei}]: "${f}" fehlt`);
                });
            });
        });
    }
}

// ── bloodmarkers ────────────────────────────────────────────────────────────
const bloodIds = new Set();
if (!Array.isArray(blood)) fail('bloodmarkers.json: muss ein Array sein');
else blood.forEach((m, i) => {
    const at = `bloodmarkers[${i}]`;
    ['id', 'name', 'cat', 'unit', 'meaning'].forEach(k => {
        if (typeof m[k] !== 'string' || !m[k]) fail(`${at}: "${k}" fehlt oder kein String`);
    });
    if (m.id) {
        if (bloodIds.has(m.id)) fail(`${at}: doppelte id "${m.id}"`);
        bloodIds.add(m.id);
    }
    if (m.low != null && typeof m.low !== 'number') fail(`${at} (${m.id}): "low" muss Zahl oder null sein`);
    if (m.high != null && typeof m.high !== 'number') fail(`${at} (${m.id}): "high" muss Zahl oder null sein`);
    if (m.low == null && m.high == null) fail(`${at} (${m.id}): braucht mindestens "low" oder "high"`);
    if (!Array.isArray(m.nutrients)) fail(`${at} (${m.id}): "nutrients" muss ein Array sein`);
    else m.nutrients.forEach(pid => { if (!productIds.has(pid)) fail(`${at} (${m.id}): verlinktes Produkt "${pid}" existiert nicht`); });
});

// ── monitoring ──────────────────────────────────────────────────────────────
const VALID_GROUPS = new Set(['steroide', 'insulin', 'peptide']);
if (!monitoring || typeof monitoring !== 'object' || Array.isArray(monitoring)) {
    fail('monitoring.json: muss ein Objekt sein');
} else {
    if (!Array.isArray(monitoring.checklist) || monitoring.checklist.length === 0) fail('monitoring.json: "checklist" fehlt/leer');
    else monitoring.checklist.forEach((it, i) => {
        const at = `monitoring.checklist[${i}]`;
        ['id', 'label', 'interval', 'why'].forEach(k => { if (typeof it[k] !== 'string' || !it[k]) fail(`${at}: "${k}" fehlt`); });
        if (!Array.isArray(it.groups) || it.groups.length === 0) fail(`${at}: "groups" fehlt/leer`);
        else it.groups.forEach(g => { if (!VALID_GROUPS.has(g)) fail(`${at}: unbekannte Gruppe "${g}"`); });
        if (it.marker != null && !bloodIds.has(it.marker)) fail(`${at}: marker "${it.marker}" existiert nicht in bloodmarkers.json`);
    });
    if (!Array.isArray(monitoring.redflags) || monitoring.redflags.length === 0) fail('monitoring.json: "redflags" fehlt/leer');
    else monitoring.redflags.forEach((f, i) => {
        const at = `monitoring.redflags[${i}]`;
        if (typeof f.sign !== 'string' || !f.sign) fail(`${at}: "sign" fehlt`);
        if (typeof f.action !== 'string' || !f.action) fail(`${at}: "action" fehlt`);
        if (!['notfall', 'arzt'].includes(f.level)) fail(`${at}: "level" muss notfall|arzt sein`);
    });
}

// ── body_zones (Grundstruktur) ──────────────────────────────────────────────
if (!body || typeof body !== 'object' || Array.isArray(body)) fail('body_zones.json: muss ein Objekt sein');

// ── Ergebnis ────────────────────────────────────────────────────────────────
if (errors.length) {
    console.error(`❌ Daten-Validierung fehlgeschlagen (${errors.length}):`);
    errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
}
console.log(`✅ Daten gültig: ${products.length} Produkte, ${timeline.length} Timeline-Blöcke, ${nutr.length} Nährstoffe, ${Object.keys(sport).length} Sportpläne, ${Object.keys(body).length} Körperzonen, ${blood.length} Blutwerte, ${monitoring.checklist.length} Monitoring-Punkte.`);
