import k from "../kaplayCtx";
import { COLORS, LAYOUT, SCREEN_WIDTH, SCREEN_HEIGHT, UI } from "../constants";

export function createBattleUI(gameState) {
    const uiContainer = k.add([
        k.fixed(),
        k.z(100),
    ]);

    // Create Player UI in Corners
    gameState.party.forEach((char, index) => {
        const pos = LAYOUT.POSITIONS[index] || { x: 0, y: 0 };

        const container = uiContainer.add([
            k.pos(pos.x, pos.y),
        ]);

        // Portrait Shadow (Offset)
        container.add([
            k.rect(200, 100),
            k.pos(UI.SHADOW, UI.SHADOW),
            k.color(COLORS.shadow),
        ]);

        // Portrait Frame/Background
        container.add([
            k.rect(200, 100),
            k.color(COLORS.uiBackground),
            k.outline(UI.OUTLINE, COLORS.uiBorder),
        ]);

        // Name
        container.add([
            k.text(char.name, { size: 20, font: "Viga" }),
            k.pos(10, 10),
            k.color(COLORS.text),
        ]);

        // HP Bar
        const hpY = 40;
        const barX = 10;

        // HP Bar Bg
        container.add([
            k.rect(LAYOUT.BAR_WIDTH, LAYOUT.BAR_HEIGHT),
            k.pos(barX, hpY),
            k.color(COLORS.shadow),
        ]);

        const hpFill = container.add([
            k.rect(LAYOUT.BAR_WIDTH, LAYOUT.BAR_HEIGHT),
            k.pos(barX, hpY),
            k.color(COLORS.hp),
            k.outline(2, COLORS.uiBorder),
            {
                update() {
                    const targetWidth = (char.hp / char.maxHp) * LAYOUT.BAR_WIDTH;
                    this.width = k.lerp(this.width, targetWidth, k.dt() * 10);
                }
            }
        ]);

        container.add([
            k.text("HP", { size: 12, font: "Inter" }),
            k.pos(barX + 5, hpY + 2),
            k.color(COLORS.text),
            k.z(101),
        ]);

        container.add([
            k.text("", { size: 12, font: "Inter" }),
            k.pos(barX + LAYOUT.BAR_WIDTH - 5, hpY + 2),
            k.anchor("right"),
            k.z(101),
            {
                update() {
                    this.text = `${Math.ceil(char.hp)}/${char.maxHp}`;
                }
            }
        ]);


        // SP Bar
        const spY = 65;

        // SP Bar Bg
        container.add([
            k.rect(LAYOUT.BAR_WIDTH, LAYOUT.BAR_HEIGHT),
            k.pos(barX, spY),
            k.color(COLORS.shadow),
        ]);

        const spFill = container.add([
            k.rect(LAYOUT.BAR_WIDTH, LAYOUT.BAR_HEIGHT),
            k.pos(barX, spY),
            k.color(COLORS.sp),
            k.outline(2, COLORS.uiBorder),
            {
                update() {
                    const targetWidth = (char.sp / char.maxSp) * LAYOUT.BAR_WIDTH;
                    this.width = k.lerp(this.width, targetWidth, k.dt() * 10);
                }
            }
        ]);

        container.add([
            k.text("SP", { size: 12, font: "Inter" }),
            k.pos(barX + 5, spY + 2),
            k.color(COLORS.text),
            k.z(101),
        ]);

        container.add([
            k.text("", { size: 12, font: "Inter" }),
            k.pos(barX + LAYOUT.BAR_WIDTH - 5, spY + 2),
            k.anchor("right"),
            k.z(101),
            {
                update() {
                    this.text = `${Math.ceil(char.sp)}/${char.maxSp}`;
                }
            }
        ]);

        // Status Overlay
        container.add([
            k.text("", { size: 28, font: "Viga" }),
            k.pos(100, 50),
            k.anchor("center"),
            k.color(COLORS.highlight),
            k.z(102),
            k.scale(1),
            {
                update() {
                    if (char.isDead) {
                        this.text = "DEAD";
                        this.color = COLORS.hp;
                    } else if (char.isDefending) {
                        this.text = "DEFEND";
                        this.color = COLORS.highlight;
                    } else {
                        this.text = "";
                    }
                    this.scale = k.vec2(1 + Math.sin(k.time() * 10) * 0.1);
                }
            }
        ]);
    });

    return uiContainer;
}

