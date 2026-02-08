import { RARITIES, TARGETS, createDamageSkill, createHealSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * HERO - COMMON SKILLS
 * Basic sword attacks and fundamental abilities
 */

export const HERO_COMMON = [
    // Basic sword attacks
    createDamageSkill({
        id: "h1",
        name: "Slash",
        className: "Hero",
        attribute: ATTRIBUTES.NORMAL,
        mpCost: 5,
        power: 25,
        target: TARGETS.ONE_ENEMY,
        description: "A standard sword slash.",
        rarity: RARITIES.COMMON,
        category: "Physical"
    }),

    createDamageSkill({
        id: "h1_2",
        name: "Side Slice",
        className: "Hero",
        attribute: ATTRIBUTES.NORMAL,
        mpCost: 7,
        power: 28,
        target: TARGETS.ONE_ENEMY,
        description: "A quick horizontal cut.",
        rarity: RARITIES.COMMON,
        category: "Physical"
    }),

    createDamageSkill({
        id: "h1_3",
        name: "Pommel Strike",
        className: "Hero",
        attribute: ATTRIBUTES.NORMAL,
        mpCost: 4,
        power: 15,
        target: TARGETS.ONE_ENEMY,
        description: "Stuns with the sword hilt.",
        rarity: RARITIES.COMMON,
        category: "Physical"
    }),

    createDamageSkill({
        id: "h1_4",
        name: "Thrust",
        className: "Hero",
        attribute: ATTRIBUTES.NORMAL,
        mpCost: 6,
        power: 30,
        target: TARGETS.ONE_ENEMY,
        description: "A focused forward thrust.",
        rarity: RARITIES.COMMON,
        category: "Physical"
    }),

    // Single-target heal (rebalanced from all allies)
    createHealSkill({
        id: "h5",
        name: "Heal",
        className: "Hero",
        mpCost: 10,
        power: 30,
        target: TARGETS.ONE_ALLY,
        description: "Restores minor HP to one ally.",
        rarity: RARITIES.COMMON
    }),

    // New: Mend - alternative single-target heal
    createHealSkill({
        id: "h5_2",
        name: "Mend",
        className: "Hero",
        mpCost: 6,
        power: 20,
        target: TARGETS.ONE_ALLY,
        description: "Quickly patch up an ally's wounds.",
        rarity: RARITIES.COMMON
    })
];
