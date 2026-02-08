import { RARITIES, TARGETS, createDamageSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * MAGE - MYTHICAL SKILLS
 * The ultimate destruction
 */

export const MAGE_MYTHICAL = [
    // Ultimate destruction
    createDamageSkill({
        id: "m_myth_1",
        name: "Big Bang",
        className: "Mage",
        attribute: ATTRIBUTES.ALMIGHTY,
        mpCost: 120,
        power: 200,
        target: TARGETS.ALL_ENEMIES,
        description: "Beginning of everything.",
        rarity: RARITIES.MYTHICAL,
        category: "Special"
    })
];
