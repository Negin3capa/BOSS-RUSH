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

        // Stats - New Naming Convention
        this.level = 1;
        this.exp = 0;

        // Base values are at Level 1
        this.rawHp = this.randomizeStat(baseStats.hp);
        this.rawJuice = this.randomizeStat(baseStats.mp); // Renamed from mp to juice
        this.rawAttack = this.randomizeStat(baseStats.attack);
        this.rawDefense = this.randomizeStat(baseStats.defense);
        this.rawSpAttack = this.randomizeStat(baseStats.specialAttack || 10);
        this.rawSpDefense = this.randomizeStat(baseStats.specialDefense || 10);
        this.rawSpeed = this.randomizeStat(baseStats.speed || 10);
        this.rawHitRate = this.randomizeStat(baseStats.accuracy || 100);
        this.rawLuck = this.randomizeStat(baseStats.luck || 5);

        this.hp = this.maxHp;
        this.juice = this.maxJuice;

        this.isDead = false;
        this.isDefending = false;
        this.statusEffects = []; // { stat: 'attack'|'defense'|..., amount: 1.5, duration: 3, type: 'BUFF'|'DEBUFF' }
        
        // Hurt Sprite State
        this.isHurt = false;
        this.hurtTimer = 0;
        this.lastActionTime = 0;
    }

    // Level-based Stat Calculation
    getStatAtLevel(baseStat, allowScaling = true) {
        if (!allowScaling) return baseStat;
        // stat = baseStat * (1 + (level - 1) * 0.1)
        return Math.floor(baseStat * (1 + (this.level - 1) * 0.1));
    }

    get maxHp() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => { if (eq && eq.hpBonus) bonus += eq.hpBonus; });
        return this.getStatAtLevel(this.rawHp) + bonus;
    }

    get maxJuice() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => { if (eq && eq.juiceBonus || eq && eq.mpBonus) bonus += (eq.juiceBonus || eq.mpBonus); });
        return this.getStatAtLevel(this.rawJuice) + bonus;
    }

    get attack() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && eq.attackBonus) bonus += eq.attackBonus;
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.getStatAtLevel(this.rawAttack) + bonus;
    }

    get defense() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && eq.defBonus) bonus += eq.defBonus;
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.getStatAtLevel(this.rawDefense) + bonus;
    }

    get spAttack() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && (eq.spAttackBonus || eq.specialAttackBonus)) bonus += (eq.spAttackBonus || eq.specialAttackBonus);
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.getStatAtLevel(this.rawSpAttack) + bonus;
    }

    get spDefense() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && (eq.spDefBonus || eq.specialDefenseBonus)) bonus += (eq.spDefBonus || eq.specialDefenseBonus);
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.getStatAtLevel(this.rawSpDefense) + bonus;
    }

    get speed() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && eq.speedBonus) bonus += eq.speedBonus;
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.getStatAtLevel(this.rawSpeed) + bonus;
    }

    get hitRate() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && (eq.hitRateBonus || eq.accuracyBonus)) bonus += (eq.hitRateBonus || eq.accuracyBonus);
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        return this.getStatAtLevel(this.rawHitRate) + bonus;
    }

    get luck() {
        let bonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq && eq.luckBonus) bonus += eq.luckBonus;
            if (eq && eq.allStatsBonus) bonus += eq.allStatsBonus;
        });
        // Luck doesn't scale with level as per request
        return this.rawLuck + bonus;
    }

    get effectiveAttack() { return this.getEffectiveStat("attack"); }
    get effectiveDefense() { return this.getEffectiveStat("defense"); }
    get effectiveSpAttack() { return this.getEffectiveStat("spAttack"); }
    get effectiveSpDefense() { return this.getEffectiveStat("spDefense"); }
    get effectiveSpeed() { return this.getEffectiveStat("speed"); }
    get effectiveHitRate() { return this.getEffectiveStat("hitRate"); }
    get effectiveLuck() { return this.getEffectiveStat("luck"); }

    getEffectiveStat(statName) {
        let multiplier = 1.0;
        this.statusEffects.forEach(effect => {
            if (effect.stat === statName ||
                effect.stat === "all" ||
                (effect.stat === "allDefense" && (statName === "defense" || statName === "spDefense")) ||
                (statName === "spAttack" && effect.stat === "specialAttack") ||
                (statName === "spDefense" && effect.stat === "specialDefense")) {
                multiplier *= effect.amount;
            }
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

        // Guard against NaN/undefined amount
        if (amount === undefined || amount === null || isNaN(amount)) {
            console.warn(`takeDamage received invalid amount: ${amount}, defaulting to 0`);
            amount = 0;
        }

        // 1. Determine Attack Type (Weapon priority for basic attacks)
        let actualSkillType = skillType;
        if (!isSkill && attacker && attacker.equipment && attacker.equipment.weapon) {
            actualSkillType = attacker.equipment.weapon.attribute;
        }

        // 2. Hit/Dodge Logic - Updated: attacker's hitRate determines hit chance
        let hitChance = 100;
        if (attacker) {
            const attackerHitRate = attacker.effectiveHitRate;
            hitChance = (attackerHitRate === undefined || attackerHitRate === null || isNaN(attackerHitRate)) ? 100 : attackerHitRate;
        }
        hitChance = Math.min(100, Math.max(5, hitChance));

        if (Math.random() * 100 > hitChance) {
            return { damage: 0, mult: 1, hit: false, crit: false };
        }

        // 3. Critical Hit Logic - Updated: 1 luck point = 1%
        let isCrit = false;
        if (category === "Physical") {
            const critChance = (attacker ? attacker.effectiveLuck : 0);
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
            if (isNaN(defValue)) defValue = 0;
            if (isCrit) defValue *= 0.5;
        } else {
            defValue = this.effectiveSpDefense;
            if (isNaN(defValue)) defValue = 0;
        }

        let actualDamage = (amount * typeMultiplier) - (defValue / 2);
        if (isNaN(actualDamage)) {
            console.warn(`actualDamage became NaN: amount=${amount}, typeMultiplier=${typeMultiplier}, defValue=${defValue}`);
            actualDamage = 1;
        }
        if (this.isDefending) {
            actualDamage *= GAMEPLAY.DEFEND_DAMAGE_REDUCTION;
        }

        actualDamage = Math.max(1, Math.floor(actualDamage));

        this.hp -= actualDamage;
        if (this.hp <= 0) {
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

    restoreJuice(amount) {
        if (this.isDead) return;
        this.juice = Math.min(this.maxJuice, Math.floor(this.juice + amount));
    }

    costJuice(amount) {
        if (this.juice >= amount) {
            this.juice -= amount;
            return true;
        }
        return false;
    }

    defend() {
        this.isDefending = true;
        // Regenerate 20% + 5 of total Juice
        const regenAmount = (this.maxJuice * 0.2) + 5;
        this.restoreJuice(regenAmount);
    }

    resetTurn() {
        this.isDefending = false;
        this.tickStatusEffects();
    }

    // EXP and Leveling Logic
    gainExp(amount) {
        if (this.isDead || this.level >= 99) return { leveledUp: false, expGained: 0 };

        this.exp += amount;
        let leveledUp = false;
        const previousLevel = this.level;

        while (this.exp >= this.expToNextLevel && this.level < 99) {
            this.exp -= this.expToNextLevel;
            this.level++;
            leveledUp = true;
        }

        if (leveledUp) {
            // Fully heal on level up? Usually a nice touch.
            this.hp = this.maxHp;
            this.juice = this.maxJuice;
        }

        return { leveledUp, previousLevel, currentLevel: this.level, expGained: amount };
    }

    get expToNextLevel() {
        return this.level * 100;
    }

    // Hurt Sprite Management
    triggerHurt() {
        this.isHurt = true;
        this.hurtTimer = 1.0; // 1 second timer
    }

    resetHurtState() {
        this.isHurt = false;
        this.hurtTimer = 0;
    }

    updateHurtState(dt) {
        if (this.isHurt && this.hurtTimer > 0) {
            this.hurtTimer -= dt;
            if (this.hurtTimer <= 0) {
                this.resetHurtState();
            }
        }
    }

    startAction() {
        this.lastActionTime = Date.now();
        this.resetHurtState();
    }
}
