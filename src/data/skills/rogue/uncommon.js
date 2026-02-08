import { RARITIES, TARGETS, createDamageSkill, createBuffSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * ROGUE - UNCOMMON SKILLS
 * Starting skill for Max and intermediate techniques
 */

export const ROGUE_UNCOMMON = [
    // Starting skill for Max
    createBuffSkill({
        id: "r_start_1",
        name: "Haste",
        className: "Rogue",
        attribute: ATTRIBUTES.WIND,
        mpCost: 10,
        target: TARGETS.SELF,
        stat: "speed",
        amount: 1.5,
        description: "Greatly increases own speed.",
        rarity: RARITIES.UNCOMMON,
        tags: ["starting"]
    }),

    // Poison attacks
    createDamageSkill({
        id: "r3",
        name: "Venom Edge",
        className: "Rogue",
        attribute: ATTRIBUTES.POISON,
        mpCost: 10,
        power: 30,
        target: TARGETS.ONE_ENEMY,
        description: "Coat blade in venom.",
        rarity: RARITIES.UNCOMMON,
        category: "Physical"
    }),

    // Speed buff with speed scaling
    createBuffSkill({
        id: "r2_2",
        name: "Ghost Step",
        className: "Rogue",
        attribute: ATTRIBUTES.GHOST,
        mpCost: 15,
        target: TARGETS.SELF,
        stat: "speed",
        amount: 1.4,
        description: "Raise Speed greatly.",
        rarity: RARITIES.UNCOMMON,
        tags: ["speed-scaling"]
    }),

    // High crit chance attack (speed scaling)
    createDamageSkill({
        id: "r2_3",
        name: "Backstab",
        className: "Rogue",
        attribute: ATTRIBUTES.DARK,
        mpCost: 15,
        power: 60,
        target: TARGETS.ONE_ENEMY,
        description: "High crit chance.",
        rarity: RARITIES.UNCOMMON,
        category: "Physical",
        isSpeedScaling: true,
        effect: { critBonus: 15 }
    })
];
