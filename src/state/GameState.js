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
        const hero = new BaseCharacter("Hero (Leader)", "Hero", {
            hp: 100, mp: 50, attack: 15, defense: 10,
            specialAttack: 15, specialDefense: 10, speed: 12, accuracy: 105, luck: 10
        });
        hero.attribute = ATTRIBUTES.LIGHT;
        hero.skills = getRandomSkills("Hero", 4);
        this.party.push(hero);

        // Member 2 - Tanky - Stone
        const tank = new BaseCharacter("Tank", "Tank", {
            hp: 150, mp: 30, attack: 12, defense: 15,
            specialAttack: 8, specialDefense: 15, speed: 8, accuracy: 95, luck: 5
        });
        tank.attribute = ATTRIBUTES.STONE;
        tank.skills = getRandomSkills("Tank", 4);
        this.party.push(tank);

        // Member 3 - Mage-like - Water
        const mage = new BaseCharacter("Mage", "Mage", {
            hp: 70, mp: 100, attack: 10, defense: 5,
            specialAttack: 25, specialDefense: 10, speed: 10, accuracy: 100, luck: 8
        });
        mage.attribute = ATTRIBUTES.WATER;
        mage.skills = getRandomSkills("Mage", 4);
        this.party.push(mage);

        // Member 4 - Striker - Wind
        const rogue = new BaseCharacter("Rogue", "Rogue", {
            hp: 80, mp: 40, attack: 20, defense: 8,
            specialAttack: 12, specialDefense: 8, speed: 18, accuracy: 110, luck: 15
        });
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
                    mp: stats.mp,
                    attack: stats.attack,
                    defense: stats.defense,
                    specialAttack: stats.specialAttack,
                    specialDefense: stats.specialDefense,
                    speed: stats.speed,
                    accuracy: stats.accuracy,
                    luck: stats.luck
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

        // Apply scaling
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
