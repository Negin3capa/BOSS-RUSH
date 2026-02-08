import { ATTRIBUTES } from "../constants.js";
import { createDamageSkill, createBuffSkill, createDebuffSkill, RARITIES, TARGETS } from "./skills/core.js";

// ============================================
// BOSS TIERS AND DIFFICULTY RANGES
// ============================================
export const BOSS_TIERS = {
    EARLY: { minAnte: 1, maxAnte: 2, label: "Lesser" },
    MID: { minAnte: 3, maxAnte: 4, label: "Greater" },
    LATE: { minAnte: 5, maxAnte: 6, label: "Elder" },
    ELITE: { minAnte: 8, maxAnte: 8, label: "ELITE" }
};

// ============================================
// HELPER FUNCTIONS FOR MECHANICS
// ============================================

/**
 * Shuffle array in place using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Get random alive party member index
 */
function getRandomAlivePartyMemberIndex(party) {
    const aliveIndices = party.map((member, index) => !member.isDead ? index : -1).filter(i => i !== -1);
    if (aliveIndices.length === 0) return -1;
    return aliveIndices[Math.floor(Math.random() * aliveIndices.length)];
}

/**
 * Get two random alive party member indices
 */
function getTwoRandomAlivePartyMemberIndices(party) {
    const aliveIndices = party.map((member, index) => !member.isDead ? index : -1).filter(i => i !== -1);
    if (aliveIndices.length < 2) return aliveIndices;
    
    const shuffled = shuffleArray([...aliveIndices]);
    return shuffled.slice(0, 2);
}

// ============================================
// EARLY ANTE BOSSES (1-2) - Simple Mechanics
// ============================================

/**
 * THE BULWARK - Very Large HP Pool
 * Mechanic: Has massive health and defensive stance every 3 turns
 */
export const BULWARK = {
    id: "bulwark",
    name: "THE BULWARK",
    description: "A living fortress of stone and steel.",
    mechanicDescription: "Massive HP pool. Enters defensive stance every 3 turns.",
    types: [ATTRIBUTES.ROCK, ATTRIBUTES.STEEL],
    tier: BOSS_TIERS.EARLY,
    baseStats: {
        hp: 800,
        mp: 100,
        attack: 20,
        defense: 25,
        specialAttack: 15,
        specialDefense: 20,
        speed: 8,
        accuracy: 100,
        luck: 5
    },
    skills: [
        createDamageSkill({
            id: "bulwark_slam", name: "Fortress Slam", className: "Boss",
            attribute: ATTRIBUTES.ROCK, mpCost: 15, power: 40,
            target: TARGETS.ONE_ENEMY, description: "A crushing blow from the fortress.",
            rarity: RARITIES.UNCOMMON
        }),
        createBuffSkill({
            id: "bulwark_stance", name: "Iron Stance", className: "Boss",
            mpCost: 20, target: TARGETS.SELF,
            stat: "defense", amount: 1.5,
            description: "Greatly increases defense.",
            rarity: RARITIES.RARE
        })
    ],
    mechanics: {
        onTurnStart: (boss, context) => {
            // Every 3 turns, enter defensive stance
            if (boss.mechanicState.turnCounter % 3 === 0) {
                boss.defend();
                context.log(`${boss.name} enters IRON STANCE! Defense increased!`);
                return { message: "IRON STANCE ACTIVATED!" };
            }
            return null;
        }
    }
};

/**
 * THE TRICKSTER - Skill Shuffler
 * Mechanic: Shuffles a random party member's skills each turn
 */
