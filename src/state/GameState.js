import { BaseCharacter } from "../entities/BaseCharacter";
import { getRandomSkills, getWeightedRandomSkills, SKILL_DATA } from "../data/skills/index.js";
import { GAMEPLAY, ATTRIBUTES } from "../constants";
import { k } from "../kaplayCtx";

const CREATURE_NOUNS = [
    "Slime", "Golem", "Sprite", "Beast", "Wraith", "Construct", "Elemental", "Stalker", "Sentinel", "Avian"
];

export class GameState {
    constructor() {
        this.party = [];
        this.enemies = [];
        this.inventory = [
            { name: "Healing Potion", type: "Heal", power: 50, count: 3 },
            { name: "Iron Sword", type: "Weapon", attackBonus: 5, attribute: ATTRIBUTES.NORMAL, multiHit: 1, count: 1 },
            { name: "Leather Vest", type: "Armor", hpBonus: 20, defBonus: 5, count: 1 },
            { name: "Copper Ring", type: "Accessory", attackBonus: 2, count: 1 }
        ];
        this.roundCounter = 1;
        this.scalingFactor = 1.0;
        this.gold = 0;
        this.scoringState = {
            roundScore: 0,
            targetScore: 1200,
            objectives: [],
            rewards: { gold: 100, exp: 200, drops: [] },
            battleMetrics: {
                superEffectiveHits: 0,
                partyDeaths: 0,
                totalTurns: 0
            }
        };
        // Turn-based scoring accumulator
        this.turnScoring = {
            baseScore: 0,
            multiplier: 1.0,
            actionLog: []
        };
        // Ante system - increments on boss defeat, win at 8/8
        this.anteCounter = 1;
        // Attempts system - starts at 4 each round, decrements per turn
        this.attemptsLeft = 4;
        this.scoringLocked = false;
        // Encounter system - 3 encounters per ante
        this.encounters = [];
        this.currentEncounterIndex = 0;
        this.initializeParty();
    }

    initializeParty() {
        this.party = [];
        this.roundCounter = 1;
        this.scalingFactor = 1.0;

        // SOL - Dark/Star
        const sol = new BaseCharacter("SOL", "Hero", {
            hp: 100, mp: 50, attack: 15, defense: 10,
            specialAttack: 15, specialDefense: 10, speed: 12, accuracy: 105, luck: 10
        });
        sol.types = [ATTRIBUTES.DARK, ATTRIBUTES.STAR];
        this.setupSkills(sol, "Hero", "SOL");
        this.party.push(sol);

        // ALLOY - Electric/Steel
        const alloy = new BaseCharacter("ALLOY", "Tank", {
            hp: 150, mp: 30, attack: 12, defense: 15,
            specialAttack: 8, specialDefense: 15, speed: 8, accuracy: 95, luck: 5
        });
        alloy.types = [ATTRIBUTES.ELECTRIC, ATTRIBUTES.STEEL];
        this.setupSkills(alloy, "Tank", "ALLOY");
        this.party.push(alloy);

        // SABRINA - Fairy/Fire
        const saber = new BaseCharacter("SABRINA", "Mage", {
            hp: 70, mp: 100, attack: 10, defense: 5,
            specialAttack: 25, specialDefense: 10, speed: 10, accuracy: 100, luck: 8
        });
        saber.types = [ATTRIBUTES.FAIRY, ATTRIBUTES.FIRE];
        this.setupSkills(saber, "Mage", "SABRINA");
        this.party.push(saber);

        // MAX - Light/Water
        const max = new BaseCharacter("MAX", "Rogue", {
            hp: 80, mp: 40, attack: 20, defense: 8,
            specialAttack: 12, specialDefense: 8, speed: 18, accuracy: 110, luck: 15
        });
        max.types = [ATTRIBUTES.LIGHT, ATTRIBUTES.WATER];
        this.setupSkills(max, "Rogue", "MAX");
        this.party.push(max);
    }

