document.addEventListener("DOMContentLoaded", function(){
    const INITIAL_STATE = {
        eddies: 0,              // Ressource principale
        shards: 0,              // Data Shards
        scrap: 0,               // Ferraille
        influence: 0,           // Réputation

        eddiesPerClick: 1,      // Gain de base par clic
        eddiesPerSecond: 0,     // Production passive totale

        totalClicks: 0,         //Compteur de clics
    };

    const PRODUCERS = [
        {
            id: "fixer",
            name: "Fixer de rue",
            lore: "Un contact dans les bas-fonds qui ramène des contrats.",
            emoji: "🤝",
            owned: 0,
            baseCost: 10,
            costMultiplier: 1.15,    //+15% à chaque achat
            baseProduction: 0.1,     //0.1 Eddies/sec par fixeur
        },
        {
            id: "braindance",
            name: "Braindance illégal",
            lore: "Tu vends des expériences neurales sur le marché noir.",
            emoji: "🧠",
            owned: 0,
            baseCost: 80,
            costMultiplier: 1.15,
            baseProduction: 0.5,
        },
        {
            id: "drone",
            name: "Drone de livraison",
            lore: "Livre des colis pour des corporations sans poser de questions.",
            emoji: "🚁",
            owned: 0,
            baseCost: 500,
            costMultiplier: 1.15,
            baseProduction: 2,
        },
        {
            id: "netrunner",
            name: "Netrunner à la solde",
            lore: "Hacke des comptes bancaires corporatifs depuis le Cyberespace.",
            emoji: "💻",
            owned: 0,
            baseCost: 3000,
            costMultiplier: 1.15,
            baseProduction: 10,
        },
        {
            id: "corrupt_ai",
            name: "IA corrompue",
            lore: "Une IA qui travaille pour toi 24H/24 dans les profondeurs du Net.",
            emoji: "🤖",
            owned: 0,
            baseCost: 150000,
            costMultiplier: 1.15,
            baseProduction: 200,
        },
    ];


    const UPGRADES = [
        {
            id: "mantis_blade",
            name: "Lame Mantis",
            lore: "Implant cybernétiques tranchant intégré dans les avant-bras.",
            emoji: "🗡️",
            bought: false,
            cost: 100,
            clickMultiplier: 2,     // Double les Eddies par clic
            unlockAt: 50,          // Se débloque à 50 Eddies
        },
        {
            id: "kiroshi_eye",
            name: "Oeil Kiroshi",
            lore: "L'oeil cybernétique de V. Détecte les failles en temps réel.",
            emoji: "👁️",
            bought: false,
            cost: 500,
            clickMultiplier: 3,     // Triple les Eddies par clic
            unlockAt: 200,
        },
        {
            id: "sandavistan",
            name: "Puce Sandevistan",
            lore: "Ralentit le temps autour de toi. Tu cliques avant même de penser.",
            emoji: "⏱️",
            bought: false,
            cost: 5000,
            clickMultiplier: 5,     // Multiplie par 5 les Eddies par clic
            unlockAt: 2000,
        },
        {
            id: "neural_override",
            name: "Surcharge Synaptique",
            lore: "Boost neural d'urgence. Libère tout le potentiel de ta puce.",
            emoji: "🔥",
            bought: false,
            cost: 50000,
            clickMultiplier: 10,
            unlockAt: 20000,
        },
    ];

});