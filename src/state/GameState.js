import { BaseCharacter } from "../entities/BaseCharacter";
import { GAMEPLAY } from "../constants";

export class GameState {
    constructor() {
        this.party = [];
        this.enemies = [];
        this.initializeParty();
    }

    initializeParty() {
        // Leader - Balanced
        this.party.push(new BaseCharacter("Hero (Leader)", { hp: 100, sp: 50, attack: 15, defense: 10 }));

        // Member 2 - Tanky
        this.party.push(new BaseCharacter("Tank", { hp: 150, sp: 30, attack: 12, defense: 15 }));

        // Member 3 - Mage-like (High SP/Attack, Low Def)
        this.party.push(new BaseCharacter("Mage", { hp: 70, sp: 100, attack: 20, defense: 5 }));

        // Member 4 - Striker (High Attack, Low HP)
        this.party.push(new BaseCharacter("Rogue", { hp: 80, sp: 40, attack: 25, defense: 8 }));
    }

    generateEnemies() {
        this.enemies = [];
        const count = Math.floor(Math.random() * GAMEPLAY.MAX_ENEMIES) + 1; // 1 to 3 enemies

        for (let i = 0; i < count; i++) {
            // Randomize enemy stats for variety
            const enemyStats = {
                hp: 60,
                sp: 0,
                attack: 20,
                defense: 5
            };
            this.enemies.push(new BaseCharacter(`Enemy ${i + 1}`, enemyStats));
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
