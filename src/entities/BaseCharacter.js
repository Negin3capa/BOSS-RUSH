import { GAMEPLAY } from "../constants";

export class BaseCharacter {
    constructor(name, baseStats) {
        this.name = name;

        // Randomize stats within a range (e.g., +/- 20% variance) to keep them relative but unique
        this.maxHp = this.randomizeStat(baseStats.hp);
        this.hp = this.maxHp;

        this.maxSp = this.randomizeStat(baseStats.sp);
        this.sp = this.maxSp;

        this.attack = this.randomizeStat(baseStats.attack);
        this.defense = this.randomizeStat(baseStats.defense);

        this.isDead = false;
        this.isDefending = false;
    }

    randomizeStat(value) {
        // Random variance between 0.8 and 1.2
        const variance = 0.8 + Math.random() * 0.4;
        return Math.floor(value * variance);
    }

    takeDamage(amount) {
        if (this.isDead) return 0;

        let actualDamage = amount - (this.defense / 2); // Damage formula: Amount - (Defense / 2)
        if (this.isDefending) {
            actualDamage *= GAMEPLAY.DEFEND_DAMAGE_REDUCTION;
        }

        actualDamage = Math.max(1, Math.floor(actualDamage)); // Minimum 1 damage

        this.hp -= actualDamage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
        }

        return actualDamage;
    }

    heal(amount) {
        if (this.isDead) return;
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    restoreSp(amount) {
        if (this.isDead) return;
        this.sp = Math.min(this.maxSp, this.sp + amount);
    }

    costSp(amount) {
        if (this.sp >= amount) {
            this.sp -= amount;
            return true;
        }
        return false;
    }

    defend() {
        this.isDefending = true;
        this.restoreSp(GAMEPLAY.DEFEND_SP_REGEN);
    }

    resetTurn() {
        this.isDefending = false;
    }
}
