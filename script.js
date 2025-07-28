const powerDistributorStats = {
    "1": { "E":{cap:10,recharge:1.2}, "D":{cap:11,recharge:1.4}, "C":{cap:12,recharge:1.5}, "B":{cap:13,recharge:1.7}, "A":{cap:14,recharge:1.8}, "A Guardian":{cap:10,recharge:2.5} },
    "2": { "E":{cap:12,recharge:1.4}, "D":{cap:14,recharge:1.6}, "C":{cap:15,recharge:1.8}, "B":{cap:17,recharge:2}, "A":{cap:18,recharge:2.2}, "A Guardian":{cap:13,recharge:3.1} },
    "3": { "E":{cap:16,recharge:1.8}, "D":{cap:18,recharge:2.1}, "C":{cap:20,recharge:2.3}, "B":{cap:22,recharge:2.5}, "A":{cap:24,recharge:2.8}, "A Guardian":{cap:17,recharge:3.9} },
    "4": { "E":{cap:22,recharge:2.3}, "D":{cap:24,recharge:2.6}, "C":{cap:27,recharge:2.9}, "B":{cap:30,recharge:3.2}, "A":{cap:33,recharge:3.5}, "A Guardian":{cap:22,recharge:4.9} },
    "5": { "E":{cap:27,recharge:2.9}, "D":{cap:31,recharge:3.2}, "C":{cap:34,recharge:3.6}, "B":{cap:37,recharge:4}, "A":{cap:41,recharge:4.3}, "A Guardian":{cap:29,recharge:6} },
    "6": { "E":{cap:34,recharge:3.4}, "D":{cap:38,recharge:3.9}, "C":{cap:42,recharge:4.3}, "B":{cap:46,recharge:4.7}, "A":{cap:50,recharge:5.2}, "A Guardian":{cap:35,recharge:7.3} },
    "7": { "E":{cap:41,recharge:4.1}, "D":{cap:46,recharge:4.6}, "C":{cap:51,recharge:5.1}, "B":{cap:56,recharge:5.6}, "A":{cap:61,recharge:6.1}, "A Guardian":{cap:43,recharge:8.5} },
    "8": { "E":{cap:48,recharge:4.8}, "D":{cap:54,recharge:5.4}, "C":{cap:60,recharge:6}, "B":{cap:66,recharge:6.6}, "A":{cap:72,recharge:7.2}, "A Guardian":{cap:50,recharge:10.1} }
};
const engineeringMods = {
    "None": { "0": { cap_mod: 1.0, recharge_mod: 1.0 } },
    "Weapons Focused": {
        "1": { cap_mod: 1.2,  recharge_mod: 1.16 }, "2": { cap_mod: 1.3,  recharge_mod: 1.23 },
        "3": { cap_mod: 1.4,  recharge_mod: 1.30 }, "4": { cap_mod: 1.5,  recharge_mod: 1.37 },
        "5": { cap_mod: 1.6,  recharge_mod: 1.44 }
    },
    "Charge Enhanced": {
        "1": { cap_mod: 0.99, recharge_mod: 1.09 }, "2": { cap_mod: 0.98, recharge_mod: 1.18 },
        "3": { cap_mod: 0.97, recharge_mod: 1.27 }, "4": { cap_mod: 0.96, recharge_mod: 1.36 },
        "5": { cap_mod: 0.95, recharge_mod: 1.45 }
    },
    "Imported": { "0": { cap_mod: 1.0, recharge_mod: 1.0 } }
};
const experimentalEffectMods = {
    "None":               { cap_mod: 1.0,  recharge_mod: 1.0 },
    "Cluster Capacitors": { cap_mod: 1.08, recharge_mod: 0.98 },
    "Super Conduits":     { cap_mod: 0.96, recharge_mod: 1.04 }
};
const collectorLimpets = {
    "collector-1d": 1, "collector-3d": 2, "collector-5d": 3,
    "collector-7d": 4, "collector-3c-multi": 4, "collector-7a-uni": 8
};
const rockFragmentYields = {
    "NO":  { "NoRES": 10, "LoRES": 11, "RES": 12, "HiRES": 13.5, "HzRES": 14.5 },
    "YES": { "NoRES": 35, "LoRES": 38.5, "RES": 42, "HiRES": 47.25, "HzRES": 50.75 }
};
const laserStats = {
    "laser-1d-ml": { draw: 1.5, frag_sec: 0.1417 },
    "laser-1d-lance": { draw: 1.75, frag_sec: 0.1700 },
    "laser-1d-modd": { draw: 0.75, frag_sec: 0.1417 },
    "laser-2d-ml": { draw: 3.0, frag_sec: 0.4183 }
};
let customPDStats = null;
let resultSpans = {};

