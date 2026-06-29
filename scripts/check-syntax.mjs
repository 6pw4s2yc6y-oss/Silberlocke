// Prüft alle App-JS-Dateien auf Syntaxfehler (node --check), ohne sie auszuführen.
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir) {
    const out = [];
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) out.push(...walk(p));
        else if (name.endsWith('.js')) out.push(p);
    }
    return out;
}

const files = walk(join(root, 'js'));
let failed = 0;
for (const f of files) {
    try {
        execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
        console.log('  ok  ' + relative(root, f));
    } catch (e) {
        failed++;
        console.error('FAIL  ' + relative(root, f));
        console.error(String(e.stderr || e.message));
    }
}
if (failed) { console.error(`\n❌ ${failed} Datei(en) mit Syntaxfehlern.`); process.exit(1); }
console.log(`\n✅ ${files.length} JS-Dateien syntaktisch ok.`);
