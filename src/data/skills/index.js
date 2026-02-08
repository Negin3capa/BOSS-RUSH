// ============================================
// SKILLS MODULE - Main Entry Point
// ============================================
// Organized by Class and Rarity for easy management

// Core exports
export {
    RARITIES,
    RARITY_COLORS,
    RARITY_WEIGHTS,
    TARGETS,
    SKILL_TAGS,
    CATEGORIES,
    SKILL_TYPES,
    createSkill,
    createDamageSkill,
    createHealSkill,
    createBuffSkill,
    createDebuffSkill,
    createPassiveSkill,
    ATTRIBUTES
} from "./core.js";

// Hero skills
export {
    HERO_SKILLS,
    HERO_COMMON,
    HERO_UNCOMMON,
    HERO_RARE,
    HERO_EXOTIC,
    HERO_LEGENDARY,
    HERO_MYTHICAL,
    HERO_SKILL_COUNTS
} from "./hero/index.js";

// Tank skills
export {
    TANK_SKILLS,
    TANK_COMMON,
    TANK_UNCOMMON,
    TANK_RARE,
    TANK_EXOTIC,
    TANK_LEGENDARY,
    TANK_MYTHICAL,
    TANK_SKILL_COUNTS
} from "./tank/index.js";

// Mage skills
export {
    MAGE_SKILLS,
    MAGE_COMMON,
    MAGE_UNCOMMON,
    MAGE_RARE,
    MAGE_EXOTIC,
    MAGE_LEGENDARY,
    MAGE_MYTHICAL,
    MAGE_SKILL_COUNTS
} from "./mage/index.js";

// Rogue skills
export {
    ROGUE_SKILLS,
    ROGUE_COMMON,
    ROGUE_UNCOMMON,
    ROGUE_RARE,
    ROGUE_EXOTIC,
    ROGUE_LEGENDARY,
    ROGUE_MYTHICAL,
    ROGUE_SKILL_COUNTS
} from "./rogue/index.js";

// Import for aggregation
import { HERO_SKILLS } from "./hero/index.js";
import { TANK_SKILLS } from "./tank/index.js";
import { MAGE_SKILLS } from "./mage/index.js";
import { ROGUE_SKILLS } from "./rogue/index.js";
import { RARITY_WEIGHTS, RARITIES } from "./core.js";

// ============================================
// MASTER SKILL DATA
// ============================================
export const SKILL_DATA = [
    ...HERO_SKILLS,
    ...TANK_SKILLS,
    ...MAGE_SKILLS,
    ...ROGUE_SKILLS
];

// ============================================
// SKILL STATISTICS
// ============================================
export const SKILL_STATS = {
    total: SKILL_DATA.length,
    byClass: {
        Hero: HERO_SKILLS.length,
        Tank: TANK_SKILLS.length,
        Mage: MAGE_SKILLS.length,
        Rogue: ROGUE_SKILLS.length
    },
    byType: {
        Damage: SKILL_DATA.filter(s => s.type === "Damage").length,
        Heal: SKILL_DATA.filter(s => s.type === "Heal").length,
        Buff: SKILL_DATA.filter(s => s.type === "Buff").length,
        Debuff: SKILL_DATA.filter(s => s.type === "Debuff").length,
        Passive: SKILL_DATA.filter(s => s.type === "Passive").length
    },
    byTarget: {
        ONE_ENEMY: SKILL_DATA.filter(s => s.target === "ONE_ENEMY").length,
        ALL_ENEMIES: SKILL_DATA.filter(s => s.target === "ALL_ENEMIES").length,
        ONE_ALLY: SKILL_DATA.filter(s => s.target === "ONE_ALLY").length,
        ALL_ALLIES: SKILL_DATA.filter(s => s.target === "ALL_ALLIES").length,
        SELF: SKILL_DATA.filter(s => s.target === "SELF").length
    },
    byRarity: {
        Common: SKILL_DATA.filter(s => s.rarity === RARITIES.COMMON).length,
        Uncommon: SKILL_DATA.filter(s => s.rarity === RARITIES.UNCOMMON).length,
        Rare: SKILL_DATA.filter(s => s.rarity === RARITIES.RARE).length,
        Exotic: SKILL_DATA.filter(s => s.rarity === RARITIES.EXOTIC).length,
        Legendary: SKILL_DATA.filter(s => s.rarity === RARITIES.LEGENDARY).length,
        Mythical: SKILL_DATA.filter(s => s.rarity === RARITIES.MYTHICAL).length
    }
};

// ============================================
// SKILL LOOKUP HELPERS
// ============================================

/**
 * Get a skill by its ID
 */
export function getSkillById(id) {
    return SKILL_DATA.find(s => s.id === id) || null;
}

/**
 * Get a skill by its name
 */
export function getSkillByName(name) {
    return SKILL_DATA.find(s => s.name === name) || null;
}

