export const SCREEN_WIDTH = 1024;
export const SCREEN_HEIGHT = 768;

export const COLORS = {
    background: [20, 20, 30],
    uiBackground: [40, 40, 50],
    text: [255, 255, 255],
    highlight: [255, 215, 0], // Gold
    hp: [220, 50, 50],
    sp: [50, 150, 220],
    enemy: [200, 100, 100],
    player: [100, 200, 100],
    uiBorder: [255, 255, 255],
};

// Gameplay Constants
export const GAMEPLAY = {
    DEFEND_DAMAGE_REDUCTION: 0.5,
    DEFEND_SP_REGEN: 10,
    ITEM_HEAL_MIN: 20,
    ITEM_HEAL_MAX: 50,
    MAX_ENEMIES: 3,
};

// New Layout Constants
export const LAYOUT = {
    // Corner Positions for UI/Portraits
    POSITIONS: [
        { x: 20, y: 120 },                  // Top-Left
        { x: SCREEN_WIDTH - 220, y: 120 },  // Top-Right
        { x: 20, y: SCREEN_HEIGHT - 120 }, // Bottom-Left
        { x: SCREEN_WIDTH - 220, y: SCREEN_HEIGHT - 120 }, // Bottom-Right
    ],
    ENEMY_CENTER_X: SCREEN_WIDTH / 2,
    ENEMY_CENTER_Y: SCREEN_HEIGHT / 2,
    BAR_WIDTH: 180,
    BAR_HEIGHT: 15,
};
