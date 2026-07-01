// ── timeline.js ────────────────────────────────────────────────────────────
// Zeitfenster-Mathematik (Mahlzeiten-Takt & Uhrzeit-Offsets).
// Reine Funktionen – kein DOM, kein globaler State.

// "HH:MM" → Minuten seit Mitternacht
function _hm(s){ const p=(s||'').split(':'); return (+p[0])*60 + (+p[1]||0); }
// Minuten → "HH:MM" (auf den Tag normalisiert)
function _fhm(min){ min=((Math.round(min)%1440)+1440)%1440; return String(Math.floor(min/60)).padStart(2,'0')+':'+String(min%60).padStart(2,'0'); }

// MAHLZEITEN: Vorschläge richten sich nach Aufwach-/Schlafzeit
export function suggestMeals(count, wakeStr, sleepStr) {
    const wakeMin = _hm(wakeStr || '07:00');
    let awake = (_hm(sleepStr || '23:00') - wakeMin + 1440) % 1440;
    if (awake < 240) awake = 240;
    const first = 60, last = awake - 120, span = Math.max(last - first, 60);
    const out = [];
    for (let i = 0; i < count; i++) out.push(_fhm(wakeMin + (count === 1 ? first : first + span * i / (count - 1))));
    return out;
}

// TRAININGSZEIT: sinnvoller Vorschlag im Wachfenster – im letzten Drittel des
// Tages, aber mindestens 3 h vor dem Schlafen (Tiefschlaf/Koffein-Schutz).
export function suggestTrainTime(wakeStr, sleepStr) {
    const wakeMin = _hm(wakeStr || '07:00');
    let awake = (_hm(sleepStr || '23:00') - wakeMin + 1440) % 1440;
    if (awake < 180) awake = 180;
    let off = Math.round(awake * 0.65);
    const latest = awake - 180;                 // spätestens 3 h vor dem Schlafen
    if (off > latest) off = Math.max(60, latest);
    return _fhm(wakeMin + off);
}

// HILFSFUNKTION: Rechnet "HH:MM" + Minuten-Offset in ein neues Zeitfenster "HH:MM – HH:MM" um
export function calculateTimeWindow(baseTimeStr, offsetMinutes, durationMinutes, isRelativeTosleep = false) {
    const parts = baseTimeStr.split(':');
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);

    let startTotalMinutes;
    if (isRelativeTosleep) {
        // Berechne rückwarts von der Schlafzeit
        startTotalMinutes = hours * 60 + minutes - offsetMinutes;
        // Korrigiere wenn negative Minuten
        while (startTotalMinutes < 0) {
            startTotalMinutes += 24 * 60;
        }
    } else {
        // Berechne vorwaerts von der Aufwachzeit
        startTotalMinutes = hours * 60 + minutes + offsetMinutes;
    }

    let startHours = Math.floor(startTotalMinutes / 60) % 24;
    let startMins = startTotalMinutes % 60;

    // Endzeit berechnen
    let endTotalMinutes = startTotalMinutes + durationMinutes;
    let endHours = Math.floor(endTotalMinutes / 60) % 24;
    let endMins = endTotalMinutes % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(startHours)}:${pad(startMins)} – ${pad(endHours)}:${pad(endMins)}`;
}

// HILFSFUNKTION: Rechnet nur eine einzige Uhrzeit aus (fuer die Proteindosen-Liste)
export function calculateSingleTime(baseTimeStr, offsetMinutes, isRelativeTosleep = false) {
    const parts = baseTimeStr.split(':');
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);

    let totalMinutes;
    if (isRelativeTosleep) {
        // Berechne rückwarts von der Schlafzeit
        totalMinutes = hours * 60 + minutes - offsetMinutes;
        // Korrigiere wenn negative Minuten
        while (totalMinutes < 0) {
            totalMinutes += 24 * 60;
        }
    } else {
        // Berechne vorwaerts von der Aufwachzeit
        totalMinutes = hours * 60 + minutes + offsetMinutes;
    }

    let finalHours = Math.floor(totalMinutes / 60) % 24;
    let finalMins = totalMinutes % 60;

    return `${String(finalHours).padStart(2, '0')}:${String(finalMins).padStart(2, '0')}`;
}