function populateSelect(elementId, options, defaultSelection) {
    const select = document.getElementById(elementId);
    if (!select) return;
    select.innerHTML = '';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = option;
        select.appendChild(opt);
    });
    if (defaultSelection) select.value = defaultSelection;
}
function populateNumberSelect(elementId, max, defaultSelection = 0) {
    const options = [];
    for (let i = 0; i <= max; i++) {
        options.push(i);
    }
    populateSelect(elementId, options, defaultSelection);
}

function updateCalculator(event) {
    const pdControlIds = ['pd-size', 'pd-grade', 'eng-type', 'eng-grade', 'exp-effect'];
    if (event && pdControlIds.includes(event.target.id)) {
        customPDStats = null;
        if (document.getElementById('eng-type').value === 'Imported') {
            document.getElementById('eng-type').value = 'None';
        }
    }

    let finalCapacity = 0, finalRecharge = 0;
    resultSpans.pdStatus.textContent = '';
    
    if (customPDStats) {
        finalCapacity = customPDStats.cap;
        finalRecharge = customPDStats.recharge;
        resultSpans.pdStatus.textContent = '(Imported)';
    } else {
        const pdSize = document.getElementById('pd-size').value;
        const pdGrade = document.getElementById('pd-grade').value;
        let engType = document.getElementById('eng-type').value;
        let engGrade = document.getElementById('eng-grade').value;
        let effect = document.getElementById('exp-effect').value;
        if (engType === "None" || engType === "Imported") {
            if (engType === "None") {
                 document.getElementById('exp-effect').value = "None";
                 effect = "None";
            }
            document.getElementById('eng-grade').value = "0";
            document.getElementById('eng-grade').disabled = true;
            document.getElementById('exp-effect').disabled = true;
            engGrade = "0";
        } else {
            document.getElementById('eng-grade').disabled = false;
            document.getElementById('exp-effect').disabled = false;
            if(engGrade === "0") { engGrade = "1"; document.getElementById('eng-grade').value = "1"; }
        }
        const baseStats = powerDistributorStats[pdSize]?.[pdGrade];
        const engMod = engineeringMods[engType]?.[engGrade];
        const effectMod = experimentalEffectMods[effect];
        if (baseStats && engMod && effectMod) {
            const engineeredCapacity = parseFloat((baseStats.cap * engMod.cap_mod).toFixed(3));
            const engineeredRecharge = parseFloat((baseStats.recharge * engMod.recharge_mod).toFixed(3));
            finalCapacity = engineeredCapacity * effectMod.cap_mod;
            finalRecharge = engineeredRecharge * effectMod.recharge_mod;
        }
    }
    
    let totalLimpets = 0;
    document.querySelectorAll('.collector-select').forEach(select => {
        totalLimpets += (parseInt(select.value) || 0) * (collectorLimpets[select.id] || 0);
    });
    const fragmentYield = rockFragmentYields[document.getElementById('prospector-select').value]?.[document.getElementById('zone-select').value] || 0;
    
    let totalDraw = 0, totalFragGen = 0;
    document.querySelectorAll('.laser-select').forEach(select => {
        const quantity = parseInt(select.value) || 0;
        const stats = laserStats[select.id];
        if (stats) { totalDraw += quantity * stats.draw; totalFragGen += quantity * stats.frag_sec; }
    });
    
    const timeToDepleteRock = totalFragGen > 0 ? fragmentYield / totalFragGen : Infinity;
    const netDraw = totalDraw - finalRecharge;
    const timeToEmptyPD = netDraw > 0 ? finalCapacity / netDraw : Infinity;
    
    let depletionPercent, depletionTime, marginFragments;
    if (timeToEmptyPD >= timeToDepleteRock) {
        depletionPercent = 100;
        depletionTime = Math.round(timeToDepleteRock);
        const remainingPDTime = timeToEmptyPD - timeToDepleteRock;
        marginFragments = Math.floor(remainingPDTime * totalFragGen);
    } else {
        depletionTime = Math.round(timeToEmptyPD);
        depletionPercent = totalFragGen > 0 ? Math.round((timeToEmptyPD / timeToDepleteRock) * 100) : 0;
        marginFragments = 0;
    }
    
    resultSpans.cap.textContent = finalCapacity.toFixed(3);
    resultSpans.recharge.textContent = finalRecharge.toFixed(3);
    resultSpans.totalLimpets.textContent = totalLimpets;
    resultSpans.totalLimpetsFinal.textContent = totalLimpets;
    resultSpans.fragmentsPerRock.textContent = fragmentYield.toFixed(2);
    resultSpans.fragmentsPerRockFinal.textContent = fragmentYield.toFixed(2);
    resultSpans.totalDraw.textContent = totalDraw.toFixed(2) + " MW";
    resultSpans.fragGen.textContent = totalFragGen.toFixed(4);
    resultSpans.depletionPercent.textContent = depletionPercent;
    resultSpans.depletionTime.textContent = isFinite(depletionTime) ? depletionTime : "∞";
    resultSpans.marginFragments.textContent = isFinite(marginFragments) ? marginFragments : "∞";
}

