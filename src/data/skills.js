export const SKILL_DATA = [];

import { ATTRIBUTES } from "../constants";


const TARGETS = {
    ONE_ENEMY: "ONE_ENEMY",
    ALL_ENEMIES: "ALL_ENEMIES",
    ONE_ALLY: "ONE_ALLY",
    ALL_ALLIES: "ALL_ALLIES",
    SELF: "SELF"
};

// Helper to create skills
function createSkill(id, name, className, type, attribute, spCost, power, target, description, effect = null) {
    return { id, name, className, type, attribute, spCost, power, target, description, effect };
}

// --- HERO SKILLS (Balanced, Light, Physical) ---
const HERO_SKILLS = [
    createSkill("h1", "Slash", "Hero", "Damage", ATTRIBUTES.PHYSICAL, 5, 25, TARGETS.ONE_ENEMY, "A basic sword slash."),
    createSkill("h2", "Double Cut", "Hero", "Damage", ATTRIBUTES.PHYSICAL, 8, 35, TARGETS.ONE_ENEMY, "Attacks twice rapidly."),
    createSkill("h3", "Light Beam", "Hero", "Damage", ATTRIBUTES.LIGHT, 12, 40, TARGETS.ONE_ENEMY, "A beam of holy light."),
    createSkill("h4", "Courage", "Hero", "Buff", ATTRIBUTES.SPECIAL, 15, 0, TARGETS.ALL_ALLIES, "Raises party Attack.", { type: "BUFF", stat: "attack", amount: 1.2 }),
    createSkill("h5", "Heal", "Hero", "Heal", ATTRIBUTES.HEALING, 10, 30, TARGETS.ONE_ALLY, "Restores minor HP."),
    createSkill("h6", "Cross Slash", "Hero", "Damage", ATTRIBUTES.PHYSICAL, 15, 50, TARGETS.ONE_ENEMY, "A powerful cross-shaped cut."),
    createSkill("h7", "Shining Blade", "Hero", "Damage", ATTRIBUTES.LIGHT, 18, 55, TARGETS.ONE_ENEMY, "Infused with light energy."),
    createSkill("h8", "Rally", "Hero", "Buff", ATTRIBUTES.SPECIAL, 20, 0, TARGETS.ALL_ALLIES, "Raises party Defense.", { type: "BUFF", stat: "defense", amount: 1.2 }),
    createSkill("h9", "Spin Attack", "Hero", "Damage", ATTRIBUTES.PHYSICAL, 20, 30, TARGETS.ALL_ENEMIES, "Hits all enemies."),
    createSkill("h10", "Holy Nova", "Hero", "Damage", ATTRIBUTES.LIGHT, 30, 45, TARGETS.ALL_ENEMIES, "Explosion of holy light on all foes."),
    createSkill("h11", "First Aid", "Hero", "Heal", ATTRIBUTES.HEALING, 8, 20, TARGETS.ONE_ALLY, "Quickly patches wounds."),
    createSkill("h12", "Shield Bash", "Hero", "Damage", ATTRIBUTES.PHYSICAL, 10, 20, TARGETS.ONE_ENEMY, "Hits with shield. Low dmg."),
    createSkill("h13", "Sun Strike", "Hero", "Damage", ATTRIBUTES.FIRE, 25, 60, TARGETS.ONE_ENEMY, "Sears the target with solar heat."),
    createSkill("h14", "Aqua Cut", "Hero", "Damage", ATTRIBUTES.WATER, 25, 60, TARGETS.ONE_ENEMY, "Fluid blade strike."),
    createSkill("h15", "Wind Slash", "Hero", "Damage", ATTRIBUTES.WIND, 25, 60, TARGETS.ONE_ENEMY, "Cutting gale."),
    createSkill("h16", "Battle Cry", "Hero", "Buff", ATTRIBUTES.SPECIAL, 10, 0, TARGETS.SELF, "Raises own Attack.", { type: "BUFF", stat: "attack", amount: 1.5 }),
    createSkill("h17", "Guard Up", "Hero", "Buff", ATTRIBUTES.SPECIAL, 10, 0, TARGETS.SELF, "Raises own Defense.", { type: "BUFF", stat: "defense", amount: 1.5 }),
    createSkill("h18", "Full Heal", "Hero", "Heal", ATTRIBUTES.HEALING, 30, 100, TARGETS.ONE_ALLY, "Fully restores HP."),
    createSkill("h19", "Light Storm", "Hero", "Damage", ATTRIBUTES.LIGHT, 40, 70, TARGETS.ALL_ENEMIES, "Rain of light swords."),
    createSkill("h20", "Heroic Strike", "Hero", "Damage", ATTRIBUTES.PHYSICAL, 50, 100, TARGETS.ONE_ENEMY, "The ultimate hero technique.")
];

