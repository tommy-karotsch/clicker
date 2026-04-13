let gameState = { ...INITIAL_STATE};
let producers = PRODUCERS.map(p => ({ ...p}));
let upgrades = UPGRADES.map(u => ({ ...u}));

function getCurrentCost(producer){
    return Math.floor(producer.baseCost * Math.pow(producer.costMultiplier, producer.owned));
}

function recalculateEPS(){
    let total = 0;
    producers.forEach(p => {
        total += p.owned * p.baseProduction;
    })
    gameState.eddiesPerSecond = total;
}

function recalculateEPC(){
    let multiplier = 1;
    upgrades.forEach(u => {
        if (u.bought) multiplier *= u.clickMultiplier;
    });
    gameState.eddiesPerClick = INITIAL_STATE.eddiesPerClick * multiplier;
}

function handleClick(){
    gameState.eddies += gameState.eddiesPerClick;
    gameState.totalClicks++;

    const btn = document.getElementById("click-btn");
    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 100);

    showClickFeedback();

    ui_update();
    save();
}

function showClickFeedback(){
    const feedback = document.getElementById("click-feedback");
    feedback.textContent = `+${gameState.eddiesPerClick} ¥`;

    feedback.classList.remove("show");
    void feedback.offsetWidth;
    feedback.classList.add("show");
}

function buyProducer(id){
    const producer = producers.find(p => p.id === id);
    if (!producer) return;

    const cost = getCurrentCost(producer);

    if (gameState.eddies < cost) return;

    gameState.eddies -= cost;
    producer.owned++;

    recalculateEPS();
    ui_update();
    save();
}

function buyUpgrade(id){
    const upgrade = upgrades.find(u => u.id === id);
    if(!upgrade) return;
    if(upgrade.bought) return;
    if(gameState.eddies < upgrade.cost) return;

    gameState.eddies -= upgrade.cost;
    upgrade.bought = true;

    recalculateEPC();
    ui_update();
    save();
}

const TICK_RATE = 100;

setInterval(() => {
    if (gameState.eddiesPerSecond > 0){
        gameState.eddies += gameState.eddiesPerSecond / (1000 / TICK_RATE);
        ui_update();
        save();
    }
    
}, TICK_RATE);

document.addEventListener("DOMContentLoaded", () => {
    load();

    recalculateEPS();
    recalculateEPC();

    document.getElementById("click-btn").addEventListener("click", handleClick);

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