    setupSkills(char, className, charName = null) {
        // If this is a party member with a specific starting skillset, assign it
        if (charName && this.getStartingSkills(charName)) {
            const startingSkills = this.getStartingSkills(charName);
            char.activeSkills = startingSkills.map(skillName => 
                SKILL_DATA.find(s => s.name === skillName) || getWeightedRandomSkills(className, 1, 0, "ACTIVE")[0]
            ).filter(Boolean);
            // Fill any missing slots with random skills
            while (char.activeSkills.length < 4) {
                const randomSkill = getWeightedRandomSkills(className, 1, 0, "ACTIVE")[0];
                if (randomSkill && !char.activeSkills.find(s => s.id === randomSkill.id)) {
                    char.activeSkills.push(randomSkill);
                }
            }
        } else {
            // Fetch 4 Actives using weighted randomness for enemies/non-party
            char.activeSkills = getWeightedRandomSkills(className, 4, 0, "ACTIVE");
        }
        // Fetch 4 Passives using weighted randomness
        char.passiveSkills = getWeightedRandomSkills(className, 4, 0, "Passive");
        char.skills = char.activeSkills; // Compatibility for UI
    }

    getStartingSkills(charName) {
        const startingSkillsets = {
            "SOL": ["Intimidate", "Cosmic Ray", "Shadow Claw", "Slash"],
            "ALLOY": ["Thunder", "Fortify", "Shield Bash", "Chain Lightning"],
            "SABRINA": ["Heal", "Fireball", "Pixie Dust", "Shadow Strike"],
            "MAX": ["Feint", "Splash", "Earthquake", "Light Beam"]
        };
        return startingSkillsets[charName] || null;
    }

    get averagePartyLevel() {
        const aliveMembers = this.party.filter(p => !p.isDead);
        if (aliveMembers.length === 0) return 1;
        const sum = aliveMembers.reduce((acc, p) => acc + p.level, 0);
        return sum / aliveMembers.length;
    }

    generateEnemies() {
        this.enemies = [];
        const availableTypes = Object.values(ATTRIBUTES).filter(t => t !== ATTRIBUTES.PHYSICAL && t !== ATTRIBUTES.SPECIAL && t !== ATTRIBUTES.HEALING);
        const roundNum = this.roundCounter;
        const isBossRound = roundNum % 3 === 0;
        const isStrongerRound = roundNum % 3 === 2;
        const type = isBossRound ? "Boss" : (isStrongerRound ? "Stronger" : "Simple");
        const count = isBossRound ? 1 : (isStrongerRound ? 2 : k.randi(1, GAMEPLAY.MAX_ENEMIES));

        for (let i = 0; i < count; i++) {
            const stats = this.getEnemyStats(type);
            const enemy = new BaseCharacter(
                isBossRound ? "BOSS" : `Enemy ${i + 1}`,
                "Enemy",
                stats
            );
            enemy.isBoss = isBossRound;
            // Enemies gain levels too
            enemy.level = Math.max(1, Math.floor(this.averagePartyLevel + (roundNum / 3)));

            // Assign 1 or 2 random types
            const t1 = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            enemy.types = [t1];
            enemy.attribute = t1; // Compatibility
            if (Math.random() > 0.6) {
                const t2 = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                if (t2 !== t1) enemy.types.push(t2);
            }

            // Assign Flavored Name
            const noun = CREATURE_NOUNS[Math.floor(Math.random() * CREATURE_NOUNS.length)];
            const typeLabel = enemy.types[0].charAt(0).toUpperCase() + enemy.types[0].slice(1).toLowerCase();
            if (isBossRound) {
                enemy.name = `GREATER ${typeLabel.toUpperCase()} ${noun.toUpperCase()}`;
            } else {
                enemy.name = `${typeLabel} ${noun}`;
            }

            this.setupSkills(enemy, "ANY");
            this.enemies.push(enemy);
        }
        this.generateObjectives();
        return this.enemies;
    }