// --- TANK SKILLS (Defense, Stone, Physical) ---
const TANK_SKILLS = [
    createSkill("t1", "Bash", "Tank", "Damage", ATTRIBUTES.PHYSICAL, 5, 20, TARGETS.ONE_ENEMY, "Simple blunt hit."),
    createSkill("t2", "Taunt", "Tank", "Buff", ATTRIBUTES.SPECIAL, 10, 0, TARGETS.SELF, "Draws aggro (Visual only)."),
    createSkill("t3", "Stone Skin", "Tank", "Buff", ATTRIBUTES.STONE, 15, 0, TARGETS.SELF, "Greatly increases Defense.", { type: "BUFF", stat: "defense", amount: 1.5 }),
    createSkill("t4", "Earthquake", "Tank", "Damage", ATTRIBUTES.STONE, 25, 40, TARGETS.ALL_ENEMIES, "Shakes the ground."),
    createSkill("t5", "Fortify", "Tank", "Buff", ATTRIBUTES.SPECIAL, 20, 0, TARGETS.ALL_ALLIES, "Raises party Defense.", { type: "BUFF", stat: "defense", amount: 1.3 }),
    createSkill("t6", "Shield Wall", "Tank", "Buff", ATTRIBUTES.SPECIAL, 30, 0, TARGETS.ALL_ALLIES, "Drastically raises party Def.", { type: "BUFF", stat: "defense", amount: 1.5 }),
    createSkill("t7", "Body Slam", "Tank", "Damage", ATTRIBUTES.PHYSICAL, 15, 45, TARGETS.ONE_ENEMY, "Throws weight at enemy."),
    createSkill("t8", "Rock Throw", "Tank", "Damage", ATTRIBUTES.STONE, 10, 30, TARGETS.ONE_ENEMY, "Hurls a boulder."),
    createSkill("t9", "Iron Will", "Tank", "Heal", ATTRIBUTES.HEALING, 20, 50, TARGETS.SELF, "Heals self through grit."),
    createSkill("t10", "Wide Swing", "Tank", "Damage", ATTRIBUTES.PHYSICAL, 18, 30, TARGETS.ALL_ENEMIES, "Hits everyone around."),
    createSkill("t11", "Mend Armor", "Tank", "Heal", ATTRIBUTES.HEALING, 15, 30, TARGETS.SELF, "Repairs gear/health."),
    createSkill("t12", "Heavy A blow", "Tank", "Damage", ATTRIBUTES.PHYSICAL, 30, 70, TARGETS.ONE_ENEMY, "Slow but heavy hit."),
    createSkill("t13", "Spike Shield", "Tank", "Buff", ATTRIBUTES.SPECIAL, 15, 0, TARGETS.SELF, "Return dmg buff (Visual)."),
    createSkill("t14", "Boulder Crash", "Tank", "Damage", ATTRIBUTES.STONE, 35, 60, TARGETS.ALL_ENEMIES, "Giant rock from above."),
    createSkill("t15", "Intimidate", "Tank", "Debuff", ATTRIBUTES.SPECIAL, 15, 0, TARGETS.ALL_ENEMIES, "Lowers enemy Attack.", { type: "DEBUFF", stat: "attack", amount: 0.8 }),
    createSkill("t16", "Armor Break", "Tank", "Debuff", ATTRIBUTES.PHYSICAL, 15, 20, TARGETS.ONE_ENEMY, "Lowers enemy Defense.", { type: "DEBUFF", stat: "defense", amount: 0.8 }),
    createSkill("t17", "Cover", "Tank", "Buff", ATTRIBUTES.SPECIAL, 10, 0, TARGETS.ONE_ALLY, "Protects an ally."),
    createSkill("t18", "Avalanche", "Tank", "Damage", ATTRIBUTES.WATER, 30, 50, TARGETS.ALL_ENEMIES, "Snow and rock slide."),
    createSkill("t19", "Titan's Fist", "Tank", "Damage", ATTRIBUTES.STONE, 45, 90, TARGETS.ONE_ENEMY, "Massive stone punch."),
    createSkill("t20", "Immovable", "Tank", "Buff", ATTRIBUTES.SPECIAL, 40, 0, TARGETS.SELF, "becoming invincible.")
];

