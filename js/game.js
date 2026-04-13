
// game.js — Logique du jeu

let gameState = { ...INITIAL_STATE };
let producers = PRODUCERS.map(p => ({ ...p }));
let upgrades  = UPGRADES.map(u => ({ ...u }));


// CALCULS
function getCurrentCost(producer) {
    return Math.floor(producer.baseCost * Math.pow(producer.costMultiplier, producer.owned));
}

function recalculateEPS() {
    let total = 0;
    producers.forEach(p => {
        total += p.baseProduction * p.owned;
    });

    const currentLevelData = LEVELS.find(1 => 1.level === gameState.currentLevel);
    const bonus = currentLevelData ? currentLevelData.epsBonus : 1;

    gameState.eddiesPerSecond = total * bonus;
}

function recalculateEPC() {
    let multiplier = 1;
    upgrades.forEach(u => {
        if (u.bought) multiplier *= u.clickMultiplier;
    });
    gameState.eddiesPerClick = INITIAL_STATE.eddiesPerClick * multiplier;
}


// CLIC PRINCIPAL — Puce neurale → Eddies
function handleClick() {
    gameState.eddies += gameState.eddiesPerClick;
    gameState.totalEddiesEarned += gameState.eddiesPerClick;
    gameState.totalClicks++;

    checkLevel();

    const btn = document.getElementById("click-btn");
    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 100);

    showClickFeedback();
    ui_update();
    save();
}

function showClickFeedback() {
    const feedback = document.getElementById("click-feedback");
    feedback.textContent = `+${gameState.eddiesPerClick} ¥`;
    feedback.classList.remove("show");
    void feedback.offsetWidth;
    feedback.classList.add("show");
}


const DECOR_COOLDOWN = 2000;

function handleDecorClick(resourceName, elementId, feedbackId) {
    const decor = document.getElementById(elementId);

    if (decor.classList.contains("cooldown")) return;

    gameState[resourceName]++;

    const feedback = document.getElementById(feedbackId);
    feedback.classList.remove("hidden");
    feedback.classList.add("show-decor");
    setTimeout(() => {
        feedback.classList.add("hidden");
        feedback.classList.remove("show-decor");
    }, 800);


    decor.classList.add("cooldown");
    setTimeout(() => decor.classList.remove("cooldown"), DECOR_COOLDOWN);

    ui_update();
    save();
}


// ACHATS
function buyProducer(id) {
    const producer = producers.find(p => p.id === id);
    if (!producer) return;

    const cost = getCurrentCost(producer);
    if (gameState.eddies < cost) return;

    gameState.eddies -= cost;
    producer.owned++;

    recalculateEPS();
    ui_renderShop();
    ui_update();
    save();
}

function buyUpgrade(id) {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade) return;
    if (upgrade.bought) return;
    if (gameState.eddies < upgrade.cost) return;

    gameState.eddies -= upgrade.cost;
    upgrade.bought = true;

    recalculateEPC();
    ui_renderShop();
    ui_update();
    save();
}

function checkLevel(){
    const reached = LEVELS.filter(1 => gameState.totalEddiesEarned >= 1.threshold);
    const newLevel = reached[reached.length - 1];

    if(newLevel.level !== gameState.currentLevel){
        gameState.currentLevel = newLevel.level;
        ui_showLevelUp(newLevel);
        recalculateEPS();
    }
}



// BOUCLE PASSIVE (Idle)
const TICK_RATE = 100;

setInterval(() => {
    if (gameState.eddiesPerSecond > 0) {
        const gained = gameState.eddiesPerSecond * (TICK_RATE / 1000);
        gameState.eddies += gained;
        gameState.totalEddiesEarned += gained;
        checkLevel();
        ui_update();
        save();
    }
}, TICK_RATE);


// INITIALISATION
document.addEventListener("DOMContentLoaded", () => {
    load();
    recalculateEPS();
    recalculateEPC();

    document.getElementById("click-btn").addEventListener("click", handleClick);


    document.getElementById("decor-terminal").addEventListener("click", () => {
        handleDecorClick("shards", "decor-terminal", "feedback-shards");
    });

    document.getElementById("decor-wreck").addEventListener("click", () => {
        handleDecorClick("scrap", "decor-wreck", "feedback-scrap");
    });

    document.getElementById("decor-contact").addEventListener("click", () => {
        handleDecorClick("influence", "decor-contact", "feedback-influence");
    });

    // Onglets boutique
    document.getElementById("tab-producers").addEventListener("click", () => {
        document.getElementById("shop-producers").classList.remove("hidden");
        document.getElementById("shop-upgrades").classList.add("hidden");
        document.getElementById("tab-producers").classList.add("active");
        document.getElementById("tab-upgrades").classList.remove("active");
    });

    document.getElementById("tab-upgrades").addEventListener("click", () => {
        document.getElementById("shop-upgrades").classList.remove("hidden");
        document.getElementById("shop-producers").classList.add("hidden");
        document.getElementById("tab-upgrades").classList.add("active");
        document.getElementById("tab-producers").classList.remove("active");
    });

    ui_renderShop();
    ui_update();
});