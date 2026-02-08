import k from "../../kaplayCtx";
import { COLORS } from "../../constants";

/**
 * Creates an enemy targeting info tooltip component
 * @returns {Object} Targeting info object with show and hide functions
 */
export function createTargetingInfo() {
    const container = k.add([
        k.pos(0, 0),
        k.fixed(),
        k.z(150),
    ]);

    // Dark Name Box
    const nameBox = container.add([
        k.rect(240, 45),
        k.pos(0, 0),
        k.color(40, 40, 45),
        k.outline(2, [200, 200, 200]),
        k.anchor("center"),
    ]);

    const nameText = nameBox.add([
        k.text("", { size: 20, font: "Viga" }),
        k.pos(0, 0),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);

    // Health Area (Below)
    const hpArea = container.add([
        k.pos(0, 35),
        k.anchor("center"),
    ]);

    // Heart Icon (using text for now or simple shapes)
    hpArea.add([
        k.text("❤️", { size: 16 }),
        k.pos(-80, 0),
        k.anchor("center"),
    ]);

    // HP Bar Background
    hpArea.add([
        k.rect(140, 16),
        k.pos(10, 0),
        k.anchor("center"),
        k.color(0, 0, 0),
        k.outline(2, [100, 100, 100]),
    ]);

    // HP Bar Fill
    const hpBar = hpArea.add([
        k.rect(136, 12),
        k.pos(-58, 0), // Offset from center
        k.anchor("left"),
        k.color(COLORS.hp),
    ]);

    container.hidden = true;

    return {
        show(enemy, pos) {
            container.hidden = false;
            container.pos = k.vec2(pos.x, pos.y - 120); // Position above the enemy
            nameText.text = enemy.name.toUpperCase();

            // Update HP Bar
            const ratio = enemy.hp / enemy.maxHp;
            hpBar.width = Math.max(0, ratio * 136);
        },
        hide() {
            container.hidden = true;
        }
    };
}
