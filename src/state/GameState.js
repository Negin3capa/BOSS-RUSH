import { BaseCharacter } from "../entities/BaseCharacter";
import { getRandomSkills, getWeightedRandomSkills } from "../data/skills";
import { GAMEPLAY, ATTRIBUTES } from "../constants";
import { k } from "../kaplayCtx";

const CREATURE_NOUNS = [
    "Slime", "Golem", "Sprite", "Beast", "Wraith", "Construct", "Elemental", "Stalker", "Sentinel", "Avian"
];

export class GameState {
    constructor() {
        this.party = [];
        this.enemies = [];
        this.inventory = [
            { name: "Healing Potion", type: "Heal", power: 50, count: 3 },
            { name: "Iron Sword", type: "Weapon", attackBonus: 5, attribute: ATTRIBUTES.NORMAL, multiHit: 1, count: 1 },
            { name: "Leather Vest", type: "Armor", hpBonus: 20, defBonus: 5, count: 1 },
            { name: "Copper Ring", type: "Accessory", attackBonus: 2, count: 1 }
        ];
        this.roundCounter = 1;
        this.scalingFactor = 1.0;
        this.gold = 0;
        this.scoringState = {
            roundScore: 0,
            targetScore: 1200,
            objectives: [],
            rewards: { gold: 100, exp: 200, drops: [] },
            battleMetrics: {
                superEffectiveHits: 0,
                partyDeaths: 0,
                totalTurns: 0
            }
        };
        // Ante system - increments on boss defeat, win at 8/8
        this.anteCounter = 0;
        // Attempts system - starts at 4 each round, decrements per turn
        this.attemptsLeft = 4;
        this.scoringLocked = false;
        this.initializeParty();
    }

    initializeParty() {
        this.party = [];
        this.roundCounter = 1;
        this.scalingFactor = 1.0;

        // Sol - Dark/Star
        const sol = new BaseCharacter("Sol", "Hero", {
            hp: 100, mp: 50, attack: 15, defense: 10,
            specialAttack: 15, specialDefense: 10, speed: 12, accuracy: 105, luck: 10
        });
        sol.types = [ATTRIBUTES.DARK, ATTRIBUTES.STAR];
        this.setupSkills(sol, "Hero");
        this.party.push(sol);

        // Alloy - Steel/Light
        const alloy = new BaseCharacter("Alloy", "Tank", {
            hp: 150, mp: 30, attack: 12, defense: 15,
            specialAttack: 8, specialDefense: 15, speed: 8, accuracy: 95, luck: 5
        });
        alloy.types = [ATTRIBUTES.STEEL, ATTRIBUTES.LIGHT];
        this.setupSkills(alloy, "Tank");
        this.party.push(alloy);

        // Saber - Fairy/Fire
        const saber = new BaseCharacter("Saber", "Mage", {
            hp: 70, mp: 100, attack: 10, defense: 5,
            specialAttack: 25, specialDefense: 10, speed: 10, accuracy: 100, luck: 8
        });
        saber.types = [ATTRIBUTES.FAIRY, ATTRIBUTES.FIRE];
        this.setupSkills(saber, "Mage");
        this.party.push(saber);

        // Max - Flying/Rock
        const max = new BaseCharacter("Max", "Rogue", {
            hp: 80, mp: 40, attack: 20, defense: 8,
            specialAttack: 12, specialDefense: 8, speed: 18, accuracy: 110, luck: 15
        });
        max.types = [ATTRIBUTES.FLYING, ATTRIBUTES.ROCK];
        this.setupSkills(max, "Rogue");
        this.party.push(max);
    }

    setupSkills(char, className) {
        // Fetch 4 Actives and 4 Passives using weighted randomness
        char.activeSkills = getWeightedRandomSkills(className, 4, 0, "ACTIVE");
        char.passiveSkills = getWeightedRandomSkills(className, 4, 0, "Passive");
        char.skills = char.activeSkills; // Compatibility for UI
    }

    get averagePartyLevel() {
        const aliveMembers = this.party.filter(p => !p.isDead);
        if (aliveMembers.length === 0) return 1;
        const sum = aliveMembers.reduce((acc, p) => acc + p.level, 0);
        return sum / aliveMembers.length;
    }

    generateEnemies() {
        this.enemies = [];
        const availableTypes = Object.values(ATTRIBUTES).filter(t => t !== ATTRIBUTES.PHYSICAL && t !== ATTRIBUTES.SPECIAL && t !== ATTRIBUTES.HEALING);
        const roundNum = this.roundCounter;
        const isBossRound = roundNum % 3 === 0;
        const isStrongerRound = roundNum % 3 === 2;
        const type = isBossRound ? "Boss" : (isStrongerRound ? "Stronger" : "Simple");
        const count = isBossRound ? 1 : (isStrongerRound ? 2 : k.randi(1, GAMEPLAY.MAX_ENEMIES));

        for (let i = 0; i < count; i++) {
            const stats = this.getEnemyStats(type);
            const enemy = new BaseCharacter(
                isBossRound ? "BOSS" : `Enemy ${i + 1}`,
                "Enemy",
                stats
            );
            enemy.isBoss = isBossRound;
            // Enemies gain levels too
            enemy.level = Math.max(1, Math.floor(this.averagePartyLevel + (roundNum / 3)));

            // Assign 1 or 2 random types
            const t1 = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            enemy.types = [t1];
            enemy.attribute = t1; // Compatibility
            if (Math.random() > 0.6) {
                const t2 = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                if (t2 !== t1) enemy.types.push(t2);
            }

            // Assign Flavored Name
            const noun = CREATURE_NOUNS[Math.floor(Math.random() * CREATURE_NOUNS.length)];
            const typeLabel = enemy.types[0].charAt(0).toUpperCase() + enemy.types[0].slice(1).toLowerCase();
            if (isBossRound) {
                enemy.name = `GREATER ${typeLabel.toUpperCase()} ${noun.toUpperCase()}`;
            } else {
                enemy.name = `${typeLabel} ${noun}`;
            }

            this.setupSkills(enemy, "ANY");
            this.enemies.push(enemy);
        }
        this.generateObjectives();
        return this.enemies;
    }

