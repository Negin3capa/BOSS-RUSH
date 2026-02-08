import k from "../../kaplayCtx";
import { RARITY_COLORS } from "../../data/skills/index.js";

/**
 * Generates text styles for different rarity levels
 * @returns {Object} Styles object with rarity keys and color values
 */
export function getTextStyles() {
    const styles = {};
    Object.keys(RARITY_COLORS).forEach(rarity => {
        const c = RARITY_COLORS[rarity];
        styles[rarity] = { color: k.rgb(c[0], c[1], c[2]) };
    });
    return styles;
}
