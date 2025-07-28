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

const sizeSelect = document.getElementById('pd-size');
const gradeSelect = document.getElementById('pd-grade');
const engTypeSelect = document.getElementById('eng-type');
const engGradeSelect = document.getElementById('eng-grade');
const capResultSpan = document.getElementById('wep-cap-result');
const rechargeResultSpan = document.getElementById('wep-recharge-result');

function updateCalculator() {
    const selectedSize = sizeSelect.value;
    const selectedGrade = gradeSelect.value;
    let selectedEngType = engTypeSelect.value;
    let selectedEngGrade = engGradeSelect.value;

    if (selectedEngType === "None") {
        selectedEngGrade = "0"; // If no engineering, force grade to 0
        engGradeSelect.disabled = true;
    } else {
        engGradeSelect.disabled = false;
        if(selectedEngGrade === "0") { // If an eng type is selected but grade is N/A, default to 1
            selectedEngGrade = "1";
            engGradeSelect.value = "1";
        }
    }

    const baseStats = powerDistributorStats[selectedSize][selectedGrade];
    const mod = engineeringMods[selectedEngType]?.[selectedEngGrade];

    if (baseStats && mod) {
        const finalCapacity = baseStats.cap * mod.cap_mod;
        const finalRecharge = baseStats.recharge * mod.recharge_mod;
        capResultSpan.textContent = finalCapacity.toFixed(2);
        rechargeResultSpan.textContent = finalRecharge.toFixed(2);
    } else {
        capResultSpan.textContent = "N/A";
        rechargeResultSpan.textContent = "N/A";
    }
}

document.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', updateCalculator);
});

updateCalculator();