// --- MAGE SKILLS (Elemental, High SP) ---
const MAGE_SKILLS = [
    createSkill("m1", "Fireball", "Mage", "Damage", ATTRIBUTES.FIRE, 10, 40, TARGETS.ONE_ENEMY, "Classic fire spell."),
    createSkill("m2", "Ice Bolt", "Mage", "Damage", ATTRIBUTES.WATER, 10, 40, TARGETS.ONE_ENEMY, "Freezing projectile."),
    createSkill("m3", "Thunder", "Mage", "Damage", ATTRIBUTES.WIND, 12, 45, TARGETS.ONE_ENEMY, "Lightning strike."),
    createSkill("m4", "Dark Orb", "Mage", "Damage", ATTRIBUTES.DARK, 15, 50, TARGETS.ONE_ENEMY, "Coalesced darkness."),
    createSkill("m5", "Flame Wall", "Mage", "Damage", ATTRIBUTES.FIRE, 25, 35, TARGETS.ALL_ENEMIES, "Line of fire."),
    createSkill("m6", "Blizzard", "Mage", "Damage", ATTRIBUTES.WATER, 25, 35, TARGETS.ALL_ENEMIES, "Ice storm."),
    createSkill("m7", "Tornado", "Mage", "Damage", ATTRIBUTES.WIND, 25, 35, TARGETS.ALL_ENEMIES, "Violent winds."),
    createSkill("m8", "Shadow Wave", "Mage", "Damage", ATTRIBUTES.DARK, 25, 35, TARGETS.ALL_ENEMIES, "Wave of shadows."),
    createSkill("m9", "Focus", "Mage", "Buff", ATTRIBUTES.SPECIAL, 15, 0, TARGETS.SELF, "Greatly raises Magic/Atk.", { type: "BUFF", stat: "attack", amount: 1.5 }),
    createSkill("m10", "Arcane Blast", "Mage", "Damage", ATTRIBUTES.SPECIAL, 40, 80, TARGETS.ONE_ENEMY, "Pure magical energy."),
    createSkill("m11", "Mana Drain", "Mage", "Damage", ATTRIBUTES.DARK, 5, 10, TARGETS.ONE_ENEMY, "Steals SP (Logic needed)."),
    createSkill("m12", "Flare", "Mage", "Damage", ATTRIBUTES.FIRE, 50, 100, TARGETS.ONE_ENEMY, "Nuclear fire."),
    createSkill("m13", "Flood", "Mage", "Damage", ATTRIBUTES.WATER, 45, 90, TARGETS.ALL_ENEMIES, "Tsunami."),
    createSkill("m14", "Storm", "Mage", "Damage", ATTRIBUTES.WIND, 45, 90, TARGETS.ALL_ENEMIES, "Thunderstorm."),
    createSkill("m15", "Abyss", "Mage", "Damage", ATTRIBUTES.DARK, 50, 100, TARGETS.ONE_ENEMY, "Consume in void."),
    createSkill("m16", "Heal More", "Mage", "Heal", ATTRIBUTES.HEALING, 20, 60, TARGETS.ONE_ALLY, "Stronger heal."),
    createSkill("m17", "Barrier", "Mage", "Buff", ATTRIBUTES.SPECIAL, 20, 0, TARGETS.ONE_ALLY, "Boost defense.", { type: "BUFF", stat: "defense", amount: 1.5 }),
    createSkill("m18", "Weaken", "Mage", "Debuff", ATTRIBUTES.DARK, 15, 0, TARGETS.ONE_ENEMY, "Lower Atk.", { type: "DEBUFF", stat: "attack", amount: 0.7 }),
    createSkill("m19", "Slow", "Mage", "Debuff", ATTRIBUTES.STONE, 15, 0, TARGETS.ONE_ENEMY, "Lower Spd/Def.", { type: "DEBUFF", stat: "defense", amount: 0.7 }),
    createSkill("m20", "Meteor", "Mage", "Damage", ATTRIBUTES.STONE, 60, 120, TARGETS.ALL_ENEMIES, "Summon a meteor.")
];