export const TRICKSTER = {
    id: "trickster",
    name: "THE TRICKSTER",
    description: "A chaotic entity that revels in confusion.",
    mechanicDescription: "Shuffles a random party member's skills each turn.",
    types: [ATTRIBUTES.PSYCHIC, ATTRIBUTES.FAIRY],
    tier: BOSS_TIERS.EARLY,
    baseStats: {
        hp: 500,
        mp: 150,
        attack: 18,
        defense: 12,
        specialAttack: 28,
        specialDefense: 18,
        speed: 22,
        accuracy: 110,
        luck: 15
    },
    skills: [
        createDamageSkill({
            id: "trickster_bolt", name: "Chaos Bolt", className: "Boss",
            attribute: ATTRIBUTES.PSYCHIC, mpCost: 12, power: 35,
            target: TARGETS.ONE_ENEMY, description: "An unpredictable psychic attack.",
            rarity: RARITIES.UNCOMMON
        }),
        createDebuffSkill({
            id: "trickster_confuse", name: "Mind Twist", className: "Boss",
            attribute: ATTRIBUTES.PSYCHIC, mpCost: 18,
            target: TARGETS.ONE_ENEMY, stat: "hitRate", amount: 0.7,
            description: "Reduces accuracy.",
            rarity: RARITIES.RARE
        })
    ],
    mechanics: {
        onTurnEnd: (boss, context) => {
            // Shuffle a random party member's skills
            const targetIndex = getRandomAlivePartyMemberIndex(context.party);
            if (targetIndex !== -1) {
                const target = context.party[targetIndex];
                const originalSkills = [...target.skills];
                target.skills = shuffleArray([...target.skills]);
                context.log(`${boss.name} shuffles ${target.name}'s skills!`);
                return { message: `SKILLS SHUFFLED: ${target.name}` };
            }
            return null;
        }
    }
};

/**
 * THE CURSED - Glass Cannon
 * Mechanic: Deals 50% more damage but takes 25% more damage
 */
export const CURSED = {
    id: "cursed",
    name: "THE CURSED",
    description: "A tormented soul that trades defense for power.",
    mechanicDescription: "Deals 50% more damage but takes 25% more damage.",
    types: [ATTRIBUTES.DARK, ATTRIBUTES.GHOST],
    tier: BOSS_TIERS.EARLY,
    baseStats: {
        hp: 450,
        mp: 120,
        attack: 35,
        defense: 8,
        specialAttack: 30,
        specialDefense: 10,
        speed: 18,
        accuracy: 105,
        luck: 12
    },
    skills: [
        createDamageSkill({
            id: "cursed_strike", name: "Tormented Strike", className: "Boss",
            attribute: ATTRIBUTES.DARK, mpCost: 15, power: 45,
            target: TARGETS.ONE_ENEMY, description: "A painful strike fueled by torment.",
            rarity: RARITIES.RARE
        })
    ],
    mechanics: {
        onBattleStart: (boss, context) => {
            boss.mechanicState.storedData.damageBoost = 1.5;
            boss.mechanicState.storedData.vulnerability = 1.25;
            context.log(`${boss.name}'s curse amplifies damage dealt and received!`);
        },
        modifyDamage: (boss, amount, source, skill, context) => {
            // Boss takes 25% more damage
            if (source && context.party.includes(source)) {
                return Math.floor(amount * 1.25);
            }
            return amount;
        },
        onPlayerAction: (boss, action, context) => {
            // Boss deals 50% more damage
            if (action.source === boss && action.type === "FIGHT") {
                // Damage boost applied in battle scene
                boss.mechanicState.storedData.pendingDamageBoost = 1.5;
            }
        }
    }
};

// ============================================
// MID ANTE BOSSES (3-4) - Moderate Complexity
// ============================================

/**
 * THE SILENCER - Skill Type Disabler
 * Mechanic: Disables one skill type (Damage/Heal/Buff) for 2 turns every 3 turns
 */
