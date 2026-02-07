import k from "../kaplayCtx";
import { COLORS, LAYOUT, SCREEN_WIDTH, SCREEN_HEIGHT, UI, ATTRIBUTE_COLORS } from "../constants";
import { RARITY_COLORS } from "../data/skills";
import gsap from "gsap";

export function createBattleUI(gameState, initialTurnCount = 1) {
    const uiContainer = k.add([
        k.fixed(),
        k.z(100),
    ]);

    const portraitUIs = [];

    // Create Player UI in Corners
    gameState.party.forEach((char, index) => {
        const pos = LAYOUT.POSITIONS[index] || { x: 0, y: 0 };

        const container = uiContainer.add([
            k.pos(pos.x, pos.y),
        ]);

        // Selection Border (Red)
        const selectionBorder = container.add([
            k.rect(210, 272),
            k.pos(-5, -205),
            k.color(COLORS.hp),
            k.z(-1),
        ]);
        selectionBorder.hidden = true;

        // Character Panel Layout
        // Portrait Box (200x200) + Stats Box (200x110)

        // Portrait Box
        const portraitBox = container.add([
            k.rect(200, 200),
            k.pos(0, -200), // Sits above stats box
            k.color(COLORS.uiBackground),
            k.outline(UI.OUTLINE, COLORS.uiBorder),
        ]);

        // Portrait Sprite
        const portraitSprite = portraitBox.add([
            k.sprite(`${char.name}Sprite`),
            k.anchor("center"),
            k.pos(100, 100),
            k.scale(0.34), // Fit inside 200x200
        ]);

        // Hurt Sprite (hidden by default)
        const hurtSprite = portraitBox.add([
            k.sprite(`Hurt${char.name}`),
            k.anchor("center"),
            k.pos(100, 100),
            k.scale(0.34),
            k.opacity(0), // Hidden by default
        ]);

        // Downed Sprite (hidden by default)
        const downedSprite = portraitBox.add([
            k.sprite(`Downed${char.name}`),
            k.anchor("center"),
            k.pos(100, 100),
            k.scale(0.34),
            k.opacity(0), // Hidden by default
        ]);

        // Header Label (e.g., NEUTRAL)
        portraitBox.add([
            k.rect(133, 30),
            k.pos(98, 5), // Lowered slightly
            k.anchor("center"),
            k.color(COLORS.uiBorder),
            k.outline(2, COLORS.uiBackground),
        ]);

        portraitBox.add([
            k.text("NEUTRAL", { size: 16, font: "Viga" }),
            k.pos(100, 5), // Lowered slightly
            k.anchor("center"),
            k.color(COLORS.uiBackground),
        ]);

        // Window Background (White) - Stats Box
        const mainBox = container.add([
            k.rect(200, 62),
            k.color(COLORS.uiBackground),
            k.outline(UI.OUTLINE, COLORS.uiBorder),
        ]);

        // Fallen Overlay
        const fallenOverlay = container.add([
            k.rect(200, 262), // Covers both portrait and stats
            k.pos(0, -200),
            k.color(100, 100, 120),
            k.opacity(0.5),
            k.z(10),
        ]);
        fallenOverlay.hidden = true;

        // Level Display (Moved to portrait box)
        portraitBox.add([
            k.text(`LV: ${char.level}`, { size: 14, font: "Viga" }),
            k.pos(190, 190),
            k.anchor("botright"),
            k.color(COLORS.text),
            {
                update() {
                    this.text = `LV: ${char.level}`;
                }
            }
        ]);

        // HP Bar
        const hpY = 8;
        const barX = 10;
        const barOffset = 35;
        const barWidth = 145;
        const barHeight = 18;

        container.add([
            k.sprite("heart"),
            k.pos(barX + 10, hpY + barHeight / 2),
            k.anchor("center"),
            k.scale(0.03),
            k.z(5),
            // Use multiply blend to make white background transparent on colored bars
            // @ts-ignore
            { blend: "multiply" },
        ]);

        container.add([
            k.rect(barWidth, barHeight),
            k.pos(barX + barOffset, hpY),
            k.color(COLORS.uiBorder),
            k.outline(2, COLORS.uiBorder),
        ]);

        const hpFill = container.add([
            k.rect(barWidth - 4, barHeight - 4),
            k.pos(barX + barOffset + 2, hpY + 2),
            k.color(COLORS.hp),
            {
                update() {
                    const targetWidth = Math.max(0, (char.hp / char.maxHp)) * (barWidth - 4);
                    this.width = k.lerp(this.width, targetWidth, k.dt() * 10);
                }
            }
        ]);

        const hpText = container.add([
            k.text(`${Math.floor(char.hp)}/${char.maxHp}`, { size: 12, font: "Viga" }),
            k.pos(barX + barOffset + barWidth - 6, hpY + barHeight / 2),
            k.anchor("right"),
            k.color(255, 255, 255),
            k.z(6),
            {
                update() {
                    const currentHp = Math.floor(char.hp);
                    this.text = `${currentHp}/${char.maxHp}`;
                }
            }
        ]);

        // Juice Bar
        const juiceY = 32;

        container.add([
            k.sprite("droplet"),
            k.pos(barX + 10, juiceY + barHeight / 2),
            k.anchor("center"),
            k.scale(0.03),
            k.z(5),
            // Use multiply blend to make white background transparent on colored bars
            // @ts-ignore
            { blend: "multiply" },
        ]);

        container.add([
            k.rect(barWidth, barHeight),
            k.pos(barX + barOffset, juiceY),
            k.color(COLORS.uiBorder),
            k.outline(2, COLORS.uiBorder),
        ]);

        const juiceFill = container.add([
            k.rect(barWidth - 4, barHeight - 4),
            k.pos(barX + barOffset + 2, juiceY + 2),
            k.color(COLORS.mp),
            {
                update() {
                    const targetWidth = (char.juice / char.maxJuice) * (barWidth - 4);
                    this.width = k.lerp(this.width, Math.max(0, targetWidth), k.dt() * 10);
                }
            }
        ]);

        const juiceText = container.add([
            k.text(`${Math.floor(char.juice)}/${char.maxJuice}`, { size: 12, font: "Viga" }),
            k.pos(barX + barOffset + barWidth - 6, juiceY + barHeight / 2),
            k.anchor("right"),
            k.color(255, 255, 255),
            k.z(6),
            {
                update() {
                    const currentJuice = Math.max(0, Math.floor(char.juice));
                    this.text = `${currentJuice}/${char.maxJuice}`;
                }
            }
        ]);

        // Status Icons (Arrows & Shield)
        const statusContainer = container.add([
            k.pos(15, -185), // Move to top of portrait box
        ]);

        ["attack", "defense"].forEach((stat, i) => {
            statusContainer.add([
                k.text("", { size: 24, font: "Inter" }),
                k.pos(i * 20, 0),
                k.anchor("center"),
                k.outline(3, [0, 0, 0]),
                {
                    update() {
                        const effect = char.statusEffects.find(e => e.stat === stat);
                        if (effect) {
                            this.text = effect.type === "BUFF" ? "↑" : "↓";
                            if (stat === "attack") this.color = k.rgb(240, 80, 120);
                            if (stat === "defense") this.color = k.rgb(100, 200, 255);
                        } else {
                            this.text = "";
                        }
                    }
                }
            ]);
        });

        const shieldIcon = container.add([
            k.text("🛡️", { size: 24 }),
            k.pos(195, 40),
            k.anchor("botright"),
            k.z(102),
        ]);
        shieldIcon.hidden = true;



        // Auto-update visuals based on character state
        container.onUpdate(() => {
            shieldIcon.hidden = !char.isDefending || char.isDead;
            fallenOverlay.hidden = !char.isDead;

            // Sprite State Management
            if (char.isDead) {
                // Show downed sprite, hide others
                portraitSprite.opacity = 0;
                hurtSprite.opacity = 0;
                downedSprite.opacity = 1;
            } else if (char.isHurt) {
                // Show hurt sprite, hide others
                portraitSprite.opacity = 0;
                hurtSprite.opacity = 1;
                downedSprite.opacity = 0;
            } else {
                // Show normal sprite, hide others
                portraitSprite.opacity = 1;
                hurtSprite.opacity = 0;
                downedSprite.opacity = 0;
            }
        });

        portraitUIs.push({ selectionBorder });
    });

    return {
        ui: uiContainer,
        updateSelection(selection) {
            portraitUIs.forEach((p, i) => {
                let isSelected = false;
                if (Array.isArray(selection)) {
                    isSelected = selection.includes(i);
                } else if (selection === "ALL_ALLIES") {
                    isSelected = !gameState.party[i].isDead;
                } else {
                    isSelected = (i === selection);
                }
                p.selectionBorder.hidden = !isSelected;
            });
        }
    };
}

