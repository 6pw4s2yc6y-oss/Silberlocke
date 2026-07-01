        import { suggestMeals, suggestTrainTime } from './modules/timeline.js';
        import { buildTargetsHtml } from './modules/ui.js';
        import { computeTargets } from './modules/calculator.js';
        import { loadData } from './modules/dataFetcher.js';
        import { store, initStorage } from './modules/storage.js';

        // Performance: Eingaben entprellen, damit nicht bei jedem Tastendruck neu gerendert wird.
        function debounce(fn, wait = 250) {
            let t;
            return function (...args) {
                clearTimeout(t);
                t = setTimeout(() => fn.apply(this, args), wait);
            };
        }
        // Performance: gerenderte Listen hart begrenzen (über aktuellem Datenbestand,
        // sodass aktuell nichts abgeschnitten wird, aber bei Wachstum geschützt ist).
        const RENDER_LIMIT = 100;

        let PRODUCTS = [];

        const PRODUCT_FLAVORS = {
          "p1":  "Vanilla",
          "p2":  "Cherry",
          "p8":  "White Chocolate Coconut",
          "p12": "Neutral",
          "p43": "Mango Tango",
          "p44": "Tropical Fruit"
        };

        const PRODUCT_BADGES = {
          "p15": { text: "⚠ EU Novel Food (HICA)", type: "banned"  },
          "p2":  { text: "Ausverkauft",       type: "soldout" },
          "p4":  { text: "Ausverkauft",       type: "soldout" },
          "p5":  { text: "Ausverkauft",       type: "soldout" },
          "p6":  { text: "Ausverkauft",       type: "soldout" },
          "p10": { text: "Ausverkauft",       type: "soldout" },
          "p11": { text: "Ausverkauft",       type: "soldout" },
          "p14": { text: "Ausverkauft",       type: "soldout" },
          "p25": { text: "Ausverkauft",       type: "soldout" },
          "p27": { text: "Ausverkauft",       type: "soldout" },
          "p31": { text: "Ausverkauft",       type: "soldout" },
          "p54": { text: "Ausverkauft",       type: "soldout" },
          "p55": { text: "Ausverkauft",       type: "soldout" }
        };

        // DATENSTRUKTUR FUER DIE TIMELINE (Die Uhrzeiten werden jetzt dynamisch berechnet)
        // offsetMinutes bestimmt den Abstand zur eingegebenen Aufwachzeit
        // isRelativeTosleep: true bedeutet, dass offsetMinutes VOR der Schlafzeit berechnet wird
        // Nur verfügbare Produkte – ausverkaufte (p2,p4,p5,p6,p10,p11,p14,p25,p27,p31,p54,p55) & verbotene (p15) entfernt
        let TIMELINE_CONFIG = [];

        const CRITICAL = [
          { bad:true,  text:"Mineralien-Transporter-Konflikt: Zink & Eisen teilen DMT1/SLC11A2, Calcium nutzt TRPV6-Kanäle, Magnesium TRPM6/7 – trotz unterschiedlicher Transporter hemmen sie sich gegenseitig bei gleichzeitiger Einnahme (geteilte Resorptionskapazität im Darm). Niemals gleichzeitig, mind. 2h Abstand!" },
          { bad:true,  text:"Zink-Kupfer-Antagonismus: Hochdosiertes Zink (>40 mg/Tag dauerhaft) induziert Metallothionein in Darmzellen → bindet Kupfer & verhindert Resorption → Kupfermangel (Anämie, Neutropenie!). Max. Zn:Cu-Ratio 10:1." },
          { bad:true,  text:"Anti-Nährstoffe blockieren Mineralien: Phytinsäure (Vollkorn, Getreide), Tannine (Kaffee, schwarzer/grüner Tee) und Oxalsäure (Spinat, Nüsse) bilden unlösliche Komplexe mit Zn/Fe/Mg/Ca – mind. 1–2h Abstand zwischen Mineralien und diesen Lebensmitteln!" },
          { bad:true,  text:"Eisen + Calcium/Zink/Magnesium -> NIEMALS zusammen (hemmen sich gegenseitig stark)" },
          { bad:true,  text:"Eisen NUR bei per Bluttest (Ferritin) belegtem Mangel einnehmen – sonst Ueberladungsrisiko (organschaedigend)" },
          { bad:true,  text:"Hochdosierte Antioxidantien (Vit C, OPC, R-ALA, Cherry, Antioxidant-Komplex) NICHT direkt ums Training – Trainings-ROS sind Wachstumssignale" },
          { bad:true,  text:"Koffein-Booster <6h vor dem Schlafen -> ruiniert Tiefschlaf & GH-Ausschuettung (Koffein-Halbwertszeit ~5–6h, individuell stark verschieden – nicht 16 Uhr pauschal, sondern relativ zu DEINER Schlafzeit berechnen!)" },
          { bad:true,  text:"R-ALA mit Mahlzeit -> ~40% weniger Absorption im Magen" },
          { bad:true,  text:"Vitamin-Stacking pruefen: Multi + Einzelvitamine + Antioxidant ueberlappen (Obergrenzen B6 >50mg Neuropathie / Selen >400mcg toxisch / Vit A >3000mcg teratogen beachten!)" },
          { bad:false, text:"D3 zusammen mit K2 – lenkt Calcium in Knochen statt Gefaesse (sinnvolle Kombi)" },
          { bad:false, text:"Vitamin C mit Eisen – verdoppelt Non-Haem-Eisenaufnahme (Fe³⁺ → Fe²⁺). HEALTH+ Collagen enthält bereits Acerola-Vit C – kein extra Vit C nötig!" },
          { bad:false, text:"Fettloesliche Vitamine (D3, A, E, K2, Q10, Omega-3, Nachtkerzenöl) IMMER zu fettreicher Mahlzeit – ohne Galle-Ausschuettung kaum absorbiert" },
          { bad:false, text:"Kreatin/Omega-3/D3/Beta-Alanin: Uhrzeit irrelevant – kumulativer Gewebespiegel entscheidet. Einzig Konsistenz (taeglich) zaehlt, nicht der Zeitpunkt!" },
          { bad:false, text:"Protein alle 3–4h mit mind. 2–3g Leucin pro Dosis fuer MPS-Trigger – ABER: Tagesgesamtmenge (1,6–2,2 g/kg KG) macht 80–90% des Effekts aus. Timing optimiert nur die restlichen ~10%." }
        ];

        // PROTEIN DOSES KONFIGURATION (wird ebenfalls dynamisch berechnet)
        const PROTEIN_DOSES_CONFIG = [
          { label:"Fruehstueck", offsetMinutes: 45, type:"Mahlzeit", g:"~20g" },
          { label:"Vormittag", offsetMinutes: 180, type:"Clear Whey Isolat (p3)", g:"~22g" },
          { label:"Post-Workout", offsetMinutes: 405, type:"Almost Whey + Malto (p1+p9)", g:"~18g" },
          { label:"Mittagessen", offsetMinutes: 450, type:"Mahlzeit + Kollagen (p38)", g:"~30g" },
          { label:"Abendessen", offsetMinutes: 780, type:"Mahlzeit", g:"~25g" },
          { label:"Vor Schlaf", offsetMinutes: 60, type:"Protein Pudding Casein (p7)", g:"~20g", isRelativeTosleep: true }
        ];

        const PRIO_STYLE = {
          "MUSS":     { bg:"#4a1500", color:"#fb923c" },
          "WICHTIG":  { bg:"#0a2e18", color:"#4ade80" },
          "OPTIONAL": { bg:"#1a1a2e", color:"#7c3aed" }
        };

        let CATS = [];

        let currentCatFilter = "Alle";
        let currentSearchQuery = "";
        let globalWakeTimeStr = "07:00";
        let globalSleepTimeStr = "23:00";
        let globalTrainTimeStr = "";   // "" = flexibel / kein festes Training (= erste Einheit)
        let baseTrainTimes = [];       // globaler Standard aus dem Setup (mehrere Einheiten möglich)
        let globalTrainTimes = [];     // effektiv für den aktuellen Tag – die Timeline liest das
        // globalTrainTimeStr immer als erste effektive Einheit spiegeln (Einzelzeit-Konsumenten)
        function syncTrainStr() { globalTrainTimeStr = globalTrainTimes[0] || ''; }
        function setBaseTrainTimes(arr) {
            baseTrainTimes = (arr || []).filter(Boolean);
            globalTrainTimes = [...baseTrainTimes];
            syncTrainStr();
        }
        let globalMeals = [];          // gewählte Mahlzeit-Uhrzeiten (leer = 0 oder auto)
        let mealsAuto = true;          // true = Zeiten automatisch; false = eigene Wahl (auch 0)
        let mealCount = 3;

        // ── MAHLZEITEN: Vorschläge (suggestMeals) → js/modules/timeline.js ─────────
        function renderMealInputs(times) {
            const box = document.getElementById('mealsList');
            if (!box) return;
            if (!times || times.length === 0) {
                // 0 Mahlzeiten = reiner Fastentag; keine festen Essenszeiten planen.
                box.innerHTML = `<div class="meals-empty">Keine festen Essenszeiten geplant. Für echte Fastentage nutze den Tagestyp <strong>Autophagie</strong> oder <strong>Wasserfasten</strong> – der passt den ganzen Plan an.</div>`;
                return;
            }
            box.innerHTML = times.map((t, i) => {
                // Einheitliche Benennung: 1. Mahlzeit … N. Mahlzeit
                const label = (i + 1) + '. Mahlzeit';
                return `<div class="meal-row"><span>${label}</span><input type="time" class="time-input meal-time" value="${t}"></div>`;
            }).join('');
        }
        // ── SETUP: Trainingszeit(en) – 1 bis 3 Einheiten pro Tag ────────────────────
        const MAX_TRAIN_UNITS = 3;
        let setupTrainTimes = [];      // Zeiten im Setup-Formular
        let trainManuallySet = false;  // true = Nutzer hat selbst eingegriffen (kein Auto-Vorschlag mehr)
        function setupWake()  { return document.getElementById('wakeTimeInput')?.value || '07:00'; }
        function setupSleep() { return document.getElementById('sleepTimeInput')?.value || '23:00'; }
        function isTrainFlex() { return !!document.getElementById('trainFlexInput')?.checked; }
        const _toMin = s => { const [h, m] = (s || '0:0').split(':').map(Number); return (h || 0) * 60 + (m || 0); };
        // Schlafdauer = von der Schlafenszeit (zu Bett) bis zur Aufwachzeit.
        function setupSleepHours() { return ((_toMin(setupWake()) - _toMin(setupSleep()) + 1440) % 1440) / 60; }
        // Gesundheits-Limit: unter 6 h Schlaf wird Training gesperrt (Regeneration reicht nicht).
        function sleepTooLittle() { return setupSleepHours() < 6; }

        function renderTrainTimes() {
            const box = document.getElementById('trainTimesList');
            if (!box) return;
            if (setupTrainTimes.length === 0) setupTrainTimes = [suggestTrainTime(setupWake(), setupSleep())];
            const blocked = sleepTooLittle();
            // Unter 6 h Schlaf: Training zwingend flexibel & gesperrt.
            const flexEl = document.getElementById('trainFlexInput');
            if (flexEl) { flexEl.disabled = blocked; if (blocked) flexEl.checked = true; }
            const flex = isTrainFlex();
            box.innerHTML = setupTrainTimes.map((t, i) => `
                <div class="train-time-row">
                    <span class="train-time-num">${i + 1}.</span>
                    <input type="time" class="time-input train-time" value="${t}" ${(flex || blocked) ? 'style="opacity:0.45;"' : ''} ${blocked ? 'disabled' : ''}
                           onfocus="uncheckTrainFlex()" oninput="setTrainTimeAt(${i}, this.value)" onchange="setTrainTimeAt(${i}, this.value)">
                    ${setupTrainTimes.length > 1 ? `<button type="button" class="train-remove-btn" onclick="removeTrainTime(${i})" aria-label="Einheit entfernen">✕</button>` : ''}
                </div>`).join('');
            // Knopf immer sichtbar (außer bei Maximum oder Sperre) – Klick aktiviert bei
            // Bedarf das Training (hebt „Flexibel" auf), damit er auffindbar & robust ist.
            const addBtn = document.getElementById('trainAddBtn');
            if (addBtn) addBtn.style.display = (blocked || setupTrainTimes.length >= MAX_TRAIN_UNITS) ? 'none' : '';
        }
        // Warnbanner zur Schlafdauer (Ziel 6–9 h) unter den Zeitfeldern.
        function updateSleepWarn() {
            const warn = document.getElementById('sleepWarn');
            if (!warn) return;
            const hrs = setupSleepHours();
            if (hrs < 6) {
                warn.style.display = 'block';
                warn.className = 'setup-warn danger';
                warn.innerHTML = `🚫 <strong>Nur ${hrs.toFixed(1)} h Schlaf:</strong> Training gesperrt. Unter 6 h reicht die Regeneration nicht – erst ausschlafen (Ziel 6–9 h).`;
            } else if (hrs > 9) {
                warn.style.display = 'block';
                warn.className = 'setup-warn note';
                warn.innerHTML = `😴 <strong>${hrs.toFixed(1)} h Schlaf:</strong> viel – achte eher auf Schlafqualität (Ziel 6–9 h).`;
            } else {
                warn.style.display = 'none';
            }
        }
        function setTrainTimeAt(i, val) { trainManuallySet = true; setupTrainTimes[i] = val; }
        function addTrainTime() {
            if (setupTrainTimes.length >= MAX_TRAIN_UNITS) return;
            trainManuallySet = true;
            if (document.getElementById('trainFlexInput')) document.getElementById('trainFlexInput').checked = false;
            // Vorschlag für die nächste Einheit: 3 h nach der letzten (im Wachfenster)
            const last = setupTrainTimes[setupTrainTimes.length - 1] || suggestTrainTime(setupWake(), setupSleep());
            const [lh, lm] = last.split(':').map(Number);
            const next = String((lh + 3) % 24).padStart(2, '0') + ':' + String(lm).padStart(2, '0');
            setupTrainTimes.push(next);
            renderTrainTimes();
        }
        function removeTrainTime(i) {
            trainManuallySet = true;
            setupTrainTimes.splice(i, 1);
            if (setupTrainTimes.length === 0) setupTrainTimes = [suggestTrainTime(setupWake(), setupSleep())];
            renderTrainTimes();
        }
        function uncheckTrainFlex() {
            const f = document.getElementById('trainFlexInput');
            if (f && f.checked) { f.checked = false; renderTrainTimes(); }
        }
        function toggleTrainFlex() { renderTrainTimes(); }
        // Auto-Vorschlag für die erste Einheit, solange der Nutzer nichts geändert hat.
        function refreshTrainSuggestion() {
            if (trainManuallySet) return;
            setupTrainTimes = [suggestTrainTime(setupWake(), setupSleep())];
            renderTrainTimes();
        }
        // Aufwach-/Schlafzeit geändert → Trainings- und Mahlzeit-Vorschläge neu
        // verbinden (feuert auch bei `change`, damit Mobile-Zeitpicker greifen).
        function onSetupTimesChanged() {
            refreshTrainSuggestion();
            renderTrainTimes();       // Sperre/Flex-Zustand immer neu anwenden (auch bei manuellen Zeiten)
            refreshMealSuggestions();
            updateSleepWarn();
        }
        function setMealCount(n) {
            mealCount = n;
            const sl = document.getElementById('mealCountSlider'); if (sl) sl.value = n;
            const v = document.getElementById('mealCountVal'); if (v) v.textContent = n;
            renderMealInputs(suggestMeals(n,
                document.getElementById('wakeTimeInput').value || '07:00',
                document.getElementById('sleepTimeInput').value || '23:00'));
        }
        function toggleMealAuto() {
            const auto = document.getElementById('mealAutoInput').checked;
            document.getElementById('mealsCustom').style.display = auto ? 'none' : 'block';
            if (!auto && !document.querySelector('#mealsList .meal-time')) setMealCount(mealCount);
        }
        function refreshMealSuggestions() {
            if (!document.getElementById('mealAutoInput').checked) setMealCount(mealCount);
        }

        const getProductById = (id) => PRODUCTS.find(p => p.id === id);

        // HILFSFUNKTIONEN: calculateTimeWindow / calculateSingleTime → js/modules/timeline.js

        // APP INITIALISIEREN NACH KLICK AUF GENERIEREN
        function startApp() {
            const wakeInput = document.getElementById("wakeTimeInput").value;
            const sleepInput = document.getElementById("sleepTimeInput").value;

            if(!wakeInput || !sleepInput) {
                alert("Bitte beide Zeiten eingeben!");
                return;
            }

            globalWakeTimeStr = wakeInput;
            globalSleepTimeStr = sleepInput;

            // Trainingszeit(en) – leer/flexibel = keine feste Einheit; sonst 1–3 Einheiten
            const flex = document.getElementById("trainFlexInput").checked;
            const trainTimes = flex ? [] :
                Array.from(document.querySelectorAll('#trainTimesList .train-time'))
                    .map(i => i.value).filter(Boolean)
                    .sort();
            setBaseTrainTimes(trainTimes);

            // Feste Trainingszeit im Onboarding gesetzt → heute ist ein Trainingstag
            // (sonst würde der Wochenplan-Standard evtl. „Trainingsfrei" zeigen und
            // die Eingabe ignorieren). So spiegelt der Plan sofort die Abfrage.
            if (inOnboarding && baseTrainTimes.length > 0) {
                const wk = loadWeek();
                if (wk[todayIdx()]) { wk[todayIdx()].train = true; saveWeek(); }
            }

            // Mahlzeiten: auto = an Schlafrhythmus; sonst eigene Zeiten (0 = keine).
            mealsAuto = document.getElementById("mealAutoInput").checked;
            globalMeals = mealsAuto ? [] :
                Array.from(document.querySelectorAll('#mealsList .meal-time')).map(i => i.value).filter(Boolean);

            // Zeiten lokal im Browser merken (kein Login/Backend nötig)
            try {
                store.setItem("sl_wake", wakeInput);
                store.setItem("sl_sleep", sleepInput);
                store.setItem("sl_train", baseTrainTimes.join(','));
                store.setItem("sl_meals", JSON.stringify({ auto: mealsAuto, times: globalMeals }));
            } catch (e) {}

            // Display im Header aktualisieren
            document.getElementById("displayWakeTime").innerText = wakeInput;
            document.getElementById("displaySleepTime").innerText = sleepInput;

            // Schritt 1 abgeschlossen → weiter im Assistenten, oder (bei Schnell-Edit) direkt zurück in die App
            if (inOnboarding) nextStep();   // weiter im (mode-abhängigen) Flow
            else enterApp();
        }

        // ── ONBOARDING-ASSISTENT (6 Schritte) ──────────────────────────────────────
        let appMode = 'light';   // Default = Light Mode (für die breite Masse)
        // Drei Stufen: Light (Masse) · Hard (ambitioniert) · Expert (volle Kontrolle).
        // MODE_TOOLS = welche Bereiche im Werkzeuge-Menü erscheinen (Tagesplan ist immer da).
        const MODE_TOOLS = {
            light:  [],
            hard:   ['tabWeek', 'tabStack', 'tabDatabase', 'tabFood', 'tabBody', 'tabSport', 'tabMoney', 'tabRecovery'],
            expert: ['tabWeek', 'tabStack', 'tabDatabase', 'tabFood', 'tabBody', 'tabSport', 'tabMoney', 'tabRecovery', 'tabBlood', 'tabMonitor'],
        };
        const MODE_DAYTYPES = {
            light:  ['training', 'rest'],
            hard:   ['training', 'rest', 'recovery', 'carb', 'keto'],
            expert: ['training', 'rest', 'recovery', 'carb', 'keto', 'autophagy', 'water'],
        };
        let inOnboarding = true;
        let currentStep = 1;
        // Modus-zuerst & adaptiv: Light fragt nur die Uhrzeiten, Hard/Expert das volle Onboarding.
        const ONBOARD_FLOW = {
            light:  ['modeScreen', 'setupScreen'],
            hard:   ['modeScreen', 'setupScreen', 'stepProfile', 'stepActivity', 'stepGoal', 'stepSport', 'stepProducts'],
            expert: ['modeScreen', 'setupScreen', 'stepProfile', 'stepActivity', 'stepGoal', 'stepSport', 'stepProducts'],
        };
        const ALL_ONBOARD = ['modeScreen', 'setupScreen', 'stepProfile', 'stepActivity', 'stepGoal', 'stepSport', 'stepProducts'];
        const SCREEN_TITLE = { modeScreen: 'Modus', setupScreen: 'Uhrzeiten', stepProfile: 'Über dich', stepActivity: 'Aktivität', stepGoal: 'Ziel', stepSport: 'Sport & Training', stepProducts: 'Deine Produkte' };
        let onboardFlow = ONBOARD_FLOW.light;   // wird gesetzt, sobald der Modus gewählt ist
        let onboardIdx = 0;

        let userProfile = { age:'', gender:'', activity:'', sportType:'' };
        let selectedSportMode = 'maxkraft';

        function isLight() { return appMode === 'light'; }

        function loadProfile() {
            try { userProfile = JSON.parse(store.getItem('sl_profile') || '{}') || {}; } catch (e) { userProfile = {}; }
            ['age','gender','height','weight','activity','sportType','goal'].forEach(k => { if (!(k in userProfile)) userProfile[k] = ''; });
            selectedSportMode = store.getItem('sl_sport') || 'maxkraft';
        }

        // ── BEDARFSBERECHNUNG (kcal & Eiweiß) ──────────────────────────────────────
        // computeTargets + Konstanten → js/modules/calculator.js
        // buildTargetsHtml (Render) → js/modules/ui.js

        function renderOnboardTargets() {
            const html = buildTargetsHtml(userProfile, false);
            ['onboardTargets', 'onboardTargets2'].forEach(id => { const b = document.getElementById(id); if (b) b.innerHTML = html; });
        }
        // Überspringen eines Profil-Schritts (Wert bleibt leer → Genauigkeits-Hinweis greift)
        function skipStep(field) { nextStep(); }
        function renderDailyTargets() {
            const box = document.getElementById('dailyTargets');
            if (box) box.innerHTML = buildTargetsHtml(userProfile, true);
        }
        function saveProfile() { try { store.setItem('sl_profile', JSON.stringify(userProfile)); } catch (e) {} }

        // idx = Index innerhalb des aktuellen (mode-abhängigen) Flows.
        function goStep(idx) {
            if (idx >= onboardFlow.length) { enterApp(); return; }
            if (idx < 0) idx = 0;
            ALL_ONBOARD.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
            const id = onboardFlow[idx];
            const el = document.getElementById(id);
            if (el) el.style.display = 'flex';
            onboardIdx = idx;
            currentStep = idx;
            window.scrollTo(0, 0);
            const prog = el.querySelector('.onboard-progress');
            if (prog) prog.innerText = (id === 'modeScreen')
                ? 'Schritt 1 · Wähle deinen Modus'
                : `Schritt ${idx + 1} von ${onboardFlow.length} · ${SCREEN_TITLE[id] || ''}`;
            if (id === 'stepActivity' || id === 'stepGoal') renderOnboardTargets();
            if (id === 'stepSport') renderOnboardSportPlans();
            if (id === 'stepProducts') renderOnboardProducts();
        }
        function nextStep() { goStep(onboardIdx + 1); }
        function prevStep() { goStep(onboardIdx - 1); }

        // Auswahl-Buttons (Geschlecht, Aktivität, Ziel, Sportart)
        function setProfileChoice(field, val, btn) {
            userProfile[field] = val;
            saveProfile();
            const parent = btn.parentElement;
            parent.querySelectorAll('.onboard-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderOnboardTargets(); // Bedarf live aktualisieren
            // Sportart geändert → passende Trainingspläne neu aufbauen
            if (field === 'sportType') renderOnboardSportPlans();
        }
        function profileNext() {
            userProfile.age    = document.getElementById('profileAge').value.trim();
            userProfile.height = document.getElementById('profileHeight').value.trim();
            userProfile.weight = document.getElementById('profileWeight').value.trim();
            saveProfile();
            nextStep();
        }

        // Schritt 7: Produkte auswählen → füllt Mein Stack
        function onboardToggle(pid) {
            if (myStack[pid]) delete myStack[pid];
            else { const p = getProductById(pid); if (p) myStack[pid] = { amount: parseServing(p.serving).num }; }
            setEmptyPlan(false);
            saveStack();
            renderOnboardProducts();
        }

        function setEmptyPlan(v) {
            userWantsEmptyPlan = v;
            try { store.setItem('sl_emptyplan', v ? '1' : '0'); } catch (e) {}
        }

        // Schritt 7 – Button: empfohlene Produkte in den Stack übernehmen
        function fillRecommendedStack() {
            myStack = {};
            RECOMMENDED_IDS.forEach(pid => {
                if (PRODUCT_BADGES[pid] && PRODUCT_BADGES[pid].type === 'soldout') return;
                const p = getProductById(pid);
                if (p) myStack[pid] = { amount: parseServing(p.serving).num };
            });
            setEmptyPlan(false);
            saveStack();
            nextStep();
        }
        // Button: leer starten, selbst befüllen
        function startEmptyPlan() {
            myStack = {};
            setEmptyPlan(true);
            saveStack();
            nextStep();
        }
        function renderOnboardProducts() {
            const box = document.getElementById('onboardProductList');
            if (!box) return;
            const q = (document.getElementById('onboardProductSearch')?.value || '').toLowerCase().trim();
            let list = [...PRODUCTS].sort((a, b) => a.name.localeCompare(b.name, 'de'));
            if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
            document.getElementById('onboardProductCount').textContent = Object.keys(myStack).length + ' Produkte gewählt';
            box.innerHTML = list.map(p => {
                const inStack = !!myStack[p.id];
                const sold = PRODUCT_BADGES[p.id] && PRODUCT_BADGES[p.id].type === 'soldout';
                return `<button class="stack-browse-row${inStack ? ' in-stack' : ''}" onclick="onboardToggle('${p.id}')">
                    <span class="stack-browse-name"><span style="margin-right:6px;">${p.icon}</span>${p.name}${sold ? ' <span style="color:#f87171;font-size:9px;">(ausverkauft)</span>' : ''}</span>
                    <span class="stack-browse-act">${inStack ? '✓ Drin' : '+ Wählen'}</span>
                </button>`;
            }).join('');
        }

        // Schritt 5: Sportart & Trainingsplan wählen
        function setSportChoice(mode, btn) {
            selectedSportMode = mode;
            try { store.setItem('sl_sport', mode); } catch (e) {}
            btn.parentElement.querySelectorAll('.onboard-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
        function finishOnboarding() { enterApp(); }

        // Schnell-Wege aus der laufenden App (kein erneutes Onboarding)
        function editTimes() {
            inOnboarding = false;
            document.getElementById("mainApp").style.display = "none";
            document.getElementById("setupScreen").style.display = "flex";
        }
        function backToModeSelect() {
            inOnboarding = false;
            document.getElementById("mainApp").style.display = "none";
            document.getElementById("modeScreen").style.display = "flex";
        }
        function modeBack() {
            if (inOnboarding) prevStep();
            else enterApp();
        }
        // Assistent komplett neu starten (ohne Cache löschen) → Modus-Abfrage zuerst
        function restartOnboarding() {
            inOnboarding = true;
            document.getElementById("mainApp").style.display = "none";
            onboardFlow = ONBOARD_FLOW[appMode] || ONBOARD_FLOW.light;
            goStep(0);
        }

        function applyMode(mode) {
            appMode = mode;
            document.body.classList.toggle('light-mode', mode === 'light');
            try { store.setItem("sl_mode", mode); } catch (e) {}
        }
        // Steuert die sichtbare Oberfläche je Modus (Light/Hard/Expert).
        // „Dein Tag" (Tagesplan) ist immer die Achse; MODE_TOOLS bestimmt das
        // Werkzeuge-Menü, MODE_DAYTYPES die verfügbaren Tagestypen.
        function applyModeVisibility() {
            const light = appMode === 'light';
            const tools = MODE_TOOLS[appMode] || MODE_TOOLS.light;
            const dts = MODE_DAYTYPES[appMode] || MODE_DAYTYPES.light;
            const tabBar = document.querySelector('.tab-bar');
            if (tabBar) tabBar.style.display = 'none';   // immer versteckt – steuert nur noch intern
            const toolsBar = document.getElementById('toolsBar');
            if (toolsBar) toolsBar.style.display = 'flex';
            // Werkzeuge-Menü nur, wenn es Tools gibt (Hard/Expert). Light: roter Notfall-Knopf.
            const navTools = document.getElementById('navTools');
            const navEmergency = document.getElementById('navEmergency');
            if (navTools) navTools.style.display = tools.length ? '' : 'none';
            if (navEmergency) navEmergency.style.display = light ? '' : 'none';
            // Tagestyp-Buttons je nach Modus ein-/ausblenden
            document.querySelectorAll('.daytype-btn').forEach(b => {
                const type = b.id.replace('dt', '').toLowerCase();
                b.style.display = dts.includes(type) ? '' : 'none';
            });
            buildToolsSheet();
            closeTools();
            // Falls die aktive Ansicht im neuen Modus nicht erlaubt ist → zurück zum Tag
            const active = document.querySelector('.tab-bar .tab-btn.active');
            const allowed = new Set(['tabTimeline', ...tools, ...(light ? ['tabRecovery'] : [])]);
            if (active && !allowed.has(active.id)) activeSection('tabTimeline', 'viewTimeline');
            if (!dts.includes(currentDayType)) selectDayType('training');
            setNavDayActive(document.getElementById('viewTimeline').classList.contains('active'));
        }

        // Baut das Werkzeuge-Menü aus den im Modus erlaubten Tools (in Reihenfolge).
        function buildToolsSheet() {
            const sheet = document.getElementById('toolsSheet');
            if (!sheet) return;
            sheet.innerHTML = '';
            (MODE_TOOLS[appMode] || []).forEach(id => {
                const src = document.getElementById(id);
                if (!src) return;
                const item = document.createElement('button');
                item.className = 'tool-item' + (src.classList.contains('tab-emergency') ? ' emergency' : '');
                item.textContent = src.textContent;
                item.addEventListener('click', () => {
                    src.click();                 // bestehenden Tab-Handler wiederverwenden
                    setNavDayActive(false);
                    setNavHomeActive(false);
                    closeTools();
                    window.scrollTo(0, 0);
                });
                sheet.appendChild(item);
            });
        }
        function setNavDayActive(on) {
            const d = document.getElementById('navDay');
            if (d) d.classList.toggle('active', on);
        }
        function toggleTools() {
            const s = document.getElementById('toolsSheet');
            const t = document.getElementById('navTools');
            if (!s) return;
            const open = s.classList.toggle('open');
            if (t) t.classList.toggle('active', open);
        }
        function closeTools() {
            document.getElementById('toolsSheet')?.classList.remove('open');
            document.getElementById('navTools')?.classList.remove('active');
        }
        function goToDay() {
            document.getElementById('tabTimeline').click();
            setNavDayActive(true);
            setNavHomeActive(false);
            closeTools();
            window.scrollTo(0, 0);
        }
        function setNavHomeActive(on) {
            const h = document.getElementById('navHome');
            if (h) h.classList.toggle('active', on);
        }
        // Übersicht/Dashboard anzeigen (Startseite: alles auf einen Blick)
        function showDashboard() {
            document.querySelectorAll('#mainApp .view-section').forEach(v => v.classList.remove('active'));
            document.getElementById('viewAboutMe').style.display = 'none';
            document.querySelectorAll('.tab-bar .tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('viewDashboard').classList.add('active');
            document.getElementById('timelinePanels').style.display = 'none';
            setNavHomeActive(true);
            setNavDayActive(false);
            closeTools();
            renderDashboard();
            window.scrollTo(0, 0);
        }
        // Von einer Dashboard-Karte in ein Modul springen.
        function dashOpen(target) {
            if (target === 'day') { goToDay(); return; }
            const btn = document.getElementById(target);
            if (btn) btn.click();
            setNavHomeActive(false);
            closeTools();
            window.scrollTo(0, 0);
        }
        // Baut das Karten-Dashboard – ein Register, das je Modul eine Karte liefert.
        // Neue (Lebens-)Module docken später einfach als weitere Karte an.
        function renderDashboard() {
            const grid = document.getElementById('dashGrid');
            if (!grid) return;
            const m = appMode;
            const cards = [];
            // Heute / Tagesplan
            const blocks = getActiveTimeline();
            const chips = blocks.slice(0, 4).map(b => `<span class="dash-chip">${b.label || ''}</span>`).join('');
            cards.push({ open: 'day', cls: 'wide', html:
                `<div class="dash-icon">🗓</div><div class="dash-title">Heute · ${DAYTYPE_LABELS[currentDayType] || ''}</div>
                 <div class="dash-sub">${blocks.length} Zeitfenster im Plan</div><div class="dash-chips">${chips}</div>` });
            // Diese Woche (Wochenplan) – in jedem Modus erreichbar
            const wk = loadWeek();
            const ti = todayIdx();
            const weekChips = wk.map((e, i) => `<span class="dash-chip${i === ti ? ' today' : ''}">${WEEKDAYS[i]} ${e.train ? '🏋️' : '🛌'}</span>`).join('');
            const trainDays = wk.filter(e => e.train).length;
            cards.push({ open: 'tabWeek', cls: 'wide', html:
                `<div class="dash-icon">📅</div><div class="dash-title">Diese Woche</div>
                 <div class="dash-sub">${trainDays} Trainingstage · heute ${wk[ti].train ? 'Training' : 'Pause'}</div>
                 <div class="dash-chips">${weekChips}</div>` });
            // Bedarf
            const t = computeTargets(userProfile);
            cards.push({ open: 'day', html: t
                ? `<div class="dash-icon">📊</div><div class="dash-title">Dein Bedarf</div><div class="dash-big">${t.tdee.toLocaleString('de-DE')}</div><div class="dash-sub">kcal · ${t.proteinMin}–${t.proteinMax} g Eiweiß</div>`
                : `<div class="dash-icon">📊</div><div class="dash-title">Dein Bedarf</div><div class="dash-sub">Profil ausfüllen für kcal & Eiweiß</div>` });
            // Mein Stack (ab Hard)
            if (m !== 'light') cards.push({ open: 'tabStack', html:
                `<div class="dash-icon">💊</div><div class="dash-title">Mein Stack</div><div class="dash-big">${Object.keys(myStack).length}</div><div class="dash-sub">Produkte im Plan</div>` });
            // Money (ab Hard)
            if (m !== 'light') {
                const inc = moneyData.income.reduce((s, e) => s + (e.amount || 0), 0);
                const cost = moneyData.costs.reduce((s, e) => s + (e.monthly || 0), 0);
                cards.push({ open: 'tabMoney', html:
                    `<div class="dash-icon">💶</div><div class="dash-title">Money</div><div class="dash-big">${eur(inc - cost)}</div><div class="dash-sub">frei / Monat</div>` });
            }
            // Blutwerte (Expert)
            if (m === 'expert') {
                const entered = Object.values(bloodValues).filter(v => v !== '' && v != null).length;
                let flagged = 0;
                BLOOD_MARKERS.forEach(mk => { const st = bloodStatus(mk, bloodValues[mk.id] || ''); if (st.cls === 'low' || st.cls === 'high') flagged++; });
                cards.push({ open: 'tabBlood', html:
                    `<div class="dash-icon">🩸</div><div class="dash-title">Blutwerte</div><div class="dash-big">${entered}</div><div class="dash-sub">${flagged ? flagged + ' auffällig' : 'Werte erfasst'}</div>` });
            }
            // Überwachung (Expert)
            if (m === 'expert') {
                const done = Object.keys(monitorLog).length;
                const total = (MONITORING.checklist || []).length;
                cards.push({ open: 'tabMonitor', html:
                    `<div class="dash-icon">🩺</div><div class="dash-title">Überwachung</div><div class="dash-big">${done}/${total}</div><div class="dash-sub">Checks erledigt</div>` });
            }
            // Notfall (immer)
            cards.push({ open: 'tabRecovery', cls: 'emergency', html:
                `<div class="dash-icon">💚</div><div class="dash-title">RecoveryMode</div><div class="dash-sub">Verletzungen, Erste Hilfe, Seelisches &amp; Notruf</div>` });

            grid.innerHTML = '';
            cards.forEach(c => {
                const el = document.createElement('button');
                el.className = 'dash-card' + (c.cls ? ' ' + c.cls : '');
                el.innerHTML = c.html;
                el.addEventListener('click', () => dashOpen(c.open));
                grid.appendChild(el);
            });
        }
        function selectMode(mode) {
            applyMode(mode);
            if (inOnboarding) {
                onboardFlow = ONBOARD_FLOW[mode] || ONBOARD_FLOW.light;   // Flow an den Modus anpassen
                nextStep();
            } else {
                enterApp();
            }
        }

        // App betreten – alle Onboarding-Screens aus, App rendern
        function enterApp() {
            inOnboarding = false;
            ALL_ONBOARD.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
            document.getElementById("mainApp").style.display = "block";

            loadStack();
            loadMoney();
            try { userWantsEmptyPlan = store.getItem('sl_emptyplan') === '1'; } catch (e) {}
            // Produkte gewählt ODER bewusst leer gestartet → persönlicher (Stack-)Plan
            stackPlanActive = Object.keys(myStack).length > 0 || userWantsEmptyPlan;

            initStaticPanels();
            applyWeekToday();   // Tagestyp automatisch nach dem heutigen Wochentag setzen
            renderWeek();
            document.getElementById("dayTypeHint").innerHTML = dayHint(currentDayType);
            renderTimeline();
            initDatabaseView();
            initNutrView();
            initBloodView();
            initMonitorView();
            initRecoveryHub();
            renderSportPlans();
            renderStackView();
            renderMoney();
            renderDailyTargets();
            if (selectedSportMode) selectSportMode(selectedSportMode);
            applyModeVisibility();
            showDashboard();   // Startseite = Übersicht (alles auf einen Blick)
        }

        function initStaticPanels() {
            const rulesBox = document.getElementById("rulesList");
            rulesBox.innerHTML = CRITICAL.map(r => `
                <div class="rule-item">
                    <span>${r.bad ? "" : ""}</span>
                    <span class="${r.bad ? 'rule-bad' : 'rule-good'}">${r.text}</span>
                </div>
            `).join('');

            // Hier werden die Proteindosen dynamisch basierend auf der Uhrzeit getaktet!
            const proteinBox = document.getElementById("proteinDosesList");
            const _dwMin = (() => { const [h,m] = globalWakeTimeStr.split(':').map(Number); return h*60+m; })();
            const _dsMin = (() => { const [h,m] = globalSleepTimeStr.split(':').map(Number); return h*60+m; })();
            const _dAwake = (_dsMin - _dwMin + 1440) % 1440;
            const _dScale = _dAwake / 960;
            const _dMsw = (d) => d.isRelativeTosleep ? _dAwake - d.offsetMinutes : Math.round(d.offsetMinutes * _dScale);
            const _dFmt = (absMin) => { const h=Math.floor((absMin%1440)/60), m=absMin%60; return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`; };
            const _dTime = (d) => _dFmt((_dwMin + _dMsw(d)) % 1440);
            const sortedDoses = [...PROTEIN_DOSES_CONFIG]
                .filter(d => { const v = _dMsw(d); return v >= 0 && v < _dAwake; })
                .sort((a, b) => _dMsw(a) - _dMsw(b));
            proteinBox.innerHTML = sortedDoses.map(d => {
                const calculatedTimeStr = _dTime(d);
                return `
                    <div class="protein-row">
                        <div>
                            <span class="protein-time">${calculatedTimeStr} ${d.label}</span>
                            <span class="protein-type">${d.type}</span>
                        </div>
                        <span class="protein-g">${d.g}</span>
                    </div>
                `;
            }).join('');
        }

        function toggleTopPanel(panelId, contentId) {
            const panel = document.getElementById(panelId);
            const content = document.getElementById(contentId);
            const isOpen = panel.classList.contains("open");

            if (isOpen) {
                panel.classList.remove("open");
                content.style.display = "none";
            } else {
                panel.classList.add("open");
                content.style.display = "block";
            }
        }

        function toggleDailyNutrBox() {
            const content = document.getElementById('daily-nutr-content');
            const arrow = document.getElementById('daily-nutr-arrow');
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            arrow.textContent = isHidden ? '▲' : '▼';
        }
        function toggleDailySection(contentId, arrowId) {
            const content = document.getElementById(contentId);
            const arrow = document.getElementById(arrowId);
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            arrow.textContent = isHidden ? '▲' : '▼';
        }

        // v = EU NRV numeric; u = unit; eu/dach/usa = display strings
        // dach_min/max, usa_min/max = numeric range for bar zone calculation
        // ul = Tolerable Upper Intake Level (numeric, same unit); ul_str = display string
        const NUTRIENT_NORMS = {
            // ── Vitamins ──────────────────────────────────────────────────────────────────────────────────────────────────
            "Vitamin A":                    { v:800,  u:"µg", eu:"800 µg",   dach:"700–850 µg",   usa:"700–900 µg",    dach_min:700,  dach_max:850,  usa_min:700,  usa_max:900,  ul:3000, ul_str:"3.000 µg" },
            "Vitamin D":                    { v:5,    u:"µg", eu:"5 µg",     dach:"20 µg",        usa:"15–20 µg",      dach_min:20,   dach_max:20,   usa_min:15,   usa_max:20,   ul:100,  ul_str:"100 µg" },
            "Vitamin D3 (Cholecalciferol)": { v:5,    u:"µg", eu:"5 µg",     dach:"20 µg",        usa:"15–20 µg",      dach_min:20,   dach_max:20,   usa_min:15,   usa_max:20,   ul:100,  ul_str:"100 µg" },
            "Vitamin E":                    { v:12,   u:"mg", eu:"12 mg",    dach:"12–15 mg",     usa:"15 mg",         dach_min:12,   dach_max:15,   usa_min:15,   usa_max:15,   ul:300,  ul_str:"300 mg" },
            "Vitamin E (Tocopherol)":       { v:12,   u:"mg", eu:"12 mg",    dach:"12–15 mg",     usa:"15 mg",         dach_min:12,   dach_max:15,   usa_min:15,   usa_max:15,   ul:300,  ul_str:"300 mg" },
            "Vitamin E (Alpha-Tocopherol)": { v:12,   u:"mg", eu:"12 mg",    dach:"12–15 mg",     usa:"15 mg",         dach_min:12,   dach_max:15,   usa_min:15,   usa_max:15,   ul:300,  ul_str:"300 mg" },
            "Vitamin K":                    { v:75,   u:"µg", eu:"75 µg",    dach:"60–70 µg",     usa:"90–120 µg",     dach_min:60,   dach_max:70,   usa_min:90,   usa_max:120,  ul:null, ul_str:null },
            "Vitamin K2 (Menachinon)":      { v:75,   u:"µg", eu:"75 µg",    dach:"60–70 µg",     usa:"90–120 µg",     dach_min:60,   dach_max:70,   usa_min:90,   usa_max:120,  ul:null, ul_str:null },
            "Vitamin C":                    { v:80,   u:"mg", eu:"80 mg",    dach:"95–110 mg",    usa:"75–90 mg",      dach_min:95,   dach_max:110,  usa_min:75,   usa_max:90,   ul:2000, ul_str:"2.000 mg" },
            "Thiamin (B1)":                 { v:1.1,  u:"mg", eu:"1,1 mg",   dach:"1,0–1,3 mg",   usa:"1,1–1,2 mg",    dach_min:1.0,  dach_max:1.3,  usa_min:1.1,  usa_max:1.2,  ul:null, ul_str:null },
            "Thiamin":                      { v:1.1,  u:"mg", eu:"1,1 mg",   dach:"1,0–1,3 mg",   usa:"1,1–1,2 mg",    dach_min:1.0,  dach_max:1.3,  usa_min:1.1,  usa_max:1.2,  ul:null, ul_str:null },
            "Riboflavin (B2)":              { v:1.4,  u:"mg", eu:"1,4 mg",   dach:"1,1–1,4 mg",   usa:"1,1–1,3 mg",    dach_min:1.1,  dach_max:1.4,  usa_min:1.1,  usa_max:1.3,  ul:null, ul_str:null },
            "Riboflavin":                   { v:1.4,  u:"mg", eu:"1,4 mg",   dach:"1,1–1,4 mg",   usa:"1,1–1,3 mg",    dach_min:1.1,  dach_max:1.4,  usa_min:1.1,  usa_max:1.3,  ul:null, ul_str:null },
            "Vitamin B2 – Riboflavin":      { v:1.4,  u:"mg", eu:"1,4 mg",   dach:"1,1–1,4 mg",   usa:"1,1–1,3 mg",    dach_min:1.1,  dach_max:1.4,  usa_min:1.1,  usa_max:1.3,  ul:null, ul_str:null },
            "Niacin (B3)":                  { v:16,   u:"mg", eu:"16 mg",    dach:"13–15 mg",     usa:"14–16 mg",      dach_min:13,   dach_max:15,   usa_min:14,   usa_max:16,   ul:35,   ul_str:"35 mg" },
            "Niacin":                       { v:16,   u:"mg", eu:"16 mg",    dach:"13–15 mg",     usa:"14–16 mg",      dach_min:13,   dach_max:15,   usa_min:14,   usa_max:16,   ul:35,   ul_str:"35 mg" },
            "Pantothensäure (B5)":          { v:6,    u:"mg", eu:"6 mg",     dach:"6 mg",         usa:"5 mg",          dach_min:6,    dach_max:6,    usa_min:5,    usa_max:5,    ul:null, ul_str:null },
            "Pantothensäure":               { v:6,    u:"mg", eu:"6 mg",     dach:"6 mg",         usa:"5 mg",          dach_min:6,    dach_max:6,    usa_min:5,    usa_max:5,    ul:null, ul_str:null },
            "Vitamin B6":                   { v:1.4,  u:"mg", eu:"1,4 mg",   dach:"1,4–1,6 mg",   usa:"1,3–1,7 mg",    dach_min:1.4,  dach_max:1.6,  usa_min:1.3,  usa_max:1.7,  ul:25,   ul_str:"25 mg" },
            "Folsäure (B9)":                { v:200,  u:"µg", eu:"200 µg",   dach:"300 µg",       usa:"400 µg",        dach_min:300,  dach_max:300,  usa_min:400,  usa_max:400,  ul:1000, ul_str:"1.000 µg" },
            "Folsäure":                     { v:200,  u:"µg", eu:"200 µg",   dach:"300 µg",       usa:"400 µg",        dach_min:300,  dach_max:300,  usa_min:400,  usa_max:400,  ul:1000, ul_str:"1.000 µg" },
            "Vitamin B9":                   { v:200,  u:"µg", eu:"200 µg",   dach:"300 µg",       usa:"400 µg",        dach_min:300,  dach_max:300,  usa_min:400,  usa_max:400,  ul:1000, ul_str:"1.000 µg" },
            "Biotin (B7)":                  { v:50,   u:"µg", eu:"50 µg",    dach:"30–60 µg",     usa:"30 µg",         dach_min:30,   dach_max:60,   usa_min:30,   usa_max:30,   ul:null, ul_str:null },
            "Biotin":                       { v:50,   u:"µg", eu:"50 µg",    dach:"30–60 µg",     usa:"30 µg",         dach_min:30,   dach_max:60,   usa_min:30,   usa_max:30,   ul:null, ul_str:null },
            "Vitamin B12":                  { v:2.5,  u:"µg", eu:"2,5 µg",   dach:"4,0 µg",       usa:"2,4 µg",        dach_min:4.0,  dach_max:4.0,  usa_min:2.4,  usa_max:2.4,  ul:null, ul_str:null },
            // ── Minerals ──────────────────────────────────────────────────────────────────────────────────────────────────
            "Calcium":                      { v:800,  u:"mg", eu:"800 mg",   dach:"1000 mg",      usa:"1000–1200 mg",  dach_min:1000, dach_max:1000, usa_min:1000, usa_max:1200, ul:2500, ul_str:"2.500 mg" },
            "Chlorid":                      { v:800,  u:"mg", eu:"800 mg",   dach:"2300 mg",      usa:"2300 mg",       dach_min:2300, dach_max:2300, usa_min:2300, usa_max:2300, ul:null, ul_str:null },
            "Chrom":                        { v:40,   u:"µg", eu:"40 µg",    dach:"30–100 µg",    usa:"25–35 µg",      dach_min:30,   dach_max:100,  usa_min:25,   usa_max:35,   ul:null, ul_str:null },
            "Eisen":                        { v:14,   u:"mg", eu:"14 mg",    dach:"10–15 mg",     usa:"8–18 mg",       dach_min:10,   dach_max:15,   usa_min:8,    usa_max:18,   ul:45,   ul_str:"45 mg" },
            "Jod":                          { v:150,  u:"µg", eu:"150 µg",   dach:"150–200 µg",   usa:"150 µg",        dach_min:150,  dach_max:200,  usa_min:150,  usa_max:150,  ul:600,  ul_str:"600 µg" },
            "Kalium":                       { v:2000, u:"mg", eu:"2.000 mg", dach:"4.000 mg",     usa:"2.600–3.400 mg",dach_min:4000, dach_max:4000, usa_min:2600, usa_max:3400, ul:null, ul_str:null },
            "Kupfer":                       { v:1,    u:"mg", eu:"1 mg",     dach:"1,0–1,5 mg",   usa:"0,9 mg",        dach_min:1.0,  dach_max:1.5,  usa_min:0.9,  usa_max:0.9,  ul:5,    ul_str:"5 mg" },
            "Magnesium":                    { v:375,  u:"mg", eu:"375 mg",   dach:"300–350 mg",   usa:"310–420 mg",    dach_min:300,  dach_max:350,  usa_min:310,  usa_max:420,  ul:250,  ul_str:"250 mg†" },
            "Mangan":                       { v:2,    u:"mg", eu:"2 mg",     dach:"2,0–5,0 mg",   usa:"1,8–2,3 mg",    dach_min:2.0,  dach_max:5.0,  usa_min:1.8,  usa_max:2.3,  ul:11,   ul_str:"11 mg" },
            "Molybdän":                     { v:50,   u:"µg", eu:"50 µg",    dach:"50–100 µg",    usa:"45 µg",         dach_min:50,   dach_max:100,  usa_min:45,   usa_max:45,   ul:600,  ul_str:"600 µg" },
            "Phosphor":                     { v:700,  u:"mg", eu:"700 mg",   dach:"700 mg",       usa:"700 mg",        dach_min:700,  dach_max:700,  usa_min:700,  usa_max:700,  ul:4000, ul_str:"4.000 mg" },
            "Selen":                        { v:55,   u:"µg", eu:"55 µg",    dach:"60–70 µg",     usa:"55 µg",         dach_min:60,   dach_max:70,   usa_min:55,   usa_max:55,   ul:300,  ul_str:"300 µg" },
            "Zink":                         { v:10,   u:"mg", eu:"10 mg",    dach:"7–16 mg",      usa:"8–11 mg",       dach_min:7,    dach_max:16,   usa_min:8,    usa_max:11,   ul:25,   ul_str:"25 mg" }
        };

        // Makros, die NICHT als Mikronährstoff/NRV gezählt werden
        const MACRO_SKIP = new Set(['Eiweiß','Protein','Fett','Fettsäuren','Kohlenhydrate',
            'Ballaststoffe','Zucker','Salz','Energie','Kalorien','kcal','kJ','Natrium','Brennwert']);
        // Vereinheitlichung verschiedener Schreibweisen desselben Nährstoffs
        const LABEL_CANON = {
            'Thiamin':                    'Thiamin (B1)',
            'Riboflavin':                 'Riboflavin (B2)',
            'Vitamin B2 – Riboflavin':    'Riboflavin (B2)',
            'Niacin':                     'Niacin (B3)',
            'Pantothensäure (B5)':        'Pantothensäure',
            'Biotin (B7)':                'Biotin',
            'Folsäure (B9)':              'Folsäure',
            'Vitamin B9':                 'Folsäure',
            'Vitamin D3 (Cholecalciferol)':'Vitamin D',
            'Vitamin E (Tocopherol)':     'Vitamin E',
            'Vitamin E (Alpha-Tocopherol)':'Vitamin E',
            'Vitamin K2 (Menachinon)':    'Vitamin K',
        };

        function buildDailyNutrientsBox() {
            // Stack-Plan: Nährwerte aus „Mein Stack" (mit echten Mengen) statt aus dem vollen Plan
            if (stackPlanActive) {
                const html = buildStackNutrientsHtml('Dein Tagesplan-Nährwerte (aus deinem Stack)');
                return html || '<div class="daily-nutr-box light-macros" style="margin-top:14px;"><div class="light-macros-title">Stack ist leer</div></div>';
            }
            const allPids = new Set();
            getActiveTimeline().forEach(block => block.productIds.forEach(pid => allPids.add(pid)));
            const products = [...allPids]
                .filter(pid => !(PRODUCT_BADGES[pid] && PRODUCT_BADGES[pid].type === 'soldout'))
                .map(pid => getProductById(pid))
                .filter(Boolean);

            let totalProtein = 0, totalCarbs = 0, totalFat = 0, totalKcal = 0;
            products.forEach(p => {
                totalProtein += p.protein || 0;
                totalCarbs   += p.carbs   || 0;
                totalFat     += p.fat     || 0;
                totalKcal    += p.kcal    || 0;
            });

            // Light Mode: nur eine einfache Makro-Übersicht, keine NRV-Balken
            if (isLight()) {
                return `<div class="daily-nutr-box light-macros">
                    <div class="light-macros-title">Das nimmst du heute insgesamt</div>
                    <div class="light-macros-grid">
                        <div><span class="lm-val" style="color:#4ade80;">${Math.round(totalProtein)} g</span><span class="lm-lbl">Eiweiß</span></div>
                        <div><span class="lm-val" style="color:#fbbf24;">${Math.round(totalCarbs)} g</span><span class="lm-lbl">Kohlenhydrate</span></div>
                        <div><span class="lm-val" style="color:#f87171;">${Math.round(totalFat)} g</span><span class="lm-lbl">Fett</span></div>
                        <div><span class="lm-val" style="color:#a5b4fc;">${Math.round(totalKcal)}</span><span class="lm-lbl">Kalorien</span></div>
                    </div>
                </div>`;
            }

            const nrvMap = {};
            const nonNrvMap = {};
            const nonNrvOptMap = {};

            products.forEach(p => {
                if (!p.nutrients) return;
                p.nutrients.forEach(n => {
                    if ((n.label.startsWith('—') && n.nrv === null) || MACRO_SKIP.has(n.label)) return;
                    const rawLabel = n.label.startsWith('— ') ? n.label.slice(2) : n.label;
                    const canonLabel = LABEL_CANON[rawLabel] || rawLabel;
                    if (n.nrv !== null) {
                        if (!nrvMap[canonLabel]) nrvMap[canonLabel] = { totalNrv: 0, sources: [] };
                        nrvMap[canonLabel].totalNrv += n.nrv;
                        nrvMap[canonLabel].sources.push({ name: p.name, serving: p.serving || '', amount: n.amount, nrv: n.nrv });
                    } else {
                        if (!nonNrvMap[canonLabel]) nonNrvMap[canonLabel] = n.amount;
                        if (!nonNrvOptMap[canonLabel]) nonNrvOptMap[canonLabel] = [];
                        nonNrvOptMap[canonLabel].push(p.name);
                    }
                });
            });

            const nrvEntries = Object.entries(nrvMap).sort((a, b) => b[1].totalNrv - a[1].totalNrv);
            const nrvHtml = nrvEntries.map(([label, data]) => {
                const pct = data.totalNrv;
                const norm = NUTRIENT_NORMS[label];
                if (!norm) {
                    const fillPct = Math.min(pct, 300) / 300 * 100;
                    const barColor = pct >= 200 ? '#f59e0b' : pct >= 100 ? '#22c55e' : pct >= 50 ? '#f97316' : '#ef4444';
                    const valColor = pct >= 200 ? '#fbbf24' : pct >= 100 ? '#4ade80' : pct >= 50 ? '#fb923c' : '#f87171';
                    return '<div class="daily-nrv-row">' +
                        '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">' +
                            '<span class="daily-nrv-name">' + label + '</span>' +
                            '<span style="color:' + valColor + ';font-size:12px;font-weight:700;">' + pct + '% NRV</span>' +
                        '</div>' +
                        '<div class="daily-nrv-track"><div class="daily-nrv-fill" style="width:' + fillPct.toFixed(1) + '%;background:' + barColor + ';"></div></div>' +
                    '</div>';
                }
                const consumed = (pct / 100) * norm.v;
                const consumedStr = (consumed >= 1000 ? Math.round(consumed) : consumed.toFixed(1)) + ' ' + norm.u;
                const allMin = Math.min(norm.v, norm.dach_min, norm.usa_min);
                const allMax = Math.max(norm.v, norm.dach_max, norm.usa_max);
                const scaleVal = Math.max(allMax * 1.5, consumed > 0 ? consumed * 1.1 : norm.v * 3, norm.v * 3);
                const fillPct = Math.min(consumed / scaleVal * 100, 100);
                const allMaxPct = Math.min(allMax / scaleVal * 100, 100);
                const ulPct = norm.ul ? Math.min(norm.ul / scaleVal * 100, 100) : null;
                let fillColor, valColor;
                const ulToxic = norm.ul && norm.ul > norm.v && consumed >= norm.ul;
                if (ulToxic)                         { fillColor = '#7f1d1d'; valColor = '#fca5a5'; }
                else if (consumed >= allMin)         { fillColor = '#22c55e'; valColor = '#4ade80'; }
                else                                 { fillColor = '#ef4444'; valColor = '#f87171'; }
                const sepColor = consumed > allMax ? '#dc2626' : '#22c55e';
                let markers = '';
                if (allMaxPct < 99) markers += '<div class="daily-nrv-mark" style="left:' + allMaxPct.toFixed(1) + '%;background:' + sepColor + ';"></div>';
                if (ulPct && ulPct < 99) markers += '<div class="daily-nrv-mark" style="left:' + ulPct.toFixed(1) + '%;background:#7f1d1d;width:3px;"></div>';
                const normsHtml = '<div class="daily-nrv-norms">' +
                    '<span>EU: <span class="daily-nrv-norms-val">' + norm.eu + '</span></span>' +
                    '<span class="daily-nrv-norms-sep">·</span>' +
                    '<span>D-A-CH: <span class="daily-nrv-norms-val">' + norm.dach + '</span></span>' +
                    '<span class="daily-nrv-norms-sep">·</span>' +
                    '<span>USA: <span class="daily-nrv-norms-val">' + norm.usa + '</span></span>' +
                    (norm.ul ? '<span class="daily-nrv-norms-sep">·</span><span>UL: <span style="color:#f87171;">' + norm.ul_str + '</span></span>' : '') +
                    '</div>';
                let barFillHtml;
                if (ulToxic) {
                    barFillHtml = '<div class="daily-nrv-fill" style="width:' + fillPct.toFixed(1) + '%;background:#7f1d1d;"></div>';
                } else if (consumed > allMax) {
                    barFillHtml = '<div class="daily-nrv-fill" style="width:' + allMaxPct.toFixed(1) + '%;background:' + fillColor + ';"></div>' +
                        '<div class="daily-nrv-fill" style="left:' + allMaxPct.toFixed(1) + '%;width:' + (fillPct - allMaxPct).toFixed(1) + '%;background:#dc2626;"></div>';
                } else {
                    barFillHtml = '<div class="daily-nrv-fill" style="width:' + fillPct.toFixed(1) + '%;background:' + fillColor + ';"></div>';
                }
                return '<div class="daily-nrv-row">' +
                    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">' +
                        '<span class="daily-nrv-name">' + label + '</span>' +
                        '<span style="color:' + valColor + ';font-size:12px;font-weight:700;">' + consumedStr + '</span>' +
                    '</div>' +
                    '<div class="daily-nrv-track">' +
                        barFillHtml +
                        markers +
                    '</div>' +
                    normsHtml +
                '</div>';
            }).join('');

            const nrvOptHtml = nrvEntries.map(([label, data]) => {
                const pct = data.totalNrv;
                const norm = NUTRIENT_NORMS[label];
                const sourcesHtml = '<div class="nutr-opt-sources">' +
                    data.sources.map(s => '<div class="nutr-opt-source"><span class="nutr-opt-prod">' + s.name + (s.serving ? ' <span style="color:#334155;font-style:normal;">· ' + s.serving + '</span>' : '') + '</span><span class="nutr-opt-amt">' + s.amount + '</span></div>').join('') +
                '</div>';
                if (!norm) {
                    const fillPct = Math.min(pct, 300) / 300 * 100;
                    const barColor = pct >= 200 ? '#f59e0b' : pct >= 100 ? '#22c55e' : pct >= 50 ? '#f97316' : '#ef4444';
                    const valColor = pct >= 200 ? '#fbbf24' : pct >= 100 ? '#4ade80' : pct >= 50 ? '#fb923c' : '#f87171';
                    return '<div class="daily-nrv-row">' +
                        '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">' +
                            '<span class="daily-nrv-name">' + label + '</span>' +
                            '<span style="color:' + valColor + ';font-size:12px;font-weight:700;">' + pct + '% NRV</span>' +
                        '</div>' +
                        '<div class="daily-nrv-track"><div class="daily-nrv-fill" style="width:' + fillPct.toFixed(1) + '%;background:' + barColor + ';"></div></div>' +
                        sourcesHtml +
                    '</div>';
                }
                const consumed = (pct / 100) * norm.v;
                const consumedStr = (consumed >= 1000 ? Math.round(consumed) : consumed.toFixed(1)) + ' ' + norm.u;
                const allMin = Math.min(norm.v, norm.dach_min, norm.usa_min);
                const allMax = Math.max(norm.v, norm.dach_max, norm.usa_max);
                const scaleVal = Math.max(allMax * 1.5, consumed > 0 ? consumed * 1.1 : norm.v * 3, norm.v * 3);
                const fillPct = Math.min(consumed / scaleVal * 100, 100);
                const allMaxPct = Math.min(allMax / scaleVal * 100, 100);
                const ulPct = norm.ul ? Math.min(norm.ul / scaleVal * 100, 100) : null;
                let fillColor, valColor;
                const ulToxic = norm.ul && norm.ul > norm.v && consumed >= norm.ul;
                if (ulToxic)                         { fillColor = '#7f1d1d'; valColor = '#fca5a5'; }
                else if (consumed >= allMin)         { fillColor = '#22c55e'; valColor = '#4ade80'; }
                else                                 { fillColor = '#ef4444'; valColor = '#f87171'; }
                const sepColor = consumed > allMax ? '#dc2626' : '#22c55e';
                let markers = '';
                if (allMaxPct < 99) markers += '<div class="daily-nrv-mark" style="left:' + allMaxPct.toFixed(1) + '%;background:' + sepColor + ';"></div>';
                if (ulPct && ulPct < 99) markers += '<div class="daily-nrv-mark" style="left:' + ulPct.toFixed(1) + '%;background:#7f1d1d;width:3px;"></div>';
                const normsHtml = '<div class="daily-nrv-norms">' +
                    '<span>EU: <span class="daily-nrv-norms-val">' + norm.eu + '</span></span>' +
                    '<span class="daily-nrv-norms-sep">·</span>' +
                    '<span>D-A-CH: <span class="daily-nrv-norms-val">' + norm.dach + '</span></span>' +
                    '<span class="daily-nrv-norms-sep">·</span>' +
                    '<span>USA: <span class="daily-nrv-norms-val">' + norm.usa + '</span></span>' +
                    (norm.ul ? '<span class="daily-nrv-norms-sep">·</span><span>UL: <span style="color:#f87171;">' + norm.ul_str + '</span></span>' : '') +
                    '</div>';
                let barFillHtml;
                if (ulToxic) {
                    barFillHtml = '<div class="daily-nrv-fill" style="width:' + fillPct.toFixed(1) + '%;background:#7f1d1d;"></div>';
                } else if (consumed > allMax) {
                    barFillHtml = '<div class="daily-nrv-fill" style="width:' + allMaxPct.toFixed(1) + '%;background:' + fillColor + ';"></div>' +
                        '<div class="daily-nrv-fill" style="left:' + allMaxPct.toFixed(1) + '%;width:' + (fillPct - allMaxPct).toFixed(1) + '%;background:#dc2626;"></div>';
                } else {
                    barFillHtml = '<div class="daily-nrv-fill" style="width:' + fillPct.toFixed(1) + '%;background:' + fillColor + ';"></div>';
                }
                return '<div class="daily-nrv-row">' +
                    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">' +
                        '<span class="daily-nrv-name">' + label + '</span>' +
                        '<span style="color:' + valColor + ';font-size:12px;font-weight:700;">' + consumedStr + '</span>' +
                    '</div>' +
                    '<div class="daily-nrv-track">' +
                        barFillHtml +
                        markers +
                    '</div>' +
                    normsHtml +
                    sourcesHtml +
                '</div>';
            }).join('');

            const nonNrvEntries = Object.entries(nonNrvMap);
            const nonNrvHtml = nonNrvEntries.map(([label, amount]) =>
                '<div class="daily-nonrv-row"><span class="daily-nonrv-lbl">' + label + '</span><span class="daily-nonrv-val">' + amount + '</span></div>'
            ).join('');

            const nrvSection = nrvEntries.length > 0 ? (
                '<div class="daily-nutr-section">' +
                    '<div class="daily-nutr-section-title daily-nutr-section-toggle" onclick="toggleDailySection(\'daily-nrv-body\',\'daily-nrv-arrow\')">' +
                        '<span>Mikronährstoffe &mdash; Ist-Zufuhr + 3 Referenzwerte</span>' +
                        '<span id="daily-nrv-arrow" class="daily-nutr-section-arrow">▼</span>' +
                    '</div>' +
                    '<div id="daily-nrv-body" style="display:none;">' +
                        nrvHtml +
                        '<div style="font-size:9px;color:#1e3a5f;margin-top:8px;">Supplement-only · Balken relativ zum EU-NRV (skaliert bis 300%) · EU Nr. 1169/2011 · D-A-CH 2020 · USA NIH/HMD</div>' +
                    '</div>' +
                '</div>'
            ) : '';

            const nonNrvSection = nonNrvEntries.length > 0 ? (
                '<div class="daily-nutr-section">' +
                    '<div class="daily-nutr-section-title daily-nutr-section-toggle" onclick="toggleDailySection(\'daily-nonrv-body\',\'daily-nonrv-arrow\')">' +
                        '<span>Wirkstoffe &amp; Extrakte (kein EU-NRV)</span>' +
                        '<span id="daily-nonrv-arrow" class="daily-nutr-section-arrow">▼</span>' +
                    '</div>' +
                    '<div id="daily-nonrv-body" style="display:none;">' +
                        nonNrvHtml +
                    '</div>' +
                '</div>'
            ) : '';

            const nonNrvOptEntries = Object.entries(nonNrvOptMap);
            const nonNrvOptSection = nonNrvOptEntries.length > 0 ? (
                '<div class="daily-nutr-section">' +
                    '<div class="daily-nutr-section-title daily-nutr-section-toggle" onclick="toggleDailySection(\'daily-nonrv-opt-body\',\'daily-nonrv-opt-arrow\')">'+
                        '<span>Wirkstoffe &amp; Extrakte (kein EU-NRV)</span>' +
                        '<span id="daily-nonrv-opt-arrow" class="daily-nutr-section-arrow">▼</span>' +
                    '</div>' +
                    '<div id="daily-nonrv-opt-body" style="display:none;">' +
                        nonNrvOptEntries.map(([label, names]) =>
                            '<div class="daily-nonrv-row" style="flex-direction:column;align-items:flex-start;gap:2px;">' +
                                '<span class="daily-nonrv-lbl">' + label + '</span>' +
                                '<span style="font-size:9px;color:#475569;font-style:italic;">' + names.join(', ') + '</span>' +
                            '</div>'
                        ).join('') +
                    '</div>' +
                '</div>'
            ) : '';

            const nrvOptSection = nrvEntries.length > 0 ? (
                '<div class="daily-nutr-section">' +
                    '<div class="daily-nutr-section-title daily-nutr-section-toggle" onclick="toggleDailySection(\'daily-nrv-opt-body\',\'daily-nrv-opt-arrow\')">'+
                        '<span>Mikronährstoffe &mdash; Ist-Zufuhr + 3 Referenzwerte</span>' +
                        '<span id="daily-nrv-opt-arrow" class="daily-nutr-section-arrow">▼</span>' +
                    '</div>' +
                    '<div id="daily-nrv-opt-body" style="display:none;">' +
                        nrvOptHtml +
                        '<div style="font-size:9px;color:#1e3a5f;margin-top:8px;">Supplement-only · EU Nr. 1169/2011 · D-A-CH 2020 · USA NIH/HMD</div>' +
                    '</div>' +
                '</div>'
            ) : '';

            return `<div class="daily-nutr-box">
                <div class="daily-nutr-header" onclick="toggleDailyNutrBox()" style="cursor:pointer;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <div class="daily-nutr-title">Tages-Nährwertbilanz</div>
                            <div class="daily-nutr-subtitle">Aus Supplementplan (ohne Mahlzeiten) · alle Timeline-Produkte</div>
                        </div>
                        <span id="daily-nutr-arrow" style="color:#60a5fa;font-size:16px;margin-left:8px;line-height:1;">▼</span>
                    </div>
                </div>
                <div id="daily-nutr-content" style="display:none;">
                    <div class="daily-nutr-section">
                        <div class="daily-nutr-section-title">Makronährstoffe aus Supplementen</div>
                        <div class="daily-macro-grid">
                            <div class="daily-macro-cell">
                                <div class="daily-macro-val" style="color:#4ade80">${totalProtein.toFixed(1)}<span style="font-size:10px;font-weight:400">g</span></div>
                                <div class="daily-macro-lbl">Protein</div>
                            </div>
                            <div class="daily-macro-cell">
                                <div class="daily-macro-val" style="color:#fb923c">${totalCarbs.toFixed(1)}<span style="font-size:10px;font-weight:400">g</span></div>
                                <div class="daily-macro-lbl">Kohlenhydrate</div>
                            </div>
                            <div class="daily-macro-cell">
                                <div class="daily-macro-val" style="color:#facc15">${totalFat.toFixed(1)}<span style="font-size:10px;font-weight:400">g</span></div>
                                <div class="daily-macro-lbl">Fett</div>
                            </div>
                            <div class="daily-macro-cell">
                                <div class="daily-macro-val" style="color:#a78bfa">${Math.round(totalKcal)}<span style="font-size:10px;font-weight:400">kcal</span></div>
                                <div class="daily-macro-lbl">Energie</div>
                            </div>
                        </div>
                    </div>
                    ${nrvSection}
                    ${nonNrvSection}
                </div>
            </div>
            <div class="daily-nutr-box" style="margin-top:8px;">
                <div class="daily-nutr-header" onclick="toggleDailySection('daily-opt-content','daily-opt-arrow')" style="cursor:pointer;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <div class="daily-nutr-title">Nährwerte optimieren</div>
                            <div class="daily-nutr-subtitle">Welches Produkt liefert welchen Nährwert</div>
                        </div>
                        <span id="daily-opt-arrow" style="color:#60a5fa;font-size:16px;margin-left:8px;line-height:1;">▼</span>
                    </div>
                </div>
                <div id="daily-opt-content" style="display:none;">
                    ${nrvOptSection}
                    ${nonNrvOptSection}
                </div>
            </div>`;
        }

        // ── MEIN STACK – eigene Produktauswahl mit Mengen ──────────────────────────
        let myStack = {}; // { pid: { amount: Number } }

        function loadStack() {
            try { myStack = JSON.parse(store.getItem('sl_stack') || '{}') || {}; }
            catch (e) { myStack = {}; }
        }
        function saveStack() {
            try { store.setItem('sl_stack', JSON.stringify(myStack)); } catch (e) {}
        }

        // Portionsangabe ("~95g", "1 Kap", "1 Tropfen") → { num, unit }
        function parseServing(serving) {
            const s = serving || '';
            const m = s.match(/(\d+(?:[.,]\d+)?)/);
            const num = m ? parseFloat(m[1].replace(',', '.')) : 1;
            let unit = 'Portion';
            if (/kap/i.test(s))          unit = 'Kap';
            else if (/tropfen/i.test(s)) unit = 'Tropfen';
            else if (/\bml\b/i.test(s))  unit = 'ml';
            else if (/g\b/i.test(s))     unit = 'g';
            return { num: num || 1, unit };
        }
        function fmtDe(n) {
            const r = n >= 100 ? Math.round(n) : Math.round(n * 10) / 10;
            return String(r).replace('.', ',');
        }

        function stackAdd(pid) {
            if (myStack[pid]) return;
            const p = getProductById(pid);
            if (!p) return;
            myStack[pid] = { amount: parseServing(p.serving).num };
            saveStack();
            const inp = document.getElementById('stackSearchInput');
            if (inp) inp.value = '';
            renderStackAddList('');
            renderStackSelected();
            renderStackNutrients();
            refreshStackBrowseIfOpen();
        }
        function stackRemove(pid) {
            delete myStack[pid];
            saveStack();
            renderStackSelected();
            renderStackNutrients();
            refreshStackBrowseIfOpen();
        }
        function refreshStackBrowseIfOpen() {
            const list = document.getElementById('stackBrowseList');
            if (list && list.style.display !== 'none') renderStackBrowse();
        }
        function stackSetAmount(pid, val) {
            if (!myStack[pid]) return;
            const n = parseFloat(String(val).replace(',', '.'));
            myStack[pid].amount = isNaN(n) ? 0 : n;
            saveStack();
            renderStackNutrients(); // nur Nährwerte neu → Eingabefokus bleibt erhalten
        }

        function renderStackAddList(query) {
            const box = document.getElementById('stackAddList');
            if (!box) return;
            const q = (query || '').toLowerCase().trim();
            if (!q) { box.innerHTML = ''; return; }
            const matches = PRODUCTS.filter(p =>
                !myStack[p.id] &&
                (p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q))
            ).slice(0, 8);
            if (matches.length === 0) { box.innerHTML = '<div class="stack-empty">Kein Produkt gefunden.</div>'; return; }
            box.innerHTML = matches.map(p => {
                const sold = PRODUCT_BADGES[p.id] && PRODUCT_BADGES[p.id].type === 'soldout';
                return `<button class="stack-add-row" onclick="stackAdd('${p.id}')">
                    <span><span style="margin-right:6px;">${p.icon}</span>${p.name}${sold ? ' <span style="color:#f87171;font-size:9px;">(ausverkauft)</span>' : ''}</span>
                    <span class="stack-add-plus">+ Hinzufügen</span>
                </button>`;
            }).join('');
        }

        function renderStackSelected() {
            const box = document.getElementById('stackSelected');
            if (!box) return;
            const ids = Object.keys(myStack);
            if (ids.length === 0) {
                box.innerHTML = '<div class="stack-empty">Noch nichts gewählt. Suche oben ein Produkt und tippe auf „+".</div>';
                return;
            }
            box.innerHTML = '<div class="stack-sel-head"><span class="stack-sel-title">Deine Auswahl</span>' +
                '<button class="stack-reco-btn" onclick="stackResetAmounts()">↺ Empfohlene Mengen</button></div>' + ids.map(pid => {
                const p = getProductById(pid);
                if (!p) return '';
                const { unit } = parseServing(p.serving);
                return `<div class="stack-item">
                    <div class="stack-item-top">
                        <span class="stack-item-name"><span style="margin-right:6px;">${p.icon}</span>${p.name}</span>
                        <button class="stack-item-del" onclick="stackRemove('${pid}')">✕</button>
                    </div>
                    <div class="stack-item-amount">
                        <button class="stack-step" onclick="stackStep('${pid}', -1)" aria-label="weniger">−</button>
                        <input type="text" inputmode="decimal" class="stack-amount-input"
                               value="${myStack[pid].amount}" oninput="stackSetAmount('${pid}', this.value)">
                        <button class="stack-step" onclick="stackStep('${pid}', 1)" aria-label="mehr">+</button>
                        <span class="stack-unit">${unit}</span>
                        <span class="stack-base">1 Portion = ${p.serving}</span>
                    </div>
                </div>`;
            }).join('');
        }

        // +/− Schritt für die Menge (Gramm in 5er-Schritten, sonst 1er)
        function stackStep(pid, dir) {
            if (!myStack[pid]) return;
            const p = getProductById(pid);
            if (!p) return;
            const unit = parseServing(p.serving).unit;
            const step = unit === 'g' ? 5 : (unit === 'ml' ? 10 : 1);
            let v = (myStack[pid].amount || 0) + dir * step;
            if (v < 0) v = 0;
            myStack[pid].amount = Math.round(v * 10) / 10;
            saveStack();
            renderStackSelected();
            renderStackNutrients();
            refreshStackBrowseIfOpen();
        }

        // Alle Mengen auf die empfohlene Portion zurücksetzen
        function stackResetAmounts() {
            Object.keys(myStack).forEach(pid => {
                const p = getProductById(pid);
                if (p) myStack[pid].amount = parseServing(p.serving).num;
            });
            saveStack();
            renderStackSelected();
            renderStackNutrients();
        }

        function computeStack() {
            const nrvMap = {};
            let prot = 0, carb = 0, fat = 0, kcal = 0;
            Object.keys(myStack).forEach(pid => {
                const p = getProductById(pid);
                if (!p) return;
                const base = parseServing(p.serving).num || 1;
                const factor = (myStack[pid].amount || 0) / base;
                prot += (p.protein || 0) * factor;
                carb += (p.carbs || 0) * factor;
                fat  += (p.fat || 0) * factor;
                kcal += (p.kcal || 0) * factor;
                if (!p.nutrients) return;
                p.nutrients.forEach(n => {
                    if ((n.label.startsWith('—') && n.nrv === null) || MACRO_SKIP.has(n.label)) return;
                    if (n.nrv === null) return;
                    const raw = n.label.startsWith('— ') ? n.label.slice(2) : n.label;
                    const canon = LABEL_CANON[raw] || raw;
                    if (!nrvMap[canon]) nrvMap[canon] = { total: 0, sources: [] };
                    const contrib = n.nrv * factor;
                    nrvMap[canon].total += contrib;
                    nrvMap[canon].sources.push({ name: p.name, pct: contrib });
                });
            });
            return { prot, carb, fat, kcal, nrvMap };
        }

        // Markennamen für kompakte Quellenanzeige kürzen
        function shortName(name) {
            return name.replace(/^(ZEC\+|HEALTH\+|Robert Franz|WICK)\s*/i, '').replace(/^ZEC\+\s*/i, '').trim();
        }

        function renderStackNutrients() {
            const box = document.getElementById('stackNutrients');
            if (!box) return;
            box.innerHTML = buildStackNutrientsHtml();
        }

        function buildStackNutrientsHtml(title) {
            if (Object.keys(myStack).length === 0) return '';
            const { prot, carb, fat, kcal, nrvMap } = computeStack();

            const macroHtml = `<div class="daily-nutr-box light-macros" style="margin-top:14px;">
                <div class="light-macros-title">${title || 'Dein Stack insgesamt'}</div>
                <div class="light-macros-grid">
                    <div><span class="lm-val" style="color:#4ade80;">${Math.round(prot)} g</span><span class="lm-lbl">Eiweiß</span></div>
                    <div><span class="lm-val" style="color:#fbbf24;">${Math.round(carb)} g</span><span class="lm-lbl">Kohlenhydrate</span></div>
                    <div><span class="lm-val" style="color:#f87171;">${Math.round(fat)} g</span><span class="lm-lbl">Fett</span></div>
                    <div><span class="lm-val" style="color:#a5b4fc;">${Math.round(kcal)}</span><span class="lm-lbl">Kalorien</span></div>
                </div>
            </div>`;

            const nrvEntries = Object.entries(nrvMap).sort((a, b) => b[1].total - a[1].total);
            let barsHtml = '';
            if (nrvEntries.length > 0) {
                const rows = nrvEntries.map(([label, data]) => {
                    const pct = data.total;
                    const norm = NUTRIENT_NORMS[label];
                    const fillPct = Math.min(pct, 300) / 300 * 100;
                    const overUL = norm && norm.ul && norm.ul > norm.v && (pct / 100) * norm.v >= norm.ul;
                    const barColor = overUL ? '#7f1d1d' : pct >= 200 ? '#f59e0b' : pct >= 100 ? '#22c55e' : pct >= 50 ? '#f97316' : '#ef4444';
                    const valColor = overUL ? '#fca5a5' : pct >= 200 ? '#fbbf24' : pct >= 100 ? '#4ade80' : pct >= 50 ? '#fb923c' : '#f87171';
                    let amountStr = '';
                    if (norm) {
                        const consumed = (pct / 100) * norm.v;
                        amountStr = (consumed >= 1000 ? Math.round(consumed) : fmtDe(consumed)) + ' ' + norm.u + ' · ';
                    }
                    const normLine = norm
                        ? `<div class="daily-nrv-norms"><span>EU: <span class="daily-nrv-norms-val">${norm.eu}</span></span>${norm.ul ? '<span class="daily-nrv-norms-sep">·</span><span>UL: <span style="color:#f87171;">' + norm.ul_str + '</span></span>' : ''}</div>`
                        : '';
                    // Quellen: welches Produkt liefert wie viel %
                    const srcHtml = '<div class="stack-src">aus: ' + data.sources
                        .sort((a, b) => b.pct - a.pct)
                        .map(s => `${shortName(s.name)} <span style="color:#64748b;">(${Math.round(s.pct)}%)</span>`)
                        .join(' · ') + '</div>';
                    return `<div class="daily-nrv-row">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
                            <span class="daily-nrv-name">${label}</span>
                            <span style="color:${valColor};font-size:12px;font-weight:700;">${amountStr}${Math.round(pct)}% NRV</span>
                        </div>
                        <div class="daily-nrv-track"><div class="daily-nrv-fill" style="width:${fillPct.toFixed(1)}%;background:${barColor};"></div></div>
                        ${normLine}
                        ${srcHtml}
                    </div>`;
                }).join('');
                barsHtml = `<div class="daily-nutr-box" style="margin-top:8px;"><div class="daily-nutr-section">
                    <div class="daily-nutr-section-title">Mikronährstoffe – Ist-Zufuhr (% NRV)</div>
                    ${rows}
                    <div style="font-size:9px;color:#1e3a5f;margin-top:8px;">Hochgerechnet auf deine Mengen · Balken bis 300% · EU-NRV Nr. 1169/2011</div>
                </div></div>`;
            }

            return macroHtml + barsHtml;
        }

        function renderStackView() {
            const inp = document.getElementById('stackSearchInput');
            renderStackAddList(inp ? inp.value : '');
            renderStackSelected();
            renderStackNutrients();
            const browse = document.getElementById('stackBrowseList');
            if (browse && browse.style.display !== 'none') renderStackBrowse();
        }

        // A–Z-Liste auf-/zuklappen
        function toggleStackBrowse() {
            const list = document.getElementById('stackBrowseList');
            const arrow = document.getElementById('stackBrowseArrow');
            const open = list.style.display !== 'none';
            list.style.display = open ? 'none' : 'block';
            arrow.textContent = open ? '▼' : '▲';
            if (!open) renderStackBrowse();
        }

        // Im Stack? → entfernen, sonst → hinzufügen (für die A–Z-Liste)
        function stackToggle(pid) {
            if (myStack[pid]) stackRemove(pid);
            else {
                const p = getProductById(pid);
                if (!p) return;
                myStack[pid] = { amount: parseServing(p.serving).num };
                saveStack();
                renderStackSelected();
                renderStackNutrients();
            }
            renderStackBrowse();
        }

        // Generieren-Panel auf-/zuklappen
        function toggleStackGen() {
            const panel = document.getElementById('stackGenPanel');
            const open = panel.style.display !== 'none';
            panel.style.display = open ? 'none' : 'block';
            if (!open) {
                // Tagestyp + Trainingszeit aus aktuellem Zustand vorbelegen
                document.getElementById('stackGenDay').value = currentDayType;
                const t = document.getElementById('stackGenTrain');
                const f = document.getElementById('stackGenFlex');
                if (globalTrainTimeStr) { t.value = globalTrainTimeStr; t.style.opacity = '1'; f.checked = false; }
                else { f.checked = true; t.style.opacity = '0.45'; }
            }
        }

        // Tagesplan aus dem Stack erzeugen
        function generateStackPlan() {
            if (Object.keys(myStack).length === 0) {
                alert("Dein Stack ist leer – füge zuerst Produkte hinzu.");
                return;
            }
            const dayType = document.getElementById('stackGenDay').value;
            const flex = document.getElementById('stackGenFlex').checked;
            const tval = document.getElementById('stackGenTrain').value;
            setBaseTrainTimes((flex || !tval) ? [] : [tval]);
            try { store.setItem('sl_train', baseTrainTimes.join(',')); } catch (e) {}

            stackPlanActive = true;
            selectDayType(dayType);                        // setzt Tagestyp + rendert Timeline (Stack-Modus)
            activeSection('tabTimeline', 'viewTimeline');  // zum Tagesplan wechseln
            window.scrollTo(0, 0);
        }

        // Zurück zum vollständigen (empfohlenen) Plan
        function exitStackPlan() {
            stackPlanActive = false;
            renderTimeline();
        }

        // ── MONEY – Finanzen ───────────────────────────────────────────────────────
        let moneyData = { income: [], costs: [] };

        function loadMoney() {
            try { moneyData = JSON.parse(store.getItem('sl_money') || '{}') || {}; } catch (e) { moneyData = {}; }
            if (!moneyData.income) moneyData.income = [];
            if (!moneyData.costs)  moneyData.costs  = [];
            if (!moneyData.budget) moneyData.budget = { supps: 0, food: 0 };
        }
        function saveMoney() {
            try { store.setItem('sl_money', JSON.stringify(moneyData)); } catch (e) {}
        }
        function eur(n) {
            return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
        }
        function parseEur(v) {
            const n = parseFloat(String(v).replace(/\./g, '').replace(',', '.'));
            return isNaN(n) ? 0 : n;
        }

        function addIncome() {
            const name = document.getElementById('incomeName').value.trim();
            const amt = parseEur(document.getElementById('incomeAmt').value);
            if (!name && !amt) return;
            moneyData.income.push({ name: name || 'Einkommen', amount: amt });
            saveMoney();
            document.getElementById('incomeName').value = '';
            document.getElementById('incomeAmt').value = '';
            renderMoney();
        }
        function addCost() {
            const name = document.getElementById('costName').value.trim();
            const monthly = parseEur(document.getElementById('costMonthly').value);
            const debt = parseEur(document.getElementById('costDebt').value);
            if (!name && !monthly && !debt) return;
            moneyData.costs.push({ name: name || 'Kosten', monthly: monthly, debt: debt });
            saveMoney();
            document.getElementById('costName').value = '';
            document.getElementById('costMonthly').value = '';
            document.getElementById('costDebt').value = '';
            renderMoney();
        }
        function removeIncome(i) { moneyData.income.splice(i, 1); saveMoney(); renderMoney(); }
        function removeCost(i)   { moneyData.costs.splice(i, 1);  saveMoney(); renderMoney(); }

        function renderMoney() {
            const incBox = document.getElementById('moneyIncomeList');
            const costBox = document.getElementById('moneyCostList');
            const resBox = document.getElementById('moneyResult');
            if (!incBox || !costBox || !resBox) return;

            const totalIncome  = moneyData.income.reduce((s, e) => s + (e.amount || 0), 0);
            const totalMonthly = moneyData.costs.reduce((s, e) => s + (e.monthly || 0), 0);
            const totalDebt    = moneyData.costs.reduce((s, e) => s + (e.debt || 0), 0);
            const left = totalIncome - totalMonthly;

            incBox.innerHTML = moneyData.income.length === 0
                ? '<div class="stack-empty">Noch kein Einkommen eingetragen.</div>'
                : moneyData.income.map((e, i) => `<div class="money-item">
                        <span class="money-item-name">${e.name}</span>
                        <span class="money-item-val" style="color:#4ade80;">${eur(e.amount || 0)}</span>
                        <button class="stack-item-del" onclick="removeIncome(${i})">✕</button>
                    </div>`).join('');

            costBox.innerHTML = moneyData.costs.length === 0
                ? '<div class="stack-empty">Noch keine Fixkosten eingetragen.</div>'
                : moneyData.costs.map((e, i) => `<div class="money-item">
                        <span class="money-item-name">${e.name}</span>
                        <span class="money-item-val" style="color:#f87171;">${eur(e.monthly || 0)}${e.debt ? `<span class="money-debt">Rest ${eur(e.debt)}</span>` : ''}</span>
                        <button class="stack-item-del" onclick="removeCost(${i})">✕</button>
                    </div>`).join('');

            const leftColor = left >= 0 ? '#a5b4fc' : '#f87171';
            resBox.innerHTML = `
                <div class="money-result-row"><span>Einkommen</span><span style="color:#4ade80;">${eur(totalIncome)}</span></div>
                <div class="money-result-row"><span>− Fixkosten & Raten</span><span style="color:#f87171;">${eur(totalMonthly)}</span></div>
                <div class="money-result-big">
                    <div class="money-result-big-lbl">Verfügbar nach Fixkosten</div>
                    <div class="money-result-big-val" style="color:${leftColor};">${eur(left)}</div>
                </div>
                ${totalDebt > 0 ? `<div class="money-result-row" style="margin-top:8px;border-top:1px solid #1e293b;padding-top:8px;"><span>Gesamte Restschulden</span><span style="color:#fb923c;">${eur(totalDebt)}</span></div>` : ''}
            `;

            renderMoneyBudget(left);
        }

        // Budget aufteilen: Supplements, Nahrung → Rest zum Sparen
        function renderMoneyBudget(available) {
            const box = document.getElementById('moneyBudget');
            if (!box) return;
            const supps = moneyData.budget.supps || 0;
            const food  = moneyData.budget.food  || 0;
            box.innerHTML = `
                <div class="money-sec-head"><span>📊 Budget aufteilen</span></div>
                <div class="money-budget-row">
                    <span class="money-budget-lbl">💊 Supplements</span>
                    <input type="text" inputmode="decimal" class="money-input money-budget-input" id="budgetSupps"
                           value="${supps ? fmtDe(supps) : ''}" placeholder="€ / Monat" oninput="setBudgetVal('supps', this.value)">
                </div>
                <div class="money-budget-row">
                    <span class="money-budget-lbl">🍗 Nahrung</span>
                    <input type="text" inputmode="decimal" class="money-input money-budget-input" id="budgetFood"
                           value="${food ? fmtDe(food) : ''}" placeholder="€ / Monat" oninput="setBudgetVal('food', this.value)">
                </div>
                <div class="money-result-row" style="margin-top:10px;"><span>Verfügbar</span><span style="color:#a5b4fc;">${eur(available)}</span></div>
                <div class="money-result-row"><span>− Supplements + Nahrung</span><span id="moneyKonsum" style="color:#fb923c;">${eur(supps + food)}</span></div>
                <div class="money-result-big" style="border-top-color:#166534;">
                    <div class="money-result-big-lbl">💰 Zum Sparen übrig</div>
                    <div class="money-result-big-val" id="moneySavings"></div>
                </div>`;
            updateSavings();
        }

        function setBudgetVal(type, val) {
            moneyData.budget[type === 'supps' ? 'supps' : 'food'] = parseEur(val);
            saveMoney();
            // nur die Summen aktualisieren → Eingabefokus bleibt erhalten
            const konsum = (moneyData.budget.supps || 0) + (moneyData.budget.food || 0);
            const k = document.getElementById('moneyKonsum');
            if (k) k.textContent = eur(konsum);
            updateSavings();
        }

        function updateSavings() {
            const el = document.getElementById('moneySavings');
            if (!el) return;
            const totalIncome  = moneyData.income.reduce((s, e) => s + (e.amount || 0), 0);
            const totalMonthly = moneyData.costs.reduce((s, e) => s + (e.monthly || 0), 0);
            const konsum = (moneyData.budget.supps || 0) + (moneyData.budget.food || 0);
            const savings = totalIncome - totalMonthly - konsum;
            el.textContent = eur(savings);
            el.style.color = savings >= 0 ? '#4ade80' : '#f87171';
        }

        function renderStackBrowse() {
            const box = document.getElementById('stackBrowseList');
            if (!box) return;
            const sorted = [...PRODUCTS].sort((a, b) => a.name.localeCompare(b.name, 'de'));
            box.innerHTML = sorted.map(p => {
                const inStack = !!myStack[p.id];
                const sold = PRODUCT_BADGES[p.id] && PRODUCT_BADGES[p.id].type === 'soldout';
                return `<button class="stack-browse-row${inStack ? ' in-stack' : ''}" onclick="stackToggle('${p.id}')">
                    <span class="stack-browse-name"><span style="margin-right:6px;">${p.icon}</span>${p.name}${sold ? ' <span style="color:#f87171;font-size:9px;">(ausverkauft)</span>' : ''}</span>
                    <span class="stack-browse-act">${inStack ? '✓ Drin' : '+ Hinzufügen'}</span>
                </button>`;
            }).join('');
        }

        // ── TAGESTYP (Training / Frei / Carb / Autophagie / Wasserfasten / Keto) ──────
        let currentDayType = 'training';
        let stackPlanActive = false;   // true = Tagesplan nur aus „Mein Stack"
        let userWantsEmptyPlan = false; // true = bewusst leerer Plan (selbst befüllen)
        // Alle empfohlenen Produkte (aus dem Standard-Tagesplan)
        let RECOMMENDED_IDS = new Set();
        const DAYTYPES = ['training','rest','recovery','carb','autophagy','water','keto'];
        // Tagestyp-Texte kommen aus data/app/daytypes.json (Daten/Logik getrennt) und
        // werden nach dem Laden befüllt – siehe loadData()-Block weiter unten.
        let DAYTYPE_LABELS = {};
        // Recovery-/Verletzungstag: Supplemente, die Geweberegeneration & Entzündungsdämpfung unterstützen
        const RECOVERY_IDS = ['p38','p39','p28','p21','p22','p24','p16']; // Kollagen, Gelenke, Omega-3, Vit C, Vit D, Zink, Glycin

        // Pre-Workout Stim-/Pump-Booster – an trainingsfreien Tagen überflüssig
        const BOOSTER_IDS = new Set(['p43','p44','p45','p46','p47']);
        // Schnelle Post-Workout-Kohlenhydrate / Gainer – nur zur Glykogen-Auffüllung nach dem Training
        const FASTCARB_IDS = new Set(['p8','p9']);
        // Kohlenhydrat-Quellen für Carb-Loading (verfügbar, nicht ausverkauft)
        const CARBLOAD_INJECT = { p9: "Maltodextrin", p12: "Instant Rice Pudding" };
        // Elektrolyt-/Mineral-Produkt fürs Wasserfasten (kalorienfrei, sicherheitsrelevant)
        const WATERFAST_KEEP = new Set(['p26']);

        // Detail-Hinweise (Hard) & Klartext-Hinweise (Easy) – ebenfalls aus
        // data/app/daytypes.json, nach dem Laden befüllt (siehe loadData()-Block).
        let DAYTYPE_HINTS = {};
        let DAYTYPE_HINTS_EASY = {};
        // Liefert den Hinweis passend zum Modus (Easy = Klartext, Hard = Details).
        function dayHint(type) {
            if (appMode === 'light' && DAYTYPE_HINTS_EASY[type]) return DAYTYPE_HINTS_EASY[type];
            return DAYTYPE_HINTS[type] || '';
        }

        function selectDayType(type) {
            currentDayType = type;
            DAYTYPES.forEach(t => {
                const btn = document.getElementById('dt' + t.charAt(0).toUpperCase() + t.slice(1));
                if (btn) btn.classList.toggle('active', t === type);
            });
            const hint = document.getElementById('dayTypeHint');
            if (hint) hint.innerHTML = dayHint(type);
            renderTimeline();
        }

        // ── WOCHENPLAN (Mo–So: Training oder Pause + optionale feste Uhrzeit) ────────
        // Der Nutzer legt seine Woche einmal fest; die App stellt sich jeden Tag
        // automatisch auf den richtigen Tagestyp (Training/Pause) ein.
        const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        const WEEKDAYS_FULL = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
        function defaultWeek() {
            // Typischer Split: Mo/Di trainieren, Mi Pause, Do/Fr trainieren, Wochenende frei.
            return [true, true, false, true, true, false, false].map(t => ({ train: t, time: '' }));
        }
        let weekPlan = null;
        function loadWeek() {
            if (weekPlan) return weekPlan;
            try {
                const raw = JSON.parse(store.getItem('sl_week') || 'null');
                if (Array.isArray(raw) && raw.length === 7) {
                    weekPlan = raw.map(e => ({ train: !!(e && e.train), time: (e && typeof e.time === 'string') ? e.time : '' }));
                    return weekPlan;
                }
            } catch (e) {}
            weekPlan = defaultWeek();
            return weekPlan;
        }
        function saveWeek() { try { store.setItem('sl_week', JSON.stringify(weekPlan)); } catch (e) {} }
        function todayIdx() { return (new Date().getDay() + 6) % 7; }   // 0 = Montag

        // Stellt Tagestyp & (falls hinterlegt) Trainingszeit passend zum heutigen Tag ein.
        function applyWeekToday() {
            const wk = loadWeek();
            const e = wk[todayIdx()];
            if (!e) return;
            currentDayType = e.train ? 'training' : 'rest';
            // Effektive Trainingszeiten: Tages-Override (eine Einheit) sonst der globale
            // Standard aus dem Setup (mehrere Einheiten). An Ruhetagen bleiben die Zeiten
            // verfügbar, werden aber vom Ruhetag-Plan (ohne Workout-Blöcke) ignoriert –
            // so erscheinen sie sofort, falls man manuell auf „Trainingstag" wechselt.
            globalTrainTimes = (e.train && e.time) ? [e.time] : [...baseTrainTimes];
            syncTrainStr();
            DAYTYPES.forEach(t => {
                const btn = document.getElementById('dt' + t.charAt(0).toUpperCase() + t.slice(1));
                if (btn) btn.classList.toggle('active', t === currentDayType);
            });
        }

        function renderWeek() {
            const el = document.getElementById('viewWeek');
            if (!el) return;
            const wk = loadWeek();
            const ti = todayIdx();
            const trainCount = wk.filter(e => e.train).length;
            const rows = wk.map((e, i) => {
                const today = i === ti;
                return `<div class="week-row${today ? ' today' : ''}">
                    <div class="week-day">${WEEKDAYS_FULL[i]}${today ? ' <span class="week-today-badge">heute</span>' : ''}</div>
                    <div class="week-toggle">
                        <button class="week-btn train${e.train ? ' active' : ''}" onclick="setWeekDay(${i}, true)">🏋️ Training</button>
                        <button class="week-btn rest${!e.train ? ' active' : ''}" onclick="setWeekDay(${i}, false)">🛌 Pause</button>
                    </div>
                    <div class="week-time">
                        <label>Uhrzeit</label>
                        <input type="time" value="${e.time || ''}" ${e.train ? '' : 'disabled'} onchange="setWeekTime(${i}, this.value)">
                    </div>
                </div>`;
            }).join('');
            el.innerHTML = `<div class="week-head">
                    <h2>📅 Dein Wochenplan</h2>
                    <p class="week-intro">Trag ein, wann du trainierst und wann Pause ist – die App stellt sich jeden Tag automatisch darauf ein. <strong>Heute</strong> ist markiert. Leere Uhrzeit = deine Standard-Trainingszeit.</p>
                    <div class="week-summary">${trainCount} Trainingstage · ${7 - trainCount} Pausentage</div>
                </div>${rows}`;
        }

        // Tag als Training/Pause setzen; wenn der heutige Tag betroffen ist, App live nachziehen.
        function setWeekDay(i, train) {
            const wk = loadWeek();
            if (!wk[i]) return;
            wk[i].train = !!train;
            saveWeek();
            renderWeek();
            if (i === todayIdx()) {
                applyWeekToday();
                const hint = document.getElementById('dayTypeHint');
                if (hint) hint.innerHTML = dayHint(currentDayType);
                renderTimeline();
            }
            renderDashboard();
        }
        // Feste Uhrzeit für einen Trainingstag hinterlegen (leer = Standardzeit).
        function setWeekTime(i, time) {
            const wk = loadWeek();
            if (!wk[i]) return;
            wk[i].time = time || '';
            saveWeek();
            if (i === todayIdx() && wk[i].train) {
                globalTrainTimes = wk[i].time ? [wk[i].time] : [...baseTrainTimes];
                syncTrainStr();
                renderTimeline();
            }
        }

        function getActiveTimeline() {
            switch (currentDayType) {
                case 'rest':      return buildRestTimeline();
                case 'recovery':  return buildRecoveryTimeline();
                case 'carb':      return buildCarbTimeline();
                case 'autophagy': return filterTimeline(
                                       p => (p.protein||0)===0 && (p.carbs||0)===0 && (p.kcal||0)<=5,
                                       "Fastenfenster: nur Wasser & kalorienfreie Mikronährstoffe. Kein Protein/keine Kalorien – sonst stoppt die Autophagie.");
                case 'water':     return filterTimeline(
                                       (p, pid) => WATERFAST_KEEP.has(pid),
                                       "Striktes Wasserfasten: ausschließlich Wasser + Elektrolyte. Keine Kalorien, keine sonstigen Supplemente.");
                case 'keto':      return filterTimeline(
                                       p => (p.carbs||0) <= 10,
                                       null);
                default:          return TIMELINE_CONFIG;
            }
        }

        // Generischer Filter: behält pro Block nur Produkte, die keepFn erfüllt;
        // leere Blöcke fallen weg. whyOverride ersetzt optional die Begründung.
        function filterTimeline(keepFn, whyOverride) {
            return TIMELINE_CONFIG
                .map(b => {
                    const productIds = b.productIds.filter(pid => {
                        const p = getProductById(pid);
                        return p && keepFn(p, pid, b);
                    });
                    const notes = {}, priority = {};
                    productIds.forEach(pid => {
                        if (b.notes[pid]) notes[pid] = b.notes[pid];
                        if (b.priority[pid]) priority[pid] = b.priority[pid];
                    });
                    const out = { ...b, productIds, notes, priority };
                    if (whyOverride) out.why = ": WASSER: reichlich über den Tag verteilt.<br><br>" + whyOverride;
                    return out;
                })
                .filter(b => b.productIds.length > 0);
        }

        // Trainingsfreier Tag: Pre-Workout entfällt, Post-Workout ohne schnelle Carbs/Gainer
        function buildRestTimeline() {
            return TIMELINE_CONFIG
                .filter(b => b.id !== 't4')
                .map(b => {
                    if (b.id !== 't6') return b;
                    const productIds = b.productIds.filter(pid => !FASTCARB_IDS.has(pid));
                    const notes = { ...b.notes };
                    const priority = { ...b.priority };
                    FASTCARB_IDS.forEach(pid => { delete notes[pid]; delete priority[pid]; });
                    return {
                        ...b,
                        label: "Protein & Regeneration",
                        why: ": WASSER: 400ml – 500ml.<br><br>Trainingsfreier Tag: <strong>Kein anaboles Fenster</strong> – Glykogenspeicher sind gefüllt, schnelle Kohlenhydrate (Maltodextrin/Gainer) entfallen. Protein bleibt wichtig (Leucin-Trigger alle 3–4h für MPS). Kreatin weiterhin täglich – kumulativ, Zeitpunkt egal.",
                        productIds, notes, priority
                    };
                });
        }

        // Verletzungs-/Recovery-Tag: kein Training (Pre-Workout entfällt), Stimulanzien & schnelle
        // Carbs raus, Heilungs-Supplemente (Kollagen, Omega-3, Vitamine) ins Frühstück einspielen.
        function buildRecoveryTimeline() {
            return TIMELINE_CONFIG
                .filter(b => b.id !== 't4')
                .map(b => {
                    let productIds = b.productIds.filter(pid => !BOOSTER_IDS.has(pid) && !FASTCARB_IDS.has(pid));
                    const notes = { ...b.notes };
                    const priority = { ...b.priority };
                    [...BOOSTER_IDS, ...FASTCARB_IDS].forEach(pid => { delete notes[pid]; delete priority[pid]; });
                    if (b.id === 't2') {
                        RECOVERY_IDS.forEach(pid => {
                            if (PRODUCT_BADGES[pid] && PRODUCT_BADGES[pid].type === 'soldout') return;
                            if (!getProductById(pid)) return;
                            if (!productIds.includes(pid)) productIds.push(pid);
                            notes[pid] = "RECOVERY: unterstützt die Heilung von Gewebe & Gelenken und dämpft Entzündung – Kollagen + Vitamin C fürs Bindegewebe, Omega-3 entzündungshemmend, Vitamin D & Zink fürs Immunsystem.";
                            priority[pid] = "WICHTIG";
                        });
                        return {
                            ...b,
                            label: "Recovery & Regeneration",
                            why: ": WASSER: reichlich über den Tag.<br><br>Verletzungs-/Recovery-Tag: Fokus auf Geweberegeneration und Entzündungsdämpfung. Eiweiß hoch halten (Muskelerhalt in der Trainingspause), Kollagen + Vitamin C ~30–60 min vor Belastung/Physio. Belastung dosieren – kein Schmerz. Bei starken oder anhaltenden Beschwerden zum Arzt/Physiotherapeuten.",
                            productIds, notes, priority
                        };
                    }
                    return { ...b, productIds, notes, priority };
                })
                .filter(b => b.productIds.length > 0);
        }

        // Carb-Loading: Trainingsplan + Carbs zu Frühstück, Mittag- & Abendessen
        function buildCarbTimeline() {
            const carbMeals = new Set(['t2','t7','t9']);
            return TIMELINE_CONFIG.map(b => {
                if (!carbMeals.has(b.id)) return b;
                const productIds = [...b.productIds];
                const notes = { ...b.notes };
                const priority = { ...b.priority };
                Object.keys(CARBLOAD_INJECT).forEach(pid => {
                    if (PRODUCT_BADGES[pid] && PRODUCT_BADGES[pid].type === 'soldout') return;
                    if (!productIds.includes(pid)) {
                        productIds.push(pid);
                        notes[pid] = "CARB-LOADING: Extra-Kohlenhydrate zur Glykogen-Superkompensation. In Wasser/Milch einrühren – über den Tag verteilt 8–10 g Carbs/kg KG anpeilen.";
                        priority[pid] = "WICHTIG";
                    }
                });
                return { ...b, productIds, notes, priority };
            });
        }

        function renderTimeline() {
            const container = document.getElementById("viewTimeline");

            const wakeMin = (() => { const [h, m] = globalWakeTimeStr.split(':').map(Number); return h * 60 + m; })();
            const sleepMin = (() => { const [h, m] = globalSleepTimeStr.split(':').map(Number); return h * 60 + m; })();
            const awakeDuration = (sleepMin - wakeMin + 1440) % 1440;
            // Config wurde für 16h-Tag (960 min) entworfen – proportional stauchen/strecken
            const timeScale = awakeDuration / 960;
            function minutesSinceWake(block) {
                if (block.absoluteMinutes != null) return block.absoluteMinutes;
                return block.isRelativeTosleep
                    ? awakeDuration - block.offsetMinutes
                    : Math.round(block.offsetMinutes * timeScale);
            }
            function blockTimeWindow(block) {
                const msw = minutesSinceWake(block);
                const s = (wakeMin + msw) % 1440;
                const e = (s + block.duration) % 1440;
                const fmt = n => `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
                return `${fmt(s)} – ${fmt(e)}`;
            }
            // Trainingszeiten → Offsets ab Aufwachen (mehrere Einheiten möglich,
            // außerhalb der Wachzeit liegende werden verworfen), aufsteigend sortiert.
            // Gesundheits-Sperre: unter 6 h Schlaf kein Training.
            const sleepHrs = (1440 - awakeDuration) / 60;
            const trainOffsets = (sleepHrs < 6 ? [] : (globalTrainTimes || []))
                .map(ts => { const [th, tm] = ts.split(':').map(Number); return ((th * 60 + tm) - wakeMin + 1440) % 1440; })
                .filter(to => to >= 0 && to < awakeDuration)
                .sort((a, b) => a - b);

            // Pre-/Post-Workout je Einheit takten + Hinweise. Erste Einheit nutzt die
            // bestehenden Blöcke t4/t6; weitere Einheiten werden als Klone ergänzt.
            let activeBlocks = getActiveTimeline();
            if (trainOffsets.length) {
                const multi = trainOffsets.length > 1;
                const suffix = i => multi ? ` (${i + 1}. Einheit)` : '';
                const preTpl  = activeBlocks.find(b => b.id === 't4');
                const postTpl = activeBlocks.find(b => b.id === 't6');
                const extra = [];
                const preNoteFor = (to, i) => {
                    const late  = (awakeDuration - to) < 360; // < 6h vor Schlaf
                    const early = to < 90;                    // < 1,5h nach Aufwachen
                    let n = "";
                    if (i > 0) n += "<div style='color:#fca5a5;background:#1a0000;border:1px solid #7f1d1d;border-radius:8px;padding:8px 10px;margin-bottom:8px;font-weight:600;line-height:1.5;'>⚠️ Weitere Einheit heute: <strong>keine zweite Koffein-Dosis</strong>, wenn du vorher schon geboostet hast (Tagesgrenze ~400 mg, Herzfrequenz/Blutdruck). Nimm den <strong>koffeinfreien Pumpdown</strong> + Protein/Carbs.</div>";
                    if (late)  n += "<div style='color:#fca5a5;background:#1a0000;border:1px solid #7f1d1d;border-radius:8px;padding:8px 10px;margin-bottom:8px;font-weight:600;line-height:1.5;'>⚠️ Spätes Training: Koffein-Booster (Re-Act, Kickdown, Fight) ruinieren den Tiefschlaf (Koffein wirkt ~5–6h nach). Besser den <strong>koffeinfreien Pumpdown</strong> nehmen.</div>";
                    if (early) n += "<div style='color:#fcd34d;background:#1a1000;border:1px solid #92400e;border-radius:8px;padding:8px 10px;margin-bottom:8px;font-weight:600;line-height:1.5;'>🌅 Früh-Training: wenig Zeit vorher – Fokus auf <strong>schnelles Protein + Kohlenhydrate</strong>, kein großer Stack.</div>";
                    return n;
                };
                trainOffsets.forEach((to, i) => {
                    if (i === 0) {
                        const note = preNoteFor(to, 0);
                        activeBlocks = activeBlocks.map(b => {
                            if (b.id === 't4') return { ...b, absoluteMinutes: Math.max(0, to - b.duration), why: note + b.why, label: b.label + suffix(0) };
                            if (b.id === 't6') return { ...b, absoluteMinutes: Math.min(awakeDuration - b.duration, to + 60), label: b.label + suffix(0) };
                            return b;
                        });
                    } else {
                        if (preTpl)  extra.push({ ...preTpl,  id: 't4_' + (i + 1), absoluteMinutes: Math.max(0, to - preTpl.duration), why: preNoteFor(to, i) + preTpl.why, label: preTpl.label + suffix(i) });
                        if (postTpl) extra.push({ ...postTpl, id: 't6_' + (i + 1), absoluteMinutes: Math.min(awakeDuration - postTpl.duration, to + 60), label: postTpl.label + suffix(i) });
                    }
                });
                if (extra.length) activeBlocks = activeBlocks.concat(extra);
            }

            // Mahlzeiten-Blöcke auf die eigenen Zeiten takten (Frühstück → erste, Abendessen → letzte, Mittag → mittlere)
            const toOffset = (timeStr) => {
                if (!timeStr) return null;
                const [hh, mm] = timeStr.split(':').map(Number);
                const off = ((hh * 60 + mm) - wakeMin + 1440) % 1440;
                return (off >= 0 && off < awakeDuration) ? off : null;
            };
            // Mahlzeit-Anzahl & -Zeiten aus dem Setup in den Plan übernehmen. Die drei
            // fest verdrahteten Meal-Anker (t2 Frühstück, t7 Mittag, t9 Abend) werden
            // durch genau die gewählten Mahlzeiten ersetzt; ihre mahlzeitgebundenen
            // Supplemente werden auf die neuen Blöcke verteilt (nichts geht verloren).
            const MEAL_IDS = ['t2', 't7', 't9'];
            if (!mealsAuto) {
                const t2 = activeBlocks.find(b => b.id === 't2');
                const t7 = activeBlocks.find(b => b.id === 't7');
                const t9 = activeBlocks.find(b => b.id === 't9');
                const style = t2 || t7 || t9;
                if (style) {
                    activeBlocks = activeBlocks.filter(b => !MEAL_IDS.includes(b.id));
                    const put = (anchor, blk) => {
                        if (!anchor || !blk) return;
                        anchor.productIds.forEach(p => { if (!blk.productIds.includes(p)) blk.productIds.push(p); });
                        blk.notes = { ...anchor.notes, ...blk.notes };
                        blk.priority = { ...anchor.priority, ...blk.priority };
                    };
                    if (globalMeals.length === 0) {
                        // 0 Mahlzeiten: mahlzeitgebundene Supplemente in einen frei wählbaren Block
                        const b = { ...style, id: 'tMealFree', label: 'Zu einer Mahlzeit (frei wählbar)',
                            absoluteMinutes: Math.round(awakeDuration * 0.4), productIds: [], notes: {}, priority: {},
                            why: ': Du hast 0 feste Mahlzeiten gewählt – nimm diese mahlzeitgebundenen Supplemente zu einer Mahlzeit deiner Wahl (fettlösliche Vitamine mit etwas Fett).' };
                        put(t2, b); put(t7, b); put(t9, b);
                        if (b.productIds.length) activeBlocks.push(b);
                    } else {
                        const blocks = globalMeals.map((tm, i) => {
                            const off = toOffset(tm);
                            return { ...style, id: 'tMeal' + (i + 1), label: (i + 1) + '. Mahlzeit',
                                absoluteMinutes: off != null ? off : Math.round(awakeDuration * (i + 1) / (globalMeals.length + 1)),
                                productIds: [], notes: {}, priority: {}, why: ': Mahlzeit – mit ausreichend Wasser.' };
                        });
                        put(t2, blocks[0]);
                        put(t9, blocks[blocks.length - 1]);
                        put(t7, blocks[Math.floor((blocks.length - 1) / 2)]);
                        activeBlocks = activeBlocks.concat(blocks);
                    }
                }
            }

            // Gesundheits-Sperre: unter 6 h Schlaf keine Trainingsbelastung – Pre-/Post-
            // Workout-Blöcke (inkl. weiterer Einheiten) entfernen, Rest bleibt im Plan.
            let sleepBanner = "";
            if (sleepHrs < 6) {
                activeBlocks = activeBlocks.filter(b => !/^t4/.test(b.id) && !/^t6/.test(b.id));
                sleepBanner = `<div class="sleep-block-banner">🚫 <strong>Training gesperrt:</strong> nur ${sleepHrs.toFixed(1)} h Schlaf. Unter 6 h keine Trainingsbelastung – Regeneration hat Vorrang. Supplemente & Mahlzeiten bleiben im Plan.</div>`;
            }

            // Stack-Plan: nur Produkte aus „Mein Stack" einplanen
            let stackBanner = "";
            if (stackPlanActive) {
                const stackIds = new Set(Object.keys(myStack));
                const placed = new Set();
                let blocks = activeBlocks.map(b => {
                    const productIds = b.productIds.filter(pid => stackIds.has(pid));
                    productIds.forEach(pid => placed.add(pid));
                    // Feinschliff: nur Wasser-/Warn-Zeile behalten, keine Hinweise auf fremde Produkte
                    const why = (b.why || '').split('<br><br>')[0];
                    return { ...b, productIds, why };
                }).filter(b => b.productIds.length > 0);
                const leftover = [...stackIds].filter(pid => !placed.has(pid) && getProductById(pid));
                if (leftover.length > 0) {
                    blocks.push({
                        id: 'tStackRest', label: 'Frei wählbar (zu einer Mahlzeit)', offsetMinutes: 120, duration: 30,
                        icon: '', color: '#94a3b8', bg: '#0c0c1e', border: '#334155',
                        why: ': Diese Produkte aus deinem Stack haben kein festes Zeitfenster – verteile sie über den Tag zu den Mahlzeiten.',
                        productIds: leftover, notes: {}, priority: {}
                    });
                }
                activeBlocks = blocks;
                stackBanner = `<div class="stack-plan-banner">
                    <div>⚡ <strong>Dein persönlicher Tagesplan</strong> aus deinem Stack · ${DAYTYPE_LABELS[currentDayType] || ''} · ${Object.keys(myStack).length} Produkte</div>
                    <button class="stack-plan-back" onclick="exitStackPlan()">← Zurück zum vollständigen Plan</button>
                </div>`;
            }

            const sortedBlocks = [...activeBlocks]
                .filter(block => { const v = minutesSinceWake(block); return v >= 0 && v < awakeDuration; })
                .sort((a, b) => minutesSinceWake(a) - minutesSinceWake(b));

            if (stackPlanActive && sortedBlocks.length === 0) {
                container.innerHTML = sleepBanner + stackBanner + '<div class="stack-empty" style="padding:20px 4px;">Dein Stack ist leer oder die Produkte passen nicht in diesen Tagestyp. Füge im Tab „Mein Stack" Produkte hinzu.</div>' + buildDailyNutrientsBox();
                return;
            }

            container.innerHTML = sleepBanner + stackBanner + sortedBlocks.map((block, idx) => {
                const isLast = idx === sortedBlocks.length - 1;
                const lineHtml = !isLast ? `<div class="timeline-line"></div>` : "";

                // Live-Kalkulation der getakteten Uhrzeit (skaliert)
                const finalTimeWindow = blockTimeWindow(block);

                const light = isLight();
                const SIMPLE_PRIO = { MUSS: "Unbedingt", WICHTIG: "Wichtig", OPTIONAL: "Wenn du magst" };

                let pListHtml = block.productIds.map(pid => {
                    const p = getProductById(pid);
                    if (!p) return "";
                    const prio = block.priority[pid] || "OPTIONAL";
                    const style = PRIO_STYLE[prio];
                    const stackAmt = (stackPlanActive && myStack[pid]) ? `${myStack[pid].amount} ${parseServing(p.serving).unit}` : null;
                    const recBadge = (stackPlanActive && RECOMMENDED_IDS.has(pid)) ? '<span class="rec-badge">empfohlen</span>' : '';

                    if (light) {
                        return `
                            <div class="sub-product-card">
                                <div class="sub-product-top">
                                    <div class="sub-product-title">
                                        <span>${p.icon}</span>
                                        <span>${p.name}</span>
                                    </div>
                                    <div style="display:flex; gap:5px; align-items:center;">
                                        <span class="prio-badge" style="background:${style.bg}; color:${style.color};">${SIMPLE_PRIO[prio] || prio}</span>
                                        <button class="info-trigger-btn" onclick="openProductOverlay('${p.id}')">?</button>
                                    </div>
                                </div>
                                <div class="light-serving">Menge: <strong>${stackAmt || p.serving}</strong></div>
                            </div>
                        `;
                    }

                    const noteHtml = block.notes[pid] ? `<div class="sub-product-note">${block.notes[pid]}</div>` : "";
                    return `
                        <div class="sub-product-card">
                            <div class="sub-product-top">
                                <div class="sub-product-title">
                                    <span>${p.icon}</span>
                                    <span>${p.name}</span>
                                    ${stackAmt ? `<span class="stack-amt-badge">${stackAmt}</span>` : ''}
                                    ${recBadge}
                                </div>
                                <div style="display:flex; gap:5px; align-items:center;">
                                    <span class="prio-badge" style="background:${style.bg}; color:${style.color};">${prio}</span>
                                    <button class="info-trigger-btn" onclick="openProductOverlay('${p.id}')">Info</button>
                                </div>
                            </div>
                            ${noteHtml}
                        </div>
                    `;
                }).join('');

                let whyHtml;
                if (light) {
                    const waterPart = (block.why.split('<br><br>')[0] || '').replace(/^:\s*/, '').trim();
                    whyHtml = `
                        <div class="why-box light-why">
                            <div class="why-text">💧 ${waterPart || 'Mit einem großen Glas Wasser einnehmen.'}</div>
                        </div>`;
                } else {
                    whyHtml = `
                        <div class="why-box" style="--bg:${block.bg}; --border:${block.border}; --color:${block.color};">
                            <div class="why-title" style="--color:${block.color}">Anweisungen & Wasserzufuhr</div>
                            <div class="why-text">${block.why}</div>
                        </div>`;
                }

                return `
                    <div class="timeline-item-container">
                        ${lineHtml}
                        <div class="timeline-card" id="tc-${block.id}" style="--border-color: ${block.color};">
                            <button class="card-trigger" onclick="toggleTimelineCard('${block.id}')" style="--bg:${block.bg}; --border:${block.border}; --color:${block.color};">
                                <div class="card-icon-box" style="--bg:${block.bg}; --border:${block.border};">
                                    ${block.icon}
                                </div>
                                <div class="card-info">
                                    <div class="card-label">${block.label}</div>
                                    <div class="card-time" style="--color:${block.color}">${finalTimeWindow}</div>
                                </div>
                                <div class="card-badge-box">
                                    <span class="card-count">${block.productIds.length}</span>
                                    <span class="card-arrow"></span>
                                </div>
                            </button>
                            <div class="card-content" id="tcc-${block.id}">
                                ${whyHtml}
                                <div class="item-list">
                                    ${pListHtml}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('') + buildDailyNutrientsBox();
        }

        function initDatabaseView() {
            const catBox = document.getElementById("dbCategoriesBox");
            catBox.innerHTML = CATS.map(c => `
                <button class="cat-btn ${c === currentCatFilter ? 'active' : ''}" id="cat-btn-${c}" onclick="filterCategory('${c}')">${c}</button>
            `).join('');
            renderFilteredProducts();
        }

        function renderFilteredProducts() {
            const listContainer = document.getElementById("dbCardList");
            const q = currentSearchQuery.toLowerCase();

            const filtered = PRODUCTS.filter(p => {
                const matchesCat = currentCatFilter === "Alle" || p.cat === currentCatFilter;
                const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.function.toLowerCase().includes(q);
                return matchesCat && matchesSearch;
            }).sort((a, b) => a.name.localeCompare(b.name, 'de'));

            document.getElementById("dbProductCount").innerText = `${filtered.length} Produkte`;
            document.getElementById("dbNoResults").style.display = filtered.length === 0 ? 'block' : 'none';

            listContainer.innerHTML = filtered.slice(0, RENDER_LIMIT).map(p => {
                const kj = Math.round(p.kcal * 4.184);
                const badge = PRODUCT_BADGES[p.id];
                let macroHtml = `
                    <div class="macros-box">
                        <div class="macros-title">NÄHRWERTE PRO PORTION (${p.serving})</div>
                        <table class="naehr-table">
                            <tr class="naehr-row-energy"><td>Brennwert</td><td>${kj} kJ / ${p.kcal} kcal</td></tr>
                            <tr class="naehr-row-fat"><td>Fett</td><td>${p.fat} g</td></tr>
                            <tr class="naehr-row-carbs"><td>Kohlenhydrate</td><td>${p.carbs} g</td></tr>
                            <tr class="naehr-row-protein"><td>Eiweiß</td><td>${p.protein} g</td></tr>
                        </table>
                    </div>
                `;

                const rows = [
                    { icon:"", label:"Funktion im Körper", val:p.function, col:"#22c55e" },
                    { icon:"", label:"Absorption", val:p.absorption, col:"#60a5fa" },
                    { icon:"", label:"Womit einnehmen", val:p.takeWith, col:"#a78bfa" },
                    { icon:"", label:"Womit konkurriert", val:p.competes, col:"#f97316" },
                    { icon:"", label:"Geschmack", val:p.geschmack, col:"#f472b6" },
                    { icon:"", label:"Löslichkeit", val:p.loeslichkeit, col:"#38bdf8" },
                    ...(p.ingredients ? [{ icon:"", label:"Zutaten", val:p.ingredients, col:"#64748b" }] : [])
                ];

                const detailsRowsHtml = rows.map(r => `
                    <div class="info-row" style="--row-color: ${r.col}">
                        <div class="info-row-title" style="--row-color: ${r.col}">${r.icon} ${r.label}</div>
                        <div class="info-row-val">${r.val}</div>
                    </div>
                `).join('');

                const flavor = PRODUCT_FLAVORS[p.id];
                return `
                    <div class="db-card" id="dbc-${p.id}">
                        <button class="db-card-trigger" onclick="toggleProductCard('${p.id}')">
                            <span class="db-card-icon">${p.icon}</span>
                            <div class="db-card-title-box">
                                <div class="db-card-name">${p.name}</div>
                                ${flavor ? `<div class="db-card-flavor">(${flavor})</div>` : ''}
                                <div class="db-card-cat">${p.cat}</div>
                            </div>
                            ${badge ? `<span class="prod-badge prod-badge-${badge.type}">${badge.text}</span>` : ''}
                            <span class="db-card-arrow"></span>
                        </button>
                        <div class="db-card-content" id="dbcc-${p.id}">
                            ${macroHtml}
                            ${buildNutrientsHtml(p)}
                            ${detailsRowsHtml}
                        </div>
                    </div>
                `;
            }).join('');
        }

        function buildNutrientsHtml(p) {
            if (!p.nutrients || p.nutrients.length === 0) return '';
            const hasNrv = p.nutrients.some(n => n.nrv !== null);
            return `<div class="micro-box">
                <div class="macros-title">MIKRONÄHRSTOFFE PRO PORTION (${p.serving})</div>
                <table class="micro-table">${p.nutrients.map(n => {
                    const isSub = n.label.startsWith('—');
                    return `<tr class="${isSub ? 'micro-sub' : ''}"><td>${n.label}</td><td>${n.amount}${n.nrv !== null ? `<span class="micro-nrv">${n.nrv}%</span>` : ''}</td></tr>`;
                }).join('')}</table>
                ${hasNrv ? `<div style="font-size:9px;color:#475569;margin-top:6px;">% der Nährstoffbezugswerte (EU) Nr. 1169/2011</div>` : ''}
            </div>`;
        }

        function toggleTimelineCard(id) {
            const card = document.getElementById(`tc-${id}`);
            const content = document.getElementById(`tcc-${id}`);
            const isOpen = card.classList.contains("open");
            if(isOpen) { card.classList.remove("open"); content.style.display = "none"; }
            else { card.classList.add("open"); content.style.display = "block"; }
        }

        function toggleProductCard(id) {
            const card = document.getElementById(`dbc-${id}`);
            const content = document.getElementById(`dbcc-${id}`);
            const isOpen = card.classList.contains("open");
            if(isOpen) { card.classList.remove("open"); content.style.display = "none"; }
            else { card.classList.add("open"); content.style.display = "block"; }
        }

        function filterCategory(catName) {
            CATS.forEach(c => { document.getElementById(`cat-btn-${c}`).classList.remove("active"); });
            currentCatFilter = catName;
            document.getElementById(`cat-btn-${catName}`).classList.add("active");
            renderFilteredProducts();
        }

        function openProductOverlay(id) {
            const p = getProductById(id);
            if(!p) return;

            document.getElementById("ovIcon").innerText = p.icon;
            document.getElementById("ovName").innerText = p.name;
            document.getElementById("ovCat").innerText = p.cat;

            // Light Mode: nur "Wofür?" und "Wann & wie?" in einfacher Sprache
            if (isLight()) {
                document.getElementById("ovDetails").innerHTML = `
                    <div class="info-row" style="--row-color:#22c55e">
                        <div class="info-row-title" style="--row-color:#22c55e">Wofür ist das gut?</div>
                        <div class="info-row-val">${p.function}</div>
                    </div>
                    <div class="info-row" style="--row-color:#a78bfa">
                        <div class="info-row-title" style="--row-color:#a78bfa">Wann & wie nehmen?</div>
                        <div class="info-row-val">${p.takeWith}</div>
                    </div>
                    <div class="info-row" style="--row-color:#38bdf8">
                        <div class="info-row-title" style="--row-color:#38bdf8">Menge</div>
                        <div class="info-row-val">${p.serving}</div>
                    </div>`;
                document.getElementById("productOverlay").style.display = "flex";
                return;
            }

            const kj = Math.round(p.kcal * 4.184);
            let macroHtml = `
                <div class="macros-box">
                    <div class="macros-title">NÄHRWERTE PRO PORTION (${p.serving})</div>
                    <table class="naehr-table">
                        <tr class="naehr-row-energy"><td>Brennwert</td><td>${kj} kJ / ${p.kcal} kcal</td></tr>
                        <tr class="naehr-row-fat"><td>Fett</td><td>${p.fat} g</td></tr>
                        <tr class="naehr-row-carbs"><td>Kohlenhydrate</td><td>${p.carbs} g</td></tr>
                        <tr class="naehr-row-protein"><td>Eiweiß</td><td>${p.protein} g</td></tr>
                    </table>
                </div>
            `;

            const rows = [
                { icon:"", label:"Funktion im Körper", val:p.function, col:"#22c55e" },
                { icon:"", label:"Absorption", val:p.absorption, col:"#60a5fa" },
                { icon:"", label:"Womit einnehmen", val:p.takeWith, col:"#a78bfa" },
                { icon:"", label:"Womit konkurriert", val:p.competes, col:"#f97316" },
                { icon:"", label:"Geschmack", val:p.geschmack, col:"#f472b6" },
                { icon:"", label:"Löslichkeit", val:p.loeslichkeit, col:"#38bdf8" }
            ];

            const rowsHtml = rows.map(r => `
                <div class="info-row" style="--row-color: ${r.col}">
                    <div class="info-row-title" style="--row-color: ${r.col}">${r.icon} ${r.label}</div>
                    <div class="info-row-val">${r.val}</div>
                </div>
            `).join('');

            document.getElementById("ovDetails").innerHTML = macroHtml + buildNutrientsHtml(p) + rowsHtml;
            document.getElementById("productOverlay").style.display = "flex";
        }

        function activeSection(tabId, viewId) {
            document.querySelectorAll('.tab-bar .tab-btn').forEach(b => b.classList.remove("active"));
            document.querySelectorAll('#mainApp .view-section').forEach(v => v.classList.remove("active"));
            document.getElementById('viewAboutMe').style.display = 'none';
            document.getElementById(tabId).classList.add("active");
            document.getElementById(viewId).classList.add("active");
            // Show panels only on Tagesplan
            document.getElementById("timelinePanels").style.display =
                (tabId === "tabTimeline") ? "block" : "none";
        }


        // ─── SPORT DATA ───────────────────────────────────────────────────
        let SPORT_DATA = {};

        // Welche Trainingspläne gehören zu welcher Sportart
        const SPORTTYPE_PLANS = {
            kraft:    ['maxkraft', 'hyper', 'kausd'],
            ausdauer: ['gla', 'intervall', 'wettkampf'],
            kampf:    ['explosiv', 'kondition', 'technik'],
            mix:      ['hybrid', 'functional', 'ganzkoerper'],
        };
        // Pläne passend zur gewählten Sportart (Default: Kraft, falls übersprungen)
        function plansForType() {
            const modes = SPORTTYPE_PLANS[userProfile.sportType] || SPORTTYPE_PLANS.kraft;
            return modes.filter(m => SPORT_DATA[m]);
        }

        function selectSportMode(mode) {
            selectedSportMode = mode;
            try { store.setItem('sl_sport', mode); } catch (e) {}
            document.querySelectorAll('#sportModeBar .sport-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
            document.querySelectorAll('#sportPlanBoxes .sport-plan-box').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
        }

        // Baut Banner + Tages-Karten für einen Plan
        function buildPlanHtml(key, plan) {
            const suppHtml = `<div class="sport-row" style="--sc:${plan.color}">
                    <div class="sport-row-title">Supplements für diesen Modus</div>
                    <div class="sport-row-val">${plan.supplements}</div>
                </div>`;
            const bannerHtml = `<div class="sport-hero-banner" style="background:${plan.bg}; border:1px solid ${plan.border}; color:${plan.color};">
                    <div style="font-size:22px; margin-bottom:4px;">${plan.icon} ${plan.title}</div>
                    <div style="font-size:11px; color:#cbd5e1; line-height:1.5;">${plan.desc}</div>
                    ${suppHtml}
                </div>`;
            const daysHtml = plan.days.map((day, di) => {
                const exHtml = day.exercises.map((ex) => `
                        <div style="background:#04040d; border-radius:8px; padding:9px 11px; margin-bottom:6px; border-left:3px solid ${plan.color};">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px;">
                                <div style="font-size:12px; font-weight:700; color:#e2e8f0;">${ex.name}</div>
                                <div style="display:flex; gap:4px; flex-shrink:0;">
                                    <span class="sport-tag" style="background:${plan.bg}; color:${plan.color};">${ex.sets}</span>
                                    <span class="sport-tag" style="background:#1a1a2e; color:#a78bfa;">${ex.load}</span>
                                </div>
                            </div>
                            <div style="font-size:10px; color:#60a5fa; margin-top:3px;">⏱ Pause: ${ex.rest}</div>
                            <div style="font-size:11px; color:#94a3b8; margin-top:3px; line-height:1.5;">💡 ${ex.tip}</div>
                        </div>
                    `).join('');
                return `<div class="sport-info-card" id="sc-${key}-${di}" style="--sc:${plan.color}">
                        <button class="sport-info-trigger" onclick="toggleSportCard('${key}','${di}')">
                            <span class="sport-info-icon">${plan.icon}</span>
                            <span class="sport-info-title">${day.day}</span>
                            <span class="sport-info-arrow">⌄</span>
                        </button>
                        <div class="sport-info-content" id="scc-${key}-${di}">
                            ${exHtml}
                        </div>
                    </div>`;
            }).join('');
            return bannerHtml + daysHtml;
        }

        // App-Sport-Tab: Modus-Leiste + Plan-Boxen passend zur Sportart aufbauen
        function renderSportPlans() {
            const bar = document.getElementById('sportModeBar');
            const boxes = document.getElementById('sportPlanBoxes');
            if (!bar || !boxes) return;
            const modes = plansForType();
            if (!modes.includes(selectedSportMode)) selectedSportMode = modes[0];
            bar.innerHTML = modes.map(m => {
                const plan = SPORT_DATA[m];
                return `<button class="sport-mode-btn${m === selectedSportMode ? ' active' : ''}" data-mode="${m}" onclick="selectSportMode('${m}')">${plan.icon} ${plan.title}</button>`;
            }).join('');
            boxes.innerHTML = modes.map(m =>
                `<div class="sport-plan-box${m === selectedSportMode ? ' active' : ''}" data-mode="${m}" id="sp-${m}">${buildPlanHtml(m, SPORT_DATA[m])}</div>`
            ).join('');
        }

        // Onboarding: Trainingsplan-Buttons passend zur gewählten Sportart
        function renderOnboardSportPlans() {
            const box = document.getElementById('sportModeChoice');
            if (!box) return;
            const modes = plansForType();
            if (!modes.includes(selectedSportMode)) selectedSportMode = modes[0];
            box.innerHTML = modes.map(m => {
                const plan = SPORT_DATA[m];
                const active = m === selectedSportMode ? ' active' : '';
                return `<button class="onboard-opt${active}" onclick="setSportChoice('${m}',this)">${plan.icon} ${plan.title} <span class="onboard-opt-sub">${plan.short || ''}</span></button>`;
            }).join('');
        }

        function toggleSportCard(mode, idx) {
            const card = document.getElementById('sc-' + mode + '-' + idx);
            const content = document.getElementById('scc-' + mode + '-' + idx);
            const open = card.classList.contains('open');
            card.classList.toggle('open', !open);
            content.style.display = open ? 'none' : 'block';
        }


        // ─── BODY ATLAS DATA ───────────────────────────────────────────────
        let BODY_ZONES = {};

        function selectZone(zoneId) {
            // Remove active from all hotspots
            document.querySelectorAll('.body-hotspot').forEach(h => h.classList.remove('active'));
            const hs = document.getElementById('hs-' + zoneId);
            if (hs) hs.classList.add('active');

            const z = BODY_ZONES[zoneId];
            if (!z) return;

            const defHtml = z.deficiencies.map(d => `
                <div class="deficiency-card" style="--def-color:${d.color}; --def-bg:${d.bg};">
                    <div class="deficiency-card-top">
                        <span class="deficiency-name">${d.name}</span>
                        <span class="deficiency-tag">${d.tag}</span>
                    </div>
                    <div class="deficiency-text">${d.text}</div>
                    <div class="deficiency-fix">&#10003; ${d.fix}</div>
                </div>
            `).join('');

            document.getElementById('atlasDetail').innerHTML = `
                <div class="atlas-zone-title">
                    <span class="atlas-zone-icon">${z.icon}</span>
                    ${z.label}
                </div>
                <div class="atlas-zone-sub">${z.sub}</div>
                <div class="deficiency-list">${defHtml}</div>
            `;

            // Scroll detail into view
            document.getElementById('atlasDetail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function showAboutMe() {
            document.getElementById('viewAboutMe').style.display = 'flex';
            document.querySelectorAll('#mainApp .view-section').forEach(v => v.classList.remove("active"));
            document.querySelectorAll('.tab-bar .tab-btn').forEach(b => b.classList.remove("active"));
            document.getElementById("timelinePanels").style.display = "none";
        }
        function hideAboutMe() {
            document.getElementById('viewAboutMe').style.display = 'none';
            document.getElementById("tabTimeline").classList.add("active");
            document.getElementById("viewTimeline").classList.add("active");
            document.getElementById("timelinePanels").style.display = "block";
        }

        function collapseBodyDisclaimer() {
            const d = document.getElementById('bodyDisclaimer');
            const c = document.getElementById('bodyDisclaimerCollapsed');
            if (d && c) { d.style.display = 'none'; c.style.display = 'block'; }
        }
        function expandBodyDisclaimer() {
            const d = document.getElementById('bodyDisclaimer');
            const c = document.getElementById('bodyDisclaimerCollapsed');
            if (d && c) { d.style.display = 'block'; c.style.display = 'none'; }
        }
        setTimeout(collapseBodyDisclaimer, 5000);

        let bodyShowingFront = true;
        function flipBody() {
            bodyShowingFront = !bodyShowingFront;
            document.getElementById('bodyFront').classList.toggle('active', bodyShowingFront);
            document.getElementById('bodyBack').classList.toggle('active', !bodyShowingFront);
            const btn = document.getElementById('bodyFlipBtn');
            btn.textContent = bodyShowingFront ? '🔄 Rücken ansehen' : '🔄 Vorderseite ansehen';
        }

        // ─── VITAMIN & MINERAL DATABASE ───────────────────────────────────

        let NUTR_DATA = [];
        let BLOOD_MARKERS = [];
        let bloodValues = {};   // { markerId: "Wert" } – lokal gespeichert
        let bloodFilter = "Alle";
        let MONITORING = { checklist: [], redflags: [] };
        let monitorLog = {};    // { itemId: "YYYY-MM-DD" } – zuletzt erledigt
        let monitorFilter = "Alle";
        let EMERGENCY = { intro: "", numbers: [], immediate: { steps: [] }, redflags: [], facts: [] };
        let INJURIES = [];
        let MENTAL = { cards: [], help: {} };
        let findings = [];        // [{ id, date, doctor, diagnosis, referral, notes }] – lokal
        let recoveryTab = 'injuries';
        let injuryFilter = 'Alle';


        let nutrFilter = "Alle";
        let nutrSearch = "";
        const NUTR_CATS = ["Alle", "Vitamin", "Mineral", "Wasser"];

        function initNutrView() {
            const catBox = document.getElementById("nutrCatsBox");
            catBox.innerHTML = NUTR_CATS.map(c => `
                <button class="nutr-cat-btn ${c === nutrFilter ? 'active' : ''}" id="nutr-cat-${c}" onclick="nutrFilterCat('${c}')">${c}</button>
            `).join('');
            renderNutrCards();
        }

        function nutrFilterCat(cat) {
            nutrFilter = cat;
            NUTR_CATS.forEach(c => {
                const el = document.getElementById('nutr-cat-' + c);
                if (el) el.classList.toggle('active', c === cat);
            });
            renderNutrCards();
        }

        function renderNutrCards() {
            const q = nutrSearch.toLowerCase();
            const filtered = NUTR_DATA.filter(n => {
                const matchCat = nutrFilter === "Alle" || n.cat === nutrFilter;
                const matchSearch = !q || n.name.toLowerCase().includes(q) || n.bodyFunction.toLowerCase().includes(q);
                return matchCat && matchSearch;
            });

            document.getElementById("nutrCardList").innerHTML = filtered.slice(0, RENDER_LIMIT).map(n => `
                <div class="nutr-card" id="nc-${n.id}">
                    <button class="nutr-trigger" onclick="toggleNutrCard('${n.id}')">
                        <span class="nutr-icon">${n.icon}</span>
                        <div class="nutr-title-box">
                            <div class="nutr-name">${n.name}</div>
                            <div class="nutr-cat-label">${n.cat}</div>
                        </div>
                        <span class="nutr-arrow">&#8964;</span>
                    </button>
                    <div class="nutr-content" id="ncc-${n.id}">
                        <div class="dose-grid">
                            <div class="dose-box">
                                <div class="dose-box-label">Tagesdosis</div>
                                <div class="dose-box-val dose-ok" style="font-size:11px;">${n.dose}</div>
                            </div>
                            <div class="dose-box">
                                <div class="dose-box-label">Optimaler Wert</div>
                                <div class="dose-box-val dose-warn" style="font-size:10px;">${n.optimal}</div>
                            </div>
                        </div>
                        <div class="nutr-row" style="--nr-color:#22c55e">
                            <div class="nutr-row-title">Funktion im Körper</div>
                            <div class="nutr-row-val">${n.bodyFunction}</div>
                        </div>
                        <div class="nutr-row" style="--nr-color:#a78bfa">
                            <div class="nutr-row-title">Womit einnehmen / Synergie</div>
                            <div class="nutr-row-val">${n.takeWith}</div>
                        </div>
                        <div class="nutr-row" style="--nr-color:#f97316">
                            <div class="nutr-row-title">Konkurrenz / Wechselwirkung</div>
                            <div class="nutr-row-val">${n.competes}</div>
                        </div>
                        <div class="nutr-row" style="--nr-color:#ef4444">
                            <div class="nutr-row-title">&#9888; Toxische Grenze</div>
                            <div class="nutr-row-val">${n.toxic}</div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function toggleNutrCard(id) {
            const card = document.getElementById('nc-' + id);
            const content = document.getElementById('ncc-' + id);
            const open = card.classList.contains('open');
            card.classList.toggle('open', !open);
            content.style.display = open ? 'none' : 'block';
        }

        // ─── BLUTWERTE-ANALYSE ─────────────────────────────────────────────
        function loadBlood() {
            try { bloodValues = JSON.parse(store.getItem('sl_blood') || '{}') || {}; } catch (e) { bloodValues = {}; }
        }
        function saveBlood() { try { store.setItem('sl_blood', JSON.stringify(bloodValues)); } catch (e) {} }

        function bloodStatus(m, raw) {
            if (raw === '' || raw == null) return { cls: 'none', label: '—' };
            const v = parseFloat(String(raw).replace(',', '.'));
            if (isNaN(v)) return { cls: 'none', label: '—' };
            if (m.low != null && v < m.low) return { cls: 'low', label: 'niedrig' };
            if (m.high != null && v > m.high) return { cls: 'high', label: 'hoch' };
            return { cls: 'ok', label: 'im Bereich' };
        }
        function bloodRef(m) {
            if (m.low != null && m.high != null) return `Referenz: ${m.low}–${m.high} ${m.unit}`;
            if (m.high != null) return `Referenz: < ${m.high} ${m.unit}`;
            if (m.low != null) return `Referenz: > ${m.low} ${m.unit}`;
            return '';
        }
        function bloodNoteHtml(m, st) {
            if (st.cls === 'low' && m.lowNote)  return `<div class="blood-note low">${m.lowNote}</div>`;
            if (st.cls === 'high' && m.highNote) return `<div class="blood-note high">${m.highNote}</div>`;
            return '';
        }
        function initBloodView() {
            loadBlood();
            renderBloodCats();
            renderBloodCards();
        }
        function renderBloodCats() {
            const bar = document.getElementById('bloodCatBar');
            if (!bar) return;
            const cats = ['Alle', 'PED-Monitoring', ...new Set(BLOOD_MARKERS.map(m => m.cat))];
            bar.innerHTML = cats.map(c =>
                `<button class="blood-cat-btn${c === bloodFilter ? ' active' : ''}" onclick="bloodFilterCat('${c}')">${c}</button>`
            ).join('');
        }
        function bloodFilterCat(c) { bloodFilter = c; renderBloodCats(); renderBloodCards(); }
        function renderBloodCards() {
            const box = document.getElementById('bloodList');
            if (!box) return;
            const list = BLOOD_MARKERS.filter(m =>
                bloodFilter === 'Alle' ? true :
                bloodFilter === 'PED-Monitoring' ? m.ped : m.cat === bloodFilter);
            box.innerHTML = list.map(m => {
                const raw = bloodValues[m.id] || '';
                const st = bloodStatus(m, raw);
                const links = (m.nutrients || []).map(pid => {
                    const p = getProductById(pid);
                    return p ? `<span class="blood-link-chip">${p.icon} ${p.name}</span>` : '';
                }).join('');
                const linksHtml = links ? `<div class="blood-links">Passende Nährstoffe: ${links}</div>` : '';
                return `<div class="blood-card">
                    <div class="blood-card-top">
                        <div>
                            <div class="blood-name">${m.name}${m.ped ? '<span class="blood-ped-badge">PED-Monitoring</span>' : ''}</div>
                            <div class="blood-ref">${bloodRef(m)}</div>
                        </div>
                        <span class="blood-status ${st.cls}" id="bs-${m.id}">${st.label}</span>
                    </div>
                    <div class="blood-input-row">
                        <input type="text" inputmode="decimal" class="blood-input" value="${raw}" placeholder="dein Wert" oninput="setBloodValue('${m.id}', this.value)">
                        <span class="blood-unit">${m.unit}</span>
                    </div>
                    <div class="blood-meaning">${m.meaning}</div>
                    <div id="bn-${m.id}">${bloodNoteHtml(m, st)}</div>
                    ${linksHtml}
                </div>`;
            }).join('');
        }
        // Wert-Eingabe: nur Status/Notiz dieser Karte aktualisieren (Fokus behalten)
        function setBloodValue(id, value) {
            bloodValues[id] = value;
            saveBlood();
            const m = BLOOD_MARKERS.find(x => x.id === id);
            if (!m) return;
            const st = bloodStatus(m, value);
            const badge = document.getElementById('bs-' + id);
            if (badge) { badge.className = 'blood-status ' + st.cls; badge.textContent = st.label; }
            const noteBox = document.getElementById('bn-' + id);
            if (noteBox) noteBox.innerHTML = bloodNoteHtml(m, st);
        }

        // ─── ÜBERWACHUNGS-PROTOKOLL (Sicherheit/Monitoring, KEINE Einnahme-Anleitung) ───
        const MONITOR_GROUPS = { steroide: 'Steroide', insulin: 'Insulin', peptide: 'Peptide' };
        function loadMonitor() {
            try { monitorLog = JSON.parse(store.getItem('sl_monitor') || '{}') || {}; } catch (e) { monitorLog = {}; }
        }
        function saveMonitor() { try { store.setItem('sl_monitor', JSON.stringify(monitorLog)); } catch (e) {} }
        function fmtDate(iso) {
            if (!iso) return '';
            const d = new Date(iso); if (isNaN(d)) return '';
            return d.toLocaleDateString('de-DE');
        }
        function initMonitorView() {
            loadMonitor();
            renderMonitorFilter();
            renderMonitor();
        }
        function renderMonitorFilter() {
            const bar = document.getElementById('monitorFilterBar');
            if (!bar) return;
            const opts = ['Alle', ...Object.keys(MONITOR_GROUPS)];
            bar.innerHTML = opts.map(g =>
                `<button class="blood-cat-btn${g === monitorFilter ? ' active' : ''}" onclick="monitorFilterGroup('${g}')">${g === 'Alle' ? 'Alle' : MONITOR_GROUPS[g]}</button>`
            ).join('');
        }
        function monitorFilterGroup(g) { monitorFilter = g; renderMonitorFilter(); renderMonitor(); }
        function renderMonitor() {
            const box = document.getElementById('monitorList');
            if (!box) return;
            const items = (MONITORING.checklist || []).filter(it =>
                monitorFilter === 'Alle' ? true : (it.groups || []).includes(monitorFilter));
            const checklistHtml = items.map(it => {
                const done = monitorLog[it.id];
                const groupTags = (it.groups || []).map(g => `<span class="mon-tag">${MONITOR_GROUPS[g] || g}</span>`).join('');
                const link = it.marker ? `<button class="mon-link" onclick="openBloodMarker('${it.marker}')">→ Wert eintragen</button>` : '';
                return `<div class="mon-item${done ? ' done' : ''}">
                    <button class="mon-check" onclick="toggleMonitorItem('${it.id}')" aria-label="erledigt">${done ? '✓' : ''}</button>
                    <div class="mon-body">
                        <div class="mon-label">${it.label} ${groupTags}</div>
                        <div class="mon-interval">🕒 ${it.interval}${done ? ' · zuletzt: ' + fmtDate(done) : ''}</div>
                        <div class="mon-why">${it.why}</div>
                        ${link}
                    </div>
                </div>`;
            }).join('');
            const flagsHtml = (MONITORING.redflags || []).map(f =>
                `<div class="mon-flag ${f.level}">
                    <div class="mon-flag-sign">${f.level === 'notfall' ? '🚨' : '⚠️'} ${f.sign}</div>
                    <div class="mon-flag-action">${f.action}</div>
                </div>`).join('');
            box.innerHTML = `
                <div class="mon-section-title">Was du überwachen musst</div>
                ${checklistHtml}
                <div class="mon-section-title danger">Warnsignale – sofort handeln</div>
                ${flagsHtml}`;
        }
        // Abhaken setzt das heutige Datum; erneutes Tippen entfernt es.
        function toggleMonitorItem(id) {
            if (monitorLog[id]) delete monitorLog[id];
            else monitorLog[id] = new Date().toISOString().slice(0, 10);
            saveMonitor();
            renderMonitor();
        }
        // Sprung in die Blutwerte-Analyse zum passenden Marker
        function openBloodMarker(markerId) {
            activeSection('tabBlood', 'viewBlood');
            bloodFilter = 'Alle';
            renderBloodCats();
            renderBloodCards();
            const el = document.getElementById('bs-' + markerId);
            if (el) { const card = el.closest('.blood-card'); if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        }

        // ─── RECOVERYMODE-HUB (eigenständige Seite mit internen Tabs) ──────────
        const RECOVERY_TABS = [
            { id: 'injuries', label: '🤕 Verletzungen' },
            { id: 'findings', label: '📋 Meine Befunde' },
            { id: 'mind',     label: '🧠 Seelisches' },
            { id: 'emergency',label: '📞 Notruf' },
        ];
        function initRecoveryHub() {
            loadFindings();
            renderRecoveryHub();
        }
        function selectRecoveryTab(id) { recoveryTab = id; renderRecoveryHub(); }
        function renderRecoveryHub() {
            const nav = document.getElementById('recoveryNav');
            const body = document.getElementById('recoveryBody');
            if (!nav || !body) return;
            nav.innerHTML = RECOVERY_TABS.map(t =>
                `<button class="rec-subtab${t.id === recoveryTab ? ' active' : ''}" onclick="selectRecoveryTab('${t.id}')">${t.label}</button>`
            ).join('');
            if (recoveryTab === 'injuries')      body.innerHTML = injuriesHtml();
            else if (recoveryTab === 'findings') body.innerHTML = findingsHtml();
            else if (recoveryTab === 'mind')     body.innerHTML = mindHtml();
            else                                 body.innerHTML = emergencyHtml();
        }

        // — Verletzungen —
        function injuriesHtml() {
            const cats = ['Alle', ...new Set(INJURIES.map(i => i.cat))];
            const catBar = cats.map(c =>
                `<button class="blood-cat-btn${c === injuryFilter ? ' active' : ''}" onclick="setInjuryFilter('${c}')">${c}</button>`).join('');
            const list = INJURIES.filter(i => injuryFilter === 'Alle' || i.cat === injuryFilter);
            const cards = list.map(inj => {
                const li = (arr, cls) => (arr || []).map(x => `<li class="${cls || ''}">${x}</li>`).join('');
                const prods = (inj.products || []).map(pid => { const p = getProductById(pid); return p ? `<span class="blood-link-chip">${p.icon} ${p.name}</span>` : ''; }).join('');
                return `<div class="inj-card" id="inj-${inj.id}">
                    <button class="inj-trigger" onclick="toggleInjury('${inj.id}')">
                        <span class="inj-icon">${inj.icon}</span>
                        <span class="inj-name">${inj.name}</span>
                        <span class="inj-cat">${inj.cat}</span>
                        <span class="inj-arrow">⌄</span>
                    </button>
                    <div class="inj-content" id="injc-${inj.id}">
                        <div class="inj-block-title">Symptome</div><ul class="emerg-list">${li(inj.symptoms)}</ul>
                        <div class="inj-block-title">Sofortmaßnahmen</div><ul class="emerg-list ok">${li(inj.measures)}</ul>
                        <div class="inj-block-title">Heilung</div><div class="inj-text">${inj.recovery}</div>
                        <div class="inj-block-title danger">Sofort zum Arzt bei</div><ul class="emerg-list danger">${li(inj.redflags)}</ul>
                        ${prods ? `<div class="blood-links">Recovery-Produkte: ${prods}</div>` : ''}
                    </div>
                </div>`;
            }).join('');
            return `<div class="rec-disclaimer">⚕️ Allgemeine Infos, kein medizinischer Rat. Bei Verdacht auf ernste Verletzung ärztlich abklären.</div>
                <div class="blood-cat-bar">${catBar}</div>${cards}`;
        }
        function setInjuryFilter(c) { injuryFilter = c; renderRecoveryHub(); }
        function toggleInjury(id) {
            const card = document.getElementById('inj-' + id);
            const content = document.getElementById('injc-' + id);
            if (!card || !content) return;
            const open = card.classList.contains('open');
            card.classList.toggle('open', !open);
            content.style.display = open ? 'none' : 'block';
        }

        // — Meine Befunde (lokale Eingabe) —
        function loadFindings() {
            try { findings = JSON.parse(store.getItem('sl_findings') || '[]') || []; } catch (e) { findings = []; }
        }
        function saveFindings() { try { store.setItem('sl_findings', JSON.stringify(findings)); } catch (e) {} }
        function findingsHtml() {
            const saved = findings.map(f => `<div class="find-item">
                    <button class="find-del" onclick="removeFinding('${f.id}')" aria-label="löschen">✕</button>
                    <div class="find-date">${f.date || ''}${f.doctor ? ' · ' + f.doctor : ''}</div>
                    ${f.diagnosis ? `<div class="find-diag">${f.diagnosis}</div>` : ''}
                    ${f.referral ? `<div class="find-row"><b>Überweisung:</b> ${f.referral}</div>` : ''}
                    ${f.notes ? `<div class="find-row">${f.notes}</div>` : ''}
                </div>`).join('');
            return `<div class="rec-disclaimer">🔒 Deine Eingaben werden <strong>nur lokal</strong> auf diesem Gerät gespeichert – nichts wird gesendet.</div>
                <div class="find-form">
                    <input type="date" id="findDate" class="time-input onboard-text">
                    <input type="text" id="findDoctor" class="time-input onboard-text" placeholder="Arzt / Praxis">
                    <input type="text" id="findDiag" class="time-input onboard-text" placeholder="Diagnose / Befund">
                    <input type="text" id="findRef" class="time-input onboard-text" placeholder="Überweisung an … (optional)">
                    <textarea id="findNotes" class="time-input onboard-text" rows="2" placeholder="Notizen (optional)"></textarea>
                    <button class="start-btn" onclick="addFinding()">+ Befund speichern</button>
                </div>
                ${saved ? `<div class="rec-sub-title">Gespeicherte Befunde</div>${saved}` : '<div class="find-empty">Noch keine Befunde gespeichert.</div>'}`;
        }
        function addFinding() {
            const v = id => (document.getElementById(id)?.value || '').trim();
            const date = v('findDate'), doctor = v('findDoctor'), diagnosis = v('findDiag'), referral = v('findRef'), notes = v('findNotes');
            if (!date && !doctor && !diagnosis && !referral && !notes) return;
            findings.unshift({ id: 'f' + Date.now(), date, doctor, diagnosis, referral, notes });
            saveFindings();
            renderRecoveryHub();
        }
        function removeFinding(id) {
            findings = findings.filter(f => f.id !== id);
            saveFindings();
            renderRecoveryHub();
        }

        // — Seelisches —
        function mindHtml() {
            const cards = (MENTAL.cards || []).map(c =>
                `<div class="mind-card"><div class="mind-title">${c.icon} ${c.title}</div><div class="mind-text">${c.text}</div></div>`).join('');
            const h = MENTAL.help || {};
            const crisis = h.crisis ? `<a class="emerg-call primary" href="tel:${h.crisis.tel}">
                    <div class="emerg-call-label">${h.crisis.label}</div>
                    <div class="emerg-call-num">${h.crisis.number}</div>
                    <span class="emerg-call-go">📞 Anrufen</span></a>` : '';
            return `<div class="rec-disclaimer">${MENTAL.intro || ''}</div>
                ${cards}
                <div class="rec-sub-title">${h.title || ''}</div>
                <div class="mind-text" style="margin-bottom:10px;">${h.text || ''}</div>
                ${crisis}`;
        }

        // — Notruf —
        function emergencyHtml() {
            const E = EMERGENCY;
            const numbersHtml = (E.numbers || []).map(n => {
                const inner = `<div class="emerg-call-label">${n.label}</div>
                    <div class="emerg-call-num">${n.number}</div>
                    <div class="emerg-call-desc">${n.desc}</div>`;
                return n.tel
                    ? `<a class="emerg-call${n.primary ? ' primary' : ''}" href="tel:${n.tel}">${inner}<span class="emerg-call-go">📞 Anrufen</span></a>`
                    : `<div class="emerg-call">${inner}</div>`;
            }).join('');
            const im = E.immediate || { steps: [] };
            const stepsHtml = (im.steps || []).map(s => `<li>${s}</li>`).join('');
            const flagsHtml = (E.redflags || []).map(f => `<li>${f}</li>`).join('');
            const factsHtml = (E.facts || []).map(f => `<li>${f}</li>`).join('');
            return `<div class="emerg-intro">${E.intro || ''}</div>
                <div class="emerg-section-title">📞 Notruf &amp; Hilfe</div>
                <div class="emerg-numbers">${numbersHtml}</div>
                <div class="emerg-section-title">${im.title || 'Sofortmaßnahmen'}</div>
                <ul class="emerg-list">${stepsHtml}</ul>
                ${im.avoid ? `<div class="emerg-avoid">⛔ ${im.avoid}</div>` : ''}
                <div class="emerg-section-title danger">⚠️ Sofort zum Arzt / 112 bei:</div>
                <ul class="emerg-list danger">${flagsHtml}</ul>
                <div class="emerg-section-title">✅ Wichtig zu wissen</div>
                <ul class="emerg-list ok">${factsHtml}</ul>`;
        }

        document.addEventListener("DOMContentLoaded", async () => {
            // Persistenz-Cache füllen (IndexedDB laden + Migration), bevor gelesen wird.
            await initStorage();
            // Statische Datensätze asynchron laden (PRODUCTS, TIMELINE_CONFIG, …) und
            // die davon abgeleiteten Werte (CATS, RECOMMENDED_IDS) berechnen.
            try {
                const data = await loadData();
                PRODUCTS        = data.products;
                TIMELINE_CONFIG = data.timeline_config;
                SPORT_DATA      = data.sport_data;
                BODY_ZONES      = data.body_zones;
                NUTR_DATA       = data.nutr_data;
                BLOOD_MARKERS   = data.bloodmarkers;
                MONITORING      = data.monitoring;
                EMERGENCY       = data.emergency;
                INJURIES        = data.injuries;
                MENTAL          = data.mental;
                // Tagestyp-Texte aus data/app/daytypes.json in die Lookup-Maps übernehmen
                // (Daten liegen in JSON, der Code hält nur die Referenzen).
                Object.entries(data.daytypes || {}).forEach(([type, d]) => {
                    if (d.label != null)    DAYTYPE_LABELS[type]     = d.label;
                    if (d.hint != null)     DAYTYPE_HINTS[type]      = d.hint;
                    if (d.hintEasy != null) DAYTYPE_HINTS_EASY[type] = d.hintEasy;
                });
                CATS = ["Alle", ...new Set(PRODUCTS.map(p => p.cat))];
                RECOMMENDED_IDS = new Set();
                TIMELINE_CONFIG.forEach(b => b.productIds.forEach(p => RECOMMENDED_IDS.add(p)));
            } catch (e) { console.error(e); }

            document.getElementById("tabTimeline").addEventListener("click", () => activeSection("tabTimeline", "viewTimeline"));
            document.getElementById("tabWeek").addEventListener("click", () => { activeSection("tabWeek", "viewWeek"); renderWeek(); });
            document.getElementById("tabMoney").addEventListener("click", () => { activeSection("tabMoney", "viewMoney"); renderMoney(); });
            document.getElementById("tabStack").addEventListener("click", () => { activeSection("tabStack", "viewStack"); renderStackView(); });
            document.getElementById("tabDatabase").addEventListener("click", () => activeSection("tabDatabase", "viewDatabase"));
            document.getElementById("tabFood").addEventListener("click", () => activeSection("tabFood", "viewFood"));
            document.getElementById("tabBody").addEventListener("click", () => activeSection("tabBody", "viewBody"));
            document.getElementById("tabSport").addEventListener("click", () => activeSection("tabSport", "viewSport"));
            document.getElementById("tabBlood").addEventListener("click", () => { activeSection("tabBlood", "viewBlood"); renderBloodCards(); });
            document.getElementById("tabMonitor").addEventListener("click", () => { activeSection("tabMonitor", "viewMonitor"); renderMonitor(); });
            document.getElementById("tabRecovery").addEventListener("click", () => { activeSection("tabRecovery", "viewRecovery"); renderRecoveryHub(); });
            document.getElementById("navHome").addEventListener("click", showDashboard);
            document.getElementById("navDay").addEventListener("click", goToDay);
            document.getElementById("navTools").addEventListener("click", toggleTools);
            document.getElementById("navEmergency").addEventListener("click", () => { document.getElementById("tabRecovery").click(); setNavDayActive(false); setNavHomeActive(false); closeTools(); window.scrollTo(0, 0); });
            document.getElementById("dbSearchInput").addEventListener("input", debounce(function(e) {
                currentSearchQuery = e.target.value;
                renderFilteredProducts();
            }, 250));
            document.getElementById("stackSearchInput").addEventListener("input", debounce(function(e) {
                renderStackAddList(e.target.value);
            }, 250));
            document.getElementById("nutrSearchInput").addEventListener("input", debounce(function(e) {
                nutrSearch = e.target.value;
                renderNutrCards();
            }, 250));
            document.getElementById("productOverlay").addEventListener("click", function() {
                this.style.display = "none";
            });
            document.querySelector("#productOverlay .overlay-sheet").addEventListener("click", function(e) {
                e.stopPropagation();
            });

            // Header-Zeitanzeige anklickbar → Zeiten ändern
            const timeInfo = document.querySelector(".header-time-info");
            if (timeInfo) timeInfo.addEventListener("click", editTimes);

            // ── Gespeicherte Sitzung wiederherstellen (localStorage) ──────────────
            // Damit man den Assistenten nicht bei jedem Besuch neu durchläuft.
            loadProfile();
            loadStack();
            // Profil-Auswahlen für den Assistenten vorbelegen (falls man hingeht)
            try {
                if (userProfile.age)    document.getElementById('profileAge').value = userProfile.age;
                if (userProfile.height) document.getElementById('profileHeight').value = userProfile.height;
                if (userProfile.weight) document.getElementById('profileWeight').value = userProfile.weight;
                const markChoice = (parentId, field) => {
                    document.querySelectorAll('#' + parentId + ' .onboard-opt').forEach(b => {
                        if (b.getAttribute('onclick').includes("'" + userProfile[field] + "'")) b.classList.add('active');
                    });
                };
                if (userProfile.gender)    markChoice('genderChoice', 'gender');
                if (userProfile.activity)  markChoice('activityChoice', 'activity');
                if (userProfile.sportType) markChoice('sportTypeChoice', 'sportType');
                if (userProfile.goal)      markChoice('goalChoice', 'goal');
                document.querySelectorAll('#sportModeChoice .onboard-opt').forEach(b => {
                    if (b.getAttribute('onclick').includes("'" + selectedSportMode + "'")) b.classList.add('active');
                });
            } catch (e) {}

            try {
                const savedWake  = store.getItem("sl_wake");
                const savedSleep = store.getItem("sl_sleep");
                const savedMode  = store.getItem("sl_mode");
                const savedTrain = store.getItem("sl_train");

                // Eingabefelder schon mal vorausfüllen (falls man doch zur Eingabe geht)
                if (savedWake)  document.getElementById("wakeTimeInput").value  = savedWake;
                if (savedSleep) document.getElementById("sleepTimeInput").value = savedSleep;
                // sl_train ist kommagetrennt ("17:00,20:00") – abwärtskompatibel zum Einzelwert.
                const savedTrainTimes = (savedTrain || "").split(',').map(s => s.trim()).filter(Boolean);
                if (savedTrainTimes.length) {
                    setupTrainTimes = [...savedTrainTimes];
                    document.getElementById("trainFlexInput").checked = false;
                    trainManuallySet = true;   // eigene Wahl nicht überschreiben
                } else {
                    trainManuallySet = false;  // neuer Nutzer: adaptiver Startwert statt fix 17:00
                }
                renderTrainTimes();
                updateSleepWarn();
                setBaseTrainTimes(savedTrainTimes);

                // Mahlzeiten wiederherstellen. Neu: { auto, times }. Alt: reines Array
                // (= eigene Zeiten) oder leeres Array (= auto) – abwärtskompatibel.
                try {
                    const raw = JSON.parse(store.getItem("sl_meals") || "null");
                    if (Array.isArray(raw)) { mealsAuto = raw.length === 0; globalMeals = raw; }
                    else if (raw && typeof raw === 'object') { mealsAuto = !!raw.auto; globalMeals = Array.isArray(raw.times) ? raw.times : []; }
                    else { mealsAuto = true; globalMeals = []; }
                    if (!mealsAuto) {
                        mealCount = globalMeals.length;
                        document.getElementById("mealAutoInput").checked = false;
                        document.getElementById("mealsCustom").style.display = 'block';
                        const sl = document.getElementById('mealCountSlider'); if (sl) sl.value = globalMeals.length;
                        const v = document.getElementById('mealCountVal'); if (v) v.textContent = globalMeals.length;
                        renderMealInputs(globalMeals);
                    }
                } catch (e) { mealsAuto = true; globalMeals = []; }

                // Alles bekannt → direkt in die App, Assistent überspringen.
                // Sonst: Onboarding mit der Modus-Abfrage als erstem Schritt starten.
                if (savedWake && savedSleep && savedMode) {
                    globalWakeTimeStr  = savedWake;
                    globalSleepTimeStr = savedSleep;
                    document.getElementById("displayWakeTime").innerText  = savedWake;
                    document.getElementById("displaySleepTime").innerText = savedSleep;
                    applyMode(savedMode);
                    enterApp();
                } else {
                    goStep(0);   // neue Nutzer: zuerst Light/Hard/Expert wählen
                }
            } catch (e) {}
        });

// ── Bridge: Handler global verfügbar machen (inline onclick in ES6-Modulen) ──
Object.assign(window, {
    addCost, addIncome, backToModeSelect, bloodFilterCat, collapseBodyDisclaimer, exitStackPlan,
    monitorFilterGroup, openBloodMarker, toggleMonitorItem,
    selectRecoveryTab, setInjuryFilter, toggleInjury, addFinding, removeFinding,
    expandBodyDisclaimer, fillRecommendedStack, filterCategory, finishOnboarding,
    flipBody, generateStackPlan, hideAboutMe, modeBack, nextStep, nutrFilterCat,
    onboardToggle, openProductOverlay, prevStep, profileNext, refreshMealSuggestions,
    onSetupTimesChanged, addTrainTime, removeTrainTime, setTrainTimeAt, toggleTrainFlex, uncheckTrainFlex,
    removeCost, removeIncome, renderOnboardProducts, restartOnboarding, selectDayType,
    selectMode, selectSportMode, selectZone, setBudgetVal, setMealCount, setProfileChoice,
    setBloodValue, setSportChoice, showAboutMe, skipStep, stackAdd, stackRemove, stackResetAmounts,
    setWeekDay, setWeekTime,
    stackSetAmount, stackStep, stackToggle, startApp, startEmptyPlan, toggleDailyNutrBox,
    toggleDailySection, toggleMealAuto, toggleNutrCard, toggleProductCard, toggleSportCard,
    toggleStackBrowse, toggleStackGen, toggleTimelineCard, toggleTopPanel
});

// ── PWA: Service Worker registrieren (App-Shell-Caching / Offline) ──────────
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js', { scope: './' })
            .catch(err => console.warn('Service-Worker-Registrierung fehlgeschlagen:', err));
    });
}