export const SILENCER = {
    id: "silencer",
    name: "THE SILENCER",
    description: "An entity that suppresses all forms of power.",
    mechanicDescription: "Disables one skill type (Damage/Heal/Buff) for 2 turns every 3 turns.",
    types: [ATTRIBUTES.DARK, ATTRIBUTES.PSYCHIC],
    tier: BOSS_TIERS.MID,
    baseStats: {
        hp: 650,
        mp: 200,
        attack: 25,
        defense: 18,
        specialAttack: 32,
        specialDefense: 22,
        speed: 15,
        accuracy: 110,
        luck: 10
    },
    skills: [
        createDamageSkill({
            id: "silencer_void", name: "Void Touch", className: "Boss",
            attribute: ATTRIBUTES.DARK, mpCost: 20, power: 45,
            target: TARGETS.ONE_ENEMY, description: "Drains power from the target.",
            rarity: RARITIES.RARE
        }),
        createDebuffSkill({
            id: "silencer_suppress", name: "Suppress", className: "Boss",
            attribute: ATTRIBUTES.PSYCHIC, mpCost: 25,
            target: TARGETS.ALL_ENEMIES, stat: "spAttack", amount: 0.8,
            description: "Reduces special attack of all enemies.",
            rarity: RARITIES.RARE
        })
    ],
    mechanics: {
        onTurnStart: (boss, context) => {
            // Every 3 turns, disable a random skill type
            if (boss.mechanicState.turnCounter % 3 === 1) {
                const skillTypes = ["Damage", "Heal", "Buff"];
                const disabledType = skillTypes[Math.floor(Math.random() * skillTypes.length)];
                boss.mechanicState.storedData.disabledType = disabledType;
                boss.mechanicState.cooldowns.skillLock = 2;
                context.log(`${boss.name} SILENCES all ${disabledType.toUpperCase()} skills for 2 turns!`);
                return { message: `SILENCED: ${disabledType} skills disabled!` };
            }
            
            // Check if lock expired
            if (boss.mechanicState.cooldowns.skillLock === 0 && boss.mechanicState.storedData.disabledType) {
                const wasDisabled = boss.mechanicState.storedData.disabledType;
                boss.mechanicState.storedData.disabledType = null;
                context.log(`${wasDisabled} skills are no longer silenced!`);
            }
            return null;
        }
    }
};

/**
 * THE TIMEKEEPER - Turn Limit
 * Mechanic: Must defeat within X turns or party takes heavy damage
 */
export const TIMEKEEPER = {
    id: "timekeeper",
    name: "THE TIMEKEEPER",
    description: "A guardian of time who dooms those who tarry.",
    mechanicDescription: "Must defeat within 15 turns or suffer catastrophic damage!",
    types: [ATTRIBUTES.STAR, ATTRIBUTES.LIGHT],
    tier: BOSS_TIERS.MID,
    baseStats: {
        hp: 600,
        mp: 180,
        attack: 22,
        defense: 20,
        specialAttack: 35,
        specialDefense: 25,
        speed: 20,
        accuracy: 115,
        luck: 12
    },
    skills: [
        createDamageSkill({
            id: "timekeeper_beam", name: "Chrono Beam", className: "Boss",
            attribute: ATTRIBUTES.STAR, mpCost: 25, power: 50,
            target: TARGETS.ONE_ENEMY, description: "A beam of compressed time.",
            rarity: RARITIES.RARE
        })
    ],
    mechanics: {
        onBattleStart: (boss, context) => {
            boss.mechanicState.storedData.turnLimit = 15;
            boss.mechanicState.storedData.doomDamage = 999;
            context.log(`TIME LIMIT: Defeat ${boss.name} in 15 turns or face DOOM!`);
        },
        onTurnEnd: (boss, context) => {
            const turnsRemaining = boss.mechanicState.storedData.turnLimit - boss.mechanicState.turnCounter;
            
            // Warning at 10, 5, and 3 turns remaining
            if (turnsRemaining === 10 || turnsRemaining === 5 || turnsRemaining === 3) {
                context.log(`⚠️ TIME WARNING: ${turnsRemaining} turns remaining!`);
                return { message: `${turnsRemaining} TURNS LEFT!` };
            }
            
            // Time's up - deal massive damage to all party members
            if (turnsRemaining <= 0) {
                context.log(`⏰ TIME'S UP! ${boss.name} unleashes DOOM upon your party!`);
                context.party.forEach(member => {
                    if (!member.isDead) {
                        member.hp = Math.max(1, member.hp - 50); // Leave at 1 HP as mercy
                    }
                });
                return { message: "DOOM STRIKES! Party takes massive damage!" };
            }
            return null;
        }
    }
};

