import { RARITIES, TARGETS, createDamageSkill, createBuffSkill, createPassiveSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * HERO - RARE SKILLS
 * Single-target buffs and advanced techniques
 */

export const HERO_RARE = [
    // REBALANCED: Courage now targets ONE_ALLY instead of ALL_ALLIES
    createBuffSkill({
        id: "h4",
        name: "Courage",
        className: "Hero",
        attribute: ATTRIBUTES.ALMIGHTY,
        mpCost: 15,
        target: TARGETS.ONE_ALLY,
        stat: "attack",
        amount: 1.2,
        description: "Raises one ally's Attack.",
        rarity: RARITIES.RARE
    }),

    // Light-infused strike
    createDamageSkill({
        id: "h7",
        name: "Shining Blade",
        className: "Hero",
        attribute: ATTRIBUTES.LIGHT,
        mpCost: 18,
        power: 45,
        target: TARGETS.ONE_ENEMY,
        description: "Light-infused strike.",
        rarity: RARITIES.RARE,
        category: "Physical"
    }),

    // AOE damage
    createDamageSkill({
        id: "h7_2",
        name: "Starfall",
        className: "Hero",
        attribute: ATTRIBUTES.STAR,
        mpCost: 22,
        power: 55,
        target: TARGETS.ALL_ENEMIES,
        description: "Stars rain down.",
        rarity: RARITIES.RARE,
        category: "Special"
    }),

    // Multi-hit attack
    createDamageSkill({
        id: "h7_3",
        name: "Dual Strike",
        className: "Hero",
        attribute: ATTRIBUTES.NORMAL,
        mpCost: 15,
        power: 25,
        target: TARGETS.ONE_ENEMY,
        description: "Hits twice.",
        rarity: RARITIES.RARE,
        category: "Physical",
        multiHit: 2
    }),

    // Passives
    createPassiveSkill({
        id: "p1",
        name: "Brave Heart",
        className: "Hero",
        attribute: ATTRIBUTES.STAR,
        stat: "attack",
        amount: 1.1,
        description: "Increases Attack by 10%.",
        rarity: RARITIES.RARE
    }),

    createPassiveSkill({
        id: "p8",
        name: "Leader Aura",
        className: "Hero",
        attribute: ATTRIBUTES.LIGHT,
        stat: "spDefense",
        amount: 1.1,
        description: "Increases Sp.Defense by 10%.",
        rarity: RARITIES.RARE
    })
];
