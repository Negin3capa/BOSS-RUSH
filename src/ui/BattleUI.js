import k from "../kaplayCtx";
import { createPlayerPortraits } from "./components/PlayerPortrait.js";

// Re-export all UI components for convenient imports
export { createPlayerPortraits } from "./components/PlayerPortrait.js";
export { createMessageLog } from "./components/MessageLog.js";
export { createTargetingInfo } from "./components/TargetingInfo.js";
export { createTurnCounter, createRoundCounter } from "./components/TurnCounter.js";
export { createMenuSystem } from "./components/MenuSystem.js";

/**
 * Creates the main battle UI with player portraits and selection management
 * @param {Object} gameState - The current game state
 * @param {number} initialTurnCount - Initial turn count (unused, kept for API compatibility)
 * @returns {Object} Battle UI object with ui container and updateSelection function
 */
export function createBattleUI(gameState, initialTurnCount = 1) {
    const uiContainer = k.add([
        k.fixed(),
        k.z(100),
    ]);

    // Create player portrait UIs
    const { portraitUIs, updateSelection } = createPlayerPortraits(gameState, uiContainer);

    return {
        ui: uiContainer,
        updateSelection
    };
}
