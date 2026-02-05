export const SCREEN_WIDTH = 1344;
export const SCREEN_HEIGHT = 768;

export const ATTRIBUTES = {
    NORMAL: "Normal",
    FIRE: "Fire",
    WATER: "Water",
    ELECTRIC: "Electric",
    ICE: "Ice",
    POISON: "Poison",
    GROUND: "Ground",
    FLYING: "Flying",
    WIND: "Wind",
    PSYCHIC: "Psychic",
    ROCK: "Rock",
    GHOST: "Ghost",
    DARK: "Dark",
    LIGHT: "Light",
    STEEL: "Steel",
    ALMIGHTY: "Almighty",
    STAR: "Star",
    GRASS: "Grass",
    BUG: "Bug",
    FIGHTING: "Fighting",
    DRAGON: "Dragon",
    FAIRY: "Fairy",
    PHYSICAL: "Physical", // Fallback/Legacy
    SPECIAL: "Special",   // Fallback/Legacy
    HEALING: "Healing"    // Fallback/Legacy
};

export const COLORS = {
    background: [20, 10, 35],      // Deep Space Purple
    uiBackground: [255, 255, 255],  // pure White
    text: [20, 20, 25],             // Dark Ink
    highlight: [240, 80, 120],      // OMORI Pink
    hp: [240, 80, 120],            // Pink
    mp: [80, 240, 210],            // Teal
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
    "NORMAL": [170, 170, 153],
    "FIRE": [255, 68, 34],
    "WATER": [51, 153, 255],
    "ELECTRIC": [255, 204, 51],
    "ICE": [102, 204, 255],
    "POISON": [170, 85, 153],
    "GROUND": [221, 187, 85],
    "FLYING": [136, 153, 255],
    "WIND": [68, 238, 153],
    "PSYCHIC": [255, 85, 153],
    "ROCK": [187, 170, 102],
    "GHOST": [119, 119, 204],
    "DARK": [119, 85, 68],
    "LIGHT": [255, 255, 102],
    "STEEL": [170, 170, 187],
    "ALMIGHTY": [255, 255, 255],
    "STAR": [255, 215, 0],
    "FAIRY": [238, 153, 238],
    "HEALING": [100, 240, 100],
    "PHYSICAL": [200, 110, 80],
    "SPECIAL": [110, 80, 200],
};

