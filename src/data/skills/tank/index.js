import { TANK_COMMON } from "./common.js";
import { TANK_UNCOMMON } from "./uncommon.js";
import { TANK_RARE } from "./rare.js";
import { TANK_EXOTIC } from "./exotic.js";
import { TANK_LEGENDARY } from "./legendary.js";
import { TANK_MYTHICAL } from "./mythical.js";

/**
 * TANK CLASS SKILLS
 * All tank skills aggregated by rarity
 */

export const TANK_SKILLS = [
    ...TANK_COMMON,
    ...TANK_UNCOMMON,
    ...TANK_RARE,
    ...TANK_EXOTIC,
    ...TANK_LEGENDARY,
    ...TANK_MYTHICAL
];

// Export individual rarities for filtered access
export {
    TANK_COMMON,
    TANK_UNCOMMON,
    TANK_RARE,
    TANK_EXOTIC,
    TANK_LEGENDARY,
    TANK_MYTHICAL
};

// Skill counts by rarity
export const TANK_SKILL_COUNTS = {
    common: TANK_COMMON.length,
    uncommon: TANK_UNCOMMON.length,
    rare: TANK_RARE.length,
    exotic: TANK_EXOTIC.length,
    legendary: TANK_LEGENDARY.length,
    mythical: TANK_MYTHICAL.length,
    total: TANK_SKILLS.length
};
