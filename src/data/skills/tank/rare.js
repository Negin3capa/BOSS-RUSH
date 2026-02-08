import { RARITIES, TARGETS, createDamageSkill, createBuffSkill, createPassiveSkill, createHealSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * TANK - RARE SKILLS
 * Advanced defense and party protection (rebalanced to ONE_ALLY)
 */

export const TANK_RARE = [
    // Strong self defense
    createBuffSkill({
        id: "t3",
        name: "Stone Skin",
        className: "Tank",
        attribute: ATTRIBUTES.ROCK,
        mpCost: 15,
        target: TARGETS.SELF,
        stat: "defense",
        amount: 1.5,
        description: "Greatly increases Defense.",
        rarity: RARITIES.RARE
    }),

    // REBALANCED: Fortify now targets ONE_ALLY instead of ALL_ALLIES
    createBuffSkill({
        id: "t5",
        name: "Fortify",
        className: "Tank",
        attribute: ATTRIBUTES.STEEL,
        mpCost: 20,
        target: TARGETS.ONE_ALLY,
        stat: "defense",
        amount: 1.3,
        description: "Raises one ally's Defense.",
        rarity: RARITIES.RARE
    }),

    // REBALANCED: Mountain Wall now targets ONE_ALLY instead of ALL_ALLIES
    createBuffSkill({
        id: "t3_2",
        name: "Mountain Wall",
        className: "Tank",
        attribute: ATTRIBUTES.ROCK,
        mpCost: 25,
        target: TARGETS.ONE_ALLY,
        stat: "damageReduction",
        amount: 0.5,
        description: "Grants immunity to minor hits to one ally.",
        rarity: RARITIES.RARE
    }),

    // NEW: First Aid - single-target heal + small defense buff
    createHealSkill({
        id: "t5_2",
        name: "First Aid",
        className: "Tank",
        mpCost: 15,
        power: 25,
        target: TARGETS.ONE_ALLY,
        description: "Heal an ally and slightly boost their defense.",
        rarity: RARITIES.RARE,
        effect: { stat: "defense", amount: 1.1 }
    }),

    // Passives
    createPassiveSkill({
        id: "p2",
        name: "Iron Wall",
        className: "Tank",
        attribute: ATTRIBUTES.STEEL,
        stat: "defense",
        amount: 1.1,
        description: "Increases Defense by 10%.",
        rarity: RARITIES.RARE
    }),

    createPassiveSkill({
        id: "p5",
        name: "Sturdy",
        className: "Tank",
        attribute: ATTRIBUTES.ROCK,
        stat: "hp",
        amount: 1.1,
        description: "Increases HP by 10%.",
        rarity: RARITIES.RARE
    })
];
