export const SKILL_DATA = [];

import { ATTRIBUTES } from "../constants";


export const RARITIES = {
    COMMON: "Common",
    UNCOMMON: "Uncommon",
    RARE: "Rare",
    EXOTIC: "Exotic",
    LEGENDARY: "Legendary",
    MYTHICAL: "Mythical"
};

export const RARITY_COLORS = {
    [RARITIES.COMMON]: [200, 200, 200],   // Grey/White
    [RARITIES.UNCOMMON]: [80, 200, 80],   // Green
    [RARITIES.RARE]: [80, 150, 255],     // Blue
    [RARITIES.EXOTIC]: [180, 80, 255],   // Purple
    [RARITIES.LEGENDARY]: [255, 180, 50], // Orange/Gold
    [RARITIES.MYTHICAL]: [255, 50, 50],   // Red
};

const RARITY_WEIGHTS = {
    [RARITIES.COMMON]: 60,
    [RARITIES.UNCOMMON]: 25,
    [RARITIES.RARE]: 10,
    [RARITIES.EXOTIC]: 4,
    [RARITIES.LEGENDARY]: 1,
    [RARITIES.MYTHICAL]: 0.1
};

const TARGETS = {
    ONE_ENEMY: "ONE_ENEMY",
    ALL_ENEMIES: "ALL_ENEMIES",
    ONE_ALLY: "ONE_ALLY",
    ALL_ALLIES: "ALL_ALLIES",
    SELF: "SELF"
};

// Helper to create skills
function createSkill(id, name, className, type, attribute, mpCost, power, target, description, rarity = RARITIES.COMMON, effect = null, isSpeedScaling = false, category = "Physical") {
    return { id, name, className, type, attribute, mpCost, power, target, description, rarity, effect, isSpeedScaling, category };
}

