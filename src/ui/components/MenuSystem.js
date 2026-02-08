import k from "../../kaplayCtx";
import { COLORS, LAYOUT, SCREEN_HEIGHT, UI, ATTRIBUTE_COLORS } from "../../constants";
import { getTextStyles } from "./uiUtils.js";

// Button position constants
const SKILL_BTN_POSITIONS = [
    k.vec2(-130, -30), k.vec2(130, -30),
    k.vec2(-130, 30), k.vec2(130, 30)
];

const ACTION_BTN_POSITIONS = [
    k.vec2(-130, -30), k.vec2(130, -30),
    k.vec2(-130, 30), k.vec2(130, 30)
];

const ACTION_DATA = [
    { label: "FIGHT", colors: [[255, 60, 40], [180, 20, 0]] },    // Red/Orange
    { label: "SKILL", colors: [[0, 160, 240], [0, 80, 160]] },   // Blue
    { label: "DEFEND", colors: [[255, 200, 40], [220, 100, 20]] }, // Yellow/Orange
    { label: "ITEM", colors: [[120, 200, 60], [40, 140, 20]] }    // Green
];

/**
 * Gets skill colors based on attribute type
 * @param {string} type - The skill attribute/type
 * @returns {Array} Array of [baseColor, darkColor]
 */
function getSkillColors(type = "Normal") {
    // Handle potential case mismatches (Fire vs FIRE vs fire)
    const upperType = type.toUpperCase();
    const baseColor = ATTRIBUTE_COLORS[upperType] ||
        ATTRIBUTE_COLORS[type] ||
        ATTRIBUTE_COLORS[Object.keys(ATTRIBUTE_COLORS).find(k => k.toUpperCase() === upperType)] ||
        [180, 180, 180];

    // Multiplicative darkening (0.7x) maintains saturation better than linear subtraction
    const darkColor = baseColor.map(c => Math.floor(c * 0.7));
    return [baseColor, darkColor];
}

/**
 * Creates a skill button
 * @param {Object} parent - Parent container
 * @param {number} index - Button index
 * @returns {Object} The created button
 */
function createSkillButton(parent, index) {
    const btn = parent.add([
        k.pos(SKILL_BTN_POSITIONS[index]),
        k.anchor("center"),
        k.scale(1),
    ]);

    btn.add([
        k.rect(244, 54),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.outline(2, [0, 0, 0]),
    ]);

    btn.add([
        k.rect(238, 48),
        k.anchor("center"),
        k.color(0, 0, 0),
    ]);

    btn.add([
        k.rect(230, 40),
        k.anchor("center"),
        k.color(200, 200, 200),
        "filler"
    ]);

    btn.add([
        k.rect(230, 10),
        k.pos(0, -12),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.opacity(0.2),
    ]);

    btn.add([
        k.rect(230, 15),
        k.pos(0, 12),
        k.anchor("center"),
        k.color(150, 150, 150),
        "gradientBottom"
    ]);

    btn.add([
        k.text("", { size: 20, font: "Viga", styles: getTextStyles() }),
        k.anchor("center"),
        k.pos(2, 2),
        k.color(0, 0, 0),
        k.opacity(0.5),
        "shadow"
    ]);

    btn.add([
        k.text("", { size: 20, font: "Viga", styles: getTextStyles() }),
        k.anchor("center"),
        k.color(255, 255, 255),
        "label"
    ]);

    return btn;
}

/**
 * Creates an action button
 * @param {Object} parent - Parent container
 * @param {Object} data - Button data (label, colors)
 * @param {number} index - Button index
 * @returns {Object} The created button
 */