function handleImport() {
    const importText = document.getElementById('import-text').value;
    const refineryAlert = document.getElementById('refinery-alert');
    if (!importText) { alert("Please paste EDSY SLEF export text first."); return; }
    
    if (refineryAlert) refineryAlert.style.display = 'none';
    customPDStats = null;
    
    try {
        const buildData = JSON.parse(importText)[0].data;
        const modules = buildData.Modules;
        let hasRefinery = false;
        
        document.querySelectorAll('.laser-select, .collector-select').forEach(s => s.value = 0);
        
        modules.forEach(module => {
            const item = module.Item;
            if (item.includes("int_refinery")) {
                hasRefinery = true;
            }
            if (item.includes("int_powerdistributor")) {
                const parts = item.split("_");
                const gradeMap = { "1": "E", "2": "D", "3": "C", "4": "B", "5": "A" };
                const gradeNumber = parts[3].replace("class", "");
                document.getElementById('pd-size').value = parts[2].replace("size", "");
                document.getElementById('pd-grade').value = gradeMap[gradeNumber] || 'A';
                if (module.Engineering) {
                    const wepCapMod = module.Engineering.Modifiers.find(m => m.Label === 'WeaponsCapacity');
                    const wepRechargeMod = module.Engineering.Modifiers.find(m => m.Label === 'WeaponsRecharge');
                    customPDStats = { cap: wepCapMod ? wepCapMod.Value : 0, recharge: wepRechargeMod ? wepRechargeMod.Value : 0 };
                    document.getElementById('eng-type').value = 'Imported';
                } else { 
                    document.getElementById('eng-type').value = "None";
                }
            }
            else if (item === "hpt_mininglaser_fixed_small") {
                const select = document.getElementById(module.Engineering ? 'laser-1d-modd' : 'laser-1d-ml');
                select.value = parseInt(select.value) + 1;
            } else if (item === "hpt_mininglaser_fixed_small_advanced") {
                document.getElementById('laser-1d-lance').value = parseInt(document.getElementById('laser-1d-lance').value) + 1;
            } else if (item === "hpt_mininglaser_fixed_medium") {
                document.getElementById('laser-2d-ml').value = parseInt(document.getElementById('laser-2d-ml').value) + 1;
            }
            else if (item.includes("int_dronecontrol_collection")) {
                const match = item.match(/size(\d)/);
                if (match) {
                    const size = match[1];
                    const select = document.getElementById(`collector-${size}d`);
                    if (select) select.value = parseInt(select.value) + 1;
                }
            }
            else if (item.includes("int_multidronecontrol")) {
                 if (item.includes("mining") || item.includes("operations")) {
                     document.getElementById('collector-3c-multi').value = 1;
                 }
                 if (item.includes("universal")) {
                     document.getElementById('collector-7a-uni').value = 1;
                 }
            }
        });

        if (!hasRefinery && refineryAlert) {
            refineryAlert.style.display = 'block';
        }

        updateCalculator();
        alert("Build imported successfully!");
    } catch (e) {
        alert("Import failed. Please ensure you have pasted the complete and unmodified SLEF (JSON) export text.");
        console.error("Import parsing error:", e);
    }
}

