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
function createSkill(id, name, className, type, attribute, spCost, power, target, description, rarity = RARITIES.COMMON, effect = null) {
    return { id, name, className, type, attribute, spCost, power, target, description, rarity, effect };
}

// --- HERO SKILLS ---
const HERO_SKILLS = [
    createSkill("h1", "Slash", "Hero", "Damage", ATTRIBUTES.PHYSICAL, 5, 25, TARGETS.ONE_ENEMY, "A basic sword slash.", RARITIES.COMMON),
    createSkill("h2", "Double Cut", "Hero", "Damage", ATTRIBUTES.PHYSICAL, 8, 35, TARGETS.ONE_ENEMY, "Attacks twice rapidly.", RARITIES.UNCOMMON),
    createSkill("h3", "Light Beam", "Hero", "Damage", ATTRIBUTES.LIGHT, 12, 40, TARGETS.ONE_ENEMY, "A holy beam.", RARITIES.UNCOMMON),
    createSkill("h4", "Courage", "Hero", "Buff", ATTRIBUTES.SPECIAL, 15, 0, TARGETS.ALL_ALLIES, "Raises party Attack.", RARITIES.RARE, { type: "BUFF", stat: "attack", amount: 1.2 }),
    createSkill("h5", "Heal", "Hero", "Heal", ATTRIBUTES.HEALING, 10, 30, TARGETS.ONE_ALLY, "Restores minor HP.", RARITIES.COMMON),
    createSkill("h6", "Cross Slash", "Hero", "Damage", ATTRIBUTES.PHYSICAL, 15, 50, TARGETS.ONE_ENEMY, "A powerful cross-shaped cut.", RARITIES.EXOTIC),
    createSkill("h7", "Shining Blade", "Hero", "Damage", ATTRIBUTES.LIGHT, 18, 55, TARGETS.ONE_ENEMY, "Infused with light.", RARITIES.RARE),
    createSkill("h8", "Rally", "Hero", "Buff", ATTRIBUTES.SPECIAL, 20, 0, TARGETS.ALL_ALLIES, "Raises party Defense.", RARITIES.RARE, { type: "BUFF", stat: "defense", amount: 1.2 }),
    createSkill("h9", "Spin Attack", "Hero", "Damage", ATTRIBUTES.PHYSICAL, 20, 30, TARGETS.ALL_ENEMIES, "Hits all enemies.", RARITIES.RARE),
    createSkill("h10", "Holy Nova", "Hero", "Damage", ATTRIBUTES.LIGHT, 30, 45, TARGETS.ALL_ENEMIES, "Holy explosion.", RARITIES.EXOTIC),
    createSkill("h18", "Full Heal", "Hero", "Heal", ATTRIBUTES.HEALING, 30, 100, TARGETS.ONE_ALLY, "Fully restores HP.", RARITIES.LEGENDARY),
    createSkill("h19", "Light Storm", "Hero", "Damage", ATTRIBUTES.LIGHT, 40, 70, TARGETS.ALL_ENEMIES, "Rain of light swords.", RARITIES.LEGENDARY),
    createSkill("h20", "Heroic Strike", "Hero", "Damage", ATTRIBUTES.PHYSICAL, 50, 100, TARGETS.ONE_ENEMY, "The ultimate technique.", RARITIES.MYTHICAL)
];

// --- TANK SKILLS ---
const TANK_SKILLS = [
    createSkill("t1", "Bash", "Tank", "Damage", ATTRIBUTES.PHYSICAL, 5, 20, TARGETS.ONE_ENEMY, "Simple blunt hit.", RARITIES.COMMON),
    createSkill("t3", "Stone Skin", "Tank", "Buff", ATTRIBUTES.STONE, 15, 0, TARGETS.SELF, "Greatly increases Defense.", RARITIES.RARE, { type: "BUFF", stat: "defense", amount: 1.5 }),
    createSkill("t4", "Earthquake", "Tank", "Damage", ATTRIBUTES.STONE, 25, 40, TARGETS.ALL_ENEMIES, "Shakes the ground.", RARITIES.EXOTIC),
    createSkill("t5", "Fortify", "Tank", "Buff", ATTRIBUTES.SPECIAL, 20, 0, TARGETS.ALL_ALLIES, "Raises party Defense.", RARITIES.UNCOMMON, { type: "BUFF", stat: "defense", amount: 1.3 }),
    createSkill("t6", "Shield Wall", "Tank", "Buff", ATTRIBUTES.SPECIAL, 30, 0, TARGETS.ALL_ALLIES, "Drastically raises party Def.", RARITIES.RARE, { type: "BUFF", stat: "defense", amount: 1.5 }),
    createSkill("t14", "Boulder Crash", "Tank", "Damage", ATTRIBUTES.STONE, 35, 60, TARGETS.ALL_ENEMIES, "Giant rock from above.", RARITIES.LEGENDARY),
    createSkill("t15", "Intimidate", "Tank", "Debuff", ATTRIBUTES.SPECIAL, 15, 0, TARGETS.ALL_ENEMIES, "Lowers enemy Attack.", RARITIES.UNCOMMON, { type: "DEBUFF", stat: "attack", amount: 0.8 }),
    createSkill("t19", "Titan's Fist", "Tank", "Damage", ATTRIBUTES.STONE, 45, 90, TARGETS.ONE_ENEMY, "Massive stone punch.", RARITIES.MYTHICAL)
];