export function createMessageLog() {
    // Top box for messages
    const logBox = k.add([
        k.rect(SCREEN_WIDTH - 400, 60),
        k.pos(SCREEN_WIDTH / 2 + UI.SHADOW, 10 + UI.SHADOW), // Shadow
        k.color(COLORS.shadow),
        k.anchor("top"),
        k.fixed(),
        k.z(89),
    ]);

    const frame = k.add([
        k.rect(SCREEN_WIDTH - 400, 60),
        k.pos(SCREEN_WIDTH / 2, 10),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
        k.anchor("top"),
        k.fixed(),
        k.z(90),
    ]);

    const logText = k.add([
        k.text("Battle Started!", { size: 24, font: "Viga" }),
        k.pos(SCREEN_WIDTH / 2, 40),
        k.anchor("center"),
        k.color(COLORS.text),
        k.fixed(),
        k.z(101),
        k.scale(1),
        {
            updateLog(msg) {
                this.text = msg;
                // Punch effect
                this.scale = k.vec2(UI.PUNCH_SCALE);
            },
            update() {
                this.scale = k.lerp(this.scale, k.vec2(1), k.dt() * 10);
            }
        }
    ]);

    return logText;
}

export function createTurnCounter() {
    const container = k.add([
        k.pos(20, 20), // Top-Left but absolute top, portrait is at y=120
        k.fixed(),
        k.z(100),
    ]);

    container.add([
        k.rect(120, 40),
        k.pos(UI.SHADOW, UI.SHADOW),
        k.color(COLORS.shadow),
    ]);

    container.add([
        k.rect(120, 40),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
    ]);

    const label = container.add([
        k.text("Turn: 1", { size: 20, font: "Viga" }),
        k.pos(10, 10),
        k.color(COLORS.highlight),
        {
            updateCount(num) {
                this.text = `Turn: ${num}`;
            }
        }
    ]);

    return label;
}

export function createMenuSystem() {
    // Container for Menus
    const menuContainer = k.add([
        k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 60),
        k.anchor("center"),
        k.z(200),
        k.fixed(),
    ]);

    // Info Box Shadow
    const infoShadow = k.add([
        k.rect(600, 100),
        k.pos(SCREEN_WIDTH / 2 + UI.SHADOW, SCREEN_HEIGHT - 170 + UI.SHADOW),
        k.anchor("center"),
        k.color(COLORS.shadow),
        k.z(198),
        k.fixed(),
    ]);

    const infoBox = k.add([
        k.rect(600, 100),
        k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 170),
        k.anchor("center"),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
        k.z(199),
        k.fixed(),
    ]);

    infoBox.hidden = true;
    infoShadow.hidden = true;

    const infoText = infoBox.add([
        k.text("", { size: 18, width: 580, font: "Inter" }),
        k.anchor("center"),
        k.color(COLORS.text),
    ]);

    const mainMenuText = menuContainer.add([
        k.text("", { size: 32, font: "Viga" }),
        k.anchor("center"),
        k.color(COLORS.text),
    ]);

    return {
        updateMainMenu(selectedIndex) {
            infoBox.hidden = true;
            const formatBtn = (i, label) => (i === selectedIndex ? `> ${label} <` : `  ${label}  `);
            const row1 = `${formatBtn(0, "FIGHT")}    ${formatBtn(1, "SKILL")}`;
            const row2 = `${formatBtn(2, "DEFEND")}    ${formatBtn(3, "ITEM")}`;
            mainMenuText.text = `${row1}\n\n${row2}`;
        },
        updateSkillMenu(skills, selectedIndex) {
            infoBox.hidden = false;
            // Skills: 4 items (0-3)
            // 0 1
            // 2 3
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
            mainMenuText.text = rows.join("\n\n");

            // Update Info Box
            const selectedSkill = skills[selectedIndex];
            if (selectedSkill) {
                infoText.text = `${selectedSkill.name} (${selectedSkill.spCost} SP) [${selectedSkill.attribute}]\n${selectedSkill.description}`;
            } else {
                infoText.text = "";
            }
        },
        hide() {
            mainMenuText.text = "";
            infoBox.hidden = true;
            infoShadow.hidden = true;
        },
        showLog(msg) {
            // Re-using common log
        }
    };
}
