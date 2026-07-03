// ── dataFetcher.js ─────────────────────────────────────────────────────────
// Lädt die statischen Datensätze asynchron aus /data/*.json beim App-Start.
// Pfade relativ zum Modul (../../data/), damit der Origin egal ist.

// Logischer Key → Pfad (relativ zu data/). Domänen-Unterordner, damit die
// wachsende Datenmenge (Studien, Nährstoffe, Supplemente) sortiert bleibt.
const FILES = {
    products:        'supplements/products.json',
    timeline_config: 'app/timeline_config.json',
    sport_data:      'training/sport_data.json',
    body_zones:      'health/body_zones.json',
    nutr_data:       'nutrition/nutr_data.json',
    bloodmarkers:    'health/bloodmarkers.json',
    monitoring:      'health/monitoring.json',
    emergency:       'health/emergency.json',
    injuries:        'health/injuries.json',
    mental:          'health/mental.json',
    daytypes:        'app/daytypes.json',
    studies:         'studies/studies.json',
    tips:            'app/tips.json',
    quiz:            'app/quiz.json',
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
