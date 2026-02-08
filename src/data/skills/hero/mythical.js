import { RARITIES, TARGETS, createDamageSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * HERO - MYTHICAL SKILLS
 * The ultimate techniques
 */

export const HERO_MYTHICAL = [
    // Ultimate multi-hit attack
    createDamageSkill({
        id: "h_myth_1",
        name: "Omnislash",
        className: "Hero",
        attribute: ATTRIBUTES.ALMIGHTY,
        mpCost: 100,
        power: 40,
        target: TARGETS.ONE_ENEMY,
        description: "7 strikes of light.",
        rarity: RARITIES.MYTHICAL,
        category: "Physical",
        multiHit: 7
    })
];