/**
 * THE LEECH - Life Steal
 * Mechanic: Heals for 30% of damage dealt
 */
export const LEECH = {
    id: "leech",
    name: "THE LEECH",
    description: "A parasitic horror that feeds on the life force of others.",
    mechanicDescription: "Heals for 30% of all damage dealt to party members.",
    types: [ATTRIBUTES.POISON, ATTRIBUTES.DARK],
    tier: BOSS_TIERS.MID,
    baseStats: {
        hp: 550,
        mp: 160,
        attack: 28,
        defense: 16,
        specialAttack: 25,
        specialDefense: 20,
        speed: 14,
        accuracy: 108,
        luck: 8
    },
    skills: [
        createDamageSkill({
            id: "leech_drain", name: "Life Drain", className: "Boss",
            attribute: ATTRIBUTES.POISON, mpCost: 18, power: 40,
            target: TARGETS.ONE_ENEMY, description: "Drains life from the target.",
            rarity: RARITIES.RARE
        }),
        createDamageSkill({
            id: "leech_swarm", name: "Leech Swarm", className: "Boss",
            attribute: ATTRIBUTES.POISON, mpCost: 30, power: 30,
            target: TARGETS.ALL_ENEMIES, description: "Summons a swarm of leeches.",
            rarity: RARITIES.EXOTIC
        })
    ],
    mechanics: {
        onDamageTaken: (boss, amount, source, skill, context) => {
            // Track damage dealt by boss for lifesteal
            return amount;
        },
        onPlayerAction: (boss, action, context) => {
            // When boss deals damage, heal for 30%
            if (action.source === boss && action.type === "FIGHT" && action.damageDealt) {
                const healAmount = Math.floor(action.damageDealt * 0.3);
                boss.heal(healAmount);
                context.log(`${boss.name} drains ${healAmount} HP from the wound!`);
            }
        }
    }
};

// ============================================
// LATE ANTE BOSSES (5-6) - Complex Mechanics
// ============================================

/**
 * THE ADAPTOID - Damage Type Adaptation
 * Mechanic: Gains resistance to damage types received (stacks up to 75%)
 */
export const ADAPTOID = {
    id: "adaptoid",
    name: "THE ADAPTOID",
    description: "A shapeshifting terror that evolves to counter any threat.",
    mechanicDescription: "Adapts to damage types received, gaining 25% resistance (max 75%).",
    types: [ATTRIBUTES.ALMIGHTY],
    tier: BOSS_TIERS.LATE,
    baseStats: {
        hp: 750,
        mp: 220,
        attack: 30,
        defense: 25,
        specialAttack: 30,
        specialDefense: 25,
        speed: 18,
        accuracy: 112,
        luck: 10
    },
    skills: [
        createDamageSkill({
            id: "adaptoid_slash", name: "Adaptive Slash", className: "Boss",
            attribute: ATTRIBUTES.ALMIGHTY, mpCost: 20, power: 45,
            target: TARGETS.ONE_ENEMY, description: "An attack that adapts to the target's weakness.",
            rarity: RARITIES.EXOTIC
        })
    ],
    mechanics: {
        onBattleStart: (boss, context) => {
            context.log(`${boss.name} begins adapting to your attacks!`);
        },
        onDamageTaken: (boss, amount, source, skill, context) => {
            if (skill && skill.attribute) {
                // Add 25% resistance to this damage type
                const currentResist = boss.mechanicState.damageResistances[skill.attribute] || 0;
                if (currentResist < 0.75) {
                    boss.addResistance(skill.attribute, 0.25);
                    const newResist = boss.mechanicState.damageResistances[skill.attribute];
                    context.log(`${boss.name} adapts to ${skill.attribute}! Resistance: ${Math.floor(newResist * 100)}%`);
                }
            }
            return amount;
        }
    }
};

/**
 * THE PARASITE - Character Locking
 * Mechanic: Randomly disables one character from acting each turn
 */
