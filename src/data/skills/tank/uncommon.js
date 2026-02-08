import { RARITIES, TARGETS, createDamageSkill, createBuffSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * TANK - UNCOMMON SKILLS
 * Shield attacks and area debuffs
 */

export const TANK_UNCOMMON = [
    // Shield attack
    createDamageSkill({
        id: "t2",
        name: "Shield Bash",
        className: "Tank",
        attribute: ATTRIBUTES.STEEL,
        mpCost: 10,
        power: 30,
        target: TARGETS.ONE_ENEMY,
        description: "Hits with the shield.",
        rarity: RARITIES.UNCOMMON,
        category: "Physical"
    }),

    // Self defense buff
    createBuffSkill({
        id: "t2_2",
        name: "Iron Skin",
        className: "Tank",
        attribute: ATTRIBUTES.STEEL,
        mpCost: 12,
        target: TARGETS.SELF,
        stat: "defense",
        amount: 1.3,
        description: "Uncommon skin hardening.",
        rarity: RARITIES.UNCOMMON
    }),

    // AOE debuff/damage
    createDamageSkill({
        id: "t2_3",
        name: "Sand Blast",
        className: "Tank",
        attribute: ATTRIBUTES.GROUND,
        mpCost: 10,
        power: 25,
        target: TARGETS.ALL_ENEMIES,
        description: "Blinds with sand.",
        rarity: RARITIES.UNCOMMON,
        category: "Special"
    })
];
