import { HERO_COMMON } from "./common.js";
import { HERO_UNCOMMON } from "./uncommon.js";
import { HERO_RARE } from "./rare.js";
import { HERO_EXOTIC } from "./exotic.js";
import { HERO_LEGENDARY } from "./legendary.js";
import { HERO_MYTHICAL } from "./mythical.js";

/**
 * HERO CLASS SKILLS
 * All hero skills aggregated by rarity
 */

export const HERO_SKILLS = [
    ...HERO_COMMON,
    ...HERO_UNCOMMON,
    ...HERO_RARE,
    ...HERO_EXOTIC,
    ...HERO_LEGENDARY,
    ...HERO_MYTHICAL
];

// Export individual rarities for filtered access
export {
    HERO_COMMON,
    HERO_UNCOMMON,
    HERO_RARE,
    HERO_EXOTIC,
    HERO_LEGENDARY,
    HERO_MYTHICAL
};

// Skill counts by rarity
export const HERO_SKILL_COUNTS = {
    common: HERO_COMMON.length,
    uncommon: HERO_UNCOMMON.length,
    rare: HERO_RARE.length,
    exotic: HERO_EXOTIC.length,
    legendary: HERO_LEGENDARY.length,
    mythical: HERO_MYTHICAL.length,
    total: HERO_SKILLS.length
};