export const PARASITE = {
    id: "parasite",
    name: "THE PARASITE",
    description: "A mind-controlling entity that dominates its victims.",
    mechanicDescription: "Disables one random party member from acting each turn.",
    types: [ATTRIBUTES.PSYCHIC, ATTRIBUTES.POISON],
    tier: BOSS_TIERS.LATE,
    baseStats: {
        hp: 680,
        mp: 200,
        attack: 26,
        defense: 22,
        specialAttack: 32,
        specialDefense: 28,
        speed: 16,
        accuracy: 110,
        luck: 12
    },
    skills: [
        createDamageSkill({
            id: "parasite_tentacle", name: "Domination Tentacle", className: "Boss",
            attribute: ATTRIBUTES.PSYCHIC, mpCost: 22, power: 42,
            target: TARGETS.ONE_ENEMY, description: "Psychic tendrils crush the will.",
            rarity: RARITIES.EXOTIC
        }),
        createDebuffSkill({
            id: "parasite_mind", name: "Mind Parasite", className: "Boss",
            attribute: ATTRIBUTES.PSYCHIC, mpCost: 25,
            target: TARGETS.ONE_ENEMY, stat: "attack", amount: 0.75,
            description: "Weakens the target's will to fight.",
            rarity: RARITIES.RARE
        })
    ],
    mechanics: {
        onTurnStart: (boss, context) => {
            // Lock a random party member for this turn
            const targetIndex = getRandomAlivePartyMemberIndex(context.party);
            if (targetIndex !== -1) {
                boss.lockCharacter(targetIndex);
                const target = context.party[targetIndex];
                context.log(`${boss.name} DOMINATES ${target.name}! They cannot act this turn!`);
                return { message: `DOMINATED: ${target.name} is paralyzed!` };
            }
            return null;
        }
    }
};

/**
 * THE MIRROR - Damage Reflection
 * Mechanic: Reflects 25% of damage back to attackers
 */
export const MIRROR = {
    id: "mirror",
    name: "THE MIRROR",
    description: "A crystalline entity that returns all harm dealt to it.",
    mechanicDescription: "Reflects 25% of all damage back to the attacker.",
    types: [ATTRIBUTES.ICE, ATTRIBUTES.PSYCHIC],
    tier: BOSS_TIERS.LATE,
    baseStats: {
        hp: 700,
        mp: 180,
        attack: 24,
        defense: 30,
        specialAttack: 28,
        specialDefense: 30,
        speed: 12,
        accuracy: 105,
        luck: 15
    },
    skills: [
        createDamageSkill({
            id: "mirror_shard", name: "Shard Storm", className: "Boss",
            attribute: ATTRIBUTES.ICE, mpCost: 24, power: 38,
            target: TARGETS.ALL_ENEMIES, description: "Razor-sharp ice shards cut all enemies.",
            rarity: RARITIES.EXOTIC
        })
    ],
    mechanics: {
        onBattleStart: (boss, context) => {
            context.log(`${boss.name}'s reflective surface glimmers menacingly!`);
        },
        onDamageTaken: (boss, amount, source, skill, context) => {
            // Reflect 25% damage back to attacker
            if (source && context.party.includes(source) && !source.isDead) {
                const reflectDamage = Math.floor(amount * 0.25);
                source.hp = Math.max(0, source.hp - reflectDamage);
                if (source.hp <= 0) {
                    source.isDead = true;
                    source.statusEffects = [];
                }
                context.log(`${boss.name} reflects ${reflectDamage} damage back to ${source.name}!`);
            }
            return amount;
        }
    }
};

// ============================================
// ELITE BOSSES (Ante 8 ONLY) - Maximum Difficulty
// ============================================

/**
 * THE DEVOURER - Ultimate Survivor
 * Mechanic: MASSIVE HP pool, gains attack boost every 3 turns,
 * consumes weakest party member at 50% HP
 */