// --- HERO SKILLS ---
// --- HERO SKILLS ---
const HERO_SKILLS = [
    createSkill("h1", "Slash", "Hero", "Damage", ATTRIBUTES.NORMAL, 5, 25, TARGETS.ONE_ENEMY, "A standard sword slash.", RARITIES.COMMON, null, false, "Physical"),
    createSkill("h1_2", "Side Slice", "Hero", "Damage", ATTRIBUTES.NORMAL, 7, 28, TARGETS.ONE_ENEMY, "A quick horizontal cut.", RARITIES.COMMON, null, false, "Physical"),
    createSkill("h1_3", "Pommel Strike", "Hero", "Damage", ATTRIBUTES.NORMAL, 4, 15, TARGETS.ONE_ENEMY, "Stuns with the sword hilt.", RARITIES.COMMON, null, false, "Physical"),
    createSkill("h1_4", "Thrust", "Hero", "Damage", ATTRIBUTES.NORMAL, 6, 30, TARGETS.ONE_ENEMY, "A focused forward thrust.", RARITIES.COMMON, null, false, "Physical"),

    createSkill("h2", "Flame Strike", "Hero", "Damage", ATTRIBUTES.FIRE, 8, 35, TARGETS.ONE_ENEMY, "A burning strike.", RARITIES.UNCOMMON, null, false, "Physical"),
    createSkill("h2_2", "Water Slash", "Hero", "Damage", ATTRIBUTES.WATER, 8, 35, TARGETS.ONE_ENEMY, "A fluid water blade.", RARITIES.UNCOMMON, null, false, "Physical"),
    createSkill("h2_3", "Spark Blade", "Hero", "Damage", ATTRIBUTES.ELECTRIC, 8, 35, TARGETS.ONE_ENEMY, "Electrified edge.", RARITIES.UNCOMMON, null, false, "Physical"),
    createSkill("h2_4", "Frost Edge", "Hero", "Damage", ATTRIBUTES.ICE, 8, 35, TARGETS.ONE_ENEMY, "Chilled sword strike.", RARITIES.UNCOMMON, null, false, "Physical"),

    createSkill("h3", "Light Beam", "Hero", "Damage", ATTRIBUTES.LIGHT, 12, 40, TARGETS.ONE_ENEMY, "A holy beam.", RARITIES.UNCOMMON, null, false, "Special"),
    createSkill("h4", "Courage", "Hero", "Buff", ATTRIBUTES.ALMIGHTY, 15, 0, TARGETS.ALL_ALLIES, "Raises party Attack.", RARITIES.RARE, { stat: "attack", amount: 1.2 }, false, "Special"),
    createSkill("h5", "Heal", "Hero", "Heal", ATTRIBUTES.HEALING, 10, 30, TARGETS.ONE_ALLY, "Restores minor HP.", RARITIES.COMMON, null, false, "Special"),
    createSkill("h7", "Shining Blade", "Hero", "Damage", ATTRIBUTES.LIGHT, 18, 45, TARGETS.ONE_ENEMY, "Light-infused strike.", RARITIES.RARE, null, false, "Physical"),
    createSkill("h7_2", "Starfall", "Hero", "Damage", ATTRIBUTES.STAR, 22, 55, TARGETS.ALL_ENEMIES, "Stars rain down.", RARITIES.RARE, null, false, "Special"),
    createSkill("h7_3", "Dual Strike", "Hero", "Damage", ATTRIBUTES.NORMAL, 15, 25, TARGETS.ONE_ENEMY, "Hits twice.", RARITIES.RARE, { multi: 2 }, false, "Physical"),

    createSkill("h6", "Cross Slash", "Hero", "Damage", ATTRIBUTES.NORMAL, 20, 50, TARGETS.ONE_ENEMY, "Powerful cross strike.", RARITIES.EXOTIC, null, false, "Physical"),
    createSkill("h6_2", "Elemental Burst", "Hero", "Damage", ATTRIBUTES.ALMIGHTY, 30, 70, TARGETS.ALL_ENEMIES, "Explosion of all types.", RARITIES.EXOTIC, null, false, "Special"),
    createSkill("h6_3", "Heroic Will", "Hero", "Buff", ATTRIBUTES.STAR, 40, 0, TARGETS.ALL_ALLIES, "Massive Stat Boost.", RARITIES.EXOTIC, { stat: "all", amount: 1.5 }, false, "Special"),
    createSkill("h6_4", "Infinity Blade", "Hero", "Damage", ATTRIBUTES.LIGHT, 35, 90, TARGETS.ONE_ENEMY, "Blade of legends.", RARITIES.LEGENDARY, null, false, "Physical"),

    createSkill("h_leg_2", "Dragon Slayer", "Hero", "Damage", ATTRIBUTES.DRAGON, 50, 120, TARGETS.ONE_ENEMY, "Anti-dragon blow.", RARITIES.LEGENDARY, null, false, "Physical"),
    createSkill("h_leg_3", "World Cleaver", "Hero", "Damage", ATTRIBUTES.STEEL, 60, 150, TARGETS.ALL_ENEMIES, "Cleaves the world.", RARITIES.LEGENDARY, null, false, "Physical"),
    createSkill("h_myth_1", "Omnislash", "Hero", "Damage", ATTRIBUTES.ALMIGHTY, 100, 40, TARGETS.ONE_ENEMY, "7 strikes of light.", RARITIES.MYTHICAL, { multi: 7 }, false, "Physical"),

    createSkill("p1", "Brave Heart", "Hero", "Passive", ATTRIBUTES.STAR, 0, 0, TARGETS.SELF, "Increases Attack by 10%.", RARITIES.RARE, { stat: "attack", amount: 1.1 }),
    createSkill("p8", "Leader Aura", "Hero", "Passive", ATTRIBUTES.LIGHT, 0, 0, TARGETS.SELF, "Increases Sp.Defense by 10%.", RARITIES.RARE, { stat: "spDefense", amount: 1.1 }),
];

