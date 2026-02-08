import { ATTRIBUTES } from "../../constants.js";

// ============================================
// RARITY DEFINITIONS
// ============================================
export const RARITIES = {
    COMMON: "Common",
    UNCOMMON: "Uncommon",
    RARE: "Rare",
    EXOTIC: "Exotic",
    LEGENDARY: "Legendary",
    MYTHICAL: "Mythical"
};

export const RARITY_COLORS = {
    [RARITIES.COMMON]: [200, 200, 200],   // Grey/White
    [RARITIES.UNCOMMON]: [80, 200, 80],   // Green
    [RARITIES.RARE]: [80, 150, 255],     // Blue
    [RARITIES.EXOTIC]: [180, 80, 255],   // Purple
    [RARITIES.LEGENDARY]: [255, 180, 50], // Orange/Gold
    [RARITIES.MYTHICAL]: [255, 50, 50],   // Red
};

export const RARITY_WEIGHTS = {
    [RARITIES.COMMON]: 60,
    [RARITIES.UNCOMMON]: 25,
    [RARITIES.RARE]: 10,
    [RARITIES.EXOTIC]: 4,
    [RARITIES.LEGENDARY]: 1,
    [RARITIES.MYTHICAL]: 0.1
};

// ============================================
// TARGET DEFINITIONS
// ============================================
export const TARGETS = {
    ONE_ENEMY: "ONE_ENEMY",
    ALL_ENEMIES: "ALL_ENEMIES",
    ONE_ALLY: "ONE_ALLY",
    ALL_ALLIES: "ALL_ALLIES",
    SELF: "SELF"
};

// ============================================
// SKILL TAGS FOR CATEGORIZATION
// ============================================
export const SKILL_TAGS = {
    MULTI_HIT: "multi-hit",
    PRIORITY: "priority",
    STACKING: "stacking",
    CLEANSING: "cleansing",
    LIFESTEAL: "lifesteal",
    PIERCING: "piercing",
    STARTING: "starting",      // Character starting skills
    PASSIVE: "passive"
};

// ============================================
// SKILL CATEGORIES
// ============================================
export const CATEGORIES = {
    PHYSICAL: "Physical",
    SPECIAL: "Special"
};

// ============================================
// SKILL TYPES
// ============================================
export const SKILL_TYPES = {
    DAMAGE: "Damage",
    HEAL: "Heal",
    BUFF: "Buff",
    DEBUFF: "Debuff",
    PASSIVE: "Passive"
};

// ============================================
// ENHANCED SKILL CREATION HELPER
// ============================================
/**
 * Creates a skill object with all metadata for easy identification and filtering
 * 
 * @param {Object} config - Skill configuration
 * @param {string} config.id - Unique skill ID
 * @param {string} config.name - Display name
 * @param {string} config.className - Class restriction (Hero, Tank, Mage, Rogue)
 * @param {string} config.type - Skill type (Damage, Heal, Buff, Debuff, Passive)
 * @param {string} config.attribute - Elemental attribute from ATTRIBUTES
 * @param {number} config.mpCost - MP/Juice cost to use
 * @param {number} config.power - Base power/damage/heal amount
 * @param {string} config.target - Target type from TARGETS
 * @param {string} config.description - Skill description
 * @param {string} config.rarity - Rarity from RARITIES
 * @param {Object} config.effect - Additional effect data (stat buffs, multi-hit count, etc.)
 * @param {boolean} config.isSpeedScaling - Whether damage scales with speed
 * @param {string} config.category - Physical or Special damage category
 * @param {string[]} config.tags - Array of SKILL_TAGS for filtering
 * @param {number} config.levelReq - Minimum level required to use
 * @param {number} config.cooldown - Turn cooldown (0 = no cooldown)
 * @param {number} config.priority - Priority value for turn order (higher = faster)
 * 
 * @returns {Object} Complete skill object
 */
