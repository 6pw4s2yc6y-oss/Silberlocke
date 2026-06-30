// ── dataFetcher.js ─────────────────────────────────────────────────────────
// Lädt die statischen Datensätze asynchron aus /data/*.json beim App-Start.
// Pfade relativ zum Modul (../../data/), damit der Origin egal ist.

const FILES = {
    products:        'products.json',
    timeline_config: 'timeline_config.json',
    sport_data:      'sport_data.json',
    body_zones:      'body_zones.json',
    nutr_data:       'nutr_data.json',
    bloodmarkers:    'bloodmarkers.json',
    monitoring:      'monitoring.json',
    emergency:       'emergency.json',
};

async function fetchJson(file) {
    const url = new URL('../../data/' + file, import.meta.url);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Daten konnten nicht geladen werden: ' + file + ' (' + res.status + ')');
    return res.json();
}

// Lädt alle Datensätze parallel und gibt sie als Objekt zurück.
export async function loadData() {
    const keys = Object.keys(FILES);
    const values = await Promise.all(keys.map(k => fetchJson(FILES[k])));
    const out = {};
    keys.forEach((k, i) => { out[k] = values[i]; });
    return out;
}