const GET_TEXT_STYLES = () => {
    const styles = {};
    Object.keys(RARITY_COLORS).forEach(rarity => {
        const c = RARITY_COLORS[rarity];
        styles[rarity] = { color: k.rgb(c[0], c[1], c[2]) };
    });
    return styles;
};

export function createMessageLog() {
    const frameWidth = 500;
    const frameHeight = 90; // Slightly shorter for 3 lines

    const frame = k.add([
        k.rect(frameWidth, frameHeight),
        k.pos(LAYOUT.CENTER_X, 15),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
        k.anchor("top"),
        k.fixed(),
        k.z(90),
    ]);

    const messages = []; // Array of { label }
    const MAX_MESSAGES = 3;
    const LINE_HEIGHT = 22;

    const logContainer = k.add([
        k.pos(LAYOUT.CENTER_X - (frameWidth / 2) + 15, 25),
        k.fixed(),
        k.z(101),
    ]);

    const refreshPositions = () => {
        messages.forEach((m, i) => {
            m.pos.y = i * LINE_HEIGHT;
            // Opacity logic: latest is brightest, others dim slightly for focus
            m.opacity = (i === messages.length - 1) ? 1 : 0.7;
        });
    };

    const logObj = {
        frame,
        updateLog(msg, scroll = false, color = COLORS.text) {
            // Avoid duplicate consecutive messages (only if we are NOT scrolling/clearing)
            if (!scroll && messages.length > 0 && messages[messages.length - 1].text === msg) return;

            if (!scroll) {
                // Replace Mode (Clear all)
                messages.forEach(m => k.destroy(m));
                messages.length = 0;
            }

            // Create new label
            const label = logContainer.add([
                k.pos(0, 0),
                k.text(msg, {
                    size: 16,
                    width: frameWidth - 30,
                    font: "Viga",
                    styles: GET_TEXT_STYLES()
                }),
                k.color(color[0], color[1], color[2]),
                k.opacity(1),
            ]);

            messages.push(label);

            if (messages.length > MAX_MESSAGES) {
                const oldest = messages.shift();
                k.destroy(oldest);
            }

            refreshPositions();
        }
    };

    // Initial message
    logObj.updateLog("What will you do?");

    return logObj;
}

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