    generateObjectives() {
        const objectivePool = [
            { id: "deal_type", label: "Deal {type} Damage", type: "DAMAGE", points: 100 },
            { id: "defeat_with", label: "Defeat an enemy with {name}", type: "DEFEAT", points: 300 },
            { id: "super_effective", label: "Deal Super-Effective damage", type: "EFFECTIVE", points: 150 },
            { id: "use_skill", label: "Use {rarity} Skill", type: "SKILL", points: 200 },
            { id: "heal_juice", label: "Heal 50+ Juice in one turn", type: "REGEN", points: 250 },
        ];

        const bonusTypes = [
            { type: "additive", value: 50, display: "+50" },
            { type: "additive", value: 100, display: "+100" },
            { type: "additive", value: 150, display: "+150" },
            { type: "multiplicative", value: 1.5, display: "x1.5" },
            { type: "multiplicative", value: 2, display: "x2" },
            { type: "multiplicative", value: 2.5, display: "x2.5" },
        ];

        const count = k.randi(3, 6);
        const objectives = [];
        const usedPoolIndices = new Set();

        for (let i = 0; i < count; i++) {
            let idx;
            do { idx = k.randi(0, objectivePool.length); } while (usedPoolIndices.has(idx));
            usedPoolIndices.add(idx);

            const base = objectivePool[idx];
            let label = base.label;
            let targetData = {};

            if (base.id === "deal_type") {
                const types = Object.values(ATTRIBUTES).filter(t => t !== ATTRIBUTES.PHYSICAL);
                const type = types[k.randi(0, types.length)];
                label = label.replace("{type}", type);
                targetData = { type };
            } else if (base.id === "defeat_with") {
                const name = this.party[k.randi(0, this.party.length)].name;
                label = label.replace("{name}", name);
                targetData = { name };
            } else if (base.id === "use_skill") {
                const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
                const rarity = rarities[k.randi(0, 3)]; // Weighted towards lower for now
                label = label.replace("{rarity}", rarity);
                targetData = { rarity };
            }

            const bonus = bonusTypes[k.randi(0, bonusTypes.length)];

            objectives.push({
                ...base,
                label,
                targetData,
                currentCount: 0,
                bonus: bonus
            });
        }

        this.scoringState.objectives = objectives;
        this.scoringState.roundScore = 0;
        // Only set default targetScore if not already set (preserves encounter target scores)
        if (!this.scoringState.targetScore || this.scoringState.targetScore === 0) {
            // NEW: Easier early rounds, scaling difficulty curve
        // Formula: 400 + (round² * 18) gives:
        // Round 1: ~418, Round 3: ~562, Round 5: ~850, Round 8: ~1552, Round 10: ~2200
        this.scoringState.targetScore = Math.floor(400 + (this.roundCounter * this.roundCounter * 18));
        }
    }

    addScore(amount) {
        // Scoring is locked when attempts reach 0
        if (this.scoringLocked) {
            return false; // Score not added
        }
        this.scoringState.roundScore += amount;
        return true; // Score added successfully
    }

    // ============================================
    // NEW SCORING SYSTEM - Turn-based accumulator
    // ============================================

    /**
     * Accumulate base score during a turn
     * @param {number} amount - Base score to add
     */
    accumulateBaseScore(amount) {
        if (this.scoringLocked) return false;
        this.turnScoring.baseScore += Math.floor(amount);
        return true;
    }

    /**
     * Accumulate multiplier during a turn
     * @param {number} multiplier - Multiplier to apply (e.g., 1.5 for STAB, 2.0 for crit)
     */
    accumulateMultiplier(multiplier) {
        if (this.scoringLocked) return false;
        // Additive stacking: add the bonus amount (multiplier - 1) instead of multiplying
        // This prevents exponential score growth while still rewarding good play
        this.turnScoring.multiplier += (multiplier - 1);
        return true;
    }

    /**
     * Log an action for the turn
     * @param {Object} actionData - Details about the action
     */
    logScoringAction(actionData) {
        this.turnScoring.actionLog.push(actionData);
    }

    /**
     * Calculate the final score at turn end and reset accumulator
     * @returns {number} The final score to add to round score
     */
    calculateTurnEndScore() {
        if (this.scoringLocked) {
            this.resetTurnScoring();
            return 0;
        }
        const finalScore = Math.floor(this.turnScoring.baseScore * this.turnScoring.multiplier);
        if (finalScore > 0) {
            this.scoringState.roundScore += finalScore;
        }
        this.resetTurnScoring();
        return finalScore;
    }

    /**
     * Reset the turn scoring accumulator
     */
    resetTurnScoring() {
        this.turnScoring.baseScore = 0;
        this.turnScoring.multiplier = 1.0;
        this.turnScoring.actionLog = [];
    }

