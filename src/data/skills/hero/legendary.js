import { RARITIES, TARGETS, createDamageSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * HERO - LEGENDARY SKILLS
 * Ultimate powerful attacks
 */

export const HERO_LEGENDARY = [
    // Ultimate single-target physical
    createDamageSkill({
        id: "h6_4",
        name: "Infinity Blade",
        className: "Hero",
        attribute: ATTRIBUTES.LIGHT,
        mpCost: 35,
        power: 90,
        target: TARGETS.ONE_ENEMY,
        description: "Blade of legends.",
        rarity: RARITIES.LEGENDARY,
        category: "Physical"
    }),

    // Anti-dragon tech
    createDamageSkill({
        id: "h_leg_2",
        name: "Dragon Slayer",
        className: "Hero",
        attribute: ATTRIBUTES.DRAGON,
        mpCost: 50,
        power: 120,
        target: TARGETS.ONE_ENEMY,
        description: "Anti-dragon blow.",
        rarity: RARITIES.LEGENDARY,
        category: "Physical"
    }),

    // AOE cleave
    createDamageSkill({
        id: "h_leg_3",
        name: "World Cleaver",
        className: "Hero",
        attribute: ATTRIBUTES.STEEL,
        mpCost: 60,
        power: 150,
        target: TARGETS.ALL_ENEMIES,
        description: "Cleaves the world.",
        rarity: RARITIES.LEGENDARY,
        category: "Physical"
    })
];
