import { BaseCharacter } from "../entities/BaseCharacter";
import { getRandomSkills, getWeightedRandomSkills } from "../data/skills";
import { GAMEPLAY, ATTRIBUTES } from "../constants";
import { k } from "../kaplayCtx";

export class GameState {
    constructor() {
        this.party = [];
        this.enemies = [];
        this.roundCounter = 1;
        this.scalingFactor = 1.0;
        this.initializeParty();
    }

    initializeParty() {
        this.party = [];
        this.roundCounter = 1;
        this.scalingFactor = 1.0;
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
        const enemyAttributes = [ATTRIBUTES.FIRE, ATTRIBUTES.WATER, ATTRIBUTES.WIND, ATTRIBUTES.STONE, ATTRIBUTES.DARK, ATTRIBUTES.LIGHT];
        const roundNum = this.roundCounter;
        const isBossRound = roundNum % 3 === 0;
        const isStrongerRound = roundNum % 3 === 2;
        const type = isBossRound ? "Boss" : (isStrongerRound ? "Stronger" : "Simple");
        const count = isBossRound ? 1 : (isStrongerRound ? 2 : k.randi(1, GAMEPLAY.MAX_ENEMIES)); // Using GAMEPLAY.MAX_ENEMIES

        // luckFactor increases by 0.5 for every set of 3 rounds (every Boss defeated)
        const luckFactor = Math.floor((roundNum - 1) / 3) * 0.5;

        for (let i = 0; i < count; i++) {
            const stats = this.getEnemyStats(type);
            const enemyAttribute = enemyAttributes[Math.floor(Math.random() * enemyAttributes.length)]; // Determine attribute here
            const enemy = new BaseCharacter(
                isBossRound ? "BOSS" : `Enemy ${i + 1}`,
                "Enemy", // Role
                {
                    hp: stats.hp,
                    sp: stats.sp,
                    attack: stats.attack,
                    defense: stats.defense
                }
            );
            enemy.isBoss = isBossRound;
            enemy.attribute = enemyAttribute; // Assign the determined attribute
            enemy.skills = getWeightedRandomSkills("ANY", 3, luckFactor);
            this.enemies.push(enemy);
        }
        return this.enemies;
    }

    getEnemyStats(type) {
        let base = { hp: 60, sp: 50, attack: 20, defense: 5 };

        if (type === "Stronger") {
            base = { hp: 100, sp: 60, attack: 25, defense: 10 };
        } else if (type === "Boss") {
            base = { hp: 400, sp: 200, attack: 35, defense: 15 };
        }

        // Apply scaling
        return {
            hp: Math.floor(base.hp * this.scalingFactor),
            sp: Math.floor(base.sp * this.scalingFactor),
            attack: Math.floor(base.attack * this.scalingFactor),
            defense: Math.floor(base.defense * this.scalingFactor)
        };
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