// --- TANK SKILLS ---
// --- TANK SKILLS ---
const TANK_SKILLS = [
    createSkill("t1", "Bash", "Tank", "Damage", ATTRIBUTES.ROCK, 5, 20, TARGETS.ONE_ENEMY, "Simple blunt hit.", RARITIES.COMMON, null, false, "Physical"),
    createSkill("t1_2", "Guard", "Tank", "Buff", ATTRIBUTES.STEEL, 5, 0, TARGETS.SELF, "Minor Defense boost.", RARITIES.COMMON, { stat: "defense", amount: 1.2 }, false, "Special"),
    createSkill("t1_3", "Taunt", "Tank", "Buff", ATTRIBUTES.NORMAL, 5, 0, TARGETS.SELF, "Draw attention.", RARITIES.COMMON, null, false, "Special"),
    createSkill("t1_4", "Body Block", "Tank", "Buff", ATTRIBUTES.STEEL, 5, 0, TARGETS.SELF, "Incoming dmg reduction.", RARITIES.COMMON, null, false, "Special"),

    createSkill("t2", "Shield Bash", "Tank", "Damage", ATTRIBUTES.STEEL, 10, 30, TARGETS.ONE_ENEMY, "Hits with the shield.", RARITIES.UNCOMMON, null, false, "Physical"),
    createSkill("t2_2", "Iron Skin", "Tank", "Buff", ATTRIBUTES.STEEL, 12, 0, TARGETS.SELF, "Uncommon skin hardening.", RARITIES.UNCOMMON, { stat: "defense", amount: 1.3 }, false, "Special"),
    createSkill("t2_3", "Sand Blast", "Tank", "Damage", ATTRIBUTES.GROUND, 10, 25, TARGETS.ALL_ENEMIES, "Blinds with sand.", RARITIES.UNCOMMON, null, false, "Special"),

    createSkill("t3", "Stone Skin", "Tank", "Buff", ATTRIBUTES.ROCK, 15, 0, TARGETS.SELF, "Greatly increases Defense.", RARITIES.RARE, { stat: "defense", amount: 1.5 }, false, "Special"),
    createSkill("t5", "Fortify", "Tank", "Buff", ATTRIBUTES.STEEL, 20, 0, TARGETS.ALL_ALLIES, "Raises party Defense.", RARITIES.RARE, { stat: "defense", amount: 1.3 }, false, "Special"),
    createSkill("t3_2", "Mountain Wall", "Tank", "Buff", ATTRIBUTES.ROCK, 25, 0, TARGETS.ALL_ALLIES, "Immunity to minor hits.", RARITIES.RARE, null, false, "Special"),

    createSkill("t4", "Earthquake", "Tank", "Damage", ATTRIBUTES.GROUND, 25, 40, TARGETS.ALL_ENEMIES, "Shakes the ground.", RARITIES.EXOTIC, null, false, "Physical"),
    createSkill("t4_2", "Diamond Coating", "Tank", "Buff", ATTRIBUTES.ROCK, 35, 0, TARGETS.SELF, "Near Invincibility.", RARITIES.EXOTIC, { stat: "defense", amount: 2.0 }, false, "Special"),
    createSkill("t_leg_1", "World Shield", "Tank", "Buff", ATTRIBUTES.STAR, 50, 0, TARGETS.ALL_ALLIES, "Ultimate protection.", RARITIES.LEGENDARY, { stat: "defense", amount: 2.5 }, false, "Special"),
    createSkill("t_myth_1", "God's Fortress", "Tank", "Buff", ATTRIBUTES.ALMIGHTY, 80, 0, TARGETS.ALL_ALLIES, "Unyielding defense.", RARITIES.MYTHICAL, { stat: "allDefense", amount: 3.0 }, false, "Special"),

    createSkill("p2", "Iron Wall", "Tank", "Passive", ATTRIBUTES.STEEL, 0, 0, TARGETS.SELF, "Increases Defense by 10%.", RARITIES.RARE, { stat: "defense", amount: 1.1 }),
    createSkill("p5", "Sturdy", "Tank", "Passive", ATTRIBUTES.ROCK, 0, 0, TARGETS.SELF, "Increases HP by 10%.", RARITIES.RARE, { stat: "hp", amount: 1.1 }),
];