    /**
     * Get current turn scoring state for UI display
     * @returns {Object} { baseScore, multiplier }
     */
    getTurnScoringState() {
        return {
            baseScore: this.turnScoring.baseScore,
            multiplier: this.turnScoring.multiplier,
            projectedScore: Math.floor(this.turnScoring.baseScore * this.turnScoring.multiplier)
        };
    }

    /**
     * Calculate if a skill gets STAB (Same Type Attack Bonus)
     * @param {Object} source - The character using the skill
     * @param {string} skillAttribute - The skill's attribute/type
     * @returns {boolean} True if STAB applies
     */
    hasSTAB(source, skillAttribute) {
        return source && source.types && source.types.includes(skillAttribute);
    }

    /**
     * Calculate score for damage dealt
     * @param {number} damage - Damage dealt
     * @param {Object} source - Attacker character
     * @param {Object} skill - Skill used
     * @param {boolean} isCrit - Was it a critical hit
     * @param {number} typeMultiplier - Type effectiveness multiplier
     * @returns {Object} { baseScore, multipliersApplied }
     */
    calculateDamageScore(damage, source, skill, isCrit, typeMultiplier) {
        const baseScore = damage;
        const multipliers = [];

        // STAB bonus for all skill types
        if (skill && this.hasSTAB(source, skill.attribute)) {
            multipliers.push({ type: 'STAB', value: 1.5 });
        }

        // Super effective bonus (typeMultiplier > 1 means super effective)
        if (typeMultiplier > 1.5) {
            multipliers.push({ type: 'SUPER_EFFECTIVE', value: 2.0 });
        }

        // Critical hit bonus
        if (isCrit) {
            multipliers.push({ type: 'CRITICAL', value: 2.0 });
        }

        return { baseScore, multipliers };
    }

    /**
     * Calculate score for healing
     * @param {number} healAmount - HP healed
     * @param {number} targetCount - Number of targets healed
     * @param {Object} source - Healer character
     * @param {Object} skill - Healing skill used
     * @returns {Object} { baseScore, multipliersApplied }
     */
    calculateHealScore(healAmount, targetCount, source, skill) {
        // Healing score = total HP healed / number of targets
        const baseScore = Math.floor(healAmount / Math.max(1, targetCount));
        const multipliers = [];

        // STAB bonus applies to healing too
        if (skill && this.hasSTAB(source, skill.attribute)) {
            multipliers.push({ type: 'STAB', value: 1.5 });
        }

        return { baseScore, multipliers };
    }

    /**
     * Calculate score for buffs/debuffs
     * @param {number} statMultiplier - The stat multiplier (e.g., 1.5 for +50%)
     * @param {number} duration - Duration in turns
     * @param {number} targetCount - Number of targets affected
     * @param {Object} source - Character applying the buff/debuff
     * @param {Object} skill - Buff/Debuff skill used
     * @returns {Object} { baseScore, multipliersApplied }
     */
    calculateBuffDebuffScore(statMultiplier, duration, targetCount, source, skill) {
        // Buff/Debuff score = statMultiplier * duration * targets
        const baseScore = Math.floor(statMultiplier * duration * Math.max(1, targetCount));
        const multipliers = [];

        // STAB bonus applies to buffs/debuffs too
        if (skill && this.hasSTAB(source, skill.attribute)) {
            multipliers.push({ type: 'STAB', value: 1.5 });
        }

        return { baseScore, multipliers };
    }

    /**
     * Calculate score for defending
     * @param {number} damagePrevented - Amount of damage prevented by defending
     * @returns {Object} { baseScore, multipliersApplied }
     */
    calculateDefendScore(damagePrevented) {
        // Defend score = damage prevented * 0.5
        const baseScore = Math.floor(damagePrevented * 0.5);
        return { baseScore, multipliers: [] };
    }

    /**
     * Apply calculated score to turn accumulator
     * @param {Object} scoreData - Result from calculateDamageScore, calculateHealScore, etc.
     */
    applyCalculatedScore(scoreData) {
        // Add base score
        this.accumulateBaseScore(scoreData.baseScore);

        // Apply all multipliers
        if (scoreData.multipliers) {
            scoreData.multipliers.forEach(m => {
                this.accumulateMultiplier(m.value);
            });
        }

        // Log the action
        this.logScoringAction(scoreData);
    }

