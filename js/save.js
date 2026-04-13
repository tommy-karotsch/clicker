const SAVE_KEY = "cyberpunk_clicker_save";

function save(){
    const saveData = {
        gameState: gameState,
        producers: producers.map(p => ({
            id: p.id,
            owned: p.owned,
        })),

        upgrades: upgrades.map(u => ({
            id: u.id,
            bought: u.bought,
        })),

        saveAt: Date.now(),
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

function load(){
    const raw = localStorage.getItem(SAVE_KEY);

    if(!raw){
        console.log("Aucune sauvegarde trouvée, Nouvelle partie !");
        return;
    }

    try{
        const saveData = JSON.parse(raw);
        gameState = {...INITIAL_STATE, ...saveData.gameState};

        saveData.producer.forEach(savedProducer => {
            const producer = producers.find(p => p.id === savedProducer.id);
            if(producer) producer.owned = savedProducer.owned;
        });

        saveData.upgrades.forEach(savedUpgrade =>{
            const upgrade = upgrades.find(u => u.id === savedUpgrade.id);
            if(upgrade) upgrade.bought = savedUpgrade.bought;
        });

        console.log("Sauvegarde chargée !");
    } catch(erro){
        console.warn("Sauvegarde corrompue, réinitialisation.", error);
        localStorage.removeItem(SAVE_KEY);
    }
}

function resetGame(){
    if(confirm("Effacer toute la progression ? Cette action est irréversible.")){
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}