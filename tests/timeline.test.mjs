import { test } from 'node:test';
import assert from 'node:assert/strict';
import { suggestMeals, calculateTimeWindow, calculateSingleTime } from '../js/modules/timeline.js';

test('4 Mahlzeiten zwischen 06:00 und 22:00', () => {
    assert.deepEqual(suggestMeals(4, '06:00', '22:00'), ['07:00', '11:20', '15:40', '20:00']);
});

test('erste Mahlzeit = Aufwachen + 60 min, letzte = Schlafen − 120 min', () => {
    const m = suggestMeals(3, '07:00', '23:00');
    assert.equal(m[0], '08:00');             // 07:00 + 60
    assert.equal(m[m.length - 1], '21:00');  // 23:00 − 120
});

test('eine einzelne Mahlzeit liegt 60 min nach dem Aufwachen', () => {
    assert.deepEqual(suggestMeals(1, '07:00', '23:00'), ['08:00']);
});

test('sehr kurzes Wachfenster wird auf min. 4h hochgesetzt', () => {
    // awake < 240 → awake = 240; first=60, last=120
    const m = suggestMeals(2, '07:00', '09:00');
    assert.equal(m[0], '08:00'); // 07:00 + 60
    assert.equal(m[1], '09:00'); // 07:00 + 120
});

test('Standardwerte greifen bei leeren Zeiten', () => {
    assert.deepEqual(suggestMeals(4, '', ''), suggestMeals(4, '07:00', '23:00'));
});

test('calculateTimeWindow rechnet vorwärts von der Basiszeit', () => {
    assert.equal(calculateTimeWindow('07:00', 30, 60), '07:30 – 08:30');
});

test('calculateTimeWindow rechnet rückwärts von der Schlafzeit', () => {
    assert.equal(calculateTimeWindow('23:00', 60, 30, true), '22:00 – 22:30');
});

test('calculateSingleTime rückwärts über Mitternacht bleibt gültig', () => {
    assert.equal(calculateSingleTime('00:30', 60, true), '23:30');
});
