import { RARITIES, TARGETS, createDamageSkill, createBuffSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * TANK - COMMON SKILLS
 * Basic defensive abilities and attacks
 */

export const TANK_COMMON = [
    // Basic attacks
    createDamageSkill({
        id: "t1",
        name: "Bash",
        className: "Tank",
        attribute: ATTRIBUTES.ROCK,
        mpCost: 5,
        power: 20,
        target: TARGETS.ONE_ENEMY,
        description: "Simple blunt hit.",
        rarity: RARITIES.COMMON,
        category: "Physical"
    }),

    // Self buffs
    createBuffSkill({
        id: "t1_2",
        name: "Guard",
        className: "Tank",
        attribute: ATTRIBUTES.STEEL,
        mpCost: 5,
        target: TARGETS.SELF,
        stat: "defense",
        amount: 1.2,
        description: "Minor Defense boost.",
        rarity: RARITIES.COMMON
    }),

    createBuffSkill({
        id: "t1_3",
        name: "Taunt",
        className: "Tank",
        attribute: ATTRIBUTES.NORMAL,
        mpCost: 5,
        target: TARGETS.SELF,
        stat: "aggro",
        amount: 2.0,
        description: "Draw attention.",
        rarity: RARITIES.COMMON
    }),

    createBuffSkill({
        id: "t1_4",
        name: "Body Block",
        className: "Tank",
        attribute: ATTRIBUTES.STEEL,
        mpCost: 5,
        target: TARGETS.SELF,
        stat: "damageReduction",
        amount: 0.8,
        description: "Incoming dmg reduction.",
        rarity: RARITIES.COMMON
    })
];