// --- MAGE SKILLS ---
const MAGE_SKILLS = [
    createSkill("m1", "Fireball", "Mage", "Damage", ATTRIBUTES.FIRE, 10, 40, TARGETS.ONE_ENEMY, "Classic fire spell.", RARITIES.COMMON),
    createSkill("m2", "Ice Bolt", "Mage", "Damage", ATTRIBUTES.WATER, 10, 40, TARGETS.ONE_ENEMY, "Freezing projectile.", RARITIES.COMMON),
    createSkill("m3", "Thunder", "Mage", "Damage", ATTRIBUTES.WIND, 12, 45, TARGETS.ONE_ENEMY, "Lightning strike.", RARITIES.UNCOMMON),
    createSkill("m4", "Dark Orb", "Mage", "Damage", ATTRIBUTES.DARK, 15, 50, TARGETS.ONE_ENEMY, "Coalesced darkness.", RARITIES.UNCOMMON),
    createSkill("m5", "Flame Wall", "Mage", "Damage", ATTRIBUTES.FIRE, 25, 35, TARGETS.ALL_ENEMIES, "Line of fire.", RARITIES.RARE),
    createSkill("m9", "Focus", "Mage", "Buff", ATTRIBUTES.SPECIAL, 15, 0, TARGETS.SELF, "Greatly raises Attack.", RARITIES.RARE, { type: "BUFF", stat: "attack", amount: 1.5 }),
    createSkill("m12", "Flare", "Mage", "Damage", ATTRIBUTES.FIRE, 50, 100, TARGETS.ONE_ENEMY, "Nuclear fire.", RARITIES.LEGENDARY),
    createSkill("m20", "Meteor", "Mage", "Damage", ATTRIBUTES.STONE, 60, 120, TARGETS.ALL_ENEMIES, "Summon a meteor.", RARITIES.MYTHICAL)
];

// --- ROGUE SKILLS ---
const ROGUE_SKILLS = [
    createSkill("r1", "Quick Stab", "Rogue", "Damage", ATTRIBUTES.PHYSICAL, 5, 20, TARGETS.ONE_ENEMY, "Very fast poke.", RARITIES.COMMON),
    createSkill("r2", "Backstab", "Rogue", "Damage", ATTRIBUTES.PHYSICAL, 15, 50, TARGETS.ONE_ENEMY, "High damage.", RARITIES.RARE),
    createSkill("r8", "Smoke Bomb", "Rogue", "Debuff", ATTRIBUTES.WIND, 15, 0, TARGETS.ALL_ENEMIES, "Lower Enemy Accuracy.", RARITIES.UNCOMMON, { type: "DEBUFF", stat: "defense", amount: 0.8 }),
    createSkill("r10", "Assassinate", "Rogue", "Damage", ATTRIBUTES.DARK, 40, 90, TARGETS.ONE_ENEMY, "Lethal strike.", RARITIES.EXOTIC),
    createSkill("r13", "Flashbang", "Rogue", "Debuff", ATTRIBUTES.LIGHT, 20, 0, TARGETS.ALL_ENEMIES, "Stun/Blind.", RARITIES.UNCOMMON, { type: "DEBUFF", stat: "attack", amount: 0.7 }),
    createSkill("r20", "Death Blossom", "Rogue", "Damage", ATTRIBUTES.DARK, 50, 100, TARGETS.ALL_ENEMIES, "Spinning execution.", RARITIES.MYTHICAL)
];

SKILL_DATA.push(...HERO_SKILLS, ...TANK_SKILLS, ...MAGE_SKILLS, ...ROGUE_SKILLS);

export function getWeightedRandomSkills(className, count = 4, luckFactor = 0) {
    let pool;
    if (className === "ANY") {
        pool = SKILL_DATA;
    } else {
        pool = SKILL_DATA.filter(s => s.className === className);
    }

    if (pool.length === 0) return [];

    const selected = [];
    const poolCopy = [...pool];

    for (let i = 0; i < count; i++) {
        if (poolCopy.length === 0) break;

        // Calculate weights with luck factor
        // Luck factor shifts weights towards rarer items
        // luckFactor 1 = +10% chance for Rare+, etc.
        const weightedPool = poolCopy.map(skill => {
            let weight = RARITY_WEIGHTS[skill.rarity];
            if (luckFactor > 0) {
                // Apply luck boost: higher rarities get multiplied more
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
                // Remove from pool to avoid duplicates for the same character
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
