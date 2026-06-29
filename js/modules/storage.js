// ── storage.js ─────────────────────────────────────────────────────────────
// Persistenz-Schicht der App. Kapselt den Zugriff hinter eine kleine API
// (store.getItem / setItem / removeItem), damit das Backend austauschbar ist.
//
// Stufe 3b: Backend = IndexedDB (lokal vendored idb-keyval), gespiegelt in einen
// synchronen In-Memory-Cache. Dadurch bleiben alle (synchronen) Aufrufstellen
// unverändert – gelesen wird aus dem Cache, geschrieben wird zusätzlich async
// nach IndexedDB. localStorage wird beim ersten Start einmalig nach IndexedDB
// migriert und danach nur noch als durables Fallback gespiegelt (z. B. wenn
// IndexedDB im privaten Modus nicht verfügbar ist).

import { get, set, del, entries } from '../vendor/idb-keyval.js';

const PREFIX = 'sl_';
const cache = Object.create(null);
let loaded = false;
let useIdb = true;   // wird auf false gesetzt, falls IndexedDB nicht nutzbar ist

// Alle App-Keys aus localStorage in den Cache spiegeln (Fallback-Pfad).
function loadFromLocalStorage() {
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(PREFIX) && !(k in cache)) cache[k] = localStorage.getItem(k);
        }
    } catch (e) { /* localStorage nicht verfügbar */ }
}

// Einmalig den Cache füllen: IndexedDB laden + localStorage→IndexedDB migrieren.
export async function initStorage() {
    if (loaded) return;
    try {
        const all = await entries();
        for (const [k, v] of all) {
            if (typeof k === 'string' && k.startsWith(PREFIX)) cache[k] = v;
        }
        // Einmalige Migration: bestehende localStorage-Keys, die noch nicht in
        // IndexedDB liegen, übernehmen.
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith(PREFIX) && !(k in cache)) {
                    const v = localStorage.getItem(k);
                    cache[k] = v;
                    set(k, v).catch(() => {});
                }
            }
        } catch (e) { /* localStorage nicht verfügbar – nicht kritisch */ }
    } catch (e) {
        // IndexedDB nicht nutzbar → auf localStorage zurückfallen.
        useIdb = false;
        loadFromLocalStorage();
    }
    loaded = true;
}

export const store = {
    // Synchron aus dem Cache lesen (verhält sich wie localStorage.getItem).
    getItem(key) {
        if (!loaded) loadFromLocalStorage();   // Notfall, falls vor init gelesen wird
        return key in cache ? cache[key] : null;
    },
    // Cache sofort aktualisieren, async nach IndexedDB schreiben und als
    // durables Fallback zusätzlich nach localStorage spiegeln.
    setItem(key, val) {
        const s = String(val);
        cache[key] = s;
        if (useIdb) { try { set(key, s).catch(() => {}); } catch (e) {} }
        try { localStorage.setItem(key, s); } catch (e) {}
    },
    removeItem(key) {
        delete cache[key];
        if (useIdb) { try { del(key).catch(() => {}); } catch (e) {} }
        try { localStorage.removeItem(key); } catch (e) {}
    },
};
