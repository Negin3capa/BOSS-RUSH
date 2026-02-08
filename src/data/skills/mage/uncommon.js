import { RARITIES, TARGETS, createDamageSkill, createBuffSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * MAGE - UNCOMMON SKILLS
 * Starting skill for Sabrina and intermediate spells
 */

export const MAGE_UNCOMMON = [
    // Starting skill for Sabrina - REBALANCED: Pixie Dust now ONE_ALLY
    createBuffSkill({
        id: "m_start_1",
        name: "Pixie Dust",
        className: "Mage",
        attribute: ATTRIBUTES.FAIRY,
        mpCost: 12,
        target: TARGETS.ONE_ALLY,
        stat: "speed",
        amount: 1.25,
        description: "Raises one ally's speed with magical dust.",
        rarity: RARITIES.UNCOMMON,
        tags: ["starting"]
    }),

    // Intermediate single-target spells
    createDamageSkill({
        id: "m3",
        name: "Thunder",
        className: "Mage",
        attribute: ATTRIBUTES.ELECTRIC,
        mpCost: 12,
        power: 45,
        target: TARGETS.ONE_ENEMY,
        description: "Lightning strike.",
        rarity: RARITIES.UNCOMMON,
        category: "Special"
    }),

    createDamageSkill({
        id: "m4",
        name: "Dark Orb",
        className: "Mage",
        attribute: ATTRIBUTES.DARK,
        mpCost: 15,
        power: 50,
        target: TARGETS.ONE_ENEMY,
        description: "Dark magic.",
        rarity: RARITIES.UNCOMMON,
        category: "Special"
    }),

    createDamageSkill({
        id: "m2_3",
        name: "Hydro Pump",
        className: "Mage",
        attribute: ATTRIBUTES.WATER,
        mpCost: 15,
        power: 55,
        target: TARGETS.ONE_ENEMY,
        description: "Fast water jet.",
        rarity: RARITIES.UNCOMMON,
        category: "Special"
    }),

    // AOE poison
    createDamageSkill({
        id: "m2_4",
        name: "Poison Fog",
        className: "Mage",
        attribute: ATTRIBUTES.POISON,
        mpCost: 12,
        power: 20,
        target: TARGETS.ALL_ENEMIES,
        description: "Poisonous mist.",
        rarity: RARITIES.UNCOMMON,
        category: "Special"
    })
];
