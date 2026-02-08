import k from "../kaplayCtx";
import { COLORS, LAYOUT, SCREEN_WIDTH, SCREEN_HEIGHT, UI, ATTRIBUTE_COLORS } from "../constants";
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
        k.z(150),
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
 * Helper function to create a styled panel box
 */
function createPanelBox(parent, x, y, w, h, bgColor, outlineColor = null, radius = 8) {
    const box = parent.add([
        k.rect(w, h, { radius }),
        k.pos(x, y),
        k.color(bgColor[0], bgColor[1], bgColor[2]),
    ]);
    
    if (outlineColor) {
        box.use(k.outline(2, outlineColor));
    }
    
    return box;
}

/**
 * Helper function to create a badge/pill
 */
function createBadge(parent, x, y, text, bgColor, textColor = [255, 255, 255], size = 10) {
    const padding = 8;
    const textObj = k.add([
        k.text(text, { size, font: "Viga" }),
        k.pos(0, 0),
        k.color(textColor[0], textColor[1], textColor[2]),
    ]);
    
    const width = textObj.width + padding * 2;
    k.destroy(textObj);
    
    const badge = parent.add([
        k.rect(width, size + 6, { radius: 10 }),
        k.pos(x, y),
        k.color(bgColor[0], bgColor[1], bgColor[2]),
        k.outline(1, [255, 255, 255]),
    ]);
    
    badge.add([
        k.text(text, { size, font: "Viga" }),
        k.pos(width / 2, (size + 6) / 2),
        k.anchor("center"),
        k.color(textColor[0], textColor[1], textColor[2]),
    ]);
    
    return badge;
}

/**
 * Creates the battle scene specific content with boss mechanic display
 */