// --- MAGE SKILLS ---
// --- MAGE SKILLS ---
const MAGE_SKILLS = [
    createSkill("m1", "Fireball", "Mage", "Damage", ATTRIBUTES.FIRE, 10, 40, TARGETS.ONE_ENEMY, "Classic fire spell.", RARITIES.COMMON, null, false, "Special"),
    createSkill("m2", "Ice Bolt", "Mage", "Damage", ATTRIBUTES.ICE, 10, 40, TARGETS.ONE_ENEMY, "Freezing projectile.", RARITIES.COMMON, null, false, "Special"),
    createSkill("m1_3", "Splash", "Mage", "Damage", ATTRIBUTES.WATER, 10, 40, TARGETS.ONE_ENEMY, "Small wave of water.", RARITIES.COMMON, null, false, "Special"),
    createSkill("m1_4", "Ember", "Mage", "Damage", ATTRIBUTES.FIRE, 8, 30, TARGETS.ALL_ENEMIES, "Small sparks.", RARITIES.COMMON, null, false, "Special"),

    createSkill("m3", "Thunder", "Mage", "Damage", ATTRIBUTES.ELECTRIC, 12, 45, TARGETS.ONE_ENEMY, "Lightning strike.", RARITIES.UNCOMMON, null, false, "Special"),
    createSkill("m4", "Dark Orb", "Mage", "Damage", ATTRIBUTES.DARK, 15, 50, TARGETS.ONE_ENEMY, "Dark magic.", RARITIES.UNCOMMON, null, false, "Special"),
    createSkill("m2_3", "Hydro Pump", "Mage", "Damage", ATTRIBUTES.WATER, 15, 55, TARGETS.ONE_ENEMY, "Fast water jet.", RARITIES.UNCOMMON, null, false, "Special"),
    createSkill("m2_4", "Poison Fog", "Mage", "Damage", ATTRIBUTES.POISON, 12, 20, TARGETS.ALL_ENEMIES, "Poisonous mist.", RARITIES.UNCOMMON, null, false, "Special"),

    createSkill("m5", "Gale", "Mage", "Damage", ATTRIBUTES.WIND, 12, 35, TARGETS.ALL_ENEMIES, "Wind blast.", RARITIES.RARE, null, false, "Special"),
    createSkill("m3_2", "Blizzard", "Mage", "Damage", ATTRIBUTES.ICE, 25, 45, TARGETS.ALL_ENEMIES, "Ice storm.", RARITIES.RARE, null, false, "Special"),
    createSkill("m3_3", "Chain Lightning", "Mage", "Damage", ATTRIBUTES.ELECTRIC, 22, 40, TARGETS.ALL_ENEMIES, "Jumping bolts.", RARITIES.RARE, null, false, "Special"),

    createSkill("m_exo_1", "Meteor", "Mage", "Damage", ATTRIBUTES.FIRE, 40, 75, TARGETS.ALL_ENEMIES, "Space rock impact.", RARITIES.EXOTIC, null, false, "Special"),
    createSkill("m_exo_2", "Black Hole", "Mage", "Damage", ATTRIBUTES.DARK, 45, 80, TARGETS.ONE_ENEMY, "Gravitational crush.", RARITIES.EXOTIC, null, false, "Special"),
    createSkill("m_leg_1", "Grand Cross", "Mage", "Damage", ATTRIBUTES.LIGHT, 60, 110, TARGETS.ALL_ENEMIES, "Celestial judgment.", RARITIES.LEGENDARY, null, false, "Special"),
    createSkill("m_myth_1", "Big Bang", "Mage", "Damage", ATTRIBUTES.ALMIGHTY, 120, 200, TARGETS.ALL_ENEMIES, "Beginning of everything.", RARITIES.MYTHICAL, null, false, "Special"),

    createSkill("p3", "Mana Flow", "Mage", "Passive", ATTRIBUTES.PSYCHIC, 0, 0, TARGETS.SELF, "Increases Sp.Attack by 10%.", RARITIES.RARE, { stat: "spAttack", amount: 1.1 }),
    createSkill("p6", "Quick Cast", "Mage", "Passive", ATTRIBUTES.ELECTRIC, 0, 0, TARGETS.SELF, "Increases Speed by 10%.", RARITIES.RARE, { stat: "speed", amount: 1.1 }),
];

