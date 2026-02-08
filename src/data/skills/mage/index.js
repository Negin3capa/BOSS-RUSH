import { MAGE_COMMON } from "./common.js";
import { MAGE_UNCOMMON } from "./uncommon.js";
import { MAGE_RARE } from "./rare.js";
import { MAGE_EXOTIC } from "./exotic.js";
import { MAGE_LEGENDARY } from "./legendary.js";
import { MAGE_MYTHICAL } from "./mythical.js";

/**
 * MAGE CLASS SKILLS
 * All mage skills aggregated by rarity
 */

export const MAGE_SKILLS = [
    ...MAGE_COMMON,
    ...MAGE_UNCOMMON,
    ...MAGE_RARE,
    ...MAGE_EXOTIC,
    ...MAGE_LEGENDARY,
    ...MAGE_MYTHICAL
];

// Export individual rarities for filtered access
export {
    MAGE_COMMON,
    MAGE_UNCOMMON,
    MAGE_RARE,
    MAGE_EXOTIC,
    MAGE_LEGENDARY,
    MAGE_MYTHICAL
};

// Skill counts by rarity
export const MAGE_SKILL_COUNTS = {
    common: MAGE_COMMON.length,
    uncommon: MAGE_UNCOMMON.length,
    rare: MAGE_RARE.length,
    exotic: MAGE_EXOTIC.length,
    legendary: MAGE_LEGENDARY.length,
    mythical: MAGE_MYTHICAL.length,
    total: MAGE_SKILLS.length
};
