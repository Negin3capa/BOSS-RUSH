import { BaseCharacter } from "./BaseCharacter";
import { getWeightedRandomSkills } from "../data/skills/index.js";

/**
 * BossCharacter extends BaseCharacter with unique mechanic capabilities
 * Supports: turn-based triggers, damage reactions, phase transitions, and special behaviors
 */
export class BossCharacter extends BaseCharacter {
    constructor(bossTemplate, ante = 1) {
        // Calculate scaled stats based on ante
        const scaledStats = BossCharacter.scaleStatsForAnte(bossTemplate.baseStats, ante);
        
        super(bossTemplate.name, "Boss", scaledStats);
        
        this.isBoss = true;
        this.isElite = bossTemplate.isElite || false;
        this.bossId = bossTemplate.id;
        this.description = bossTemplate.description;
        this.mechanicDescription = bossTemplate.mechanicDescription;
        
        // Set types
        this.types = [...bossTemplate.types];
        this.attribute = bossTemplate.types[0];
        
        // Set up skills from template or generate random
        if (bossTemplate.skills && bossTemplate.skills.length > 0) {
            this.activeSkills = [...bossTemplate.skills];
            this.skills = this.activeSkills;
        } else {
            this.setupSkills(this, "ANY");
        }
        
        // Boss mechanic state
        this.mechanicState = {
            turnCounter: 0,
            phase: 1,
            cooldowns: {},
            storedData: {}, // For mechanics to persist data
            disabledSkills: new Set(), // Skills disabled by mechanics
            lockedCharacterIndex: -1, // For character-locking mechanics
            damageResistances: {}, // For adaptation mechanics
        };
        
        // Bind mechanic functions from template
        this.mechanics = {
            onBattleStart: bossTemplate.mechanics?.onBattleStart || null,
            onTurnStart: bossTemplate.mechanics?.onTurnStart || null,
            onTurnEnd: bossTemplate.mechanics?.onTurnEnd || null,
            onDamageTaken: bossTemplate.mechanics?.onDamageTaken || null,
            onPlayerAction: bossTemplate.mechanics?.onPlayerAction || null,
            onPhaseTransition: bossTemplate.mechanics?.onPhaseTransition || null,
            getCustomAction: bossTemplate.mechanics?.getCustomAction || null,
            modifyDamage: bossTemplate.mechanics?.modifyDamage || null,
        };
        
        // Phase thresholds (HP % for phase changes)
        this.phaseThresholds = bossTemplate.phaseThresholds || [];
    }
    
    /**
     * Scale boss stats based on ante level
     */
    static scaleStatsForAnte(baseStats, ante) {
        const scalingFactor = 1 + ((ante - 1) * 0.25); // 25% increase per ante
        const eliteMultiplier = ante === 8 ? 1.5 : 1.0; // Elite bosses at ante 8 are stronger
        
        const finalMultiplier = scalingFactor * eliteMultiplier;
        
        return {
            hp: Math.floor((baseStats.hp || 400) * finalMultiplier),
            mp: Math.floor((baseStats.mp || 200) * finalMultiplier),
            attack: Math.floor((baseStats.attack || 30) * finalMultiplier),
            defense: Math.floor((baseStats.defense || 15) * finalMultiplier),
            specialAttack: Math.floor((baseStats.specialAttack || 30) * finalMultiplier),
            specialDefense: Math.floor((baseStats.specialDefense || 15) * finalMultiplier),
            speed: Math.floor((baseStats.speed || 15) * finalMultiplier),
            accuracy: Math.floor((baseStats.accuracy || 110) * finalMultiplier),
            luck: Math.floor((baseStats.luck || 10) * finalMultiplier),
        };
    }
    
    /**
     * Called when battle starts
     */
    onBattleStart(battleContext) {
        if (this.mechanics.onBattleStart) {
            this.mechanics.onBattleStart(this, battleContext);
        }
    }
    
    /**
     * Called at the start of boss's turn
     */
    onTurnStart(battleContext) {
        this.mechanicState.turnCounter++;
        
        // Check for phase transitions
        this.checkPhaseTransition();
        
        // Clear temporary locks
        this.mechanicState.lockedCharacterIndex = -1;
        
        if (this.mechanics.onTurnStart) {
            this.mechanics.onTurnStart(this, battleContext);
        }
    }
    