// --- ROGUE SKILLS (Fast, Dark, Wind) ---
const ROGUE_SKILLS = [
    createSkill("r1", "Quick Stab", "Rogue", "Damage", ATTRIBUTES.PHYSICAL, 5, 20, TARGETS.ONE_ENEMY, "Very fast poke."),
    createSkill("r2", "Backstab", "Rogue", "Damage", ATTRIBUTES.PHYSICAL, 15, 50, TARGETS.ONE_ENEMY, "High dmg if behind."),
    createSkill("r3", "Poison Edge", "Rogue", "Damage", ATTRIBUTES.DARK, 12, 30, TARGETS.ONE_ENEMY, "Tainted blade."),
    createSkill("r4", "Wind Walk", "Rogue", "Buff", ATTRIBUTES.WIND, 10, 0, TARGETS.SELF, "Raise evasion (Visual)."),
    createSkill("r5", "Fan of Knives", "Rogue", "Damage", ATTRIBUTES.PHYSICAL, 20, 30, TARGETS.ALL_ENEMIES, "Throw knives everywhere."),
    createSkill("r6", "Shadow Step", "Rogue", "Buff", ATTRIBUTES.DARK, 15, 0, TARGETS.SELF, "Prepare for crit."),
    createSkill("r7", "Mug", "Rogue", "Damage", ATTRIBUTES.PHYSICAL, 10, 25, TARGETS.ONE_ENEMY, "Steal item (Visual)."),
    createSkill("r8", "Smoke Bomb", "Rogue", "Debuff", ATTRIBUTES.WIND, 15, 0, TARGETS.ALL_ENEMIES, "Lower Enemy Accuracy."),
    createSkill("r9", "Twin Fangs", "Rogue", "Damage", ATTRIBUTES.PHYSICAL, 25, 60, TARGETS.ONE_ENEMY, "Two heavy hits."),
    createSkill("r10", "Assassinate", "Rogue", "Damage", ATTRIBUTES.DARK, 40, 90, TARGETS.ONE_ENEMY, "Lethal strike."),
    createSkill("r11", "Slice & Dice", "Rogue", "Damage", ATTRIBUTES.PHYSICAL, 30, 40, TARGETS.ALL_ENEMIES, "Rapid cuts."),
    createSkill("r12", "Venom Cloud", "Rogue", "Damage", ATTRIBUTES.DARK, 35, 30, TARGETS.ALL_ENEMIES, "Poisonous gas."),
    createSkill("r13", "Flashbang", "Rogue", "Debuff", ATTRIBUTES.LIGHT, 20, 0, TARGETS.ALL_ENEMIES, "Stun/Blind."),
    createSkill("r14", "Sprint", "Rogue", "Buff", ATTRIBUTES.WIND, 10, 0, TARGETS.SELF, "Speed up."),
    createSkill("r15", "Trickster", "Rogue", "Buff", ATTRIBUTES.SPECIAL, 15, 0, TARGETS.SELF, "Random buff."),
    createSkill("r16", "Dagger Throw", "Rogue", "Damage", ATTRIBUTES.PHYSICAL, 8, 20, TARGETS.ONE_ENEMY, "Ranged hit."),
    createSkill("r17", "Night Shade", "Rogue", "Damage", ATTRIBUTES.DARK, 25, 60, TARGETS.ONE_ENEMY, "Dark elemental strike."),
    createSkill("r18", "Gale Strike", "Rogue", "Damage", ATTRIBUTES.WIND, 25, 60, TARGETS.ONE_ENEMY, "Wind elemental strike."),
    createSkill("r19", "First Aid Kit", "Rogue", "Heal", ATTRIBUTES.HEALING, 15, 40, TARGETS.ONE_ALLY, "Rogue healing."),
    createSkill("r20", "Death Blossom", "Rogue", "Damage", ATTRIBUTES.DARK, 50, 100, TARGETS.ALL_ENEMIES, "Spinning execution.")
];

SKILL_DATA.push(...HERO_SKILLS, ...TANK_SKILLS, ...MAGE_SKILLS, ...ROGUE_SKILLS);

export function getRandomSkills(className, count = 4) {
    let classSkills;
    if (className === "ANY") {
        classSkills = SKILL_DATA;
    } else {
        classSkills = SKILL_DATA.filter(s => s.className === className);
    }
    const shuffled = classSkills.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export { ATTRIBUTES, TARGETS };
