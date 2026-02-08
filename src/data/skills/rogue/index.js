import { ROGUE_COMMON } from "./common.js";
import { ROGUE_UNCOMMON } from "./uncommon.js";
import { ROGUE_RARE } from "./rare.js";
import { ROGUE_EXOTIC } from "./exotic.js";
import { ROGUE_LEGENDARY } from "./legendary.js";
import { ROGUE_MYTHICAL } from "./mythical.js";

/**
 * ROGUE CLASS SKILLS
 * All rogue skills aggregated by rarity
 */

export const ROGUE_SKILLS = [
    ...ROGUE_COMMON,
    ...ROGUE_UNCOMMON,
    ...ROGUE_RARE,
    ...ROGUE_EXOTIC,
    ...ROGUE_LEGENDARY,
    ...ROGUE_MYTHICAL
];

// Export individual rarities for filtered access
export {
    ROGUE_COMMON,
    ROGUE_UNCOMMON,
    ROGUE_RARE,
    ROGUE_EXOTIC,
    ROGUE_LEGENDARY,
    ROGUE_MYTHICAL
};

// Skill counts by rarity
export const ROGUE_SKILL_COUNTS = {
    common: ROGUE_COMMON.length,
    uncommon: ROGUE_UNCOMMON.length,
    rare: ROGUE_RARE.length,
    exotic: ROGUE_EXOTIC.length,
    legendary: ROGUE_LEGENDARY.length,
    mythical: ROGUE_MYTHICAL.length,
    total: ROGUE_SKILLS.length
};