export const DEVOURER = {
    id: "devourer",
    name: "THE DEVOURER",
    description: "An insatiable cosmic horror that consumes all life.",
    mechanicDescription: "MASSIVE HP. Gains +20% Attack every 3 turns. Consumes weakest ally at 50% HP.",
    types: [ATTRIBUTES.DARK, ATTRIBUTES.STAR],
    tier: BOSS_TIERS.ELITE,
    isElite: true,
    baseStats: {
        hp: 1500,
        mp: 300,
        attack: 45,
        defense: 30,
        specialAttack: 40,
        specialDefense: 30,
        speed: 20,
        accuracy: 120,
        luck: 15
    },
    phaseThresholds: [0.5], // Phase 2 at 50% HP
    skills: [
        createDamageSkill({
            id: "devourer_maw", name: "Cosmic Maw", className: "Boss",
            attribute: ATTRIBUTES.DARK, mpCost: 35, power: 60,
            target: TARGETS.ONE_ENEMY, description: "The devouring darkness consumes.",
            rarity: RARITIES.LEGENDARY
        }),
        createDamageSkill({
            id: "devourer_hunger", name: "Endless Hunger", className: "Boss",
            attribute: ATTRIBUTES.STAR, mpCost: 50, power: 45,
            target: TARGETS.ALL_ENEMIES, description: "A hunger that can never be sated.",
            rarity: RARITIES.MYTHICAL
        })
    ],
    mechanics: {
        onBattleStart: (boss, context) => {
            boss.mechanicState.storedData.attackBoostStacks = 0;
            context.log(`${boss.name} hungers for your party! Its power grows every 3 turns!`);
        },
        onTurnStart: (boss, context) => {
            // Every 3 turns, gain attack boost
            if (boss.mechanicState.turnCounter % 3 === 0 && boss.mechanicState.turnCounter > 0) {
                boss.mechanicState.storedData.attackBoostStacks++;
                const boost = 1 + (boss.mechanicState.storedData.attackBoostStacks * 0.2);
                context.log(`${boss.name}'s HUNGER grows! Attack increased by ${boss.mechanicState.storedData.attackBoostStacks * 20}%!`);
                return { message: `HUNGER GROWS: +${boss.mechanicState.storedData.attackBoostStacks * 20}% Attack!` };
            }
            return null;
        },
        onPhaseTransition: (boss, newPhase) => {
            if (newPhase === 2) {
                return "PHASE 2: The Devourer enters a feeding frenzy!";
            }
            return null;
        },
        onTurnEnd: (boss, context) => {
            // At phase 2, consume weakest party member every 4 turns
            if (boss.mechanicState.phase >= 2 && boss.mechanicState.turnCounter % 4 === 0) {
                const aliveMembers = context.party.filter(m => !m.isDead);
                if (aliveMembers.length > 0) {
                    // Find member with lowest HP percentage
                    const weakest = aliveMembers.reduce((min, member) => 
                        (member.hp / member.maxHp) < (min.hp / min.maxHp) ? member : min
                    );
                    const damage = Math.floor(weakest.hp * 0.5); // 50% HP damage
                    weakest.hp -= damage;
                    if (weakest.hp <= 0) {
                        weakest.isDead = true;
                        weakest.statusEffects = [];
                    }
                    // Heal boss for the damage dealt
                    boss.heal(damage);
                    context.log(`💀 ${boss.name} DEVOURS ${weakest.name} for ${damage} damage and heals!`);
                    return { message: `DEVOURED: ${weakest.name} suffers ${damage} damage!` };
                }
            }
            return null;
        },
        modifyDamage: (boss, amount, source, skill, context) => {
            // Apply attack boost to damage
            const boost = 1 + (boss.mechanicState.storedData.attackBoostStacks * 0.2);
            if (boost > 1 && source === boss) {
                return Math.floor(amount * boost);
            }
            return amount;
        }
    }
};

/**
 * THE CHRONOS - Rapid Adaptation
 * Mechanic: Adapts every turn, alternates between damage immunity phases
 */
