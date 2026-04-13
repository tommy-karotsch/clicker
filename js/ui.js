
// ui.js — Gestion de l'affichage

function formatNumber(n) {
    n = Math.floor(n);
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + " M";
    if (n >= 1_000)     return (n / 1_000).toFixed(2) + " K";
    return n.toString();
}

function ui_update() {
    document.getElementById("display-eddies").textContent    = formatNumber(gameState.eddies) + " ¥";
    document.getElementById("display-shards").textContent    = formatNumber(gameState.shards);
    document.getElementById("display-scrap").textContent     = formatNumber(gameState.scrap);
    document.getElementById("display-influence").textContent = formatNumber(gameState.influence);

    document.getElementById("display-per-click").textContent  = formatNumber(gameState.eddiesPerClick);
    document.getElementById("display-per-second").textContent = gameState.eddiesPerSecond.toFixed(1);

    ui_updateShopCards();
    ui_updateLevel();
}

function ui_renderShop() {
    ui_renderProducers();
    ui_renderUpgrades();
}

function ui_renderProducers() {
    const container = document.getElementById("shop-producers");
    container.innerHTML = "";

    producers.forEach(producer => {
        const cost = getCurrentCost(producer);
        const canAfford = gameState.eddies >= cost;

        const card = document.createElement("div");
        card.className = "shop-card" + (canAfford ? "" : " disabled");
        card.dataset.id = producer.id;

        card.innerHTML = `
            <span class="shop-card-emoji">${producer.emoji}</span>
            <div class="shop-card-info">
                <div class="shop-card-name">${producer.name}</div>
                <div class="shop-card-lore">${producer.lore}</div>
                <div class="shop-card-cost">${formatNumber(cost)} ¥</div>
            </div>
            <div class="shop-card-owned">${producer.owned}</div>
        `;

        card.addEventListener("click", () => buyProducer(producer.id));
        container.appendChild(card);
    });
}

function ui_renderUpgrades() {
    const container = document.getElementById("shop-upgrades");
    container.innerHTML = "";

    const visible = upgrades.filter(u => !u.bought && gameState.eddies >= u.unlockAt);

    if (visible.length === 0) {
        container.innerHTML = `<p class="shop-empty">Accumulez plus d'Eddies pour débloquer des implants...</p>`;
        return;
    }

    upgrades.forEach(upgrade => {
        if (upgrade.bought) return;
        if (gameState.eddies < upgrade.unlockAt) return;

        const canAfford = gameState.eddies >= upgrade.cost;
        const card = document.createElement("div");
        card.className = "shop-card" + (canAfford ? "" : " disabled");
        card.dataset.id = upgrade.id;

        card.innerHTML = `
            <span class="shop-card-emoji">${upgrade.emoji}</span>
            <div class="shop-card-info">
                <div class="shop-card-name">${upgrade.name}</div>
                <div class="shop-card-lore">${upgrade.lore}</div>
                <div class="shop-card-cost">${formatNumber(upgrade.cost)} ¥</div>
            </div>
            <div class="shop-card-owned">×${upgrade.clickMultiplier}</div>
        `;

        card.addEventListener("click", () => buyUpgrade(upgrade.id));
        container.appendChild(card);
    });
}

function ui_updateShopCards() {
    producers.forEach(producer => {
        const card = document.querySelector(`[data-id="${producer.id}"]`);
        if (!card) return;

        const cost = getCurrentCost(producer);

        const costEl = card.querySelector(".shop-card-cost");
        if (costEl) costEl.textContent = formatNumber(cost) + " ¥";

        const ownedEl = card.querySelector(".shop-card-owned");
        if (ownedEl) ownedEl.textContent = producer.owned;

        if (gameState.eddies < cost) {
            card.classList.add("disabled");
        } else {
            card.classList.remove("disabled");
        }
    });

    ui_renderUpgrades();
}

function ui_updateLevel(){
    const currentLevelData = LEVELS.find(1 => 1.level === gameState.currentLevel);
    const nextLevelData    = LEVELS.find(1 => 1.level === gameState.currentLevel + 1);

    document.getElementById("level-emoji").textContent = currentLevelData.emoji;
    document.getElementById("level-name").textContent = currentLevelData.title;

    if(!nextLevelData){
        document.getElementById("level-bar").style.width = "100%";
        document.getElementById("level-progress").textContent = "NIVEAU MAX 🏆";
        return;
    }

    const progresseFromCurrent = gameState.totalEddiesEarned - currentLevelData.threshold;
    const progressNeeded       = nextLevelData.threshold - currentLevelData.threshold;
    const percent = Math.min((progressFromCurrent / progressNeeded) * 100, 100);

    document.getElementById("level-bar").style.width = percent + "%";
    document.getElementById("level-progress").textContent =
            `${formatNumber(gameState.totalEddiesEarned)} / ${formatNumber(nextLevelData.threshold)} ¥`;
}

function ui_showLevelUp(levelData){
    const popup = document.getElementById("levelup-popup");
    document.getElementById("levelup-emoji").textContent = levelData.emoji;
    document.getElementById("levelup-text").textContent = '${levelData.title}.toUpperCase()} !';

    popup.classList.remove("hidden");
    popup.classList.add("show-decor");

    setTimeout(() => {
        popup.classList.add("hidde");
        popup.classList.remove("show-decor");
    },3000);
}