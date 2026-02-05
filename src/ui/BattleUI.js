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
            k.rect(210, 320),
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
        portraitBox.add([
            k.sprite(`${char.name}Sprite`),
            k.anchor("center"),
            k.pos(100, 100),
            k.scale(0.34), // Fit inside 200x200
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
            k.rect(200, 110),
            k.color(COLORS.uiBackground),
            k.outline(UI.OUTLINE, COLORS.uiBorder),
        ]);

        // Fallen Overlay (Fixed reference here as well)
        const fallenOverlay = container.add([
            k.rect(200, 310), // Covers both portrait and stats
            k.pos(0, -200),
            k.color(100, 100, 120),
            k.opacity(0.5),
            k.z(10),
        ]);
        fallenOverlay.hidden = true;

        // Level Display
        container.add([
            k.text(`LV: ${char.level}`, { size: 14, font: "Viga" }),
            k.pos(190, 10),
            k.anchor("right"),
            k.color(COLORS.text),
            {
                update() {
                    this.text = `LV: ${char.level}`;
                }
            }
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

        // Juice Bar (Renamed from MP)
        const juiceY = 74;

        container.add([
            k.sprite("droplet"),
            k.pos(barX + 10, juiceY + 7.5),
            k.anchor("center"),
            k.scale(0.025),
        ]);

        container.add([
            k.rect(barWidth, LAYOUT.BAR_HEIGHT),
            k.pos(barX + 25, juiceY),
            k.color(COLORS.uiBorder),
        ]);

        const juiceFill = container.add([
            k.rect(barWidth - 4, LAYOUT.BAR_HEIGHT - 4),
            k.pos(barX + 27, juiceY + 2),
            k.color(COLORS.mp),
            {
                update() {
                    const targetWidth = (char.juice / char.maxJuice) * (barWidth - 4);
                    this.width = k.lerp(this.width, Math.max(0, targetWidth), k.dt() * 10);
                }
            }
        ]);

        const juiceText = container.add([
            k.text(`${Math.floor(char.juice)}/${char.maxJuice}`, { size: 12, font: "Inter" }),
            k.pos(barX + 25, juiceY + 16),
            k.color(COLORS.text),
            {
                update() {
                    const currentJuice = Math.max(0, Math.floor(char.juice));
                    this.text = `${currentJuice}/${char.maxJuice}`;
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
                // mainBox.color = k.rgb(150, 150, 160); // Optional: dim individual boxes
            } else {
                // mainBox.color = k.rgb(COLORS.uiBackground[0], COLORS.uiBackground[1], COLORS.uiBackground[2]);
            }
        });

        portraitUIs.push({ selectionBorder });
    });

    const sidePanel = createSidePanel(gameState);

    return {
        ui: uiContainer,
        sidePanel,
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
        k.rect(500, 100), // Same size as Action Box
        k.pos(LAYOUT.CENTER_X, 20),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
        k.anchor("top"),
        k.fixed(),
        k.z(90),
    ]);

    const logText = k.add([
        k.text("What will you do?", {
            size: 24, // Smaller to account for more text/frame constraints
            width: 460,
            font: "Viga",
            styles: GET_TEXT_STYLES()
        }),
        k.pos(LAYOUT.CENTER_X, 70),
        k.anchor("center"),
        k.color(COLORS.text),
        k.fixed(),
        k.z(101),
        k.scale(1),
        {
            updateLog(msg, noPunch = false, color = COLORS.text) {
                this.text = msg;
                this.color = k.rgb(color[0], color[1], color[2]);
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
        k.pos(LAYOUT.CENTER_X, SCREEN_HEIGHT - 70),
        k.anchor("center"),
        k.z(200),
        k.fixed(),
    ]);

    const infoBox = k.add([
        k.rect(500, 100),
        k.pos(LAYOUT.CENTER_X, SCREEN_HEIGHT - 170),
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
                infoText.text = `${selectedSkill.name.toUpperCase()} [[${selectedSkill.rarity}]${selectedSkill.rarity}[/${selectedSkill.rarity}]]\n(${selectedSkill.mpCost} JUICE) ${selectedSkill.description}`;
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

export function createSidePanel(gameState) {
    const container = k.add([
        k.pos(0, 0),
        k.fixed(),
        k.z(80),
    ]);

    // Background
    container.add([
        k.rect(320, SCREEN_HEIGHT),
        k.color(40, 40, 50),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
    ]);

    // Enemy Name Header Area
    container.add([
        k.rect(280, 50),
        k.pos(20, 20),
        k.color(200, 150, 50), // Gold-ish
        k.outline(4, COLORS.uiBorder),
    ]);

    const enemyNameText = container.add([
        k.text("ENEMY NAME HERE", { size: 20, font: "Viga" }),
        k.pos(160, 45),
        k.anchor("center"),
        k.color(COLORS.uiBackground),
    ]);

    // Scoring Section
    const scoreBox = container.add([
        k.rect(280, 140),
        k.pos(20, 90),
        k.color(60, 60, 70),
        k.outline(3, COLORS.uiBorder),
    ]);

    scoreBox.add([
        k.text("Score at least", { size: 14, font: "Viga" }),
        k.pos(140, 20),
        k.anchor("center"),
        k.color(200, 200, 200),
    ]);

    const targetScoreText = scoreBox.add([
        k.text("", { size: 40, font: "Viga" }),
        k.pos(140, 60),
        k.anchor("center"),
        k.color(240, 80, 80), // Reddish
        {
            update() {
                this.text = `${gameState.scoringState.targetScore.toLocaleString()}`;
            }
        }
    ]);

    scoreBox.add([
        k.text("to earn $$$$", { size: 14, font: "Viga" }),
        k.pos(140, 100),
        k.anchor("center"),
        k.color(200, 200, 200),
    ]);

    // Round Score
    const roundScoreBox = container.add([
        k.rect(280, 60),
        k.pos(20, 250),
        k.color(30, 30, 40),
        k.outline(3, COLORS.uiBorder),
    ]);

    roundScoreBox.add([
        k.text("Round\nscore", { size: 18, font: "Viga" }),
        k.pos(60, 30),
        k.anchor("center"),
        k.color(COLORS.uiBackground),
    ]);

    const roundScoreText = roundScoreBox.add([
        k.text("0", { size: 30, font: "Viga" }),
        k.pos(200, 30),
        k.anchor("center"),
        k.color(255, 255, 255),
        {
            update() {
                this.text = gameState.scoringState.roundScore.toLocaleString();
            }
        }
    ]);

    // Objectives List
    const objContainer = container.add([
        k.pos(20, 330),
    ]);

    const objectiveLabels = [];
    const updateObjectives = () => {
        objectiveLabels.forEach(l => k.destroy(l));
        objectiveLabels.length = 0;

        gameState.scoringState.objectives.forEach((obj, i) => {
            const label = objContainer.add([
                k.text(obj.label, { size: 13, font: "Inter", width: 280 }),
                k.pos(0, i * 25),
                k.color(obj.completed ? [100, 255, 100] : [255, 180, 100]),
            ]);
            objectiveLabels.push(label);
        });
    };

    // Initial draw and update hook
    container.onUpdate(() => {
        // Simple hack to refresh objectives if they change (could be optimized)
        if (objectiveLabels.length !== gameState.scoringState.objectives.length) {
            updateObjectives();
        }
    });

    // Dummy Buttons
    const btnStyle = (x, y, w, h, label, color) => {
        const b = container.add([
            k.rect(w, h),
            k.pos(x, y),
            k.color(color),
            k.outline(3, COLORS.uiBorder),
            k.area(),
        ]);
        b.add([
            k.text(label, { size: 18, font: "Viga", width: w - 10 }),
            k.pos(w / 2, h / 2),
            k.anchor("center"),
            k.color(COLORS.uiBackground),
        ]);
        return b;
    };

    btnStyle(20, 600, 80, 100, "Run\nInfo", [240, 80, 80]);
    btnStyle(20, 710, 80, 40, "Options", [240, 150, 40]);

    // Turn/Round Displays
    const turnVal = container.add([
        k.text("1", { size: 24, font: "Viga" }),
        k.pos(150, 630),
        k.anchor("center"),
        k.color(COLORS.uiBackground),
        k.z(85),
    ]);
    const turnBox = btnStyle(110, 600, 80, 60, "", [60, 150, 240]);
    turnBox.add([k.text("Turn", { size: 12, font: "Viga" }), k.pos(40, -10), k.anchor("center")]);

    const roundVal = container.add([
        k.text("1", { size: 24, font: "Viga" }),
        k.pos(245, 630),
        k.anchor("center"),
        k.color(COLORS.uiBackground),
        k.z(85),
    ]);
    const roundBox = btnStyle(205, 600, 80, 60, "", [60, 70, 80]);
    roundBox.add([k.text("Round", { size: 12, font: "Viga" }), k.pos(40, -10), k.anchor("center")]);

    return {
        updateEnemyName(name) {
            enemyNameText.text = name.toUpperCase();
        },
        updateTurn(num) {
            turnVal.text = num.toString();
        },
        updateRound(num) {
            roundVal.text = num.toString();
        }
    };
}