/**
 * Get all skills for a specific class
 */
export function getSkillsByClass(className) {
    return SKILL_DATA.filter(s => s.className === className);
}

/**
 * Get all skills of a specific type
 */
export function getSkillsByType(type) {
    return SKILL_DATA.filter(s => s.type === type);
}

/**
 * Get all skills of a specific rarity
 */
export function getSkillsByRarity(rarity) {
    return SKILL_DATA.filter(s => s.rarity === rarity);
}

/**
 * Get all skills with a specific tag
 */
export function getSkillsByTag(tag) {
    return SKILL_DATA.filter(s => s.tags && s.tags.includes(tag));
}

/**
 * Get all skills that target a specific target type
 */
export function getSkillsByTarget(target) {
    return SKILL_DATA.filter(s => s.target === target);
}

/**
 * Get all active skills (non-passive)
 */
export function getActiveSkills(className = null) {
    let pool = SKILL_DATA.filter(s => s.type !== "Passive");
    if (className) {
        pool = pool.filter(s => s.className === className);
    }
    return pool;
}

/**
 * Get all passive skills
 */
export function getPassiveSkills(className = null) {
    let pool = SKILL_DATA.filter(s => s.type === "Passive");
    if (className) {
        pool = pool.filter(s => s.className === className);
    }
    return pool;
}

// ============================================
// WEIGHTED RANDOM SKILL SELECTION
// ============================================

/**
 * Get weighted random skills for a class
 * @param {string} className - Class name (Hero, Tank, Mage, Rogue) or "ANY"
 * @param {number} count - Number of skills to select
 * @param {number} luckFactor - Luck modifier (0-1)
 * @param {string} filterType - "ACTIVE", "Passive", or null for all
 * @returns {Array} Array of selected skills
 */
export function getWeightedRandomSkills(className, count = 4, luckFactor = 0, filterType = null) {
    let pool;
    if (className === "ANY") {
        pool = SKILL_DATA;
    } else {
        pool = SKILL_DATA.filter(s => s.className === className);
    }

    if (filterType) {
        if (filterType === "ACTIVE") {
            pool = pool.filter(s => s.type !== "Passive");
        } else {
            pool = pool.filter(s => s.type === filterType);
        }
    }

    if (pool.length === 0) return [];

    const selected = [];
    const poolCopy = [...pool];

    for (let i = 0; i < count; i++) {
        if (poolCopy.length === 0) break;

        // Calculate weights with luck factor
        const weightedPool = poolCopy.map(skill => {
            let weight = RARITY_WEIGHTS[skill.rarity] || 1;
            if (luckFactor > 0) {
                const rarityIndex = Object.values(RARITIES).indexOf(skill.rarity);
                weight *= (1 + (rarityIndex * 0.5 * luckFactor));
            }
            return { skill, weight };
        });

        const totalWeight = weightedPool.reduce((acc, item) => acc + item.weight, 0);
        let random = Math.random() * totalWeight;

        for (let j = 0; j < weightedPool.length; j++) {
            random -= weightedPool[j].weight;
            if (random <= 0) {
                const picked = weightedPool[j].skill;
                selected.push(picked);
                const idx = poolCopy.indexOf(picked);
                poolCopy.splice(idx, 1);
                break;
            }
        }
    }

    return selected;
}

/**
 * Get random skills without weighting
 */
export function getRandomSkills(className, count = 4) {
    return getWeightedRandomSkills(className, count, 0);
}

// ============================================
// SKILL VALIDATION
// ============================================

/**
 * Validate skill data integrity
 * Returns array of issues found
 */
export function validateSkills() {
    const issues = [];
    const ids = new Set();
    const names = new Set();

    for (const skill of SKILL_DATA) {
        // Check for duplicate IDs
        if (ids.has(skill.id)) {
            issues.push(`Duplicate ID: ${skill.id}`);
        } else {
            ids.add(skill.id);
        }

        // Check for duplicate names
        if (names.has(skill.name)) {
            issues.push(`Duplicate name: ${skill.name}`);
        } else {
            names.add(skill.name);
        }

        // Check required fields
        if (!skill.id) issues.push("Skill missing ID");
        if (!skill.name) issues.push("Skill missing name");
        if (!skill.className) issues.push(`${skill.id} missing className`);
        if (!skill.type) issues.push(`${skill.id} missing type`);
        if (!skill.attribute) issues.push(`${skill.id} missing attribute`);
        if (!skill.target) issues.push(`${skill.id} missing target`);
    }

    return issues;
}

// Validate on load (in development)
if (typeof window !== "undefined" && window.location?.hostname === "localhost") {
    const issues = validateSkills();
    if (issues.length > 0) {
        console.warn("Skill validation issues:", issues);
    } else {
        console.log(`✓ ${SKILL_DATA.length} skills loaded successfully`);
    }
}