export function createSkill({
    id,
    name,
    className,
    type,
    attribute,
    mpCost,
    power,
    target,
    description,
    rarity = RARITIES.COMMON,
    effect = null,
    isSpeedScaling = false,
    category = CATEGORIES.PHYSICAL,
    tags = [],
    levelReq = 1,
    cooldown = 0,
    priority = 0
}) {
    // Validate required fields
    if (!id || !name || !className || !type || !attribute || target === undefined) {
        console.warn(`Skill ${id || name || 'unknown'} is missing required fields`);
    }

    // Auto-add tags based on skill properties
    const autoTags = [...tags];
    if (effect?.multi && effect.multi > 1) {
        if (!autoTags.includes(SKILL_TAGS.MULTI_HIT)) {
            autoTags.push(SKILL_TAGS.MULTI_HIT);
        }
    }
    if (type === SKILL_TYPES.PASSIVE && !autoTags.includes(SKILL_TAGS.PASSIVE)) {
        autoTags.push(SKILL_TAGS.PASSIVE);
    }
    if (priority > 0 && !autoTags.includes(SKILL_TAGS.PRIORITY)) {
        autoTags.push(SKILL_TAGS.PRIORITY);
    }

    return {
        // Core identification
        id,
        name,
        className,
        
        // Combat properties
        type,
        attribute,
        mpCost,
        power,
        target,
        category,
        
        // Metadata
        description,
        rarity,
        effect,
        isSpeedScaling,
        
        // Extended metadata
        tags: autoTags,
        levelReq,
        cooldown,
        priority,
        
        // Utility getters for quick filtering
        get isMultiHit() { return autoTags.includes(SKILL_TAGS.MULTI_HIT); },
        get isPriority() { return autoTags.includes(SKILL_TAGS.PRIORITY); },
        get isPassive() { return type === SKILL_TYPES.PASSIVE; },
        get isDamage() { return type === SKILL_TYPES.DAMAGE; },
        get isHeal() { return type === SKILL_TYPES.HEAL; },
        get isBuff() { return type === SKILL_TYPES.BUFF; },
        get isDebuff() { return type === SKILL_TYPES.DEBUFF; },
        get targetsEnemies() { return target === TARGETS.ONE_ENEMY || target === TARGETS.ALL_ENEMIES; },
        get targetsAllies() { return target === TARGETS.ONE_ALLY || target === TARGETS.ALL_ALLIES; },
        get targetsSelf() { return target === TARGETS.SELF; }
    };
}

// ============================================
// QUICK SKILL FACTORIES FOR COMMON PATTERNS
// ============================================

/**
 * Creates a damage skill with standard properties
 */
export function createDamageSkill({
    id, name, className, attribute, mpCost, power, target = TARGETS.ONE_ENEMY,
    description, rarity = RARITIES.COMMON, isSpeedScaling = false,
    category = CATEGORIES.PHYSICAL, tags = [], levelReq = 1, priority = 0,
    multiHit = 1, effect = null
}) {
    const damageEffect = multiHit > 1 ? { ...(effect || {}), multi: multiHit } : effect;
    const damageTags = multiHit > 1 ? [...tags, SKILL_TAGS.MULTI_HIT] : tags;
    
    return createSkill({
        id, name, className, type: SKILL_TYPES.DAMAGE, attribute,
        mpCost, power, target, description, rarity,
        effect: damageEffect, isSpeedScaling, category,
        tags: damageTags, levelReq, priority
    });
}

/**
 * Creates a healing skill
 */
export function createHealSkill({
    id, name, className, mpCost, power, target = TARGETS.ONE_ALLY,
    description, rarity = RARITIES.COMMON, tags = [], levelReq = 1
}) {
    return createSkill({
        id, name, className, type: SKILL_TYPES.HEAL, attribute: ATTRIBUTES.HEALING,
        mpCost, power, target, description, rarity,
        category: CATEGORIES.SPECIAL, tags, levelReq
    });
}

/**
 * Creates a buff skill
 */
export function createBuffSkill({
    id, name, className, attribute = ATTRIBUTES.ALMIGHTY, mpCost,
    target = TARGETS.SELF, stat, amount, description, rarity = RARITIES.COMMON,
    tags = [], levelReq = 1
}) {
    return createSkill({
        id, name, className, type: SKILL_TYPES.BUFF, attribute,
        mpCost, power: 0, target, description, rarity,
        effect: { stat, amount }, category: CATEGORIES.SPECIAL, tags, levelReq
    });
}

/**
 * Creates a debuff skill
 */
export function createDebuffSkill({
    id, name, className, attribute, mpCost,
    target = TARGETS.ONE_ENEMY, stat, amount, description, rarity = RARITIES.COMMON,
    tags = [], levelReq = 1
}) {
    return createSkill({
        id, name, className, type: SKILL_TYPES.DEBUFF, attribute,
        mpCost, power: 0, target, description, rarity,
        effect: { stat, amount }, category: CATEGORIES.SPECIAL, tags, levelReq
    });
}

/**
 * Creates a passive skill
 */
export function createPassiveSkill({
    id, name, className, attribute = ATTRIBUTES.NORMAL, stat, amount,
    description, rarity = RARITIES.RARE, tags = [], levelReq = 1
}) {
    return createSkill({
        id, name, className, type: SKILL_TYPES.PASSIVE, attribute,
        mpCost: 0, power: 0, target: TARGETS.SELF, description, rarity,
        effect: { stat, amount }, category: CATEGORIES.SPECIAL,
        tags: [...tags, SKILL_TAGS.PASSIVE], levelReq
    });
}

// Re-export ATTRIBUTES for convenience
export { ATTRIBUTES };
