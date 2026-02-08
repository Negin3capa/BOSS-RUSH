import { RARITIES, TARGETS, createDamageSkill, createPassiveSkill, createSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * MAGE - RARE SKILLS
 * AOE spells, passives, and utility
 */

export const MAGE_RARE = [
    // AOE spells
    createDamageSkill({
        id: "m5",
        name: "Gale",
        className: "Mage",
        attribute: ATTRIBUTES.WIND,
        mpCost: 12,
        power: 35,
        target: TARGETS.ALL_ENEMIES,
        description: "Wind blast.",
        rarity: RARITIES.RARE,
        category: "Special"
    }),

    createDamageSkill({
        id: "m3_2",
        name: "Blizzard",
        className: "Mage",
        attribute: ATTRIBUTES.ICE,
        mpCost: 25,
        power: 45,
        target: TARGETS.ALL_ENEMIES,
        description: "Ice storm.",
        rarity: RARITIES.RARE,
        category: "Special"
    }),

    createDamageSkill({
        id: "m3_3",
        name: "Chain Lightning",
        className: "Mage",
        attribute: ATTRIBUTES.ELECTRIC,
        mpCost: 22,
        power: 40,
        target: TARGETS.ALL_ENEMIES,
        description: "Jumping bolts.",
        rarity: RARITIES.RARE,
        category: "Special"
    }),

    // NEW: Energize - single-target MP restore
    createSkill({
        id: "m5_2",
        name: "Energize",
        className: "Mage",
        type: "Buff",
        attribute: ATTRIBUTES.ELECTRIC,
        mpCost: 8,
        power: 25,
        target: TARGETS.ONE_ALLY,
        description: "Restore MP to one ally.",
        rarity: RARITIES.RARE,
        category: "Special",
        effect: { type: "mpRestore", amount: 25 }
    }),

    // Passives
    createPassiveSkill({
        id: "p3",
        name: "Mana Flow",
        className: "Mage",
        attribute: ATTRIBUTES.PSYCHIC,
        stat: "spAttack",
        amount: 1.1,
        description: "Increases Sp.Attack by 10%.",
        rarity: RARITIES.RARE
    }),

    createPassiveSkill({
        id: "p6",
        name: "Quick Cast",
        className: "Mage",
        attribute: ATTRIBUTES.ELECTRIC,
        stat: "speed",
        amount: 1.1,
        description: "Increases Speed by 10%.",
        rarity: RARITIES.RARE
    })
];
