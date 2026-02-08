import { RARITIES, TARGETS, createDamageSkill, createBuffSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * TANK - EXOTIC SKILLS
 * Powerful defensive and offensive capabilities
 */

export const TANK_EXOTIC = [
    // AOE damage
    createDamageSkill({
        id: "t4",
        name: "Earthquake",
        className: "Tank",
        attribute: ATTRIBUTES.GROUND,
        mpCost: 25,
        power: 40,
        target: TARGETS.ALL_ENEMIES,
        description: "Shakes the ground.",
        rarity: RARITIES.EXOTIC,
        category: "Physical"
    }),

    // Ultimate self defense
    createBuffSkill({
        id: "t4_2",
        name: "Diamond Coating",
        className: "Tank",
        attribute: ATTRIBUTES.ROCK,
        mpCost: 35,
        target: TARGETS.SELF,
        stat: "defense",
        amount: 2.0,
        description: "Near Invincibility.",
        rarity: RARITIES.EXOTIC
    })
];
