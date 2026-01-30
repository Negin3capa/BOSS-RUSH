import k from "../kaplayCtx";
import { COLORS, LAYOUT, SCREEN_WIDTH, SCREEN_HEIGHT, UI } from "../constants";

export function createBattleUI(gameState) {
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

        // Selection Border (Red) - Behind the main box
        const selectionBorder = container.add([
            k.rect(210, 120),
            k.pos(-5, -5),
            k.color(COLORS.hp), // Red selection
            k.z(-1),
        ]);
        selectionBorder.hidden = true;

        // Window Background (White)
        container.add([
            k.rect(200, 110),
            k.color(COLORS.uiBackground),
            k.outline(UI.OUTLINE, COLORS.uiBorder),
        ]);

        // Name Tag Box (Black tab)
        container.add([
            k.rect(180, 25),
            k.pos(10, -15),
            k.color(COLORS.uiBorder),
        ]);

        container.add([
            k.text(char.name.toUpperCase(), { size: 18, font: "Viga" }),
            k.pos(100, -2),
            k.anchor("center"),
            k.color(COLORS.uiBackground),
        ]);

        // HP Bar
        const hpY = 32;
        const barX = 10;
        const barWidth = LAYOUT.BAR_WIDTH - 25;

        container.add([
            k.text("❤", { size: 16 }),
            k.pos(barX, hpY + 2),
            k.color(COLORS.hp),
        ]);

        container.add([
            k.rect(barWidth, LAYOUT.BAR_HEIGHT),
            k.pos(barX + 25, hpY),
            k.color(COLORS.uiBorder),
        ]);

        const hpFill = container.add([
            k.rect(barWidth - 4, LAYOUT.BAR_HEIGHT - 4),
            k.pos(barX + 27, hpY + 2),
            k.color(COLORS.hp),
            {
                update() {
                    const targetWidth = (char.hp / char.maxHp) * (barWidth - 4);
                    this.width = k.lerp(this.width, Math.max(0, targetWidth), k.dt() * 10);
                }
            }
        ]);

        container.add([
            k.text(`${Math.ceil(char.hp)}/${char.maxHp}`, { size: 12, font: "Inter" }),
            k.pos(barX + 25, hpY + 16),
            k.color(COLORS.text),
        ]);

        // SP Bar
        const spY = 74;

        container.add([
            k.text("💧", { size: 16 }),
            k.pos(barX, spY + 2),
            k.color(COLORS.sp),
        ]);

        container.add([
            k.rect(barWidth, LAYOUT.BAR_HEIGHT),
            k.pos(barX + 25, spY),
            k.color(COLORS.uiBorder),
        ]);

        const spFill = container.add([
            k.rect(barWidth - 4, LAYOUT.BAR_HEIGHT - 4),
            k.pos(barX + 27, spY + 2),
            k.color(COLORS.sp),
            {
                update() {
                    const targetWidth = (char.sp / char.maxSp) * (barWidth - 4);
                    this.width = k.lerp(this.width, Math.max(0, targetWidth), k.dt() * 10);
                }
            }
        ]);

        container.add([
            k.text(`${Math.ceil(char.sp)}/${char.maxSp}`, { size: 12, font: "Inter" }),
            k.pos(barX + 25, spY + 16),
            k.color(COLORS.text),
        ]);

        // Status Overlay
        container.add([
            k.text("", { size: 14, font: "Viga" }),
            k.pos(190, 100),
            k.anchor("botright"),
            k.color(COLORS.text),
            k.z(102),
            {
                update() {
                    if (char.isDead) {
                        this.text = "FALLEN";
                        this.color = COLORS.hp;
                    } else if (char.isDefending) {
                        this.text = "SHIELDED";
                        this.color = COLORS.sp;
                    } else {
                        this.text = "NEUTRAL";
                        this.color = COLORS.text;
                    }
                }
            }
        ]);

        portraitUIs.push({ selectionBorder });
    });

    return {
        ui: uiContainer,
        updateSelection(activeIndex) {
            portraitUIs.forEach((p, i) => {
                p.selectionBorder.hidden = (i !== activeIndex);
            });
        }
    };
}

export function createMessageLog() {
    const frame = k.add([
        k.rect(SCREEN_WIDTH - 400, 80),
        k.pos(SCREEN_WIDTH / 2, 20),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
        k.anchor("top"),
        k.fixed(),
        k.z(90),
    ]);

    const logText = k.add([
        k.text("What will you do?", { size: 28, font: "Viga" }),
        k.pos(SCREEN_WIDTH / 2, 60),
        k.anchor("center"),
        k.color(COLORS.text),
        k.fixed(),
        k.z(101),
        k.scale(1),
        {
            updateLog(msg) {
                this.text = msg;
                this.scale = k.vec2(UI.PUNCH_SCALE);
            },
            update() {
                this.scale = k.lerp(this.scale, k.vec2(1), k.dt() * 8);
            }
        }
    ]);

    return logText;
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

export function createMenuSystem() {
    const menuContainer = k.add([
        k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 60),
        k.anchor("center"),
        k.z(200),
        k.fixed(),
    ]);

    const infoBox = k.add([
        k.rect(500, 80),
        k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 170),
        k.anchor("center"),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
        k.z(199),
        k.fixed(),
    ]);

    infoBox.hidden = true;

    const infoText = infoBox.add([
        k.text("", { size: 16, width: 480, font: "Inter" }),
        k.anchor("center"),
        k.color(COLORS.text),
    ]);

    const mainMenuWindow = menuContainer.add([
        k.rect(500, 100),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
        k.anchor("center"),
    ]);

    const mainMenuText = mainMenuWindow.add([
        k.text("", { size: 26, font: "Viga" }),
        k.anchor("center"),
        k.color(COLORS.text),
    ]);

    return {
        updateMainMenu(selectedIndex) {
            infoBox.hidden = true;
            menuContainer.hidden = false;
            const formatBtn = (i, label) => (i === selectedIndex ? `> ${label} <` : `  ${label}  `);
            const row1 = `${formatBtn(0, "FIGHT")}    ${formatBtn(1, "SKILL")}`;
            const row2 = `${formatBtn(2, "DEFEND")}    ${formatBtn(3, "ITEM")}`;
            mainMenuText.text = `${row1}\n${row2}`;
        },
        updateSkillMenu(skills, selectedIndex) {
            infoBox.hidden = false;
            menuContainer.hidden = false;
            if (!skills || skills.length === 0) {
                mainMenuText.text = "No Skills";
                return;
            }

            const rows = [];
            for (let i = 0; i < 4; i += 2) {
                const s1 = skills[i];
                const s2 = skills[i + 1];
                const formatSkill = (skill, idx) => {
                    if (!skill) return "   ---   ";
                    const cursor = (idx === selectedIndex) ? ">" : " ";
                    return `${cursor} ${skill.name} ${cursor}`;
                };
                rows.push(`${formatSkill(s1, i)}    ${formatSkill(s2, i + 1)}`);
            }
            mainMenuText.text = rows.join("\n");

            const selectedSkill = skills[selectedIndex];
            if (selectedSkill) {
                infoText.text = `${selectedSkill.name.toUpperCase()} (${selectedSkill.spCost} SP)\n${selectedSkill.description}`;
            }
        },
        hide() {
            menuContainer.hidden = true;
            infoBox.hidden = true;
        },
        show() {
            menuContainer.hidden = false;
        }
    };
}
