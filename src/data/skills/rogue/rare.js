import { RARITIES, TARGETS, createDamageSkill, createBuffSkill, createPassiveSkill, createSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * ROGUE - RARE SKILLS
 * Advanced attacks and single-target support
 */

export const ROGUE_RARE = [
    // Poisonous strike
    createDamageSkill({
        id: "r2",
        name: "Nightshade",
        className: "Rogue",
        attribute: ATTRIBUTES.POISON,
        mpCost: 15,
        power: 50,
        target: TARGETS.ONE_ENEMY,
        description: "Poisonous strike.",
        rarity: RARITIES.RARE,
        category: "Physical"
    }),

    // Shadow strike
    createDamageSkill({
        id: "r4",
        name: "Shadow Strike",
        className: "Rogue",
        attribute: ATTRIBUTES.DARK,
        mpCost: 18,
        power: 40,
        target: TARGETS.ONE_ENEMY,
        description: "Strike from shadows.",
        rarity: RARITIES.RARE,
        category: "Physical"
    }),

    // Multi-hit attack
    createDamageSkill({
        id: "r3_2",
        name: "Triple Threat",
        className: "Rogue",
        attribute: ATTRIBUTES.NORMAL,
        mpCost: 20,
        power: 25,
        target: TARGETS.ONE_ENEMY,
        description: "Three quick hits.",
        rarity: RARITIES.RARE,
        category: "Physical",
        isSpeedScaling: true,
        multiHit: 3
    }),

    // NEW: Inspire - single-target crit chance boost
    createSkill({
        id: "r4_2",
        name: "Inspire",
        className: "Rogue",
        type: "Buff",
        attribute: ATTRIBUTES.LIGHT,
        mpCost: 18,
        power: 0,
        target: TARGETS.ONE_ALLY,
        description: "Boost one ally's critical hit chance.",
        rarity: RARITIES.RARE,
        category: "Special",
        effect: { stat: "luck", amount: 1.4 }
    }),

    // Passives
    createPassiveSkill({
        id: "p4",
        name: "Keen Eye",
        className: "Rogue",
        attribute: ATTRIBUTES.DARK,
        stat: "speed",
        amount: 1.1,
        description: "Increases Speed by 10%.",
        rarity: RARITIES.RARE
    }),

    createPassiveSkill({
        id: "p7",
        name: "Hidden Blade",
        className: "Rogue",
        attribute: ATTRIBUTES.NORMAL,
        stat: "attack",
        amount: 1.1,
        description: "Increases Attack by 10%.",
        rarity: RARITIES.RARE
    })
];
