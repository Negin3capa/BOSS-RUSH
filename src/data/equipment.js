import { ATTRIBUTES } from "../constants";
import { RARITIES } from "./skills/index.js";

export const EQUIPMENT_TYPES = {
    WEAPON: "Weapon",
    ARMOR: "Armor",
    ACCESSORY: "Accessory"
};

export const EQUIPMENT_DATA = [
    // --- WEAPONS (Attack + Type + Multi-Hit) ---
    // Common
    { id: "w1", name: "Iron Sword", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.COMMON, attackBonus: 5, attribute: ATTRIBUTES.NORMAL, multiHit: 1, description: "Basic soldier's sword." },
    { id: "w2", name: "Wooden Club", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.COMMON, attackBonus: 4, attribute: ATTRIBUTES.ROCK, multiHit: 1, description: "A heavy primitive club." },
    { id: "w3", name: "Rusty Dagger", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.COMMON, attackBonus: 3, attribute: ATTRIBUTES.STEEL, multiHit: 2, description: "Hits twice but weak." },
    { id: "w4", name: "Training Staff", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.COMMON, attackBonus: 3, attribute: ATTRIBUTES.NORMAL, multiHit: 1, description: "Lightweight and easy." },

    // Uncommon
    { id: "w5", name: "Flametongue", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.UNCOMMON, attackBonus: 10, attribute: ATTRIBUTES.FIRE, multiHit: 1, description: "Glows with heat." },
    { id: "w6", name: "Wave Blade", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.UNCOMMON, attackBonus: 10, attribute: ATTRIBUTES.WATER, multiHit: 1, description: "Flows like water." },
    { id: "w7", name: "Storm Spear", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.UNCOMMON, attackBonus: 8, attribute: ATTRIBUTES.ELECTRIC, multiHit: 2, description: "Crackles with bolts." },
    { id: "w8", name: "Ivory Bow", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.UNCOMMON, attackBonus: 12, attribute: ATTRIBUTES.FLYING, multiHit: 1, description: "Light as a feather." },

    // Rare
    { id: "w9", name: "Holy Avenger", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.RARE, attackBonus: 18, attribute: ATTRIBUTES.LIGHT, multiHit: 1, description: "Blessed by the gods." },
    { id: "w10", name: "Shadow Dirk", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.RARE, attackBonus: 15, attribute: ATTRIBUTES.DARK, multiHit: 3, description: "Strike from the dark." },
    { id: "w11", name: "Frostbite Greataxe", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.RARE, attackBonus: 22, attribute: ATTRIBUTES.ICE, multiHit: 1, description: "Freezes on contact." },
    { id: "w12", name: "Terra Hammer", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.RARE, attackBonus: 20, attribute: ATTRIBUTES.GROUND, multiHit: 1, description: "Heavy earth power." },

    // Exotic
    { id: "w13", name: "Dragon Soul", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.EXOTIC, attackBonus: 30, attribute: ATTRIBUTES.DRAGON, multiHit: 1, description: "Wreathed in dragon fire." },
    { id: "w14", name: "Wind Cutter", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.EXOTIC, attackBonus: 25, attribute: ATTRIBUTES.WIND, multiHit: 4, description: "Multiple air slices." },
    { id: "w15", name: "Void Slasher", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.EXOTIC, attackBonus: 35, attribute: ATTRIBUTES.GHOST, multiHit: 1, description: "Cuts through reality." },
    { id: "w16", name: "Star Blade", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.EXOTIC, attackBonus: 32, attribute: ATTRIBUTES.STAR, multiHit: 1, description: "Crafted from a falling star." },

    // Legendary
    { id: "w17", name: "Excalibur", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.LEGENDARY, attackBonus: 50, attribute: ATTRIBUTES.LIGHT, multiHit: 2, description: "The sword of kings." },
    { id: "w18", name: "Masamune", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.LEGENDARY, attackBonus: 45, attribute: ATTRIBUTES.STEEL, multiHit: 5, description: "Legendary sharpness." },
    { id: "w19", name: "Mjolnir", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.LEGENDARY, attackBonus: 55, attribute: ATTRIBUTES.ELECTRIC, multiHit: 1, description: "The crusher of worlds." },
    { id: "w20", name: "Apocalypse", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.LEGENDARY, attackBonus: 60, attribute: ATTRIBUTES.ALMIGHTY, multiHit: 1, description: "End of days." },

    // Mythical
    { id: "w21", name: "God-Slayer", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.MYTHICAL, attackBonus: 100, attribute: ATTRIBUTES.ALMIGHTY, multiHit: 3, description: "Defy the heavens." },
    { id: "w22", name: "Infinity Edge", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.MYTHICAL, attackBonus: 80, attribute: ATTRIBUTES.STAR, multiHit: 10, description: "Endless strikes." },
    { id: "w23", name: "Primordial Chaos", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.MYTHICAL, attackBonus: 120, attribute: ATTRIBUTES.DARK, multiHit: 1, description: "Origin of shadow." },
    { id: "w24", name: "Aethelgard", type: EQUIPMENT_TYPES.WEAPON, rarity: RARITIES.MYTHICAL, attackBonus: 110, attribute: ATTRIBUTES.LIGHT, multiHit: 1, description: "Absolute holy radiance." },

    // --- ARMOR (HP + Def + Sp.Def + Speed) ---
    // Common
    { id: "a1", name: "Cloth Tunic", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.COMMON, hpBonus: 15, defBonus: 2, spDefBonus: 2, speedBonus: 1, description: "Simple cloth armor." },
    { id: "a2", name: "Leather Vest", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.COMMON, hpBonus: 20, defBonus: 5, spDefBonus: 1, speedBonus: 0, description: "Basic leather protection." },
    { id: "a3", name: "Rusty Mail", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.COMMON, hpBonus: 30, defBonus: 8, spDefBonus: 0, speedBonus: -2, description: "Heavy and noisy." },
    { id: "a4", name: "Straw Cloak", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.COMMON, hpBonus: 10, defBonus: 1, spDefBonus: 1, speedBonus: 3, description: "Very light." },

    // Uncommon
    { id: "a5", name: "Studded Leather", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.UNCOMMON, hpBonus: 40, defBonus: 12, spDefBonus: 5, speedBonus: 2, description: "Reinforced leather." },
    { id: "a6", name: "Chainmail", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.UNCOMMON, hpBonus: 60, defBonus: 18, spDefBonus: 2, speedBonus: -1, description: "Standard soldier mail." },
    { id: "a7", name: "Silk Robe", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.UNCOMMON, hpBonus: 30, defBonus: 4, spDefBonus: 15, speedBonus: 1, description: "Favored by mages." },
    { id: "a8", name: "Scale Mail", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.UNCOMMON, hpBonus: 50, defBonus: 15, spDefBonus: 8, speedBonus: 0, description: "Reptilian scales." },

    // Rare
    { id: "a9", name: "Knight Armor", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.RARE, hpBonus: 100, defBonus: 30, spDefBonus: 15, speedBonus: -3, description: "Solid plate armor." },
    { id: "a10", name: "Mystic Mantle", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.RARE, hpBonus: 70, defBonus: 10, spDefBonus: 35, speedBonus: 2, description: "Glows with magic." },
    { id: "a11", name: "Shadow Gear", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.RARE, hpBonus: 80, defBonus: 20, spDefBonus: 20, speedBonus: 8, description: "Hard to see in dark." },
    { id: "a12", name: "Heroic Plate", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.RARE, hpBonus: 120, defBonus: 25, spDefBonus: 25, speedBonus: 0, description: "Well-balanced protection." },

    // Exotic
    { id: "a13", name: "Dragon Scale", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.EXOTIC, hpBonus: 200, defBonus: 50, spDefBonus: 40, speedBonus: -2, description: "Near fireproof." },
    { id: "a14", name: "Celestial Garb", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.EXOTIC, hpBonus: 150, defBonus: 30, spDefBonus: 60, speedBonus: 5, description: "Starlight threads." },
    { id: "a15", name: "Titan Skin", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.EXOTIC, hpBonus: 300, defBonus: 80, spDefBonus: 20, speedBonus: -10, description: "Unstoppable bulk." },
    { id: "a16", name: "Speedster Suit", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.EXOTIC, hpBonus: 120, defBonus: 25, spDefBonus: 25, speedBonus: 20, description: "Built for velocity." },

    // Legendary
    { id: "a17", name: "Aegis Plate", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.LEGENDARY, hpBonus: 400, defBonus: 100, spDefBonus: 100, speedBonus: -5, description: "The ultimate shield." },
    { id: "a18", name: "Phoenix Down Garb", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.LEGENDARY, hpBonus: 350, defBonus: 60, spDefBonus: 120, speedBonus: 10, description: "Revitalizing warmth." },
    { id: "a19", name: "Grandmaster Robe", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.LEGENDARY, hpBonus: 250, defBonus: 50, spDefBonus: 150, speedBonus: 15, description: "Archmage's choice." },
    { id: "a20", name: "God-Skin Armor", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.LEGENDARY, hpBonus: 500, defBonus: 120, spDefBonus: 80, speedBonus: 0, description: "Indestructible." },

    // Mythical
    { id: "a21", name: "Infinity Armor", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.MYTHICAL, hpBonus: 1000, defBonus: 200, spDefBonus: 200, speedBonus: 50, description: "Transcend mortality." },
    { id: "a22", name: "Cosmic Shell", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.MYTHICAL, hpBonus: 800, defBonus: 300, spDefBonus: 300, speedBonus: -20, description: "Armor of the universe." },
    { id: "a23", name: "Eternal Void", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.MYTHICAL, hpBonus: 700, defBonus: 150, spDefBonus: 400, speedBonus: 30, description: "Shadows protect you." },
    { id: "a24", name: "Aurelian Guard", type: EQUIPMENT_TYPES.ARMOR, rarity: RARITIES.MYTHICAL, hpBonus: 900, defBonus: 250, spDefBonus: 250, speedBonus: 10, description: "Gilded in eternity." },

    // --- ACCESSORIES (Stats + Passives) ---
    // Common
    { id: "ac1", name: "Copper Ring", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.COMMON, attackBonus: 2, description: "Simple ring." },
    { id: "ac2", name: "Glass Beads", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.COMMON, spAttackBonus: 2, description: "Pretty but weak." },
    { id: "ac3", name: "Lucky Charm", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.COMMON, luckBonus: 2, description: "Feels lucky." },
    { id: "ac4", name: "Running Shoes", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.COMMON, speedBonus: 2, description: "Good for cardio." },

    // Uncommon
    { id: "ac5", name: "Silver Band", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.UNCOMMON, attackBonus: 5, spAttackBonus: 5, description: "Better quality." },
    { id: "ac6", name: "Garnet Amulet", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.UNCOMMON, hpBonus: 25, description: "Hearty red stone." },
    { id: "ac7", name: "Sharp Eye Lens", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.UNCOMMON, hitRateBonus: 10, description: "Focuses sight." },
    { id: "ac8", name: "Mana Crystal", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.UNCOMMON, juiceBonus: 20, description: "Stores energy." },

    // Rare
    { id: "ac9", name: "Brave Ring", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.RARE, grantedPassive: "p1", description: "Grants Brave Heart." },
    { id: "ac10", name: "Stone Amulet", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.RARE, grantedPassive: "p5", description: "Grants Sturdy." },
    { id: "ac11", name: "Mana Circlet", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.RARE, grantedPassive: "p3", description: "Grants Mana Flow." },
    { id: "ac12", name: "Haste Boots", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.RARE, grantedPassive: "p6", description: "Grants Quick Cast." },

    // Exotic
    { id: "ac13", name: "Berserker Mask", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.EXOTIC, attackBonus: 20, speedBonus: 10, defBonus: -10, description: "Rage incarnate." },
    { id: "ac14", name: "Wisdom Crown", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.EXOTIC, spAttackBonus: 20, spDefBonus: 20, description: "Academic brilliance." },
    { id: "ac15", name: "Vampire Teeth", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.EXOTIC, grantedPassive: "p7", attackBonus: 15, description: "Grants Hidden Blade." },
    { id: "ac16", name: "Guardian Ankh", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.EXOTIC, grantedPassive: "p2", hpBonus: 50, description: "Grants Iron Wall." },

    // Legendary
    { id: "ac17", name: "Hero's Emblem", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.LEGENDARY, allStatsBonus: 15, description: "Mark of a true hero." },
    { id: "ac18", name: "God's Finger", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.LEGENDARY, attackBonus: 50, hitRateBonus: 50, description: "Divine precision." },
    { id: "ac19", name: "Eye of Odin", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.LEGENDARY, spAttackBonus: 50, grantedPassive: "p8", description: "All-seeing magic." },
    { id: "ac20", name: "Ring of Command", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.LEGENDARY, grantedPassive: "p4", speedBonus: 30, description: "Leaders' speed." },

    // Mythical
    { id: "ac21", name: "Omega Ring", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.MYTHICAL, allStatsBonus: 50, description: "The beginning and end." },
    { id: "ac22", name: "Star Heart", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.MYTHICAL, hpBonus: 500, juiceBonus: 500, description: "Core of a galaxy." },
    { id: "ac23", name: "Chaos Orb", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.MYTHICAL, grantedPassive: "h6_3", description: "Unpredictable power." },
    { id: "ac24", name: "Aurelian Soul", type: EQUIPMENT_TYPES.ACCESSORY, rarity: RARITIES.MYTHICAL, allStatsBonus: 100, description: "Eternal essence." },
];
