// ── storage.js ─────────────────────────────────────────────────────────────
// Persistenz-Schicht der App. Kapselt den Zugriff hinter eine kleine API
// (store.getItem / setItem / removeItem), damit das Backend austauschbar ist.
//
// Stufe 3a: Backend = localStorage, gespiegelt in einen synchronen In-Memory-Cache.
// Dadurch bleiben alle (synchronen) Aufrufstellen unverändert. In Stufe 3b wird
// nur das Backend gegen IndexedDB getauscht – die API hier bleibt identisch.

const PREFIX = 'sl_';
const cache = Object.create(null);
let loaded = false;

// Einmalig alle App-Keys (sl_*) aus localStorage in den Cache laden.
export function initStorage() {
    if (loaded) return;
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(PREFIX)) cache[k] = localStorage.getItem(k);
        }
    } catch (e) { /* localStorage nicht verfügbar → Cache bleibt leer */ }
    loaded = true;
}

export const store = {
    // Synchron aus dem Cache lesen (verhält sich wie localStorage.getItem).
    getItem(key) {
        if (!loaded) initStorage();
        return key in cache ? cache[key] : null;
    },
    // Cache aktualisieren und durchschreiben.
    setItem(key, val) {
        const s = String(val);
        cache[key] = s;
        try { localStorage.setItem(key, s); } catch (e) {}
    },
    removeItem(key) {
        delete cache[key];
        try { localStorage.removeItem(key); } catch (e) {}
    },
};
