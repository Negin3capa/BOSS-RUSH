import { BaseCharacter } from "../entities/BaseCharacter";
import { getRandomSkills, getWeightedRandomSkills } from "../data/skills";
import { GAMEPLAY, ATTRIBUTES } from "../constants";
import { k } from "../kaplayCtx";

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
        this.initializeParty();
    }

    initializeParty() {
        this.party = [];
        this.roundCounter = 1;
        this.scalingFactor = 1.0;

        // Leader - Balanced - Light/Star
        const hero = new BaseCharacter("Hero (Leader)", "Hero", {
            hp: 100, mp: 50, attack: 15, defense: 10,
            specialAttack: 15, specialDefense: 10, speed: 12, accuracy: 105, luck: 10
        });
        hero.types = [ATTRIBUTES.LIGHT, ATTRIBUTES.STAR];
        this.setupSkills(hero, "Hero");
        this.party.push(hero);

        // Member 2 - Tanky - Rock/Steel
        const tank = new BaseCharacter("Tank", "Tank", {
            hp: 150, mp: 30, attack: 12, defense: 15,
            specialAttack: 8, specialDefense: 15, speed: 8, accuracy: 95, luck: 5
        });
        tank.types = [ATTRIBUTES.ROCK, ATTRIBUTES.STEEL];
        this.setupSkills(tank, "Tank");
        this.party.push(tank);

        // Member 3 - Mage-like - Water/Ice
        const mage = new BaseCharacter("Mage", "Mage", {
            hp: 70, mp: 100, attack: 10, defense: 5,
            specialAttack: 25, specialDefense: 10, speed: 10, accuracy: 100, luck: 8
        });
        mage.types = [ATTRIBUTES.WATER, ATTRIBUTES.ICE];
        this.setupSkills(mage, "Mage");
        this.party.push(mage);

        // Member 4 - Striker - Wind/Flying
        const rogue = new BaseCharacter("Rogue", "Rogue", {
            hp: 80, mp: 40, attack: 20, defense: 8,
            specialAttack: 12, specialDefense: 8, speed: 18, accuracy: 110, luck: 15
        });
        rogue.types = [ATTRIBUTES.WIND, ATTRIBUTES.FLYING];
        this.setupSkills(rogue, "Rogue");
        this.party.push(rogue);
    }

    setupSkills(char, className) {
        // Fetch 4 Actives and 4 Passives using weighted randomness
        char.activeSkills = getWeightedRandomSkills(className, 4, 0, "ACTIVE");
        char.passiveSkills = getWeightedRandomSkills(className, 4, 0, "Passive");
        char.skills = char.activeSkills; // Compatibility for UI
    }

    generateEnemies() {
        this.enemies = [];
        const availableTypes = Object.values(ATTRIBUTES).filter(t => t !== ATTRIBUTES.PHYSICAL && t !== ATTRIBUTES.SPECIAL && t !== ATTRIBUTES.HEALING);
        const roundNum = this.roundCounter;
        const isBossRound = roundNum % 3 === 0;
        const isStrongerRound = roundNum % 3 === 2;
        const type = isBossRound ? "Boss" : (isStrongerRound ? "Stronger" : "Simple");
        const count = isBossRound ? 1 : (isStrongerRound ? 2 : k.randi(1, GAMEPLAY.MAX_ENEMIES));

        const luckFactor = Math.floor((roundNum - 1) / 3) * 0.5;

        for (let i = 0; i < count; i++) {
            const stats = this.getEnemyStats(type);
            const enemy = new BaseCharacter(
                isBossRound ? "BOSS" : `Enemy ${i + 1}`,
                "Enemy",
                stats
            );
            enemy.isBoss = isBossRound;

            // Assign 1 or 2 random types
            const t1 = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            enemy.types = [t1];
            if (Math.random() > 0.6) {
                const t2 = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                if (t2 !== t1) enemy.types.push(t2);
            }

            this.setupSkills(enemy, "ANY");
            this.enemies.push(enemy);
        }
        return this.enemies;
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

        return {
            hp: Math.floor(base.hp * this.scalingFactor),
            mp: Math.floor(base.mp * this.scalingFactor),
            attack: Math.floor(base.attack * this.scalingFactor),
            defense: Math.floor(base.defense * this.scalingFactor),
            specialAttack: Math.floor(base.specialAttack * this.scalingFactor),
            specialDefense: Math.floor(base.specialDefense * this.scalingFactor),
            speed: Math.floor(base.speed * this.scalingFactor),
            accuracy: Math.floor(base.accuracy * this.scalingFactor),
            luck: Math.floor(base.luck * this.scalingFactor)
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
