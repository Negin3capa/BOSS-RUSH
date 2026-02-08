import k from "../../kaplayCtx";
import { COLORS, UI, SCREEN_WIDTH } from "../../constants";

/**
 * Creates a turn counter component
 * @returns {Object} Label object with updateCount function
 */
export function createTurnCounter() {
    const container = k.add([
        k.pos(25, 25),
        k.fixed(),
        k.z(100),
    ]);

    container.add([
        k.rect(130, 45),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
    ]);

    const label = container.add([
        k.text("Turn: 1", { size: 22, font: "Viga" }),
        k.pos(65, 22),
        k.anchor("center"),
        k.color(COLORS.text),
        {
            updateCount(num) {
                this.text = `Turn: ${num}`;
            }
        }
    ]);

    return label;
}

/**
 * Creates a round counter component
 * @param {Object} gameState - The current game state
 * @returns {Object} Label object that auto-updates
 */
export function createRoundCounter(gameState) {
    const container = k.add([
        k.pos(SCREEN_WIDTH - 155, 25),
        k.fixed(),
        k.z(100),
    ]);

    container.add([
        k.rect(130, 45),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
    ]);

    const label = container.add([
        k.text(`Round: ${gameState.roundCounter}`, { size: 22, font: "Viga" }),
        k.pos(65, 22),
        k.anchor("center"),
        k.color(COLORS.text),
        {
            update() {
                this.text = `Round: ${gameState.roundCounter}`;
            }
        }
    ]);

    return label;
}
