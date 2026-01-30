import { GAMEPLAY, ELEMENTAL_CHART, ATTRIBUTES } from "../constants";

export class BaseCharacter {
    constructor(name, className, baseStats) {
        this.name = name;
        this.className = className;
        this.skills = []; // Assigned later via GameState

        // Default attribute
        this.attribute = ATTRIBUTES.PHYSICAL;

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

    takeDamage(amount, attackAttribute = ATTRIBUTES.PHYSICAL) {
        if (this.isDead) return { damage: 0, mult: 1 };

        let multiplier = 1.0;
        if (ELEMENTAL_CHART[attackAttribute] && ELEMENTAL_CHART[attackAttribute][this.attribute]) {
            multiplier = ELEMENTAL_CHART[attackAttribute][this.attribute];
        }

        let actualDamage = (amount * multiplier) - (this.defense / 2); // Damage formula: (Amount * Mult) - (Defense / 2)
        if (this.isDefending) {
            actualDamage *= GAMEPLAY.DEFEND_DAMAGE_REDUCTION;
        }

        actualDamage = Math.max(1, Math.floor(actualDamage)); // Minimum 1 damage

        this.hp -= actualDamage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
        }

        return { damage: actualDamage, mult: multiplier };
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
