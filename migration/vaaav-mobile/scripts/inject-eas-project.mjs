// Injiziert die Expo-Projekt-ID (Repo-Variable EXPO_PROJECT_ID) zur Laufzeit
// der CI in app.json. So bleibt das Repository frei von Account-spezifischen
// IDs und ist ohne Änderung auf andere Expo-Accounts übertragbar.
import { readFileSync, writeFileSync } from 'node:fs';

const projectId = process.env.EXPO_PROJECT_ID;
if (!projectId) {
  console.error('EXPO_PROJECT_ID ist nicht gesetzt.');
  process.exit(1);
}

const path = new URL('../app.json', import.meta.url);
const config = JSON.parse(readFileSync(path, 'utf8'));

config.expo.extra = { ...config.expo.extra, eas: { projectId } };
config.expo.updates = { ...config.expo.updates, url: `https://u.expo.dev/${projectId}` };

writeFileSync(path, JSON.stringify(config, null, 2) + '\n');
console.log('app.json: EAS-Projekt-ID injiziert →', projectId);
