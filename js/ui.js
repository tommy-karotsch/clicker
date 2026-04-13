function formatNumber(n){
    n = Math.floor(n);
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(2) + "K";
    return n.toString();
}

function ui_update(){
    document.getElementById("display-eddies").textContent       = formatNumber(gameState.eddies) + " ¥";
    document.getElementById("display-shards").textContent       = formatNumber(gameState.shards);
    document.getElementById("display-scrap").textContent        = formatNumber(gameState.scrap);
    document.getElementById("display-influence").textContent    = formatNumber(gameState.influence);

    document.getElementById("display-per-click").textContent    = formatNumber(gameState.eddiesPerClick);
    document.getElementById("display-per-second").textContent   = gameState.eddiesPerSecond.toFixed(1);   
    
    ui_updateShopCards();
}

function ui_renderShop(){
    ui_renderProducers();
    ui_renderUpgrades();
}

function ui_renderProducers(){
    const container = document.getElementById("shop-producers");
    container.innerHTML = "";

    producers.forEach(producer => {
        const cost =  getCurrentCost(producer);

        const card = document.createElement("div");

        card.className = "shop-card" + (gameState.eddies < cost ? " disabled" : "");

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

function ui_renderUpgrades(){
    const container = document.getElementById("shop-upgrades");
    container.innerHTML = "";

    upgrades.forEach(upgrade => {
        if (upgrade.bought) return;

        if (gameState.eddies < upgrade.unlockAt && !upgrade.bought) return;

        const card = document.createElement("div");
        card.className = "shop-card" + (gameState.eddies < upgrade_cost ? " disabled" : "");
        card.dataset.id = upgrade.id;

        card.innerHTML = `
            <span class="shop-card-emoji">${upgrade.emoji}</span>
            <div class="shop-card-info">
                <div class="shop-card-name">${upgrade.name}</div>
                <div class="shop-card-lore">${upgrade.lore}</div>
                <div class="shop-card-cost">${formatNumber(upgrade.cost)} ¥</div>
            </div>
            <div class="shop-card-owned">x${upgrade.clickMultiplier}</div>
        `;

        card.addEventListener("click", () => buyUpgrade(upgrade.id));
        container.appendChild(card);
    });
}

function ui_updateShopCards(){
    producers.forEach(producer => {
        const card = document.querySelector(`[data-id="${producer.id}"]`)
        if(!card) return;

        const cost = getCurrentCost(producer);

        const costEl = card.querySelector(".shop-card-cost");
        if (costEl) costEl.textContent = formatNumber(cost) + " ¥";

        const ownedEl = card.querySelector(".shop-card-owned");
        if (ownedEl) ownedEl.textContent = producer.owned;

        if (gameState.eddies < cost){
            card.classList.add("disabled");
        } else{
            card.classList.remove("disabled");
        }
    });

    ui_renderUpgrades();
}