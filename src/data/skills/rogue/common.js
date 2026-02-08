import { RARITIES, TARGETS, createDamageSkill, createBuffSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * ROGUE - COMMON SKILLS
 * Quick strikes and basic tricks
 */

export const ROGUE_COMMON = [
    // Speed-scaling attacks
    createDamageSkill({
        id: "r1",
        name: "Quick Stab",
        className: "Rogue",
        attribute: ATTRIBUTES.NORMAL,
        mpCost: 5,
        power: 20,
        target: TARGETS.ONE_ENEMY,
        description: "Very fast poke.",
        rarity: RARITIES.COMMON,
        category: "Physical",
        isSpeedScaling: true
    }),

    createDamageSkill({
        id: "r1_2",
        name: "Snatch",
        className: "Rogue",
        attribute: ATTRIBUTES.NORMAL,
        mpCost: 6,
        power: 18,
        target: TARGETS.ONE_ENEMY,
        description: "Steal opportunity.",
        rarity: RARITIES.COMMON,
        category: "Physical",
        isSpeedScaling: true
    }),

    // Luck buff
    createBuffSkill({
        id: "r1_3",
        name: "Feint",
        className: "Rogue",
        attribute: ATTRIBUTES.NORMAL,
        mpCost: 10,
        target: TARGETS.SELF,
        stat: "luck",
        amount: 1.3,
        description: "Raise Luck.",
        rarity: RARITIES.COMMON,
        tags: ["speed-scaling"]
    })
];
