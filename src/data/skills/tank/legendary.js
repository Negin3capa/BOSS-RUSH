import { RARITIES, TARGETS, createBuffSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * TANK - LEGENDARY SKILLS
 * Ultimate party protection (keeps ALL_ALLIES for Legendary tier)
 */

export const TANK_LEGENDARY = [
    // ALL_ALLIES buff (Legendary tier - keeps AOE for high rarity)
    createBuffSkill({
        id: "t_leg_1",
        name: "World Shield",
        className: "Tank",
        attribute: ATTRIBUTES.STAR,
        mpCost: 50,
        target: TARGETS.ALL_ALLIES,
        stat: "defense",
        amount: 2.5,
        description: "Ultimate protection for all allies.",
        rarity: RARITIES.LEGENDARY
    })
];
