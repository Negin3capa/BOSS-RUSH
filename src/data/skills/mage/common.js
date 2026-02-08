import { RARITIES, TARGETS, createDamageSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * MAGE - COMMON SKILLS
 * Basic elemental spells
 */

export const MAGE_COMMON = [
    // Single-target spells
    createDamageSkill({
        id: "m1",
        name: "Fireball",
        className: "Mage",
        attribute: ATTRIBUTES.FIRE,
        mpCost: 10,
        power: 40,
        target: TARGETS.ONE_ENEMY,
        description: "Classic fire spell.",
        rarity: RARITIES.COMMON,
        category: "Special"
    }),

    createDamageSkill({
        id: "m2",
        name: "Ice Bolt",
        className: "Mage",
        attribute: ATTRIBUTES.ICE,
        mpCost: 10,
        power: 40,
        target: TARGETS.ONE_ENEMY,
        description: "Freezing projectile.",
        rarity: RARITIES.COMMON,
        category: "Special"
    }),

    createDamageSkill({
        id: "m1_3",
        name: "Splash",
        className: "Mage",
        attribute: ATTRIBUTES.WATER,
        mpCost: 10,
        power: 40,
        target: TARGETS.ONE_ENEMY,
        description: "Small wave of water.",
        rarity: RARITIES.COMMON,
        category: "Special"
    }),

    // AOE spell
    createDamageSkill({
        id: "m1_4",
        name: "Ember",
        className: "Mage",
        attribute: ATTRIBUTES.FIRE,
        mpCost: 8,
        power: 30,
        target: TARGETS.ALL_ENEMIES,
        description: "Small sparks.",
        rarity: RARITIES.COMMON,
        category: "Special"
    })
];