    generateObjectives() {
        const objectivePool = [
            { id: "deal_type", label: "Deal {type} Damage", type: "DAMAGE", points: 100 },
            { id: "defeat_with", label: "Defeat an enemy with {name}", type: "DEFEAT", points: 300 },
            { id: "super_effective", label: "Deal Super-Effective damage", type: "EFFECTIVE", points: 150 },
            { id: "use_skill", label: "Use {rarity} Skill", type: "SKILL", points: 200 },
            { id: "heal_juice", label: "Heal 50+ Juice in one turn", type: "REGEN", points: 250 },
        ];

        const bonusTypes = [
            { type: "additive", value: 50, display: "+50" },
            { type: "additive", value: 100, display: "+100" },
            { type: "additive", value: 150, display: "+150" },
            { type: "multiplicative", value: 1.5, display: "x1.5" },
            { type: "multiplicative", value: 2, display: "x2" },
            { type: "multiplicative", value: 2.5, display: "x2.5" },
        ];

        const count = k.randi(3, 6);
        const objectives = [];
        const usedPoolIndices = new Set();

        for (let i = 0; i < count; i++) {
            let idx;
            do { idx = k.randi(0, objectivePool.length); } while (usedPoolIndices.has(idx));
            usedPoolIndices.add(idx);

            const base = objectivePool[idx];
            let label = base.label;
            let targetData = {};

            if (base.id === "deal_type") {
                const types = Object.values(ATTRIBUTES).filter(t => t !== ATTRIBUTES.PHYSICAL);
                const type = types[k.randi(0, types.length)];
                label = label.replace("{type}", type);
                targetData = { type };
            } else if (base.id === "defeat_with") {
                const name = this.party[k.randi(0, this.party.length)].name;
                label = label.replace("{name}", name);
                targetData = { name };
            } else if (base.id === "use_skill") {
                const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
                const rarity = rarities[k.randi(0, 3)]; // Weighted towards lower for now
                label = label.replace("{rarity}", rarity);
                targetData = { rarity };
            }

            const bonus = bonusTypes[k.randi(0, bonusTypes.length)];

            objectives.push({
                ...base,
                label,
                targetData,
                currentCount: 0,
                bonus: bonus
            });
        }

        this.scoringState.objectives = objectives;
        this.scoringState.roundScore = 0;
        this.scoringState.targetScore = 1000 + (this.roundCounter * 200);
    }

    addScore(amount) {
        // Scoring is locked when attempts reach 0
        if (this.scoringLocked) {
            return false; // Score not added
        }
        this.scoringState.roundScore += amount;
        return true; // Score added successfully
    }

    decrementAttempts() {
        this.attemptsLeft = Math.max(0, this.attemptsLeft - 1);
        if (this.attemptsLeft === 0) {
            this.scoringLocked = true;
        }
        return this.attemptsLeft;
    }

    resetAttempts() {
        this.attemptsLeft = 4;
        this.scoringLocked = false;
    }

    incrementAnte() {
        this.anteCounter = Math.min(8, this.anteCounter + 1);
        return this.anteCounter;
    }

    hasWonGame() {
        return this.anteCounter >= 8;
    }

    getEnemyStats(type) {
        let base = {
            hp: 60, mp: 50, attack: 15, defense: 5,
            specialAttack: 15, specialDefense: 5, speed: 10, accuracy: 100, luck: 5
        };

        if (type === "Stronger") {
            base = {
                hp: 100, mp: 60, attack: 20, defense: 10,
                specialAttack: 20, specialDefense: 10, speed: 12, accuracy: 105, luck: 7
            };
        } else if (type === "Boss") {
            base = {
                hp: 400, mp: 200, attack: 30, defense: 15,
                specialAttack: 30, specialDefense: 15, speed: 15, accuracy: 110, luck: 10
            };
        }

        // Combine round-based scaling and level-based scaling
        const roundScaling = this.scalingFactor * (1 + (this.roundCounter - 1) * 0.05);

        return {
            hp: Math.floor(base.hp * roundScaling),
            mp: Math.floor(base.mp * roundScaling),
            attack: Math.floor(base.attack * roundScaling),
            defense: Math.floor(base.defense * roundScaling),
            specialAttack: Math.floor(base.specialAttack * roundScaling),
            specialDefense: Math.floor(base.specialDefense * roundScaling),
            speed: Math.floor(base.speed * roundScaling),
            accuracy: Math.floor(base.accuracy * roundScaling),
            luck: Math.floor(base.luck * roundScaling)
        };
    }

    isLeaderAlive() {
        return this.party[0] && !this.party[0].isDead;
    }

    isPartyDefeated() {
        return !this.isLeaderAlive();
    }

    areEnemiesDefeated() {
        return this.enemies.every(e => e.isDead);
    }

    equipItem(char, item) {
        const slot = item.type.toLowerCase();
        if (char.equipment[slot]) {
            this.unequipItem(char, slot);
        }

        char.equipment[slot] = item;
    }

    unequipItem(char, slot) {
        const item = char.equipment[slot];
        if (item) {
            char.equipment[slot] = null;
            this.inventory.push({ ...item, count: 1 });
        }
    }
}

export const gameState = new GameState();
