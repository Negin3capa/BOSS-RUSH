import { GAMEPLAY, ELEMENTAL_CHART, ATTRIBUTES } from "../constants";

export class BaseCharacter {
    constructor(name, className, baseStats) {
        this.name = name;
        this.className = className;

        // Active and Passive Skills
        this.activeSkills = [];
        this.passiveSkills = [];
        this.skills = []; // Compatibility

        // Equipment
        this.equipment = {
            weapon: null,
            armor: null,
            accessory: null
        };

        // Types (Support for dual-typing)
        this.types = [ATTRIBUTES.NORMAL];

        // Stats
        this.baseMaxHp = this.randomizeStat(baseStats.hp);
        this.baseMaxMp = this.randomizeStat(baseStats.mp);

        this.baseAttack = this.randomizeStat(baseStats.attack);
        this.baseDefense = this.randomizeStat(baseStats.defense);
        this.baseSpecialAttack = this.randomizeStat(baseStats.specialAttack || 10);
        this.baseSpecialDefense = this.randomizeStat(baseStats.specialDefense || 10);
        this.baseSpeed = this.randomizeStat(baseStats.speed || 10);
        this.baseAccuracy = this.randomizeStat(baseStats.accuracy || 100);
        this.baseLuck = this.randomizeStat(baseStats.luck || 5);

        this.hp = this.maxHp;
        this.mp = this.maxMp;

        this.isDead = false;
        this.isDefending = false;
        this.statusEffects = []; // { stat: 'attack'|'defense'|..., amount: 1.5, duration: 3, type: 'BUFF'|'DEBUFF' }
    }

    get maxHp() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => { if (eq && eq.hpBonus) bonus += eq.hpBonus; });
        return this.baseMaxHp + bonus;
    }

    get maxMp() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => { if (eq && eq.mpBonus) bonus += eq.mpBonus; });
        return this.baseMaxMp + bonus;
    }

    get attack() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && eq.attackBonus) bonus += eq.attackBonus;
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.baseAttack + bonus;
    }

    get defense() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && eq.defBonus) bonus += eq.defBonus;
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.baseDefense + bonus;
    }

    get specialAttack() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && eq.spAttackBonus) bonus += eq.spAttackBonus;
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.baseSpecialAttack + bonus;
    }

    get specialDefense() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && eq.spDefBonus) bonus += eq.spDefBonus;
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.baseSpecialDefense + bonus;
    }

    get speed() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && eq.speedBonus) bonus += eq.speedBonus;
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.baseSpeed + bonus;
    }

    get accuracy() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && eq.accuracyBonus) bonus += eq.accuracyBonus;
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.baseAccuracy + bonus;
    }

    get luck() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && eq.luckBonus) bonus += eq.luckBonus;
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.baseLuck + bonus;
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

    takeDamage(amount, skillType = ATTRIBUTES.PHYSICAL, attacker = null, isSkill = false, category = "Physical") {
        if (this.isDead) return { damage: 0, mult: 1, hit: false, crit: false };

        // 1. Determine Attack Type (Weapon priority for basic attacks)
        let actualSkillType = skillType;
        if (!isSkill && attacker && attacker.equipment.weapon) {
            actualSkillType = attacker.equipment.weapon.attribute;
        }

        // 2. Hit/Dodge Logic
        let hitChance = 100;
        if (attacker) {
            hitChance = 90 + (attacker.effectiveAccuracy * 0.1) - (this.effectiveSpeed * 0.1);
        }
        hitChance = Math.min(100, Math.max(5, hitChance));

        if (Math.random() * 100 > hitChance) {
            return { damage: 0, mult: 1, hit: false, crit: false };
        }

        // 3. Critical Hit Logic (Physical Only)
        let isCrit = false;
        if (category === "Physical") {
            const critChance = (attacker ? attacker.effectiveLuck : 0) * 0.5 + (attacker ? attacker.effectiveAccuracy : 0) * 0.1;
            if (Math.random() * 100 < critChance) {
                isCrit = true;
            }
        }

        // 4. Multiplier Logic (Type Effectiveness & STAB)
        let typeMultiplier = 1.0;
        // Check effectiveness against each of the target's types (Always check now)
        this.types.forEach(targetType => {
            if (ELEMENTAL_CHART[actualSkillType] && ELEMENTAL_CHART[actualSkillType][targetType] !== undefined) {
                typeMultiplier *= ELEMENTAL_CHART[actualSkillType][targetType];
            }
        });

        // STAB (Same Type Attack Bonus)
        if (attacker && attacker.types.includes(actualSkillType)) {
            typeMultiplier *= GAMEPLAY.STAB_BONUS;
        }

        // 5. Defense Logic
        let defValue = 0;
        if (category === "Physical") {
            defValue = this.effectiveDefense;
            if (isCrit) defValue *= 0.5;
        } else {
            defValue = this.effectiveSpecialDefense;
        }

        let actualDamage = (amount * typeMultiplier) - (defValue / 2);
        if (this.isDefending) {
            actualDamage *= GAMEPLAY.DEFEND_DAMAGE_REDUCTION;
        }

        actualDamage = Math.max(1, Math.floor(actualDamage));

        this.hp -= actualDamage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
            this.statusEffects = [];
        }

        return { damage: actualDamage, mult: typeMultiplier, hit: true, crit: isCrit };
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        if (this.isDead && this.hp > 0) {
            this.isDead = false;
        }
    }

    restoreMp(amount) {
        if (this.isDead) return;
        this.mp = Math.min(this.maxMp, Math.floor(this.mp + amount));
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
        // Regenerate 20% + 5 of total MP
        const regenAmount = (this.maxMp * 0.2) + 5;
        this.restoreMp(regenAmount);
    }

    resetTurn() {
        this.isDefending = false;
        this.tickStatusEffects();
    }
}
