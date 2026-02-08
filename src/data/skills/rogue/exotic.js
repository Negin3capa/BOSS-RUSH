import { RARITIES, TARGETS, createDamageSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * ROGUE - EXOTIC SKILLS
 * Devastating single-target attacks
 */

export const ROGUE_EXOTIC = [
    // Deep wound
    createDamageSkill({
        id: "r5",
        name: "Eviscerate",
        className: "Rogue",
        attribute: ATTRIBUTES.NORMAL,
        mpCost: 25,
        power: 60,
        target: TARGETS.ONE_ENEMY,
        description: "Deep wound.",
        rarity: RARITIES.EXOTIC,
        category: "Physical"
    }),

    // Silent death (speed scaling)
    createDamageSkill({
        id: "r_exo_1",
        name: "Assassinate",
        className: "Rogue",
        attribute: ATTRIBUTES.DARK,
        mpCost: 40,
        power: 100,
        target: TARGETS.ONE_ENEMY,
        description: "Silent death.",
        rarity: RARITIES.EXOTIC,
        category: "Physical",
        isSpeedScaling: true
    })
];
