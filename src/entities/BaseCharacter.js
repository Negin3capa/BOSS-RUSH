import { GAMEPLAY, ELEMENTAL_CHART, ATTRIBUTES } from "../constants";

export class BaseCharacter {
    constructor(name, className, baseStats) {
        this.name = name;
        this.className = className;
        this.skills = []; // Assigned later via GameState

        // Specific attributes
        this.attribute = ATTRIBUTES.PHYSICAL;

        // Stats
        this.maxHp = this.randomizeStat(baseStats.hp);
        this.hp = this.maxHp;

        this.maxMp = this.randomizeStat(baseStats.mp);
        this.mp = this.maxMp;

        this.attack = this.randomizeStat(baseStats.attack);
        this.defense = this.randomizeStat(baseStats.defense);
        this.specialAttack = this.randomizeStat(baseStats.specialAttack || 10);
        this.specialDefense = this.randomizeStat(baseStats.specialDefense || 10);
        this.speed = this.randomizeStat(baseStats.speed || 10);
        this.accuracy = this.randomizeStat(baseStats.accuracy || 100);
        this.luck = this.randomizeStat(baseStats.luck || 5);

        this.isDead = false;
        this.isDefending = false;
        this.statusEffects = []; // { stat: 'attack'|'defense'|..., amount: 1.5, duration: 3, type: 'BUFF'|'DEBUFF' }
    }

    get effectiveAttack() { return this.getEffectiveStat("attack"); }
    get effectiveDefense() { return this.getEffectiveStat("defense"); }
    get effectiveSpecialAttack() { return this.getEffectiveStat("specialAttack"); }
    get effectiveSpecialDefense() { return this.getEffectiveStat("specialDefense"); }
    get effectiveSpeed() { return this.getEffectiveStat("speed"); }
    get effectiveAccuracy() { return this.getEffectiveStat("accuracy"); }
    get effectiveLuck() { return this.getEffectiveStat("luck"); }

    getEffectiveStat(statName) {
        let multiplier = 1.0;
        this.statusEffects.forEach(effect => {
            if (effect.stat === statName) multiplier *= effect.amount;
        });
        const base = this[statName];
        return Math.floor(base * multiplier);
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

    takeDamage(amount, attackAttribute = ATTRIBUTES.PHYSICAL, attacker = null, isSkill = false) {
        if (this.isDead) return { damage: 0, mult: 1, hit: false, crit: false };

        // 1. Hit/Dodge Logic
        let hitChance = 100;
        if (attacker) {
            // Accuracy boosts hit, Speed boosts dodge
            // Base formula: 90 + (Acc * 0.1) - (EnemySpeed * 0.1)
            hitChance = 90 + (attacker.effectiveAccuracy * 0.1) - (this.effectiveSpeed * 0.1);
        }
        hitChance = Math.min(100, Math.max(5, hitChance));

        if (Math.random() * 100 > hitChance) {
            return { damage: 0, mult: 1, hit: false, crit: false };
        }

        // 2. Critical Hit Logic (Physical Only)
        let isCrit = false;
        if (!isSkill || attackAttribute === ATTRIBUTES.PHYSICAL) {
            const critChance = (attacker ? attacker.effectiveLuck : 0) * 0.5 + (attacker ? attacker.effectiveAccuracy : 0) * 0.1;
            if (Math.random() * 100 < critChance) {
                isCrit = true;
            }
        }

        // 3. Multiplier Logic (Elemental Skills Only)
        let multiplier = 1.0;
        if (isSkill && attackAttribute !== ATTRIBUTES.PHYSICAL) {
            if (ELEMENTAL_CHART[attackAttribute] && ELEMENTAL_CHART[attackAttribute][this.attribute]) {
                multiplier = ELEMENTAL_CHART[attackAttribute][this.attribute];
            }
        }

        // 4. Defense Logic
        // Physical attacks use defense, crits ignore 50%. Elemental use specialDefense.
        let defValue = 0;
        if (!isSkill || attackAttribute === ATTRIBUTES.PHYSICAL) {
            defValue = this.effectiveDefense;
            if (isCrit) defValue *= 0.5;
        } else {
            defValue = this.effectiveSpecialDefense;
        }

        let actualDamage = (amount * multiplier) - (defValue / 2);
        if (this.isDefending) {
            actualDamage *= GAMEPLAY.DEFEND_DAMAGE_REDUCTION;
        }

        actualDamage = Math.max(1, Math.floor(actualDamage));

        this.hp -= actualDamage;
        if (this.hp <= 0) {
            this.isDead = true;
            this.statusEffects = [];
        }

        return { damage: actualDamage, mult: multiplier, hit: true, crit: isCrit };
    }

    heal(amount) {
        // Heal can now target dead members
        this.hp = Math.min(this.maxHp, this.hp + amount);
        if (this.isDead && this.hp > 0) {
            this.isDead = false;
        }
    }

    restoreMp(amount) {
        if (this.isDead) return;
        this.mp = Math.min(this.maxMp, this.mp + amount);
    }

    costMp(amount) {
        if (this.mp >= amount) {
            this.mp -= amount;
            return true;
        }
        return false;
    }

    defend() {
        this.isDefending = true;
        this.restoreMp(GAMEPLAY.DEFEND_MP_REGEN);
    }

    resetTurn() {
        this.isDefending = false;
        this.tickStatusEffects();
    }
}