export const CHRONOS = {
    id: "chronos",
    name: "CHRONOS, ETERNAL",
    description: "The master of time itself, forever beyond reach.",
    mechanicDescription: "Adapts EVERY turn. Alternates between Physical and Special immunity.",
    types: [ATTRIBUTES.STAR, ATTRIBUTES.ALMIGHTY],
    tier: BOSS_TIERS.ELITE,
    isElite: true,
    baseStats: {
        hp: 1200,
        mp: 400,
        attack: 35,
        defense: 35,
        specialAttack: 35,
        specialDefense: 35,
        speed: 25,
        accuracy: 125,
        luck: 20
    },
    skills: [
        createDamageSkill({
            id: "chronos_era", name: "Era Collapse", className: "Boss",
            attribute: ATTRIBUTES.STAR, mpCost: 40, power: 55,
            target: TARGETS.ONE_ENEMY, description: "Time itself collapses on the target.",
            rarity: RARITIES.LEGENDARY
        }),
        createBuffSkill({
            id: "chronos_rewind", name: "Temporal Rewind", className: "Boss",
            attribute: ATTRIBUTES.STAR, mpCost: 60,
            target: TARGETS.SELF, stat: "allDefense", amount: 1.3,
            description: "Rewinds damage taken.",
            rarity: RARITIES.MYTHICAL
        })
    ],
    mechanics: {
        onBattleStart: (boss, context) => {
            boss.mechanicState.storedData.immunityPhase = "Physical";
            context.log(`${boss.name} shifts through time! Currently immune to ${boss.mechanicState.storedData.immunityPhase} damage!`);
        },
        onTurnStart: (boss, context) => {
            // Alternate immunity phase
            const currentPhase = boss.mechanicState.storedData.immunityPhase;
            const newPhase = currentPhase === "Physical" ? "Special" : "Physical";
            boss.mechanicState.storedData.immunityPhase = newPhase;
            
            // Clear old immunities and set new one
            boss.mechanicState.damageResistances = {};
            if (newPhase === "Physical") {
                // Immune to Physical (represented as 100% resistance)
                boss.mechanicState.damageResistances["Physical"] = 1.0;
            } else {
                // Immune to Special
                boss.mechanicState.damageResistances["Special"] = 1.0;
            }
            
            context.log(`⏰ ${boss.name} shifts to ${newPhase} IMMUNITY PHASE!`);
            return { message: `${newPhase.toUpperCase()} IMMUNITY ACTIVE!` };
        },
        onDamageTaken: (boss, amount, source, skill, context) => {
            // Adapt to the attribute used
            if (skill && skill.attribute) {
                const currentResist = boss.mechanicState.damageResistances[skill.attribute] || 0;
                if (currentResist < 0.5) {
                    boss.addResistance(skill.attribute, 0.25);
                    context.log(`${boss.name} adapts to ${skill.attribute} attacks!`);
                }
            }
            return amount;
        }
    }
};

/**
 * THE TYRANT - Ultimate Oppressor
 * Mechanic: Disables 2 random characters per turn, has aura reducing all party stats by 20%
 */
export const TYRANT = {
    id: "tyrant",
    name: "THE TYRANT",
    description: "An oppressive force that crushes all who oppose it.",
    mechanicDescription: "Disables 2 characters per turn. All party stats reduced by 20%.",
    types: [ATTRIBUTES.DARK, ATTRIBUTES.FIGHTING],
    tier: BOSS_TIERS.ELITE,
    isElite: true,
    baseStats: {
        hp: 1400,
        mp: 250,
        attack: 50,
        defense: 40,
        specialAttack: 35,
        specialDefense: 35,
        speed: 22,
        accuracy: 115,
        luck: 18
    },
    skills: [
        createDamageSkill({
            id: "tyrant_fist", name: "Tyrant's Fist", className: "Boss",
            attribute: ATTRIBUTES.FIGHTING, mpCost: 30, power: 55,
            target: TARGETS.ONE_ENEMY, description: "An oppressive strike that crushes will.",
            rarity: RARITIES.LEGENDARY
        }),
        createDebuffSkill({
            id: "tyrant_command", name: "Imperial Command", className: "Boss",
            attribute: ATTRIBUTES.DARK, mpCost: 40,
            target: TARGETS.ALL_ENEMIES, stat: "all", amount: 0.85,
            description: "Reduces all stats of enemies.",
            rarity: RARITIES.MYTHICAL
        })
    ],
    mechanics: {
        onBattleStart: (boss, context) => {
            context.log(`${boss.name}'s oppressive aura weakens your entire party by 20%!`);
            // Apply permanent debuff to all party members
            context.party.forEach(member => {
                member.addStatusEffect({
                    stat: "all",
                    amount: 0.8,
                    type: "DEBUFF"
                });
            });
        },
        onTurnStart: (boss, context) => {
            // Lock 2 random party members
            const targets = getTwoRandomAlivePartyMemberIndices(context.party);
            if (targets.length > 0) {
                const lockedNames = [];
                targets.forEach(index => {
                    boss.lockCharacter(index);
                    lockedNames.push(context.party[index].name);
                });
                context.log(`👑 ${boss.name} commands ${lockedNames.join(" and ")} to KNEEL! They cannot act!`);
                return { message: `COMMAND: ${lockedNames.join(", ")} are dominated!` };
            }
            return null;
        },
        onPhaseTransition: (boss, newPhase) => {
            if (newPhase === 2) {
                return "PHASE 2: The Tyrant's oppression intensifies!";
            }
            return null;
        }
    }
};

