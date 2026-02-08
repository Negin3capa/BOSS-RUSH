import { RARITIES, TARGETS, createDamageSkill, createDebuffSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * HERO - UNCOMMON SKILLS
 * Starting skills for Sol and elemental sword techniques
 */

export const HERO_UNCOMMON = [
    // Starting skills for Sol
    createDebuffSkill({
        id: "h_start_1",
        name: "Intimidate",
        className: "Hero",
        attribute: ATTRIBUTES.DARK,
        mpCost: 8,
        target: TARGETS.ONE_ENEMY,
        stat: "attack",
        amount: 0.8,
        description: "Lowers enemy's attack.",
        rarity: RARITIES.UNCOMMON,
        tags: ["starting"]
    }),

    createDamageSkill({
        id: "h_start_2",
        name: "Cosmic Ray",
        className: "Hero",
        attribute: ATTRIBUTES.STAR,
        mpCost: 12,
        power: 45,
        target: TARGETS.ONE_ENEMY,
        description: "A beam of cosmic energy.",
        rarity: RARITIES.UNCOMMON,
        category: "Special",
        tags: ["starting"]
    }),

    createDamageSkill({
        id: "h_start_3",
        name: "Shadow Claw",
        className: "Hero",
        attribute: ATTRIBUTES.GHOST,
        mpCost: 10,
        power: 35,
        target: TARGETS.ONE_ENEMY,
        description: "A spectral claw strike.",
        rarity: RARITIES.UNCOMMON,
        category: "Physical",
        tags: ["starting"]
    }),

    // Elemental sword strikes
    createDamageSkill({
        id: "h2",
        name: "Flame Strike",
        className: "Hero",
        attribute: ATTRIBUTES.FIRE,
        mpCost: 8,
        power: 35,
        target: TARGETS.ONE_ENEMY,
        description: "A burning strike.",
        rarity: RARITIES.UNCOMMON,
        category: "Physical"
    }),

    createDamageSkill({
        id: "h2_2",
        name: "Water Slash",
        className: "Hero",
        attribute: ATTRIBUTES.WATER,
        mpCost: 8,
        power: 35,
        target: TARGETS.ONE_ENEMY,
        description: "A fluid water blade.",
        rarity: RARITIES.UNCOMMON,
        category: "Physical"
    }),

    createDamageSkill({
        id: "h2_3",
        name: "Spark Blade",
        className: "Hero",
        attribute: ATTRIBUTES.ELECTRIC,
        mpCost: 8,
        power: 35,
        target: TARGETS.ONE_ENEMY,
        description: "Electrified edge.",
        rarity: RARITIES.UNCOMMON,
        category: "Physical"
    }),

    createDamageSkill({
        id: "h2_4",
        name: "Frost Edge",
        className: "Hero",
        attribute: ATTRIBUTES.ICE,
        mpCost: 8,
        power: 35,
        target: TARGETS.ONE_ENEMY,
        description: "Chilled sword strike.",
        rarity: RARITIES.UNCOMMON,
        category: "Physical"
    }),

    // Light damage
    createDamageSkill({
        id: "h3",
        name: "Light Beam",
        className: "Hero",
        attribute: ATTRIBUTES.LIGHT,
        mpCost: 12,
        power: 40,
        target: TARGETS.ONE_ENEMY,
        description: "A holy beam.",
        rarity: RARITIES.UNCOMMON,
        category: "Special"
    })
];
