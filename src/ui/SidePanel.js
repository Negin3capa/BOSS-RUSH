import k from "../kaplayCtx";
import { COLORS, LAYOUT, SCREEN_WIDTH, SCREEN_HEIGHT, UI } from "../constants";
import gsap from "gsap";

/**
 * Global Side Panel UI Component
 * Can be configured for different scenes with different content
 * 
 * @param {Object} gameState - The game state object
 * @param {Object} options - Configuration options
 * @param {string} options.scene - Scene context: "battle", "shop", etc.
 * @param {number} options.initialTurnCount - Starting turn number
 */
export function createSidePanel(gameState, options = {}) {
    const { scene = "battle", initialTurnCount = 1 } = options;

    const container = k.add([
        k.pos(-340, 0), // Start off-screen for slide-in animation
        k.fixed(),
        k.z(80),
    ]);

    // GSAP Slide-in Animation
    gsap.to(container.pos, {
        x: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    // Dark Background (Deep Purple/Space)
    container.add([
        k.rect(320, SCREEN_HEIGHT),
        k.color(20, 15, 30),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
    ]);

    // Scene-specific content
    let contentElements = {};

    if (scene === "battle") {
        contentElements = createBattleContent(container, gameState, initialTurnCount);
    } else if (scene === "encounter_select") {
        contentElements = createEncounterSelectContent(container, gameState);
    }
    // Future scenes can add their own content configurations here
    // else if (scene === "shop") { ... }

    return {
        ...contentElements,
        destroy() {
            k.destroy(container);
        },
        hide() {
            container.hidden = true;
        },
        show() {
            container.hidden = false;
        },
        animateOut() {
            return gsap.to(container.pos, {
                x: -340,
                duration: 0.5,
                ease: "power2.in"
            });
        }
    };
}

/**
 * Creates the battle scene specific content
 */
function createBattleContent(container, gameState, initialTurnCount) {
    // Enemy Name Header Area
    container.add([
        k.rect(280, 50, { radius: 4 }),
        k.pos(20, 20),
        k.color(40, 30, 60),
        k.outline(3, [255, 255, 255]),
    ]);

    const enemyNameText = container.add([
        k.text("ENEMY NAME HERE", { size: 20, font: "Viga" }),
        k.pos(160, 45),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);

    // Scoring Section
    const scoreBox = container.add([
        k.rect(280, 140, { radius: 4 }),
        k.pos(20, 90),
        k.color(30, 25, 45),
        k.outline(2, [100, 100, 150]),
    ]);

    scoreBox.add([
        k.text("Score at least", { size: 14, font: "Viga" }),
        k.pos(140, 20),
        k.anchor("center"),
        k.color(200, 200, 255),
    ]);

    const targetScoreText = scoreBox.add([
        k.text("", { size: 40, font: "Viga" }),
        k.pos(140, 60),
        k.anchor("center"),
        k.scale(1),
        k.color(255, 80, 120), // Hot Pink
        {
            update() {
                this.text = `${gameState.scoringState.targetScore.toLocaleString()}`;
            }
        }
    ]);

    // GSAP Pulse Animation
    gsap.to(targetScoreText.scale, {
        x: 1.1,
        y: 1.1,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    scoreBox.add([
        k.text("to earn reward", { size: 14, font: "Viga" }),
        k.pos(140, 100),
        k.anchor("center"),
        k.color(200, 200, 255),
    ]);

    // Round Score
    const roundScoreBox = container.add([
        k.rect(280, 60, { radius: 4 }),
        k.pos(20, 250),
        k.color(40, 35, 60),
        k.outline(2, [100, 100, 150]),
    ]);

    roundScoreBox.add([
        k.text("Round\nscore", { size: 18, font: "Viga" }),
        k.pos(60, 30),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);

    const roundScoreText = roundScoreBox.add([
        k.text("0", { size: 30, font: "Viga" }),
        k.pos(200, 30),
        k.anchor("center"),
        k.color(251, 255, 100), // Vibrant Yellow
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
            const objWrapper = objContainer.add([
                k.pos(0, i * 30),
                k.anchor("left"),
            ]);

            const objText = objWrapper.add([
                k.text(obj.label, { 
                    size: 13, 
                    font: "Inter", 
                    width: 240 
                }),
                k.color([255, 255, 0]), // Yellow for active
            ]);

            const bonusText = objWrapper.add([
                k.text(obj.bonus.display, { 
                    size: 13, 
                    font: "Inter", 
                    width: 40 
                }),
                k.pos(245, 0),
                k.color(obj.bonus.type === "additive" ? [255, 255, 255] : [255, 80, 80]),
            ]);

            objectiveLabels.push({ container: objWrapper, objText, bonusText, obj });
        });
    };

    // Function to trigger pop-out animation for objective
    const activateObjective = (index) => {
        if (objectiveLabels[index]) {
            const { container } = objectiveLabels[index];
            container.scale = k.vec2(1.2);
            k.wait(0.1).then(() => {
                container.scale = k.vec2(1);
            });
        }
    };

    // Initial draw and update hook for objectives
    container.onUpdate(() => {
        if (objectiveLabels.length !== gameState.scoringState.objectives.length) {
            updateObjectives();
        }
        // Update objective colors based on scoring locked state
        objectiveLabels.forEach(({ objText, bonusText }) => {
            const baseColor = gameState.scoringLocked ? [120, 120, 120] : [255, 255, 0];
            objText.color = k.rgb(baseColor[0], baseColor[1], baseColor[2]);
            bonusText.opacity = gameState.scoringLocked ? 0.5 : 1;
        });
    });

    // Button helper function
    const btnStyle = (x, y, w, h, label, color) => {
        const b = container.add([
            k.rect(w, h, { radius: 6 }),
            k.pos(x, y),
            k.color(color),
            k.outline(3, [255, 255, 255]),
            k.area(),
        ]);

        b.add([
            k.text(label, { size: 18, font: "Viga", width: w - 10 }),
            k.pos(w / 2, h / 2),
            k.anchor("center"),
            k.color(255, 255, 255),
        ]);
        return b;
    };

    // Run Info and Options buttons (moved up to make room)
    btnStyle(20, 530, 80, 80, "Run\nInfo", [240, 80, 80]); // Vibrant Red
    btnStyle(20, 620, 80, 40, "Options", [240, 150, 40]);  // Vibrant Orange

    // Turn/Round Displays (smaller, positioned above Gold)
    const turnBox = btnStyle(110, 530, 80, 50, "", [60, 150, 240]);
    turnBox.add([k.text("Turn", { size: 12, font: "Viga" }), k.pos(40, -8), k.anchor("center"), k.color(255, 255, 255)]);
    
    const turnVal = container.add([
        k.text(initialTurnCount.toString(), { size: 22, font: "Viga" }),
        k.pos(150, 555),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.z(85),
    ]);

    const roundBox = btnStyle(205, 530, 80, 50, "", [100, 80, 180]);
    roundBox.add([k.text("Round", { size: 12, font: "Viga" }), k.pos(40, -8), k.anchor("center"), k.color(255, 255, 255)]);
    
    const roundVal = container.add([
        k.text(gameState.roundCounter.toString(), { size: 22, font: "Viga" }),
        k.pos(245, 555),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.z(85),
    ]);

    // Gold Display (single wide box)
    const goldBox = btnStyle(110, 590, 175, 45, "", [139, 69, 19]);
    goldBox.add([k.text("Gold", { size: 12, font: "Viga" }), k.pos(87, -8), k.anchor("center"), k.color(255, 255, 255)]);
    
    const goldVal = container.add([
        k.text(gameState.gold.toString(), { size: 20, font: "Viga" }),
        k.pos(197, 612),
        k.anchor("center"),
        k.color(255, 215, 0), // Gold color
        k.z(85),
    ]);

    // NEW: Ante Counter (x/8) - positioned below Gold on the left
    const anteBox = btnStyle(110, 645, 100, 45, "", [80, 40, 120]); // Dark purple
    anteBox.add([k.text("Ante", { size: 11, font: "Viga" }), k.pos(50, -8), k.anchor("center"), k.color(200, 180, 255)]);
    
    const anteVal = container.add([
        k.text(`${gameState.anteCounter}/8`, { size: 18, font: "Viga" }),
        k.pos(160, 667),
        k.anchor("center"),
        k.color(200, 180, 255), // Light purple
        k.z(85),
        {
            update() {
                this.text = `${gameState.anteCounter}/8`;
                // Visual feedback when approaching win condition
                if (gameState.anteCounter >= 7) {
                    this.color = k.rgb(255, 215, 0); // Gold when close to winning
                }
            }
        }
    ]);

    // NEW: Attempts Counter (single number countdown) - positioned below Gold on the right
    const attemptsBox = btnStyle(220, 645, 65, 45, "", [60, 60, 80]); // Dark gray
    attemptsBox.add([k.text("Try", { size: 11, font: "Viga" }), k.pos(32, -8), k.anchor("center"), k.color(200, 200, 200)]);
    
    const attemptsVal = container.add([
        k.text(gameState.attemptsLeft.toString(), { size: 22, font: "Viga" }),
        k.pos(252, 667),
        k.anchor("center"),
        k.color(100, 255, 100), // Green when healthy
        k.z(85),
        {
            update() {
                this.text = gameState.attemptsLeft.toString();
                // Color changes based on remaining attempts
                if (gameState.attemptsLeft === 0) {
                    this.color = k.rgb(255, 60, 60); // Red when locked
                } else if (gameState.attemptsLeft === 1) {
                    this.color = k.rgb(255, 180, 60); // Orange when low
                } else if (gameState.scoringLocked) {
                    this.color = k.rgb(255, 60, 60); // Red when locked
                } else {
                    this.color = k.rgb(100, 255, 100); // Green when healthy
                }
            }
        }
    ]);

    // Scoring locked warning indicator (optional visual feedback)
    const lockedIndicator = container.add([
        k.text("⚠️ LOCKED", { size: 14, font: "Viga" }),
        k.pos(160, 710),
        k.anchor("center"),
        k.color(255, 60, 60),
        k.opacity(0),
        k.z(85),
    ]);

    container.onUpdate(() => {
        // Fade in/out locked indicator
        const targetOpacity = gameState.scoringLocked ? 1 : 0;
        lockedIndicator.opacity = k.lerp(lockedIndicator.opacity, targetOpacity, k.dt() * 5);
    });

    return {
        updateEnemyName(name) {
            enemyNameText.text = name.toUpperCase();
        },
        updateTurn(num) {
            turnVal.text = num.toString();
        },
        updateRound(num) {
            roundVal.text = num.toString();
        },
        updateGold(num) {
            goldVal.text = num.toString();
        },
        updateAnte(num) {
            anteVal.text = `${num}/8`;
        },
        updateAttempts(num) {
            attemptsVal.text = num.toString();
        },
        updateRoundScore(score) {
            roundScoreText.text = score.toLocaleString();
            // Visual feedback - brief scale pop
            roundScoreText.scale = k.vec2(1.2);
            gsap.to(roundScoreText.scale, {
                x: 1,
                y: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        },
        setScoringLocked(locked) {
            // Visual update is handled by the onUpdate hook
        },
        activateObjective
    };
}

/**
 * Creates the encounter select scene specific content
 * Matches battle content layout with "Choose your next Battle" header
 */
function createEncounterSelectContent(container, gameState) {
    // Header Area - "Choose your next Battle"
    container.add([
        k.rect(280, 70, { radius: 4 }),
        k.pos(20, 20),
        k.color(40, 30, 60),
        k.outline(3, [255, 255, 255]),
    ]);

    container.add([
        k.text("Choose your", { size: 18, font: "Viga" }),
        k.pos(160, 38),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);

    container.add([
        k.text("next Battle", { size: 22, font: "Viga" }),
        k.pos(160, 62),
        k.anchor("center"),
        k.color(COLORS.highlight),
    ]);

    // Scoring Section - Shows target score for current encounter
    const scoreBox = container.add([
        k.rect(280, 140, { radius: 4 }),
        k.pos(20, 105),
        k.color(30, 25, 45),
        k.outline(2, [100, 100, 150]),
    ]);

    scoreBox.add([
        k.text("Score at least", { size: 14, font: "Viga" }),
        k.pos(140, 20),
        k.anchor("center"),
        k.color(200, 200, 255),
    ]);

    const targetScoreText = scoreBox.add([
        k.text("", { size: 40, font: "Viga" }),
        k.pos(140, 60),
        k.anchor("center"),
        k.scale(1),
        k.color(255, 80, 120), // Hot Pink
        {
            update() {
                const encounter = gameState.getCurrentEncounter();
                const target = encounter ? encounter.targetScore : 0;
                this.text = target.toLocaleString();
            }
        }
    ]);

    // GSAP Pulse Animation
    gsap.to(targetScoreText.scale, {
        x: 1.1,
        y: 1.1,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    scoreBox.add([
        k.text("to earn reward", { size: 14, font: "Viga" }),
        k.pos(140, 100),
        k.anchor("center"),
        k.color(200, 200, 255),
    ]);

    // Round Score
    const roundScoreBox = container.add([
        k.rect(280, 60, { radius: 4 }),
        k.pos(20, 265),
        k.color(40, 35, 60),
        k.outline(2, [100, 100, 150]),
    ]);

    roundScoreBox.add([
        k.text("Round\nscore", { size: 18, font: "Viga" }),
        k.pos(60, 30),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);

    const roundScoreText = roundScoreBox.add([
        k.text("0", { size: 30, font: "Viga" }),
        k.pos(200, 30),
        k.anchor("center"),
        k.color(251, 255, 100), // Vibrant Yellow
        {
            update() {
                this.text = gameState.scoringState.roundScore.toLocaleString();
            }
        }
    ]);

    // Blank Objectives Section
    const objContainer = container.add([
        k.pos(20, 345),
    ]);

    // Button helper function
    const btnStyle = (x, y, w, h, label, color) => {
        const b = container.add([
            k.rect(w, h, { radius: 6 }),
            k.pos(x, y),
            k.color(color),
            k.outline(3, [255, 255, 255]),
            k.area(),
        ]);

        b.add([
            k.text(label, { size: 18, font: "Viga", width: w - 10 }),
            k.pos(w / 2, h / 2),
            k.anchor("center"),
            k.color(255, 255, 255),
        ]);
        return b;
    };

    // Run Info and Options buttons
    btnStyle(20, 530, 80, 80, "Run\nInfo", [240, 80, 80]); // Vibrant Red
    btnStyle(20, 620, 80, 40, "Options", [240, 150, 40]);  // Vibrant Orange

    // Turn/Round Displays
    const turnBox = btnStyle(110, 530, 80, 50, "", [60, 150, 240]);
    turnBox.add([k.text("Turn", { size: 12, font: "Viga" }), k.pos(40, -8), k.anchor("center"), k.color(255, 255, 255)]);
    
    const turnVal = container.add([
        k.text("1", { size: 22, font: "Viga" }),
        k.pos(150, 555),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.z(85),
    ]);

    const roundBox = btnStyle(205, 530, 80, 50, "", [100, 80, 180]);
    roundBox.add([k.text("Round", { size: 12, font: "Viga" }), k.pos(40, -8), k.anchor("center"), k.color(255, 255, 255)]);
    
    const roundVal = container.add([
        k.text(gameState.roundCounter.toString(), { size: 22, font: "Viga" }),
        k.pos(245, 555),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.z(85),
    ]);

    // Gold Display
    const goldBox = btnStyle(110, 590, 175, 45, "", [139, 69, 19]);
    goldBox.add([k.text("Gold", { size: 12, font: "Viga" }), k.pos(87, -8), k.anchor("center"), k.color(255, 255, 255)]);
    
    const goldVal = container.add([
        k.text(gameState.gold.toString(), { size: 20, font: "Viga" }),
        k.pos(197, 612),
        k.anchor("center"),
        k.color(255, 215, 0), // Gold color
        k.z(85),
    ]);

    // Ante Counter
    const anteBox = btnStyle(110, 645, 100, 45, "", [80, 40, 120]); // Dark purple
    anteBox.add([k.text("Ante", { size: 11, font: "Viga" }), k.pos(50, -8), k.anchor("center"), k.color(200, 180, 255)]);
    
    const anteVal = container.add([
        k.text(`${gameState.anteCounter}/8`, { size: 18, font: "Viga" }),
        k.pos(160, 667),
        k.anchor("center"),
        k.color(200, 180, 255), // Light purple
        k.z(85),
        {
            update() {
                this.text = `${gameState.anteCounter}/8`;
                if (gameState.anteCounter >= 7) {
                    this.color = k.rgb(255, 215, 0); // Gold when close to winning
                }
            }
        }
    ]);

    // Attempts Counter
    const attemptsBox = btnStyle(220, 645, 65, 45, "", [60, 60, 80]); // Dark gray
    attemptsBox.add([k.text("Try", { size: 11, font: "Viga" }), k.pos(32, -8), k.anchor("center"), k.color(200, 200, 200)]);
    
    const attemptsVal = container.add([
        k.text(gameState.attemptsLeft.toString(), { size: 22, font: "Viga" }),
        k.pos(252, 667),
        k.anchor("center"),
        k.color(100, 255, 100), // Green when healthy
        k.z(85),
        {
            update() {
                this.text = gameState.attemptsLeft.toString();
                if (gameState.attemptsLeft === 0) {
                    this.color = k.rgb(255, 60, 60); // Red when locked
                } else if (gameState.attemptsLeft === 1) {
                    this.color = k.rgb(255, 180, 60); // Orange when low
                } else {
                    this.color = k.rgb(100, 255, 100); // Green when healthy
                }
            }
        }
    ]);

    return {
        updateTurn(num) {
            turnVal.text = num.toString();
        },
        updateRound(num) {
            roundVal.text = num.toString();
        },
        updateGold(num) {
            goldVal.text = num.toString();
        },
        updateAnte(num) {
            anteVal.text = `${num}/8`;
        },
        updateAttempts(num) {
            attemptsVal.text = num.toString();
        },
        activateObjective() {
            // Not used in encounter select
        }
    };
}

export default createSidePanel;
