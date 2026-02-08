import { RARITIES, TARGETS, createDamageSkill, createBuffSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * HERO - EXOTIC SKILLS
 * Powerful single-target and AOE abilities
 */

export const HERO_EXOTIC = [
    // Power strike
    createDamageSkill({
        id: "h6",
        name: "Cross Slash",
        className: "Hero",
        attribute: ATTRIBUTES.NORMAL,
        mpCost: 20,
        power: 50,
        target: TARGETS.ONE_ENEMY,
        description: "Powerful cross strike.",
        rarity: RARITIES.EXOTIC,
        category: "Physical"
    }),

    // AOE Almighty damage
    createDamageSkill({
        id: "h6_2",
        name: "Elemental Burst",
        className: "Hero",
        attribute: ATTRIBUTES.ALMIGHTY,
        mpCost: 30,
        power: 70,
        target: TARGETS.ALL_ENEMIES,
        description: "Explosion of all types.",
        rarity: RARITIES.EXOTIC,
        category: "Special"
    }),

    // ALL_ALLIES buff (Exotic tier - keeps AOE for high rarity)
    createBuffSkill({
        id: "h6_3",
        name: "Heroic Will",
        className: "Hero",
        attribute: ATTRIBUTES.STAR,
        mpCost: 40,
        target: TARGETS.ALL_ALLIES,
        stat: "all",
        amount: 1.5,
        description: "Massive Stat Boost for all allies.",
        rarity: RARITIES.EXOTIC
    })
];