// --- ROGUE SKILLS ---
// --- ROGUE SKILLS ---
const ROGUE_SKILLS = [
    createSkill("r1", "Quick Stab", "Rogue", "Damage", ATTRIBUTES.NORMAL, 5, 20, TARGETS.ONE_ENEMY, "Very fast poke.", RARITIES.COMMON, null, true, "Physical"),
    createSkill("r1_2", "Snatch", "Rogue", "Damage", ATTRIBUTES.NORMAL, 6, 18, TARGETS.ONE_ENEMY, "Steal opportunity.", RARITIES.COMMON, null, true, "Physical"),
    createSkill("r1_3", "Feint", "Rogue", "Buff", ATTRIBUTES.NORMAL, 10, 0, TARGETS.SELF, "Raise Luck.", RARITIES.COMMON, { stat: "luck", amount: 1.3 }, true, "Special"),

    createSkill("r3", "Venom Edge", "Rogue", "Damage", ATTRIBUTES.POISON, 10, 30, TARGETS.ONE_ENEMY, "Coat blade in venom.", RARITIES.UNCOMMON, null, false, "Physical"),
    createSkill("r2_2", "Ghost Step", "Rogue", "Buff", ATTRIBUTES.GHOST, 15, 0, TARGETS.SELF, "Raise Speed greatly.", RARITIES.UNCOMMON, { stat: "speed", amount: 1.4 }, true, "Special"),
    createSkill("r2_3", "Backstab", "Rogue", "Damage", ATTRIBUTES.DARK, 15, 60, TARGETS.ONE_ENEMY, "High crit chance.", RARITIES.UNCOMMON, null, true, "Physical"),

    createSkill("r2", "Nightshade", "Rogue", "Damage", ATTRIBUTES.POISON, 15, 50, TARGETS.ONE_ENEMY, "Poisonous strike.", RARITIES.RARE, null, false, "Physical"),
    createSkill("r4", "Shadow Strike", "Rogue", "Damage", ATTRIBUTES.DARK, 18, 40, TARGETS.ONE_ENEMY, "Strike from shadows.", RARITIES.RARE, null, false, "Physical"),
    createSkill("r3_2", "Triple Threat", "Rogue", "Damage", ATTRIBUTES.NORMAL, 20, 25, TARGETS.ONE_ENEMY, "Three quick hits.", RARITIES.RARE, { multi: 3 }, true, "Physical"),

    createSkill("r5", "Eviscerate", "Rogue", "Damage", ATTRIBUTES.Normal, 25, 60, TARGETS.ONE_ENEMY, "Deep wound.", RARITIES.EXOTIC, null, false, "Physical"),
    createSkill("r_exo_1", "Assassinate", "Rogue", "Damage", ATTRIBUTES.DARK, 40, 100, TARGETS.ONE_ENEMY, "Silent death.", RARITIES.EXOTIC, null, true, "Physical"),
    createSkill("r_leg_1", "Shadow Clone", "Rogue", "Damage", ATTRIBUTES.GHOST, 60, 40, TARGETS.ONE_ENEMY, "Many shadows strike.", RARITIES.LEGENDARY, { multi: 5 }, true, "Physical"),
    createSkill("r_myth_1", "Execution", "Rogue", "Damage", ATTRIBUTES.ALMIGHTY, 80, 200, TARGETS.ONE_ENEMY, "Irresistible end.", RARITIES.MYTHICAL, null, true, "Physical"),

    createSkill("p4", "Keen Eye", "Rogue", "Passive", ATTRIBUTES.DARK, 0, 0, TARGETS.SELF, "Increases Speed by 10%.", RARITIES.RARE, { stat: "speed", amount: 1.1 }),
    createSkill("p7", "Hidden Blade", "Rogue", "Passive", ATTRIBUTES.NORMAL, 0, 0, TARGETS.SELF, "Increases Attack by 10%.", RARITIES.RARE, { stat: "attack", amount: 1.1 }),
];

SKILL_DATA.push(...HERO_SKILLS, ...TANK_SKILLS, ...MAGE_SKILLS, ...ROGUE_SKILLS);

export function getWeightedRandomSkills(className, count = 4, luckFactor = 0, filterType = null) {
    let pool;
    if (className === "ANY") {
        pool = SKILL_DATA;
    } else {
        pool = SKILL_DATA.filter(s => s.className === className);
    }

    if (filterType) {
        if (filterType === "ACTIVE") {
            pool = pool.filter(s => s.type !== "Passive");
        } else {
            pool = pool.filter(s => s.type === filterType);
        }
    }

    if (pool.length === 0) return [];

    const selected = [];
    const poolCopy = [...pool];

    for (let i = 0; i < count; i++) {
        if (poolCopy.length === 0) break;

        // Calculate weights with luck factor
        const weightedPool = poolCopy.map(skill => {
            let weight = RARITY_WEIGHTS[skill.rarity] || 1;
            if (luckFactor > 0) {
                const rarityIndex = Object.values(RARITIES).indexOf(skill.rarity);
                weight *= (1 + (rarityIndex * 0.5 * luckFactor));
            }
            return { skill, weight };
        });

        const totalWeight = weightedPool.reduce((acc, item) => acc + item.weight, 0);
        let random = Math.random() * totalWeight;

        for (let j = 0; j < weightedPool.length; j++) {
            random -= weightedPool[j].weight;
            if (random <= 0) {
                const picked = weightedPool[j].skill;
                selected.push(picked);
                const idx = poolCopy.indexOf(picked);
                poolCopy.splice(idx, 1);
                break;
            }
        }
    }

    return selected;
}

export function getRandomSkills(className, count = 4) {
    return getWeightedRandomSkills(className, count, 0);
}

export { ATTRIBUTES, TARGETS };