// ============================================
// BOSS REGISTRY AND HELPER FUNCTIONS
// ============================================

/**
 * All available bosses organized by tier
 */
export const ALL_BOSSES = {
    [BOSS_TIERS.EARLY.label]: [BULWARK, TRICKSTER, CURSED],
    [BOSS_TIERS.MID.label]: [SILENCER, TIMEKEEPER, LEECH],
    [BOSS_TIERS.LATE.label]: [ADAPTOID, PARASITE, MIRROR],
    [BOSS_TIERS.ELITE.label]: [DEVOURER, CHRONOS, TYRANT]
};

/**
 * Get a random boss appropriate for the current ante
 */
export function getRandomBossForAnte(ante) {
    let availableBosses = [];
    
    // Determine which tiers are available based on ante
    if (ante >= 1 && ante <= 2) {
        availableBosses = [...ALL_BOSSES[BOSS_TIERS.EARLY.label]];
    } else if (ante >= 3 && ante <= 4) {
        availableBosses = [...ALL_BOSSES[BOSS_TIERS.MID.label]];
    } else if (ante >= 5 && ante <= 6) {
        availableBosses = [...ALL_BOSSES[BOSS_TIERS.LATE.label]];
    } else if (ante >= 7) {
        // Ante 7 can be late or elite
        availableBosses = [...ALL_BOSSES[BOSS_TIERS.LATE.label]];
    } else if (ante === 8) {
        // Ante 8 is ELITE ONLY
        availableBosses = [...ALL_BOSSES[BOSS_TIERS.ELITE.label]];
    }
    
    if (availableBosses.length === 0) {
        // Fallback to early tier
        availableBosses = [...ALL_BOSSES[BOSS_TIERS.EARLY.label]];
    }
    
    // Return random boss from available pool
    return availableBosses[Math.floor(Math.random() * availableBosses.length)];
}

/**
 * Get a specific boss by ID
 */
export function getBossById(id) {
    const allBosses = [
        ...ALL_BOSSES[BOSS_TIERS.EARLY.label],
        ...ALL_BOSSES[BOSS_TIERS.MID.label],
        ...ALL_BOSSES[BOSS_TIERS.LATE.label],
        ...ALL_BOSSES[BOSS_TIERS.ELITE.label]
    ];
    return allBosses.find(boss => boss.id === id);
}

/**
 * Check if a boss is elite
 */
export function isEliteBoss(bossTemplate) {
    return bossTemplate.isElite === true;
}

export default {
    BOSS_TIERS,
    ALL_BOSSES,
    BULWARK,
    TRICKSTER,
    CURSED,
    SILENCER,
    TIMEKEEPER,
    LEECH,
    ADAPTOID,
    PARASITE,
    MIRROR,
    DEVOURER,
    CHRONOS,
    TYRANT,
    getRandomBossForAnte,
    getBossById,
    isEliteBoss
};
