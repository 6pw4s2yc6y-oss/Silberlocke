// ── idb-keyval (vendored, minimal) ─────────────────────────────────────────
// Schlanke Promise-API über IndexedDB im idb-keyval-Stil. Lokal eingebunden,
// damit keine externe Abhängigkeit/CDN nötig ist. API: get / set / del / entries.

function promisifyRequest(request) {
    return new Promise((resolve, reject) => {
        request.oncomplete = request.onsuccess = () => resolve(request.result);
        request.onabort = request.onerror = () => reject(request.error);
    });
}

function createStore(dbName, storeName) {
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    const dbp = promisifyRequest(request);
    return (txMode, callback) =>
        dbp.then(db => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}

let defaultStore;
function getDefaultStore() {
    if (!defaultStore) defaultStore = createStore('silberlocke', 'keyval');
    return defaultStore;
}

export function get(key, store = getDefaultStore()) {
    return store('readonly', s => promisifyRequest(s.get(key)));
}

export function set(key, value, store = getDefaultStore()) {
    return store('readwrite', s => {
        s.put(value, key);
        return promisifyRequest(s.transaction);
    });
}

export function del(key, store = getDefaultStore()) {
    return store('readwrite', s => {
        s.delete(key);
        return promisifyRequest(s.transaction);
    });
}

// Liefert [[key, value], …] für alle Einträge.
export function entries(store = getDefaultStore()) {
    return store('readonly', s => {
        if (s.getAll && s.getAllKeys) {
            return Promise.all([
                promisifyRequest(s.getAllKeys()),
                promisifyRequest(s.getAll()),
            ]).then(([keys, values]) => keys.map((k, i) => [k, values[i]]));
        }
        // Fallback über Cursor (sehr alte Browser)
        const out = [];
        return store('readonly', s2 => {
            s2.openCursor().onsuccess = function () {
                if (!this.result) return;
                out.push([this.result.key, this.result.value]);
                this.result.continue();
            };
            return promisifyRequest(s2.transaction).then(() => out);
        });
    });
}