    decrementAttempts() {
        this.attemptsLeft = Math.max(0, this.attemptsLeft - 1);
        if (this.attemptsLeft === 0) {
            this.scoringLocked = true;
        }
        return this.attemptsLeft;
    }

    resetAttempts() {
        this.attemptsLeft = 4;
        this.scoringLocked = false;
    }

    incrementAnte() {
        this.anteCounter = Math.min(8, this.anteCounter + 1);
        return this.anteCounter;
    }

    hasWonGame() {
        return this.anteCounter >= 8;
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

        // Combine round-based scaling and level-based scaling
        const roundScaling = this.scalingFactor * (1 + (this.roundCounter - 1) * 0.05);

        return {
            hp: Math.floor(base.hp * roundScaling),
            mp: Math.floor(base.mp * roundScaling),
            attack: Math.floor(base.attack * roundScaling),
            defense: Math.floor(base.defense * roundScaling),
            specialAttack: Math.floor(base.specialAttack * roundScaling),
            specialDefense: Math.floor(base.specialDefense * roundScaling),
            speed: Math.floor(base.speed * roundScaling),
            accuracy: Math.floor(base.accuracy * roundScaling),
            luck: Math.floor(base.luck * roundScaling)
        };
    }

    isLeaderAlive() {
        return this.party[0] && !this.party[0].isDead;
    }

    isPartyDefeated() {
        return !this.isLeaderAlive();
    }

    areEnemiesDefeated() {
        return this.enemies.every(e => e.isDead);
    }

    equipItem(char, item) {
        const slot = item.type.toLowerCase();
        if (char.equipment[slot]) {
            this.unequipItem(char, slot);
        }

        char.equipment[slot] = item;
    }

    unequipItem(char, slot) {
        const item = char.equipment[slot];
        if (item) {
            char.equipment[slot] = null;
            this.inventory.push({ ...item, count: 1 });
        }
    }

    /**
     * Generate 3 encounters for the current ante
     * - Encounter 1: Simple (1 weak enemy)
     * - Encounter 2: Stronger (2 enemies or stronger single)
     * - Encounter 3: Boss (1 powerful boss)
     */
    generateEncounters() {
        this.encounters = [];
        this.currentEncounterIndex = 0;
        const availableTypes = Object.values(ATTRIBUTES).filter(t => t !== ATTRIBUTES.PHYSICAL && t !== ATTRIBUTES.SPECIAL && t !== ATTRIBUTES.HEALING);
        
        // Base scaling for this ante
        const anteScaling = 1 + (this.anteCounter * 0.15);

        for (let i = 0; i < 3; i++) {
            const type = i === 0 ? "Simple" : (i === 1 ? "Stronger" : "Boss");
            const count = i === 0 ? 1 : (i === 1 ? k.randi(1, 3) : 1);
            
            // Calculate target score for this encounter
            const targetScore = 300 + (i * 150) + (this.anteCounter * 100);
            
            const enemies = [];
            for (let j = 0; j < count; j++) {
                const stats = this.getEncounterStats(type, anteScaling, targetScore);
                const enemy = new BaseCharacter(
                    i === 2 ? "BOSS" : `Enemy ${j + 1}`,
                    "Enemy",
                    stats
                );
                enemy.isBoss = (i === 2);
                enemy.level = Math.max(1, Math.floor(this.averagePartyLevel + this.anteCounter));

                // Assign random types
                const t1 = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                enemy.types = [t1];
                enemy.attribute = t1;
                if (Math.random() > 0.6) {
                    const t2 = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                    if (t2 !== t1) enemy.types.push(t2);
                }

                // Assign flavored name
                const noun = CREATURE_NOUNS[Math.floor(Math.random() * CREATURE_NOUNS.length)];
                const typeLabel = enemy.types[0].charAt(0).toUpperCase() + enemy.types[0].slice(1).toLowerCase();
                if (i === 2) {
                    enemy.name = `GREATER ${typeLabel.toUpperCase()} ${noun.toUpperCase()}`;
                } else {
                    enemy.name = `${typeLabel} ${noun}`;
                }

                this.setupSkills(enemy, "ANY");
                enemies.push(enemy);
            }

            // Calculate reward
            const baseReward = 50 + (this.anteCounter * 25);
            const reward = i === 0 ? baseReward : (i === 1 ? Math.floor(baseReward * 1.5) : Math.floor(baseReward * 2.5));

            this.encounters.push({
                id: i,
                type: type,
                enemies: enemies,
                reward: reward,
                completed: false,
                targetScore: targetScore
            });
        }

        return this.encounters;
    }

