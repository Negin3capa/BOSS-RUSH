import k from "../kaplayCtx";
import { COLORS, LAYOUT, SCREEN_WIDTH, SCREEN_HEIGHT, UI } from "../constants";
import { RARITY_COLORS } from "../data/skills";

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

        // Selection Border (Red)
        const selectionBorder = container.add([
            k.rect(210, 120),
            k.pos(-5, -5),
            k.color(COLORS.hp),
            k.z(-1),
        ]);
        selectionBorder.hidden = true;

        // Window Background (White)
        const mainBox = container.add([
            k.rect(200, 110),
            k.color(COLORS.uiBackground),
            k.outline(UI.OUTLINE, COLORS.uiBorder),
        ]);

        // Fallen Overlay (Grey semi-transparent)
        const fallenOverlay = container.add([
            k.rect(200, 110),
            k.color(100, 100, 120),
            k.opacity(0.5),
            k.z(10),
        ]);
        fallenOverlay.hidden = true;

        // Name Tag Box
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
            k.sprite("heart"),
            k.pos(barX + 10, hpY + 7.5),
            k.anchor("center"),
            k.scale(0.025), // Adjusted scale to fit 15px height bar better
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
                    const targetWidth = Math.max(0, (char.hp / char.maxHp)) * (barWidth - 4);
                    this.width = k.lerp(this.width, targetWidth, k.dt() * 10);
                }
            }
        ]);

        const hpText = container.add([
            k.text(`${Math.floor(char.hp)}/${char.maxHp}`, { size: 12, font: "Inter" }),
            k.pos(barX + 25, hpY + 16),
            k.color(COLORS.text),
            {
                update() {
                    const currentHp = Math.floor(char.hp);
                    this.text = `${currentHp}/${char.maxHp}`;
                    this.color = currentHp <= 0 ? k.rgb(255, 50, 50) : COLORS.text;
                }
            }
        ]);

        // MP Bar
        const mpY = 74;

        container.add([
            k.sprite("droplet"),
            k.pos(barX + 10, mpY + 7.5),
            k.anchor("center"),
            k.scale(0.025),
        ]);

        container.add([
            k.rect(barWidth, LAYOUT.BAR_HEIGHT),
            k.pos(barX + 25, mpY),
            k.color(COLORS.uiBorder),
        ]);

        const mpFill = container.add([
            k.rect(barWidth - 4, LAYOUT.BAR_HEIGHT - 4),
            k.pos(barX + 27, mpY + 2),
            k.color(COLORS.mp),
            {
                update() {
                    const targetWidth = (char.mp / char.maxMp) * (barWidth - 4);
                    this.width = k.lerp(this.width, Math.max(0, targetWidth), k.dt() * 10);
                }
            }
        ]);

        const mpText = container.add([
            k.text(`${Math.floor(char.mp)}/${char.maxMp}`, { size: 12, font: "Inter" }),
            k.pos(barX + 25, mpY + 16),
            k.color(COLORS.text),
            {
                update() {
                    const currentMp = Math.max(0, Math.floor(char.mp));
                    this.text = `${currentMp}/${char.maxMp}`;
                }
            }
        ]);

        // Status Indicators (Arrows)
        const statusContainer = container.add([
            k.pos(25, -15), // Top of the name tag box, left side
        ]);

        const statusIcons = ["attack", "defense"].map((stat, i) => {
            return statusContainer.add([
                k.text("", { size: 24, font: "Inter" }), // Switched to Inter for better character support
                k.pos(i * 20, 0),
                k.anchor("center"),
                k.outline(3, [0, 0, 0]), // Dark outline for better visibility on all backgrounds
                {
                    update() {
                        const effect = char.statusEffects.find(e => e.stat === stat);
                        if (effect) {
                            this.text = effect.type === "BUFF" ? "↑" : "↓";
                            if (stat === "attack") this.color = k.rgb(240, 80, 120); // Pinkish red
                            if (stat === "defense") this.color = k.rgb(100, 200, 255); // Sky blue
                        } else {
                            this.text = "";
                        }
                    }
                }
            ]);
        });

        // Status Icons (Shield)
        const shieldIcon = container.add([
            k.text("🛡️", { size: 24 }),
            k.pos(195, 105),
            k.anchor("botright"),
            k.z(102),
        ]);
        shieldIcon.hidden = true;

        // Auto-update visuals based on character state
        container.onUpdate(() => {
            shieldIcon.hidden = !char.isDefending || char.isDead;
            fallenOverlay.hidden = !char.isDead;
            if (char.isDead) {
                mainBox.color = k.rgb(150, 150, 160); // Dim the background
            } else {
                mainBox.color = k.rgb(COLORS.uiBackground[0], COLORS.uiBackground[1], COLORS.uiBackground[2]);
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
        k.text("What will you do?", {
            size: 28,
            font: "Viga",
            styles: GET_TEXT_STYLES()
        }),
        k.pos(SCREEN_WIDTH / 2, 60),
        k.anchor("center"),
        k.color(COLORS.text),
        k.fixed(),
        k.z(101),
        k.scale(1),
        {
            updateLog(msg, noPunch = false) {
                this.text = msg;
                if (!noPunch) {
                    this.scale = k.vec2(UI.PUNCH_SCALE);
                }
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
        k.text("", {
            size: 16,
            width: 480,
            font: "Inter",
            styles: GET_TEXT_STYLES()
        }),
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

    // Skill Slots for independent coloring
    const skillSlots = [];
    const slotPositions = [
        k.vec2(-140, -18), k.vec2(140, -18),
        k.vec2(-140, 22), k.vec2(140, 22)
    ];

    for (let i = 0; i < 4; i++) {
        const slot = mainMenuWindow.add([
            k.text("", {
                size: 24,
                font: "Viga",
                styles: GET_TEXT_STYLES()
            }),
            k.pos(slotPositions[i]),
            k.anchor("center"),
        ]);
        skillSlots.push(slot);
    }

    return {
        updateMainMenu(selectedIndex) {
            infoBox.hidden = true;
            menuContainer.hidden = false;
            skillSlots.forEach(s => s.text = "");
            mainMenuText.hidden = false;

            const formatBtn = (i, label) => (i === selectedIndex ? `> ${label} <` : `  ${label}  `);
            const row1 = `${formatBtn(0, "FIGHT")}    ${formatBtn(1, "SKILL")}`;
            const row2 = `${formatBtn(2, "DEFEND")}    ${formatBtn(3, "ITEM")}`;
            mainMenuText.text = `${row1}\n${row2}`;
        },
        updateSkillMenu(skills, selectedIndex) {
            infoBox.hidden = false;
            menuContainer.hidden = false;
            mainMenuText.hidden = true;

            if (!skills || skills.length === 0) {
                skillSlots[0].text = "No Skills";
                skillSlots[0].color = k.rgb(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
                [1, 2, 3].forEach(i => skillSlots[i].text = "");
                return;
            }

            skillSlots.forEach((slot, i) => {
                const skill = skills[i];
                if (!skill) {
                    slot.text = "   ---   ";
                    slot.color = k.rgb(100, 100, 100);
                    return;
                }
                const cursor = (i === selectedIndex) ? ">" : " ";
                // Just wrap the name in rarity tag
                slot.text = `${cursor} [${skill.rarity}]${skill.name}[/${skill.rarity}] ${cursor}`;
                slot.color = k.rgb(COLORS.text[0], COLORS.text[1], COLORS.text[2]); // Default text color
            });

            const selectedSkill = skills[selectedIndex];
            if (selectedSkill) {
                infoText.text = `${selectedSkill.name.toUpperCase()} [[${selectedSkill.rarity}]${selectedSkill.rarity}[/${selectedSkill.rarity}]]\n(${selectedSkill.mpCost} MP) ${selectedSkill.description}`;
                infoText.color = k.rgb(COLORS.text[0], COLORS.text[1], COLORS.text[2]); // Default text color
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
