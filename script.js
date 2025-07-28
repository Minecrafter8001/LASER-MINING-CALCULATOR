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
    }
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
    "laser-1d-lance": { draw: 0.7, frag_sec: 0.1700 },
    "laser-1d-modd": { draw: 0.75, frag_sec: 0.1417 },
    "laser-2d-ml": { draw: 3.0, frag_sec: 0.4183 }
};

// --- Helper function to populate dropdowns ---
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

// --- Populate all dropdowns on page load ---
document.addEventListener('DOMContentLoaded', () => {
    populateSelect('pd-size', [1, 2, 3, 4, 5, 6, 7, 8], 7);
    populateSelect('pd-grade', ['E', 'D', 'C', 'B', 'A', 'A Guardian'], 'A');
    populateSelect('eng-type', ['None', 'Weapons Focused', 'Charge Enhanced']);
    populateSelect('eng-grade', ['0', '1', '2', '3', '4', '5']);
    populateSelect('exp-effect', ['None', 'Cluster Capacitors', 'Super Conduits']);
    populateSelect('zone-select', ['NoRES', 'LoRES', 'RES', 'HiRES', 'HzRES']);
    populateSelect('prospector-select', ['YES', 'NO'], 'YES'); // Corrected from probe-select
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
    updateCalculator();
});

// --- Get references to elements ---
const resultSpans = {
    cap: document.getElementById('wep-cap-result'),
    recharge: document.getElementById('wep-recharge-result'),
    totalLimpets: document.getElementById('total-limpets-result'),
    fragmentsPerRock: document.getElementById('fragments-per-rock'),
    totalDraw: document.getElementById('total-draw-result'),
    depletionPercent: document.getElementById('depletion-percent'),
    depletionTime: document.getElementById('depletion-time'),
    marginFragments: document.getElementById('margin-fragments')
};

function updateCalculator() {
    // --- GATHER ALL INPUTS ---
    const pdSize = document.getElementById('pd-size').value;
    const pdGrade = document.getElementById('pd-grade').value;
    let engType = document.getElementById('eng-type').value;
    let engGrade = document.getElementById('eng-grade').value;
    let effect = document.getElementById('exp-effect').value;

    if (engType === "None") {
        document.getElementById('eng-grade').value = "0";
        document.getElementById('exp-effect').value = "None";
        document.getElementById('eng-grade').disabled = true;
        document.getElementById('exp-effect').disabled = true;
        engGrade = "0";
        effect = "None";
    } else {
        document.getElementById('eng-grade').disabled = false;
        document.getElementById('exp-effect').disabled = false;
        if(engGrade === "0") {
            engGrade = "1";
            document.getElementById('eng-grade').value = "1";
        }
    }

    // --- CALCULATE INTERMEDIATE VALUES ---
    const baseStats = powerDistributorStats[pdSize]?.[pdGrade];
    const engMod = engineeringMods[engType]?.[engGrade];
    const effectMod = experimentalEffectMods[effect];

    let finalCapacity = 0;
    let finalRecharge = 0;
    if (baseStats && engMod && effectMod) {
        const engineeredCapacity = parseFloat((baseStats.cap * engMod.cap_mod).toFixed(3));
        const engineeredRecharge = parseFloat((baseStats.recharge * engMod.recharge_mod).toFixed(3));
        finalCapacity = engineeredCapacity * effectMod.cap_mod;
        finalRecharge = engineeredRecharge * effectMod.recharge_mod;
    }

    let totalLimpets = 0;
    document.querySelectorAll('.collector-select').forEach(select => {
        totalLimpets += (parseInt(select.value) || 0) * (collectorLimpets[select.id] || 0);
    });

    const fragmentYield = rockFragmentYields[document.getElementById('prospector-select').value]?.[document.getElementById('zone-select').value] || 0;
    
    let totalDraw = 0;
    let totalFragGen = 0;
    document.querySelectorAll('.laser-select').forEach(select => {
        const quantity = parseInt(select.value) || 0;
        const stats = laserStats[select.id];
        if (stats) {
            totalDraw += quantity * stats.draw;
            totalFragGen += quantity * stats.frag_sec;
        }
    });

    // --- FINAL CALCULATIONS ---
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
        depletionPercent = Math.round((timeToEmptyPD / timeToDepleteRock) * 100);
        marginFragments = 0;
    }

    // --- UPDATE DISPLAY ---
    resultSpans.cap.textContent = finalCapacity.toFixed(3);
    resultSpans.recharge.textContent = finalRecharge.toFixed(3);
    resultSpans.totalLimpets.textContent = totalLimpets;
    resultSpans.fragmentsPerRock.textContent = fragmentYield.toFixed(2);
    resultSpans.totalDraw.textContent = totalDraw.toFixed(2) + " MW";
    resultSpans.depletionPercent.textContent = depletionPercent;
    resultSpans.depletionTime.textContent = isFinite(depletionTime) ? depletionTime : "∞";
    resultSpans.marginFragments.textContent = isFinite(marginFragments) ? marginFragments : "∞";
}

// --- EVENT HANDLING ---
function setupEventListeners() {
    const multiLimpetInput = document.getElementById('collector-3c-multi');
    const universalInput = document.getElementById('collector-7a-uni');

    function handleExclusiveCollectors(event) {
        if (parseInt(event.target.value) === 1) {
            if (event.target.id === 'collector-3c-multi') universalInput.value = 0;
            else if (event.target.id === 'collector-7a-uni') multiLimpetInput.value = 0;
        }
        updateCalculator();
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
            updateCalculator();
        });
    });

    document.querySelectorAll('select:not(.laser-select):not(.exclusive-collector)').forEach(select => {
        select.addEventListener('change', updateCalculator);
    });
}

// --- Initial Execution ---
document.addEventListener('DOMContentLoaded', () => {
    // This function will now run only after the DOM is fully loaded.
    setupEventListeners();
});
