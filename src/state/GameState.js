import { BaseCharacter } from "../entities/BaseCharacter";
import { getRandomSkills } from "../data/skills";
import { GAMEPLAY, ATTRIBUTES } from "../constants";

export class GameState {
    constructor() {
        this.party = [];
        this.enemies = [];
        this.initializeParty();
    }

    initializeParty() {
        // Leader - Balanced - Light
        const hero = new BaseCharacter("Hero (Leader)", "Hero", { hp: 100, sp: 50, attack: 15, defense: 10 });
        hero.attribute = ATTRIBUTES.LIGHT;
        hero.skills = getRandomSkills("Hero", 4);
        this.party.push(hero);

        // Member 2 - Tanky - Stone
        const tank = new BaseCharacter("Tank", "Tank", { hp: 150, sp: 30, attack: 12, defense: 15 });
        tank.attribute = ATTRIBUTES.STONE;
        tank.skills = getRandomSkills("Tank", 4);
        this.party.push(tank);

        // Member 3 - Mage-like - Water
        const mage = new BaseCharacter("Mage", "Mage", { hp: 70, sp: 100, attack: 20, defense: 5 });
        mage.attribute = ATTRIBUTES.WATER;
        mage.skills = getRandomSkills("Mage", 4);
        this.party.push(mage);

        // Member 4 - Striker - Wind
        const rogue = new BaseCharacter("Rogue", "Rogue", { hp: 80, sp: 40, attack: 25, defense: 8 });
        rogue.attribute = ATTRIBUTES.WIND;
        rogue.skills = getRandomSkills("Rogue", 4);
        this.party.push(rogue);
    }

    generateEnemies() {
        this.enemies = [];
        const count = Math.floor(Math.random() * GAMEPLAY.MAX_ENEMIES) + 1; // 1 to 3 enemies

        const enemyAttributes = [ATTRIBUTES.FIRE, ATTRIBUTES.WATER, ATTRIBUTES.WIND, ATTRIBUTES.STONE, ATTRIBUTES.DARK, ATTRIBUTES.LIGHT];

        for (let i = 0; i < count; i++) {
            // Randomize enemy stats for variety
            const enemyStats = {
                hp: 60,
                sp: 50,
                attack: 20,
                defense: 5
            };
            const enemy = new BaseCharacter(`Enemy ${i + 1}`, "Enemy", enemyStats);
            enemy.attribute = enemyAttributes[Math.floor(Math.random() * enemyAttributes.length)];
            enemy.skills = getRandomSkills("ANY", 4);
            this.enemies.push(enemy);
        }
        return this.enemies;
    }

    isLeaderAlive() {
        return !this.party[0].isDead;
    }

    isPartyDefeated() {
        // Game over condition: Leader is defeated
        return !this.isLeaderAlive();
    }

    areEnemiesDefeated() {
        return this.enemies.every(e => e.isDead);
    }
}

export const gameState = new GameState();