// Pokemon-inspired 17-type chart
export const ELEMENTAL_CHART = {
    [ATTRIBUTES.NORMAL]: { [ATTRIBUTES.ROCK]: 0.5, [ATTRIBUTES.GHOST]: 0, [ATTRIBUTES.STEEL]: 0.5 },
    [ATTRIBUTES.FIRE]: { [ATTRIBUTES.FIRE]: 0.5, [ATTRIBUTES.WATER]: 0.5, [ATTRIBUTES.GRASS]: 2.0, [ATTRIBUTES.ICE]: 2.0, [ATTRIBUTES.BUG]: 2.0, [ATTRIBUTES.ROCK]: 0.5, [ATTRIBUTES.DRAGON]: 0.5, [ATTRIBUTES.STEEL]: 2.0 },
    [ATTRIBUTES.WATER]: { [ATTRIBUTES.FIRE]: 2.0, [ATTRIBUTES.WATER]: 0.5, [ATTRIBUTES.GRASS]: 0.5, [ATTRIBUTES.GROUND]: 2.0, [ATTRIBUTES.ROCK]: 2.0, [ATTRIBUTES.DRAGON]: 0.5 },
    [ATTRIBUTES.ELECTRIC]: { [ATTRIBUTES.WATER]: 2.0, [ATTRIBUTES.ELECTRIC]: 0.5, [ATTRIBUTES.GRASS]: 0.5, [ATTRIBUTES.GROUND]: 0, [ATTRIBUTES.FLYING]: 2.0, [ATTRIBUTES.DRAGON]: 0.5 },
    [ATTRIBUTES.ICE]: { [ATTRIBUTES.FIRE]: 0.5, [ATTRIBUTES.WATER]: 0.5, [ATTRIBUTES.GRASS]: 2.0, [ATTRIBUTES.ICE]: 0.5, [ATTRIBUTES.GROUND]: 2.0, [ATTRIBUTES.FLYING]: 2.0, [ATTRIBUTES.DRAGON]: 2.0, [ATTRIBUTES.STEEL]: 0.5 },
    [ATTRIBUTES.POISON]: { [ATTRIBUTES.GRASS]: 2.0, [ATTRIBUTES.POISON]: 0.5, [ATTRIBUTES.GROUND]: 0.5, [ATTRIBUTES.ROCK]: 0.5, [ATTRIBUTES.GHOST]: 0.5, [ATTRIBUTES.STEEL]: 0 },
    [ATTRIBUTES.GROUND]: { [ATTRIBUTES.FIRE]: 2.0, [ATTRIBUTES.ELECTRIC]: 2.0, [ATTRIBUTES.GRASS]: 0.5, [ATTRIBUTES.POISON]: 2.0, [ATTRIBUTES.FLYING]: 0, [ATTRIBUTES.BUG]: 0.5, [ATTRIBUTES.ROCK]: 2.0, [ATTRIBUTES.STEEL]: 2.0 },
    [ATTRIBUTES.FLYING]: { [ATTRIBUTES.ELECTRIC]: 0.5, [ATTRIBUTES.GRASS]: 2.0, [ATTRIBUTES.FIGHTING]: 2.0, [ATTRIBUTES.BUG]: 2.0, [ATTRIBUTES.ROCK]: 0.5, [ATTRIBUTES.STEEL]: 0.5 },
    [ATTRIBUTES.WIND]: { [ATTRIBUTES.FLYING]: 2.0, [ATTRIBUTES.GROUND]: 2.0, [ATTRIBUTES.ROCK]: 0.5 },
    [ATTRIBUTES.PSYCHIC]: { [ATTRIBUTES.FIGHTING]: 2.0, [ATTRIBUTES.POISON]: 2.0, [ATTRIBUTES.PSYCHIC]: 0.5, [ATTRIBUTES.DARK]: 0, [ATTRIBUTES.STEEL]: 0.5 },
    [ATTRIBUTES.ROCK]: { [ATTRIBUTES.FIRE]: 2.0, [ATTRIBUTES.ICE]: 2.0, [ATTRIBUTES.FIGHTING]: 0.5, [ATTRIBUTES.GROUND]: 0.5, [ATTRIBUTES.FLYING]: 2.0, [ATTRIBUTES.BUG]: 2.0, [ATTRIBUTES.STEEL]: 0.5 },
    [ATTRIBUTES.GHOST]: { [ATTRIBUTES.NORMAL]: 0, [ATTRIBUTES.PSYCHIC]: 2.0, [ATTRIBUTES.GHOST]: 2.0, [ATTRIBUTES.DARK]: 0.5 },
    [ATTRIBUTES.DARK]: { [ATTRIBUTES.FIGHTING]: 0.5, [ATTRIBUTES.PSYCHIC]: 2.0, [ATTRIBUTES.GHOST]: 2.0, [ATTRIBUTES.DARK]: 0.5, [ATTRIBUTES.FAIRY]: 0.5 },
    [ATTRIBUTES.LIGHT]: { [ATTRIBUTES.DARK]: 2.0, [ATTRIBUTES.GHOST]: 2.0, [ATTRIBUTES.STEEL]: 0.5 },
    [ATTRIBUTES.STEEL]: { [ATTRIBUTES.FIRE]: 0.5, [ATTRIBUTES.WATER]: 0.5, [ATTRIBUTES.ELECTRIC]: 0.5, [ATTRIBUTES.ICE]: 2.0, [ATTRIBUTES.ROCK]: 2.0, [ATTRIBUTES.STEEL]: 0.5, [ATTRIBUTES.FAIRY]: 2.0 },
    [ATTRIBUTES.FAIRY]: { [ATTRIBUTES.FIRE]: 0.5, [ATTRIBUTES.POISON]: 0.5, [ATTRIBUTES.DARK]: 2.0, [ATTRIBUTES.STEEL]: 0.5, [ATTRIBUTES.DRAGON]: 2.0, [ATTRIBUTES.FIGHTING]: 2.0 },
    [ATTRIBUTES.ALMIGHTY]: {}, // No weaknesses or resistances
    [ATTRIBUTES.STAR]: { [ATTRIBUTES.ALMIGHTY]: 2.0, [ATTRIBUTES.STAR]: 0.5 },
};

// Gameplay Constants
export const GAMEPLAY = {
    DEFEND_DAMAGE_REDUCTION: 0.7, // 30% reduction
    STAB_BONUS: 1.5,
    ITEM_HEAL_MIN: 20,
    ITEM_HEAL_MAX: 50,
    MAX_ENEMIES: 3,
    LEVEL_CAP: 99,
};

// New Layout Constants
export const LAYOUT = {
    // Corner Positions for UI/Portraits
    POSITIONS: [
        { x: 340, y: 220 },                  // Top-Left (Lowered for portrait)
        { x: SCREEN_WIDTH - 220, y: 220 },  // Top-Right
        { x: 340, y: SCREEN_HEIGHT - 77 }, // Bottom-Left (Aligned with action menu bottom)
        { x: SCREEN_WIDTH - 220, y: SCREEN_HEIGHT - 77 }, // Bottom-Right
    ],
    SIDE_PANEL_WIDTH: 320,
    ENEMY_CENTER_X: 832, // (1344 + 320) / 2
    CENTER_X: 832,       // Center of the playable area
    ENEMY_CENTER_Y: SCREEN_HEIGHT / 2 - 20,
    BAR_WIDTH: 180,
    BAR_HEIGHT: 15,
};
