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

// ── sport_data / body_zones (Grundstruktur) ─────────────────────────────────
if (!sport || typeof sport !== 'object' || Array.isArray(sport)) fail('sport_data.json: muss ein Objekt sein');
if (!body || typeof body !== 'object' || Array.isArray(body)) fail('body_zones.json: muss ein Objekt sein');

// ── Ergebnis ────────────────────────────────────────────────────────────────
if (errors.length) {
    console.error(`❌ Daten-Validierung fehlgeschlagen (${errors.length}):`);
    errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
}
console.log(`✅ Daten gültig: ${products.length} Produkte, ${timeline.length} Timeline-Blöcke, ${nutr.length} Nährstoffe, ${Object.keys(sport).length} Sportpläne, ${Object.keys(body).length} Körperzonen.`);