function handleCoriolisImport() {
    const importText = document.getElementById('import-text-cor').value;
    const refineryAlert = document.getElementById('refinery-alert');
    if (!importText) {
        alert("Please paste Coriolis export text first.");
        return;
    }

    refineryAlert.style.display = 'none';
    customPDStats = null;

    try {
        const buildData = JSON.parse(importText);
        const modules = buildData.components;
        const hardpoints = modules.hardpoints || [];
        const internals = modules.internal || [];
        let hasRefinery = false;

        console.log("=== Coriolis Import Start ===");
        console.log("Parsed build data:", buildData);

        document.querySelectorAll('.laser-select, .collector-select').forEach(s => s.value = 0);

        // Power distributor
        const pd = modules.standard?.powerDistributor;
        console.log("Power Distributor module:", pd);

        if (pd) {
            document.getElementById('pd-size').value = pd.class.toString();
            document.getElementById('pd-grade').value = pd.rating;
            if (pd.blueprint && pd.blueprint.fdname === "PowerDistributor_PriorityWeapons") {
                const capMod = 1 + (pd.modifications?.wepcap || 0) / 10000;
                const rechargeMod = 1 + (pd.modifications?.weprate || 0) / 10000;
                const pdBase = powerDistributorStats[pd.class]?.[pd.rating];
                console.log("PD base stats:", pdBase);
                console.log("Cap mod:", capMod, "Recharge mod:", rechargeMod);
                if (pdBase) {
                    const cap = parseFloat((pdBase.cap * capMod).toFixed(3));
                    const recharge = parseFloat((pdBase.recharge * rechargeMod).toFixed(3));
                    customPDStats = { cap, recharge };
                    document.getElementById('eng-type').value = 'Imported';
                    console.log("Custom PD stats set:", customPDStats);
                }
            } else {
                document.getElementById('eng-type').value = "None";
                console.log("No engineering on PD");
            }
        }

        // Lasers
        hardpoints.forEach((hp, idx) => {
            if (!hp || !hp.enabled || !hp.group) return;
            console.log(`Hardpoint ${idx}:`, hp.group, hp);

            if (hp.group === "Mining Laser") {
                const key = (hp.class === 2) ? "laser-2d-ml"
                        : hp.blueprint ? "laser-1d-modd"
                        : "laser-1d-ml";
                const select = document.getElementById(key);
                if (select) {
                    select.value = parseInt(select.value) + 1;
                    console.log(`Incremented ${key}`);
                }
            } else if (hp.group === "Mining Laser (Lance)") {
                const select = document.getElementById('laser-1d-lance');
                if (select) {
                    select.value = parseInt(select.value) + 1;
                    console.log("Incremented laser-1d-lance");
                }
            }
        });

        // Collectors
        internals.forEach((mod, idx) => {
            if (!mod || !mod.group) return;
            const group = mod.group.toLowerCase();
            const id = mod.name?.toLowerCase();

            console.log(`Internal ${idx}:`, group, id);

            if (group === "refinery") {
                hasRefinery = true;
                console.log("Refinery found");
            } else if (group.includes("collector")) {
                const classStr = mod.class.toString();
                const cid = `collector-${classStr}${"d"}`;
                const select = document.getElementById(cid);
                if (select) {
                    select.value = parseInt(select.value) + 1;
                    console.log(`Incremented ${cid}`);
                } else {
                    console.warn(`Unknown collector ID: ${cid}`);
                }
            } else if (group.includes("multi limpet")) {
                if (id?.includes("universal")) {
                    document.getElementById('collector-7a-uni').value = 1;
                    console.log("Enabled collector-7a-uni");
                } else {
                    document.getElementById('collector-3c-multi').value = 1;
                    console.log("Enabled collector-3c-multi");
                }
            }
        });

        if (!hasRefinery && refineryAlert) {
            refineryAlert.style.display = 'block';
            console.warn("No refinery found");
        }

        updateCalculator();
        alert("Coriolis build imported successfully!");
        console.log("=== Coriolis Import End ===");
    } catch (e) {
        alert("Coriolis import failed. Please ensure you have pasted the full and unmodified JSON export.");
        console.error("Coriolis import error:", e);
    }
}