export function createTurnCounter() {
    const container = k.add([
        k.pos(25, 25),
        k.fixed(),
        k.z(100),
    ]);

    container.add([
        k.rect(130, 45),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
    ]);

    const label = container.add([
        k.text("Turn: 1", { size: 22, font: "Viga" }),
        k.pos(65, 22),
        k.anchor("center"),
        k.color(COLORS.text),
        {
            updateCount(num) {
                this.text = `Turn: ${num}`;
            }
        }
    ]);

    return label;
}

export function createRoundCounter(gameState) {
    const container = k.add([
        k.pos(SCREEN_WIDTH - 155, 25),
        k.fixed(),
        k.z(100),
    ]);

    container.add([
        k.rect(130, 45),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
    ]);

    const label = container.add([
        k.text(`Round: ${gameState.roundCounter}`, { size: 22, font: "Viga" }),
        k.pos(65, 22),
        k.anchor("center"),
        k.color(COLORS.text),
        {
            update() {
                this.text = `Round: ${gameState.roundCounter}`;
            }
        }
    ]);

    return label;
}

export function createMenuSystem(log) {
    const menuContainer = k.add([
        k.pos(LAYOUT.CENTER_X, SCREEN_HEIGHT - 70),
        k.anchor("center"),
        k.z(200),
        k.fixed(),
    ]);

    const getSkillColors = (type = "Normal") => {
        // Handle potential case mismatches (Fire vs FIRE vs fire)
        const upperType = type.toUpperCase();
        const baseColor = ATTRIBUTE_COLORS[upperType] ||
            ATTRIBUTE_COLORS[type] ||
            ATTRIBUTE_COLORS[Object.keys(ATTRIBUTE_COLORS).find(k => k.toUpperCase() === upperType)] ||
            [180, 180, 180];

        // Multiplicative darkening (0.7x) maintains saturation better than linear subtraction
        const darkColor = baseColor.map(c => Math.floor(c * 0.7));
        return [baseColor, darkColor];
    };

    // New Skill Buttons
    const skillButtons = [];
    const skillBtnPositions = [
        k.vec2(-130, -30), k.vec2(130, -30),
        k.vec2(-130, 30), k.vec2(130, 30)
    ];

    for (let i = 0; i < 4; i++) {
        const btn = menuContainer.add([
            k.pos(skillBtnPositions[i]),
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
            k.text("", { size: 20, font: "Viga", styles: GET_TEXT_STYLES() }),
            k.anchor("center"),
            k.pos(2, 2),
            k.color(0, 0, 0),
            k.opacity(0.5),
            "shadow"
        ]);

        btn.add([
            k.text("", { size: 20, font: "Viga", styles: GET_TEXT_STYLES() }),
            k.anchor("center"),
            k.color(255, 255, 255),
            "label"
        ]);

        skillButtons.push(btn);
    }

    // New Action Buttons
    const actionButtons = [];
    const actionData = [
        { label: "FIGHT", colors: [[255, 60, 40], [180, 20, 0]] },    // Red/Orange
        { label: "SKILL", colors: [[0, 160, 240], [0, 80, 160]] },   // Blue
        { label: "DEFEND", colors: [[255, 200, 40], [220, 100, 20]] }, // Yellow/Orange
        { label: "ITEM", colors: [[120, 200, 60], [40, 140, 20]] }    // Green
    ];

    const btnPositions = [
        k.vec2(-130, -30), k.vec2(130, -30),
        k.vec2(-130, 30), k.vec2(130, 30)
    ];

    actionData.forEach((data, i) => {
        const btn = menuContainer.add([
            k.pos(btnPositions[i]),
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
        const filler = btn.add([
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
            k.text(data.label, { size: 24, font: "Viga", styles: GET_TEXT_STYLES() }),
            k.anchor("center"),
            k.pos(2, 2), // Shadow
            k.color(0, 0, 0),
            k.opacity(0.5),
        ]);

        btn.add([
            k.text(data.label, { size: 24, font: "Viga", styles: GET_TEXT_STYLES() }),
            k.anchor("center"),
            k.color(255, 255, 255),
        ]);

        actionButtons.push(btn);
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

            const targetPos = btnPositions[selectedIndex];
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

            const targetPos = skillBtnPositions[selectedIndex];
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

