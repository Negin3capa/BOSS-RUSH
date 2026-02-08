import { RARITIES, TARGETS, createDamageSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * MAGE - EXOTIC SKILLS
 * Powerful advanced magic
 */

export const MAGE_EXOTIC = [
    // Devastating AOE
    createDamageSkill({
        id: "m_exo_1",
        name: "Meteor",
        className: "Mage",
        attribute: ATTRIBUTES.FIRE,
        mpCost: 40,
        power: 75,
        target: TARGETS.ALL_ENEMIES,
        description: "Space rock impact.",
        rarity: RARITIES.EXOTIC,
        category: "Special"
    }),

    // Powerful single-target
    createDamageSkill({
        id: "m_exo_2",
        name: "Black Hole",
        className: "Mage",
        attribute: ATTRIBUTES.DARK,
        mpCost: 45,
        power: 80,
        target: TARGETS.ONE_ENEMY,
        description: "Gravitational crush.",
        rarity: RARITIES.EXOTIC,
        category: "Special"
    })
];
