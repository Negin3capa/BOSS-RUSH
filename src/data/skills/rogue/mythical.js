import { RARITIES, TARGETS, createDamageSkill } from "../core.js";
import { ATTRIBUTES } from "../../../constants.js";

/**
 * ROGUE - MYTHICAL SKILLS
 * The ultimate assassination
 */

export const ROGUE_MYTHICAL = [
    // Irresistible end (speed scaling, priority)
    createDamageSkill({
        id: "r_myth_1",
        name: "Execution",
        className: "Rogue",
        attribute: ATTRIBUTES.ALMIGHTY,
        mpCost: 80,
        power: 200,
        target: TARGETS.ONE_ENEMY,
        description: "Irresistible end.",
        rarity: RARITIES.MYTHICAL,
        category: "Physical",
        isSpeedScaling: true,
        priority: 1
    })
];
