
import { BaseCharacter } from "../src/entities/BaseCharacter";
import { ATTRIBUTES } from "../src/constants";

function testStatsScaling() {
    console.log("Testing Stats Scaling...");
    const char = new BaseCharacter("Test Hero", "Hero", {
        hp: 100, mp: 50, attack: 10, defense: 10, specialAttack: 10, specialDefense: 10, speed: 10, accuracy: 100, luck: 10
    });

    console.log(`Level 1 - HP: ${char.maxHp}, Attack: ${char.attack}, Luck: ${char.luck}`);

    char.gainExp(100);
    console.log(`Level 2 - HP: ${char.maxHp}, Attack: ${char.attack}, Luck: ${char.luck}`);
    // Expected HP: Level 1 was ~100 (randomized). Level 2 should be ~100 * (1 + 0.1) = ~110.
    // Luck should stay the same.

    if (char.level !== 2) throw new Error("Level up failed");
    console.log("Stats Scaling Test Passed!");
}

function testDamageFormula() {
    console.log("Testing Damage Formula...");
    const attacker = new BaseCharacter("Attacker", "Hero", {
        hp: 100, mp: 50, attack: 20, defense: 10, specialAttack: 10, specialDefense: 10, speed: 10, accuracy: 200, luck: 0
    });
    const defender = new BaseCharacter("Defender", "Hero", {
        hp: 100, mp: 50, attack: 10, defense: 10, specialAttack: 10, specialDefense: 10, speed: 10, accuracy: 100, luck: 0
    });

    // Accuracy 200 means hitRate should be 200 (approx), so hitChance 100%.
    const result = defender.takeDamage(50, ATTRIBUTES.NORMAL, attacker, false, "Physical");
    console.log(`Damage taken: ${result.damage}, Hit: ${result.hit}, Crit: ${result.crit}`);

    if (!result.hit) throw new Error("Hit failed despite high hitRate");
    console.log("Damage Formula Test Passed!");
}

// Simple mock for constants/kaplay since this is a node script
global.ATTRIBUTES = ATTRIBUTES;
global.ELEMENTAL_CHART = {};
global.GAMEPLAY = { STAB_BONUS: 1.5, DEFEND_DAMAGE_REDUCTION: 0.7 };

try {
    testStatsScaling();
    testDamageFormula();
} catch (e) {
    console.error("Test failed:", e);
}
