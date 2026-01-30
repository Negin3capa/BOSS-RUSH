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
        this.statusEffects = []; // { stat: 'attack'|'defense', amount: 1.5, duration: 3, type: 'BUFF'|'DEBUFF' }
    }

    get effectiveAttack() {
        let multiplier = 1.0;
        this.statusEffects.forEach(effect => {
            if (effect.stat === "attack") multiplier *= effect.amount;
        });
        return Math.floor(this.attack * multiplier);
    }

    get effectiveDefense() {
        let multiplier = 1.0;
        this.statusEffects.forEach(effect => {
            if (effect.stat === "defense") multiplier *= effect.amount;
        });
        return Math.floor(this.defense * multiplier);
    }

    randomizeStat(value) {
        // Random variance between 0.8 and 1.2
        const variance = 0.8 + Math.random() * 0.4;
        return Math.floor(value * variance);
    }

    addStatusEffect(effectData) {
        // Find existing effect on same stat
        const existing = this.statusEffects.find(e => e.stat === effectData.stat);
        if (existing) {
            existing.duration = 3; // Refresh/Extend to max
            existing.amount = effectData.amount; // Update amount if different
            existing.type = effectData.type;
        } else {
            this.statusEffects.push({
                stat: effectData.stat,
                amount: effectData.amount,
                duration: 3,
                type: effectData.type
            });
        }
    }

    tickStatusEffects() {
        this.statusEffects.forEach(e => e.duration--);
        this.statusEffects = this.statusEffects.filter(e => e.duration > 0);
    }

    takeDamage(amount, attackAttribute = ATTRIBUTES.PHYSICAL) {
        // If already dead, don't take more damage (overkill depth is set at moment of death)
        if (this.isDead) return { damage: 0, mult: 1 };

        let multiplier = 1.0;
        if (ELEMENTAL_CHART[attackAttribute] && ELEMENTAL_CHART[attackAttribute][this.attribute]) {
            multiplier = ELEMENTAL_CHART[attackAttribute][this.attribute];
        }

        let actualDamage = (amount * multiplier) - (this.effectiveDefense / 2);
        if (this.isDefending) {
            actualDamage *= GAMEPLAY.DEFEND_DAMAGE_REDUCTION;
        }

        actualDamage = Math.max(1, Math.floor(actualDamage)); // Minimum 1 damage

        this.hp -= actualDamage;
        if (this.hp <= 0) {
            this.isDead = true;
            this.statusEffects = []; // Clear on death
        }

        return { damage: actualDamage, mult: multiplier };
    }

    heal(amount) {
        // Heal can now target dead members
        this.hp = Math.min(this.maxHp, this.hp + amount);
        if (this.isDead && this.hp > 0) {
            this.isDead = false;
        }
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
        this.tickStatusEffects();
    }
}