    /**
     * Called at the end of boss's turn
     */
    onTurnEnd(battleContext) {
        // Decrement cooldowns
        Object.keys(this.mechanicState.cooldowns).forEach(key => {
            if (this.mechanicState.cooldowns[key] > 0) {
                this.mechanicState.cooldowns[key]--;
            }
        });
        
        if (this.mechanics.onTurnEnd) {
            this.mechanics.onTurnEnd(this, battleContext);
        }
    }
    
    /**
     * Called when boss takes damage
     */
    onDamageTaken(amount, source, skill, battleContext) {
        let modifiedAmount = amount;
        
        // Apply damage modification from mechanics
        if (this.mechanics.modifyDamage) {
            modifiedAmount = this.mechanics.modifyDamage(this, modifiedAmount, source, skill, battleContext);
        }
        
        // Apply resistance adaptations
        if (skill && skill.attribute) {
            const resistance = this.mechanicState.damageResistances[skill.attribute] || 0;
            modifiedAmount = Math.floor(modifiedAmount * (1 - resistance));
        }
        
        if (this.mechanics.onDamageTaken) {
            this.mechanics.onDamageTaken(this, modifiedAmount, source, skill, battleContext);
        }
        
        return modifiedAmount;
    }
    
    /**
     * Called when a player performs an action
     */
    onPlayerAction(action, battleContext) {
        if (this.mechanics.onPlayerAction) {
            this.mechanics.onPlayerAction(this, action, battleContext);
        }
    }
    
    /**
     * Check and handle phase transitions based on HP thresholds
     */
    checkPhaseTransition() {
        const hpPercent = this.hp / this.maxHp;
        
        for (let i = 0; i < this.phaseThresholds.length; i++) {
            const threshold = this.phaseThresholds[i];
            const phaseNumber = i + 2; // Phase 2, 3, etc.
            
            if (hpPercent <= threshold && this.mechanicState.phase < phaseNumber) {
                this.mechanicState.phase = phaseNumber;
                if (this.mechanics.onPhaseTransition) {
                    return {
                        transitioned: true,
                        newPhase: phaseNumber,
                        message: this.mechanics.onPhaseTransition(this, phaseNumber)
                    };
                }
            }
        }
        
        return { transitioned: false };
    }
    
    /**
     * Get the boss's next action (can override normal AI)
     */
    getCustomAction(battleContext) {
        if (this.mechanics.getCustomAction) {
            return this.mechanics.getCustomAction(this, battleContext);
        }
        return null; // Use default AI
    }
    
    /**
     * Check if a skill is currently disabled
     */
    isSkillDisabled(skillType) {
        return this.mechanicState.disabledSkills.has(skillType);
    }
    
    /**
     * Disable a skill type for a number of turns
     */
    disableSkillType(skillType, turns) {
        this.mechanicState.disabledSkills.add(skillType);
        this.mechanicState.cooldowns[`skill_${skillType}`] = turns;
    }
    
    /**
     * Lock a character from acting this turn
     */
    lockCharacter(characterIndex) {
        this.mechanicState.lockedCharacterIndex = characterIndex;
    }
    
    /**
     * Check if a character is locked
     */
    isCharacterLocked(characterIndex) {
        return this.mechanicState.lockedCharacterIndex === characterIndex;
    }
    
    /**
     * Add damage resistance to a type
     */
    addResistance(attribute, amount) {
        const current = this.mechanicState.damageResistances[attribute] || 0;
        this.mechanicState.damageResistances[attribute] = Math.min(0.9, current + amount);
    }
    
    /**
     * Override takeDamage to include boss mechanics
     */
    takeDamage(amount, skillType, attacker = null, isSkill = false, category = "Physical") {
        // Call onDamageTaken hook if this is a boss with mechanics
        if (this.mechanics && attacker) {
            // We'll handle this in the battle scene where we have more context
        }
        
        return super.takeDamage(amount, skillType, attacker, isSkill, category);
    }
    
    /**
     * Reset for a new battle
     */
    resetForBattle() {
        this.hp = this.maxHp;
        this.juice = this.maxJuice;
        this.isDead = false;
        this.statusEffects = [];
        this.mechanicState.turnCounter = 0;
        this.mechanicState.phase = 1;
        this.mechanicState.cooldowns = {};
        this.mechanicState.storedData = {};
        this.mechanicState.disabledSkills.clear();
        this.mechanicState.lockedCharacterIndex = -1;
        this.mechanicState.damageResistances = {};
    }
}

export default BossCharacter;
