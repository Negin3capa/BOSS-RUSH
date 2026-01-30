export const SCREEN_WIDTH = 1024;
export const SCREEN_HEIGHT = 768;

export const ATTRIBUTES = {
    PHYSICAL: "Physical",
    FIRE: "Fire",
    WATER: "Water",
    WIND: "Wind",
    STONE: "Stone",
    DARK: "Dark",
    LIGHT: "Light",
    HEALING: "Healing",
    SPECIAL: "Special"
};

export const COLORS = {
    background: [20, 10, 35],      // Deep Space Purple
    uiBackground: [255, 255, 255],  // pure White
    text: [20, 20, 25],             // Dark Ink
    highlight: [240, 80, 120],      // OMORI Pink
    hp: [240, 80, 120],            // Pink
    sp: [80, 240, 210],            // Teal
    enemy: [200, 80, 80],
    player: [80, 180, 80],
    uiBorder: [0, 0, 0],            // Black
    shadow: [100, 100, 120],        // Muted grey shadow
};

export const UI = {
    OUTLINE: 6,                     // Thicker for sketchy look
    SHADOW: 8,
    PUNCH_SCALE: 1.15,
    WOBBLE_SPEED: 6,
    WOBBLE_FORCE: 0.08,
};


export const ATTRIBUTE_COLORS = {
    [ATTRIBUTES.PHYSICAL]: [255, 255, 255], // White
    [ATTRIBUTES.FIRE]: [255, 50, 50],    // Red
    [ATTRIBUTES.WATER]: [50, 100, 255],  // Blue
    [ATTRIBUTES.WIND]: [50, 200, 100],   // Green
    [ATTRIBUTES.STONE]: [150, 100, 50],  // Brown
    [ATTRIBUTES.DARK]: [150, 50, 200],   // Purple
    [ATTRIBUTES.LIGHT]: [255, 255, 100], // Yellow
};

// Rock-Paper-Scissors: Fire -> Stone -> Wind -> Water -> Fire
// Duality: Light <-> Dark
export const ELEMENTAL_CHART = {
    [ATTRIBUTES.FIRE]: { [ATTRIBUTES.STONE]: 2.0, [ATTRIBUTES.WATER]: 0.5 },
    [ATTRIBUTES.STONE]: { [ATTRIBUTES.WIND]: 2.0, [ATTRIBUTES.FIRE]: 0.5 },
    [ATTRIBUTES.WIND]: { [ATTRIBUTES.WATER]: 2.0, [ATTRIBUTES.STONE]: 0.5 },
    [ATTRIBUTES.WATER]: { [ATTRIBUTES.FIRE]: 2.0, [ATTRIBUTES.WIND]: 0.5 },
    [ATTRIBUTES.LIGHT]: { [ATTRIBUTES.DARK]: 2.0, [ATTRIBUTES.LIGHT]: 0.5 },
    [ATTRIBUTES.DARK]: { [ATTRIBUTES.LIGHT]: 2.0, [ATTRIBUTES.DARK]: 0.5 },
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