function exportStats() {
    // (same code to gather exportText)
    const pdSize = document.getElementById('pd-size').value;
    const pdGrade = document.getElementById('pd-grade').value;
    const engType = document.getElementById('eng-type').value;
    const engGrade = document.getElementById('eng-grade').value;
    const expEffect = document.getElementById('exp-effect').value;
    const totalLimpets = document.getElementById('total-limpets-result').textContent;
    const fragmentsPerRock = document.getElementById('fragments-per-rock').textContent;
    const totalDraw = document.getElementById('total-draw-result').textContent;
    const fragGen = document.getElementById('frag-gen-result').textContent;
    const depletionPercent = document.getElementById('depletion-percent').textContent;
    const depletionTime = document.getElementById('depletion-time').textContent;
    const marginFragments = document.getElementById('margin-fragments').textContent;
    const cap = document.getElementById('wep-cap-result').textContent;
    const recharge = document.getElementById('wep-recharge-result').textContent;

    const pdType = engType === "Imported" ? "Imported" : `Grade ${engGrade}`;
    
    const exportText = `
Power Distributor:
  Capacity: ${cap}
  Recharge Rate: ${recharge}
  Size: ${pdSize}
  Grade: ${pdGrade}
  Engineering: ${pdType}
  Experimental Effect: ${expEffect}

Mining Setup:
  Total Limpets: ${totalLimpets}
  Fragments per Rock: ${fragmentsPerRock}
  Total Power Draw: ${totalDraw}
  Fragment Generation Rate: ${fragGen}

Depletion Estimates:
  Depletion %: ${depletionPercent}%
  Time to Depletion: ${depletionTime} seconds
  PD Fragment Margin: ${marginFragments}
`.trim();

    const popup = document.getElementById('export-popup');
    const textarea = popup.querySelector('textarea');
    textarea.value = exportText;

    popup.style.display = 'flex';

    textarea.focus();
    textarea.select();
}





