import { RARITIES, TARGETS, createBuffSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * TANK - MYTHICAL SKILLS
 * The ultimate defensive technique
 */

export const TANK_MYTHICAL = [
    // Ultimate party defense (Mythical tier - keeps ALL_ALLIES)
    createBuffSkill({
        id: "t_myth_1",
        name: "God's Fortress",
        className: "Tank",
        attribute: ATTRIBUTES.ALMIGHTY,
        mpCost: 80,
        target: TARGETS.ALL_ALLIES,
        stat: "allDefense",
        amount: 3.0,
        description: "Unyielding defense for all allies.",
        rarity: RARITIES.MYTHICAL
    })
];