    /**
     * Get stats for encounter enemies based on type and ante scaling
     * Base HP is set to half of targetScore for balanced gameplay
     */
    getEncounterStats(type, anteScaling, targetScore) {
        // Use half of targetScore as base HP for balanced enemy durability
        const baseHp = Math.floor(targetScore / 2);

        let base = {
            hp: baseHp, mp: 50, attack: 15, defense: 5,
            specialAttack: 15, specialDefense: 5, speed: 10, accuracy: 100, luck: 5
        };

        if (type === "Stronger") {
            base = {
                hp: baseHp, mp: 60, attack: 20, defense: 10,
                specialAttack: 20, specialDefense: 10, speed: 12, accuracy: 105, luck: 7
            };
        } else if (type === "Boss") {
            base = {
                hp: baseHp, mp: 200, attack: 30, defense: 15,
                specialAttack: 30, specialDefense: 15, speed: 15, accuracy: 110, luck: 10
            };
        }

        return {
            hp: Math.floor(base.hp * anteScaling * this.scalingFactor),
            mp: Math.floor(base.mp * anteScaling * this.scalingFactor),
            attack: Math.floor(base.attack * anteScaling * this.scalingFactor),
            defense: Math.floor(base.defense * anteScaling * this.scalingFactor),
            specialAttack: Math.floor(base.specialAttack * anteScaling * this.scalingFactor),
            specialDefense: Math.floor(base.specialDefense * anteScaling * this.scalingFactor),
            speed: Math.floor(base.speed * anteScaling * this.scalingFactor),
            accuracy: Math.floor(base.accuracy * anteScaling * this.scalingFactor),
            luck: Math.floor(base.luck * anteScaling * this.scalingFactor)
        };
    }

    /**
     * Get the current encounter
     */
    getCurrentEncounter() {
        return this.encounters[this.currentEncounterIndex];
    }

    /**
     * Mark current encounter as completed and advance to next
     * Returns true if there are more encounters, false if ante is complete
     */
    completeCurrentEncounter() {
        if (this.encounters[this.currentEncounterIndex]) {
            this.encounters[this.currentEncounterIndex].completed = true;
        }
        this.currentEncounterIndex++;
        return this.currentEncounterIndex < this.encounters.length;
    }

    /**
     * Check if all encounters in current ante are completed
     */
    isAnteComplete() {
        return this.currentEncounterIndex >= this.encounters.length;
    }

    /**
     * Set up enemies for battle from current encounter
     */
    setupEncounterForBattle() {
        const encounter = this.getCurrentEncounter();
        if (!encounter) return false;
        
        // Deep copy enemies from encounter
        // Use raw stats directly to avoid double-scaling
        this.enemies = encounter.enemies.map(e => {
            const copy = new BaseCharacter(e.name, e.role, {
                hp: e.rawHp ?? e.maxHp,
                mp: e.rawJuice ?? e.maxMp,
                attack: e.rawAttack ?? e.attack,
                defense: e.rawDefense ?? e.defense,
                specialAttack: e.rawSpAttack ?? e.spAttack,
                specialDefense: e.rawSpDefense ?? e.spDefense,
                speed: e.rawSpeed ?? e.speed,
                accuracy: e.rawHitRate ?? e.hitRate,
                luck: e.rawLuck ?? e.luck
            });
            copy.isBoss = e.isBoss;
            copy.types = [...e.types];
            copy.attribute = e.attribute;
            copy.level = e.level;
            copy.skills = [...e.skills];
            copy.activeSkills = [...e.activeSkills];
            copy.passiveSkills = [...e.passiveSkills];
            return copy;
        });
        
        // Update target score for this encounter
        this.scoringState.targetScore = encounter.targetScore;
        this.generateObjectives();
        
        return true;
    }
}

export const gameState = new GameState();