function setupEventListeners() {
    document.getElementById('toggle-import-btn').addEventListener('click', () => {
        const importSection = document.getElementById('import-section');
        const coriolisSection = document.getElementById('coriolis-section');
        const isHidden = importSection.style.display === 'none' || importSection.style.display === '';
        importSection.style.display = isHidden ? 'block' : 'none';
        if (isHidden) coriolisSection.style.display = 'none';
    });
    
    document.getElementById('toggle-coriolis-btn').addEventListener('click', () => {
        const importSection = document.getElementById('import-section');
        const coriolisSection = document.getElementById('coriolis-section');
        const isHidden = coriolisSection.style.display === 'none' || coriolisSection.style.display === '';
        coriolisSection.style.display = isHidden ? 'block' : 'none';
        if (isHidden) importSection.style.display = 'none';
    });
    
    const multiLimpetInput = document.getElementById('collector-3c-multi');
    const universalInput = document.getElementById('collector-7a-uni');
    function handleExclusiveCollectors(event) {
        if (parseInt(event.target.value) === 1) {
            if (event.target.id === 'collector-3c-multi') universalInput.value = 0;
            else if (event.target.id === 'collector-7a-uni') multiLimpetInput.value = 0;
        }
        updateCalculator(event);
    }
    if (multiLimpetInput) multiLimpetInput.addEventListener('change', handleExclusiveCollectors);
    if (universalInput) universalInput.addEventListener('change', handleExclusiveCollectors);

    const laserSelects = document.querySelectorAll('.laser-select');
    laserSelects.forEach(select => {
        select.addEventListener('change', (event) => {
            let totalLasers = 0;
            laserSelects.forEach(s => totalLasers += parseInt(s.value));
            if (totalLasers > 10) {
                event.target.value = parseInt(event.target.value) - (totalLasers - 10);
            }
            updateCalculator(event);
        });
    });

    document.querySelectorAll('select:not(.laser-select):not(.exclusive-collector)').forEach(select => {
        select.addEventListener('change', (event) => updateCalculator(event));
    });

    document.getElementById('import-btn').addEventListener('click', handleImport);
    document.getElementById('import-btn-cor').addEventListener('click', handleCoriolisImport);
    document.getElementById('export-btn').addEventListener('click', exportStats);
    document.getElementById('export-popup-close').addEventListener('click', () => {
        document.getElementById('export-popup').style.display = 'none';
    });


}



document.addEventListener('DOMContentLoaded', () => {
    resultSpans = {
        cap: document.getElementById('wep-cap-result'), recharge: document.getElementById('wep-recharge-result'),
        totalLimpets: document.getElementById('total-limpets-result'), totalLimpetsFinal: document.getElementById('total-limpets-result-final'),
        fragmentsPerRock: document.getElementById('fragments-per-rock'), fragmentsPerRockFinal: document.getElementById('fragments-per-rock-final'),
        totalDraw: document.getElementById('total-draw-result'),
        fragGen: document.getElementById('frag-gen-result'),
        depletionPercent: document.getElementById('depletion-percent'), depletionTime: document.getElementById('depletion-time'),
        marginFragments: document.getElementById('margin-fragments'), pdStatus: document.getElementById('pd-status')
    };

    populateSelect('pd-size', [1, 2, 3, 4, 5, 6, 7, 8], 7);
    populateSelect('pd-grade', ['E', 'D', 'C', 'B', 'A', 'A Guardian'], 'A');
    populateSelect('eng-type', ['None', 'Weapons Focused', 'Charge Enhanced']);
    const engTypeSelect = document.getElementById('eng-type');
    const importedOption = document.createElement('option');
    importedOption.value = 'Imported';
    importedOption.textContent = 'Imported';
    importedOption.hidden = true;
    engTypeSelect.appendChild(importedOption);
    
    populateSelect('eng-grade', ['0', '1', '2', '3', '4', '5']);
    populateSelect('exp-effect', ['None', 'Cluster Capacitors', 'Super Conduits']);
    populateSelect('zone-select', ['NoRES', 'LoRES', 'RES', 'HiRES', 'HzRES']);
    populateSelect('prospector-select', ['YES', 'NO'], 'YES');
    populateNumberSelect('laser-1d-ml', 10);
    populateNumberSelect('laser-1d-lance', 10);
    populateNumberSelect('laser-1d-modd', 10);
    populateNumberSelect('laser-2d-ml', 7);
    populateNumberSelect('collector-1d', 10);
    populateNumberSelect('collector-3d', 10);
    populateNumberSelect('collector-5d', 7);
    populateNumberSelect('collector-7d', 3);
    populateNumberSelect('collector-3c-multi', 1);
    populateNumberSelect('collector-7a-uni', 1);
    
    setupEventListeners();
    updateCalculator();
});
