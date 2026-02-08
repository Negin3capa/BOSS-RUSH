import { RARITIES, TARGETS, createDamageSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * ROGUE - LEGENDARY SKILLS
 * Ultimate assassination techniques
 */

export const ROGUE_LEGENDARY = [
    // Multi-hit shadow attack
    createDamageSkill({
        id: "r_leg_1",
        name: "Shadow Clone",
        className: "Rogue",
        attribute: ATTRIBUTES.GHOST,
        mpCost: 60,
        power: 40,
        target: TARGETS.ONE_ENEMY,
        description: "Many shadows strike.",
        rarity: RARITIES.LEGENDARY,
        category: "Physical",
        isSpeedScaling: true,
        multiHit: 5
    })
];