function createBattleContent(container, gameState, initialTurnCount) {
    let currentBoss = null;
    let mechanicStatusText = null;
    let mechanicContainer = null;
    
    // ============================================
    // BOSS INFO HEADER SECTION
    // ============================================
    
    // Boss name header background - gradient effect with darker top
    const headerBg = createPanelBox(container, 20, 20, 280, 70, [45, 35, 65], [80, 70, 100], 8);
    
    // Elite badge (hidden by default)
    let eliteBadge = null;
    
    // Boss name text
    const enemyNameText = container.add([
        k.text("BOSS NAME", { size: 22, font: "Viga" }),
        k.pos(160, 42),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);
    
    // Type badges container
    const typeBadgesContainer = container.add([
        k.pos(30, 65),
    ]);
    
    // ============================================
    // BOSS MECHANIC DISPLAY SECTION (NEW)
    // ============================================
    
    // Mechanic panel background
    mechanicContainer = container.add([
        k.pos(20, 100),
        k.opacity(1),
    ]);
    
    // Mechanic card background
    const mechanicBg = createPanelBox(mechanicContainer, 0, 0, 280, 100, [35, 25, 50], [100, 80, 120], 8);
    
    // Mechanic icon (warning symbol)
    const mechanicIcon = mechanicContainer.add([
        k.text("⚠", { size: 28, font: "Viga" }),
        k.pos(20, 20),
        k.anchor("center"),
        k.color(255, 200, 80),
    ]);
    
    // Mechanic title
    mechanicContainer.add([
        k.text("BOSS MECHANIC", { size: 11, font: "Viga" }),
        k.pos(40, 12),
        k.color(180, 160, 200),
    ]);
    
    // Mechanic description text
    const mechanicDescText = mechanicContainer.add([
        k.text("No special mechanics", { size: 12, font: "Inter", width: 230 }),
        k.pos(15, 32),
        k.color(220, 220, 240),
    ]);
    
    // Mechanic status indicator (e.g., "ACTIVE", "2 turns until trigger")
    mechanicStatusText = mechanicContainer.add([
        k.text("", { size: 11, font: "Viga" }),
        k.pos(15, 78),
        k.color(100, 255, 150),
    ]);
    
    // ============================================
    // SCORING SECTION
    // ============================================
    
    const scoreSectionY = 210;
    
    // Score target panel
    const scoreBox = createPanelBox(container, 20, scoreSectionY, 280, 110, [30, 25, 45], [100, 100, 150], 8);
    
    // Score icon and label
    scoreBox.add([
        k.text("❄", { size: 16 }),
        k.pos(20, 18),
        k.anchor("center"),
        k.color(150, 220, 255),
    ]);
    
    scoreBox.add([
        k.text("Score at least", { size: 13, font: "Viga" }),
        k.pos(140, 18),
        k.anchor("center"),
        k.color(180, 180, 220),
    ]);
    
    // Target score with pulsing animation
    const targetScoreText = container.add([
        k.text("", { size: 38, font: "Viga" }),
        k.pos(160, scoreSectionY + 50),
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
        x: 1.08,
        y: 1.08,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Reward preview
    scoreBox.add([
        k.text("Reward:", { size: 11, font: "Viga" }),
        k.pos(60, 88),
        k.color(180, 180, 220),
    ]);
    
    scoreBox.add([
        k.text("$$$$$", { size: 14, font: "Viga" }),
        k.pos(180, 88),
        k.anchor("center"),
        k.color(255, 215, 0), // Gold
    ]);
    
    // ============================================
    // BASE SCORE × MULTIPLIER DISPLAY
    // ============================================
    
    const scoringDisplayY = 330;
    const scoringDisplayContainer = container.add([
        k.pos(30, scoringDisplayY),
    ]);
    
    // Blue box for Base Score
    const baseScoreBox = createPanelBox(scoringDisplayContainer, 0, 0, 100, 42, [60, 120, 200], [255, 255, 255], 6);
    
    scoringDisplayContainer.add([
        k.text("Base", { size: 9, font: "Viga" }),
        k.pos(50, -10),
        k.anchor("center"),
        k.color(150, 180, 220),
    ]);
    
    const baseScoreText = scoringDisplayContainer.add([
        k.text("0", { size: 20, font: "Viga" }),
        k.pos(50, 21),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.z(85),
        {
            update() {
                const state = gameState.getTurnScoringState();
                this.text = state.baseScore.toString();
            }
        }
    ]);
    
    // Multiplication symbol
    scoringDisplayContainer.add([
        k.text("×", { size: 22, font: "Viga" }),
        k.pos(118, 21),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.z(85),
    ]);
    
    // Red box for Multiplier
    const multiplierBox = createPanelBox(scoringDisplayContainer, 135, 0, 100, 42, [200, 60, 80], [255, 255, 255], 6);
    
    scoringDisplayContainer.add([
        k.text("Mult", { size: 9, font: "Viga" }),
        k.pos(185, -10),
        k.anchor("center"),
        k.color(220, 150, 160),
    ]);
    
    const multiplierText = scoringDisplayContainer.add([
        k.text("1.0x", { size: 20, font: "Viga" }),
        k.pos(185, 21),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.z(85),
        {
            update() {
                const state = gameState.getTurnScoringState();
                this.text = state.multiplier.toFixed(1) + "x";
            }
        }
    ]);
    
    // ============================================
    // ROUND SCORE SECTION
    // ============================================
    
    const roundScoreY = 390;
    
    const roundScoreBox = createPanelBox(container, 20, roundScoreY, 280, 55, [40, 35, 60], [100, 100, 150], 8);
    
    roundScoreBox.add([
        k.text("Round Score", { size: 14, font: "Viga" }),
        k.pos(70, 27),
        k.anchor("center"),
        k.color(200, 200, 220),
    ]);
    
    const roundScoreText = container.add([
        k.text("0", { size: 26, font: "Viga" }),
        k.pos(220, roundScoreY + 27),
        k.anchor("center"),
        k.color(251, 255, 100), // Vibrant Yellow
        {
            update() {
                this.text = gameState.scoringState.roundScore.toLocaleString();
            }
        }
    ]);
    
    // ============================================
    // OBJECTIVES SECTION
    // ============================================
    
    const objContainer = container.add([
        k.pos(20, 455),
    ]);
    
    const objectiveLabels = [];
    const updateObjectives = () => {
        objectiveLabels.forEach(l => k.destroy(l));
        objectiveLabels.length = 0;
        
        gameState.scoringState.objectives.forEach((obj, i) => {
            const objWrapper = objContainer.add([
                k.pos(0, i * 28),
                k.anchor("left"),
            ]);
            
            // Checkbox or indicator
            const checkbox = objWrapper.add([
                k.rect(14, 14, { radius: 3 }),
                k.pos(0, 0),
                k.color(obj.completed ? [100, 255, 100] : [60, 60, 80]),
                k.outline(1, [150, 150, 150]),
            ]);
            
            if (obj.completed) {
                objWrapper.add([
                    k.text("✓", { size: 10, font: "Viga" }),
                    k.pos(7, 7),
                    k.anchor("center"),
                    k.color(0, 0, 0),
                ]);
            }
            
            const objText = objWrapper.add([
                k.text(obj.label, { 
                    size: 12, 
                    font: "Inter", 
                    width: 210 
                }),
                k.pos(22, 0),
                k.color(obj.completed ? [120, 255, 120] : [255, 255, 0]),
            ]);
            
            const bonusText = objWrapper.add([
                k.text(obj.bonus.display, { 
                    size: 11, 
                    font: "Viga", 
                }),
                k.pos(250, 2),
                k.anchor("right"),
                k.color(obj.bonus.type === "additive" ? [200, 200, 255] : [255, 100, 100]),
            ]);
            
            objectiveLabels.push({ container: objWrapper, objText, bonusText, obj });
        });
    };
    
    // Function to trigger pop-out animation for objective
    const activateObjective = (index) => {
        if (objectiveLabels[index]) {
            const { container } = objectiveLabels[index];
            gsap.to(container.scale, {
                x: 1.15,
                y: 1.15,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
        }
    };
    
    // Initial draw and update hook for objectives
    container.onUpdate(() => {
        if (objectiveLabels.length !== gameState.scoringState.objectives.length) {
            updateObjectives();
        }
        // Update objective colors based on scoring locked state
        objectiveLabels.forEach(({ objText, bonusText, obj }) => {
            if (obj.completed) {
                objText.color = k.rgb(120, 255, 120);
            } else {
                const baseColor = gameState.scoringLocked ? [120, 120, 120] : [255, 255, 0];
                objText.color = k.rgb(baseColor[0], baseColor[1], baseColor[2]);
            }
            bonusText.opacity = gameState.scoringLocked ? 0.5 : 1;
        });
    });
    
    // ============================================
    // BOTTOM CONTROLS SECTION
    // ============================================
    
    const bottomSectionY = 580;
    
    // Run Info button (left side, tall)
    const runInfoBtn = createPanelBox(container, 20, bottomSectionY, 75, 90, [240, 80, 80], [255, 255, 255], 8);
    runInfoBtn.add([
        k.text("Run\nInfo", { size: 16, font: "Viga", align: "center" }),
        k.pos(37, 45),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);
    runInfoBtn.use(k.area());
    
    // Options button (left side, below Run Info)
    const optionsBtn = createPanelBox(container, 20, bottomSectionY + 100, 75, 45, [240, 150, 40], [255, 255, 255], 8);
    optionsBtn.add([
        k.text("☰", { size: 20, font: "Viga" }),
        k.pos(37, 22),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);
    optionsBtn.use(k.area());
    
    // Turn/Round/Gold panel (right side)
    const statsPanel = createPanelBox(container, 105, bottomSectionY, 195, 145, [35, 30, 50], [80, 80, 100], 8);
    
    // Turn display
    statsPanel.add([
        k.text("TURN", { size: 10, font: "Viga" }),
        k.pos(50, 20),
        k.anchor("center"),
        k.color(150, 180, 220),
    ]);
    
    const turnVal = container.add([
        k.text(initialTurnCount.toString(), { size: 20, font: "Viga" }),
        k.pos(155, bottomSectionY + 35),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.z(85),
    ]);
    
    // Round display
    statsPanel.add([
        k.text("ROUND", { size: 10, font: "Viga" }),
        k.pos(145, 20),
        k.anchor("center"),
        k.color(180, 150, 220),
    ]);
    
    const roundVal = container.add([
        k.text(gameState.roundCounter.toString(), { size: 20, font: "Viga" }),
        k.pos(250, bottomSectionY + 35),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.z(85),
    ]);
    
    // Gold display
    const goldIcon = container.add([
        k.text("◆", { size: 16 }),
        k.pos(125, bottomSectionY + 70),
        k.anchor("center"),
        k.color(255, 215, 0),
        k.z(85),
    ]);
    
    statsPanel.add([
        k.text("GOLD", { size: 10, font: "Viga" }),
        k.pos(145, 55),
        k.anchor("center"),
        k.color(200, 180, 100),
    ]);
    
    const goldVal = container.add([
        k.text(gameState.gold.toString(), { size: 18, font: "Viga" }),
        k.pos(220, bottomSectionY + 70),
        k.anchor("center"),
        k.color(255, 215, 0),
        k.z(85),
    ]);
    
    // Ante display
    const anteBox = createPanelBox(container, 115, bottomSectionY + 95, 85, 40, [80, 40, 120], [150, 120, 180], 6);
    
    anteBox.add([
        k.text("ANTE", { size: 9, font: "Viga" }),
        k.pos(42, 10),
        k.anchor("center"),
        k.color(180, 160, 200),
    ]);
    
    const anteVal = container.add([
        k.text(`${gameState.anteCounter}/8`, { size: 16, font: "Viga" }),
        k.pos(157, bottomSectionY + 125),
        k.anchor("center"),
        k.color(200, 180, 255),
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
    
    // Attempts display
    const attemptsBox = createPanelBox(container, 210, bottomSectionY + 95, 80, 40, [60, 60, 80], [120, 120, 140], 6);
    
    attemptsBox.add([
        k.text("ATTEMPTS", { size: 9, font: "Viga" }),
        k.pos(40, 10),
        k.anchor("center"),
        k.color(180, 180, 180),
    ]);
    
    const attemptsVal = container.add([
        k.text(gameState.attemptsLeft.toString(), { size: 18, font: "Viga" }),
        k.pos(250, bottomSectionY + 125),
        k.anchor("center"),
        k.color(100, 255, 100),
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
    
    // Scoring locked warning indicator
    const lockedIndicator = container.add([
        k.text("⚠️ LOCKED", { size: 14, font: "Viga" }),
        k.pos(160, 745),
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
    
    // ============================================
    // RETURNED METHODS
    // ============================================
    
    return {
        updateEnemyName(name, boss = null) {
            enemyNameText.text = name.toUpperCase();
            currentBoss = boss;
            
            // Clear existing badges
            typeBadgesContainer.children.forEach(child => k.destroy(child));
            if (eliteBadge) {
                k.destroy(eliteBadge);
                eliteBadge = null;
            }
            
            // Add type badges if boss data available
            if (boss && boss.types) {
                let badgeX = 0;
                boss.types.forEach((type, i) => {
                    const typeColor = ATTRIBUTE_COLORS[type] || [150, 150, 150];
                    createBadge(typeBadgesContainer, badgeX, 0, type, typeColor, [255, 255, 255], 9);
                    badgeX += 65;
                });
                
                // Add elite badge if applicable
                if (boss.isElite) {
                    eliteBadge = createBadge(container, 260, 25, "ELITE", [255, 215, 0], [80, 60, 0], 10);
                }
            }
            
            // Update mechanic display
            this.updateBossMechanic(boss);
        },
        
        updateBossMechanic(boss) {
            if (!boss || !mechanicContainer) return;
            
            // Update mechanic description
            if (boss.mechanicDescription) {
                mechanicDescText.text = boss.mechanicDescription;
                
                // Set icon based on mechanic type
                let icon = "⚠";
                let iconColor = [255, 200, 80];
                
                const desc = boss.mechanicDescription.toLowerCase();
                if (desc.includes("time") || desc.includes("turn")) {
                    icon = "⏰";
                    iconColor = [100, 200, 255];
                } else if (desc.includes("heal") || desc.includes("drain") || desc.includes("life")) {
                    icon = "♥";
                    iconColor = [255, 100, 100];
                } else if (desc.includes("silence") || desc.includes("disable")) {
                    icon = "🔇";
                    iconColor = [200, 150, 255];
                } else if (desc.includes("reflect") || desc.includes("mirror")) {
                    icon = "🪞";
                    iconColor = [200, 200, 255];
                } else if (desc.includes("adapt") || desc.includes("evolve")) {
                    icon = "🧬";
                    iconColor = [150, 255, 150];
                } else if (desc.includes("dominat") || desc.includes("lock") || desc.includes("control")) {
                    icon = "⛓";
                    iconColor = [255, 100, 150];
                } else if (desc.includes("phase") || desc.includes("frenzy")) {
                    icon = "🌙";
                    iconColor = [200, 100, 255];
                }
                
                mechanicIcon.text = icon;
                mechanicIcon.color = k.rgb(iconColor[0], iconColor[1], iconColor[2]);
                
                mechanicContainer.opacity = 1;
            } else {
                mechanicDescText.text = "Standard encounter - no special mechanics";
                mechanicIcon.text = "•";
                mechanicIcon.color = k.rgb(150, 150, 150);
            }
            
            // Reset status text
            if (mechanicStatusText) {
                mechanicStatusText.text = "";
            }
        },
        
        updateMechanicStatus(status, color = [100, 255, 150]) {
            if (mechanicStatusText) {
                mechanicStatusText.text = status;
                mechanicStatusText.color = k.rgb(color[0], color[1], color[2]);
                
                // Flash animation
                gsap.fromTo(mechanicStatusText, 
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: "power2.out" }
                );
            }
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
            gsap.fromTo(roundScoreText.scale, 
                { x: 1.3, y: 1.3 },
                { x: 1, y: 1, duration: 0.3, ease: "power2.out" }
            );
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
    createPanelBox(container, 20, 20, 280, 70, [45, 35, 65], [80, 70, 100], 8);
    
    container.add([
        k.text("Choose your", { size: 16, font: "Viga" }),
        k.pos(160, 38),
        k.anchor("center"),
        k.color(200, 200, 220),
    ]);
    
    container.add([
        k.text("next Battle", { size: 24, font: "Viga" }),
        k.pos(160, 62),
        k.anchor("center"),
        k.color(COLORS.highlight),
    ]);
    
    // Score target panel
    const scoreBox = createPanelBox(container, 20, 105, 280, 110, [30, 25, 45], [100, 100, 150], 8);
    
    scoreBox.add([
        k.text("❄", { size: 16 }),
        k.pos(20, 18),
        k.anchor("center"),
        k.color(150, 220, 255),
    ]);
    
    scoreBox.add([
        k.text("Target Score", { size: 13, font: "Viga" }),
        k.pos(140, 18),
        k.anchor("center"),
        k.color(180, 180, 220),
    ]);
    
    const targetScoreText = container.add([
        k.text("", { size: 38, font: "Viga" }),
        k.pos(160, 155),
        k.anchor("center"),
        k.scale(1),
        k.color(255, 80, 120),
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
        x: 1.08,
        y: 1.08,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    scoreBox.add([
        k.text("Reward: $$$$$", { size: 12, font: "Viga" }),
        k.pos(140, 88),
        k.anchor("center"),
        k.color(255, 215, 0),
    ]);
    
    // Round Score
    const roundScoreBox = createPanelBox(container, 20, 230, 280, 55, [40, 35, 60], [100, 100, 150], 8);
    
    roundScoreBox.add([
        k.text("Current Score", { size: 14, font: "Viga" }),
        k.pos(70, 27),
        k.anchor("center"),
        k.color(200, 200, 220),
    ]);
    
    const roundScoreText = container.add([
        k.text("0", { size: 26, font: "Viga" }),
        k.pos(220, 257),
        k.anchor("center"),
        k.color(251, 255, 100),
        {
            update() {
                this.text = gameState.scoringState.roundScore.toLocaleString();
            }
        }
    ]);
    
    // Blank Objectives Section placeholder
    createPanelBox(container, 20, 300, 280, 120, [35, 30, 45], [80, 80, 100], 8);
    
    container.add([
        k.text("Objectives will appear\nduring battle", { size: 12, font: "Inter", align: "center" }),
        k.pos(160, 360),
        k.anchor("center"),
        k.color(150, 150, 170),
    ]);
    
    // Bottom controls - same layout as battle
    const bottomSectionY = 580;
    
    const runInfoBtn = createPanelBox(container, 20, bottomSectionY, 75, 90, [240, 80, 80], [255, 255, 255], 8);
    runInfoBtn.add([
        k.text("Run\nInfo", { size: 16, font: "Viga", align: "center" }),
        k.pos(37, 45),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);
    
    const optionsBtn = createPanelBox(container, 20, bottomSectionY + 100, 75, 45, [240, 150, 40], [255, 255, 255], 8);
    optionsBtn.add([
        k.text("☰", { size: 20, font: "Viga" }),
        k.pos(37, 22),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);
    
    const statsPanel = createPanelBox(container, 105, bottomSectionY, 195, 145, [35, 30, 50], [80, 80, 100], 8);
    
    statsPanel.add([
        k.text("TURN", { size: 10, font: "Viga" }),
        k.pos(50, 20),
        k.anchor("center"),
        k.color(150, 180, 220),
    ]);
    
    const turnVal = container.add([
        k.text("1", { size: 20, font: "Viga" }),
        k.pos(155, bottomSectionY + 35),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.z(85),
    ]);
    
    statsPanel.add([
        k.text("ROUND", { size: 10, font: "Viga" }),
        k.pos(145, 20),
        k.anchor("center"),
        k.color(180, 150, 220),
    ]);
    
    const roundVal = container.add([
        k.text(gameState.roundCounter.toString(), { size: 20, font: "Viga" }),
        k.pos(250, bottomSectionY + 35),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.z(85),
    ]);
    
    container.add([
        k.text("◆", { size: 16 }),
        k.pos(125, bottomSectionY + 70),
        k.anchor("center"),
        k.color(255, 215, 0),
        k.z(85),
    ]);
    
    statsPanel.add([
        k.text("GOLD", { size: 10, font: "Viga" }),
        k.pos(145, 55),
        k.anchor("center"),
        k.color(200, 180, 100),
    ]);
    
    const goldVal = container.add([
        k.text(gameState.gold.toString(), { size: 18, font: "Viga" }),
        k.pos(220, bottomSectionY + 70),
        k.anchor("center"),
        k.color(255, 215, 0),
        k.z(85),
    ]);
    
    const anteBox = createPanelBox(container, 115, bottomSectionY + 95, 85, 40, [80, 40, 120], [150, 120, 180], 6);
    
    anteBox.add([
        k.text("ANTE", { size: 9, font: "Viga" }),
        k.pos(42, 10),
        k.anchor("center"),
        k.color(180, 160, 200),
    ]);
    
    const anteVal = container.add([
        k.text(`${gameState.anteCounter}/8`, { size: 16, font: "Viga" }),
        k.pos(157, bottomSectionY + 125),
        k.anchor("center"),
        k.color(200, 180, 255),
        k.z(85),
        {
            update() {
                this.text = `${gameState.anteCounter}/8`;
                if (gameState.anteCounter >= 7) {
                    this.color = k.rgb(255, 215, 0);
                }
            }
        }
    ]);
    
    const attemptsBox = createPanelBox(container, 210, bottomSectionY + 95, 80, 40, [60, 60, 80], [120, 120, 140], 6);
    
    attemptsBox.add([
        k.text("ATTEMPTS", { size: 9, font: "Viga" }),
        k.pos(40, 10),
        k.anchor("center"),
        k.color(180, 180, 180),
    ]);
    
    const attemptsVal = container.add([
        k.text(gameState.attemptsLeft.toString(), { size: 18, font: "Viga" }),
        k.pos(250, bottomSectionY + 125),
        k.anchor("center"),
        k.color(100, 255, 100),
        k.z(85),
        {
            update() {
                this.text = gameState.attemptsLeft.toString();
                if (gameState.attemptsLeft === 0) {
                    this.color = k.rgb(255, 60, 60);
                } else if (gameState.attemptsLeft === 1) {
                    this.color = k.rgb(255, 180, 60);
                } else {
                    this.color = k.rgb(100, 255, 100);
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
        },
        updateEnemyName() {
            // Not used in encounter select
        },
        updateBossMechanic() {
            // Not used in encounter select
        },
        updateMechanicStatus() {
            // Not used in encounter select
        }
    };
}

export default createSidePanel;