function createActionButton(parent, data, index) {
    const btn = parent.add([
        k.pos(ACTION_BTN_POSITIONS[index]),
        k.anchor("center"),
        k.scale(1),
    ]);

    // White Border
    btn.add([
        k.rect(244, 54),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.outline(2, [0, 0, 0]),
    ]);

    // Black Inner Frame
    btn.add([
        k.rect(238, 48),
        k.anchor("center"),
        k.color(0, 0, 0),
    ]);

    // Gradient (Main Color)
    btn.add([
        k.rect(230, 40),
        k.anchor("center"),
        k.color(data.colors[0][0], data.colors[0][1], data.colors[0][2]),
        "filler"
    ]);

    // Top highlight for "gradient"
    btn.add([
        k.rect(230, 10),
        k.pos(0, -12),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.opacity(0.2),
    ]);

    // Bottom darker part of "gradient"
    btn.add([
        k.rect(230, 15),
        k.pos(0, 12),
        k.anchor("center"),
        k.color(data.colors[1][0], data.colors[1][1], data.colors[1][2]),
        k.opacity(0.8),
    ]);

    btn.add([
        k.text(data.label, { size: 24, font: "Viga", styles: getTextStyles() }),
        k.anchor("center"),
        k.pos(2, 2), // Shadow
        k.color(0, 0, 0),
        k.opacity(0.5),
    ]);

    btn.add([
        k.text(data.label, { size: 24, font: "Viga", styles: getTextStyles() }),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);

    return btn;
}

/**
 * Creates the battle menu system with action and skill buttons
 * @param {Object} log - The message log object for displaying skill info
 * @returns {Object} Menu system object with update and control functions
 */
export function createMenuSystem(log) {
    const menuContainer = k.add([
        k.pos(LAYOUT.CENTER_X, SCREEN_HEIGHT - 70),
        k.anchor("center"),
        k.z(200),
        k.fixed(),
    ]);

    // Create Skill Buttons
    const skillButtons = [];
    for (let i = 0; i < 4; i++) {
        skillButtons.push(createSkillButton(menuContainer, i));
    }

    // Create Action Buttons
    const actionButtons = [];
    ACTION_DATA.forEach((data, i) => {
        actionButtons.push(createActionButton(menuContainer, data, i));
    });

    const pointer = menuContainer.add([
        k.sprite("pointer"),
        k.pos(0, 0),
        k.anchor("center"),
        k.rotate(90),
        k.z(210),
        k.scale(1.2),
    ]);

    return {
        container: menuContainer, // Expose container for animation
        updateMainMenu(selectedIndex) {
            menuContainer.hidden = false;
            skillButtons.forEach(b => b.hidden = true);
            actionButtons.forEach(b => b.hidden = false);
            pointer.hidden = false;

            const targetPos = ACTION_BTN_POSITIONS[selectedIndex];
            pointer.pos = k.vec2(targetPos.x - 100, targetPos.y);

            // Subtle pulse on selected
            actionButtons.forEach((b, i) => {
                const targetScale = (i === selectedIndex) ? 1.05 : 1;
                b.scale = k.lerp(b.scale, k.vec2(targetScale), k.dt() * 5);
            });
        },
        updateSkillMenu(skills, selectedIndex) {
            menuContainer.hidden = false;
            actionButtons.forEach(b => b.hidden = true);
            skillButtons.forEach(b => b.hidden = false);
            pointer.hidden = false;

            skillButtons.forEach((btn, i) => {
                const skill = skills[i];
                if (!skill) {
                    btn.hidden = true;
                    return;
                }
                btn.hidden = false;

                // Update Label
                const label = btn.get("label")[0];
                const shadow = btn.get("shadow")[0];
                const shortName = skill.name.length > 12 ? skill.name.substring(0, 11) + "..." : skill.name;
                label.text = shadow.text = shortName.toUpperCase();

                // Update Colors
                const skillType = skill.attribute || skill.type || "Normal";
                const colors = getSkillColors(skillType);
                btn.get("filler")[0].color = k.rgb(colors[0][0], colors[0][1], colors[0][2]);
                btn.get("gradientBottom")[0].color = k.rgb(colors[1][0], colors[1][1], colors[1][2]);

                const targetScale = (i === selectedIndex) ? 1.05 : 1;
                btn.scale = k.lerp(btn.scale, k.vec2(targetScale), k.dt() * 5);
            });

            const targetPos = SKILL_BTN_POSITIONS[selectedIndex];
            pointer.pos = k.vec2(targetPos.x - 100, targetPos.y);

            const selectedSkill = skills[selectedIndex];
            if (selectedSkill && log) {
                const typeText = (selectedSkill.attribute || selectedSkill.type || "NORMAL").toUpperCase();
                log.updateLog(`[${typeText}] ${selectedSkill.name.toUpperCase()} - (${selectedSkill.mpCost} JUICE) ${selectedSkill.description}`, false);
            }
        },
        hide() {
            menuContainer.hidden = true;
        },
        show() {
            menuContainer.hidden = false;
        }
    };
}
