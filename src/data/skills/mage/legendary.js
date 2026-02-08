import { RARITIES, TARGETS, createDamageSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * MAGE - LEGENDARY SKILLS
 * Ultimate destructive magic
 */

export const MAGE_LEGENDARY = [
    // Ultimate AOE judgment
    createDamageSkill({
        id: "m_leg_1",
        name: "Grand Cross",
        className: "Mage",
        attribute: ATTRIBUTES.LIGHT,
        mpCost: 60,
        power: 110,
        target: TARGETS.ALL_ENEMIES,
        description: "Celestial judgment.",
        rarity: RARITIES.LEGENDARY,
        category: "Special"
    })
];
