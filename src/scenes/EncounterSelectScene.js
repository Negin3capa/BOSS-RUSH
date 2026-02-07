import k from "../kaplayCtx";
import { gameState } from "../state/GameState";
import { COLORS, SCREEN_WIDTH, SCREEN_HEIGHT, UI, ATTRIBUTE_COLORS } from "../constants";
import { createSidePanel } from "../ui/SidePanel";
import gsap from "gsap";

export default function EncounterSelectScene() {
    // Ensure encounters are generated
    if (gameState.encounters.length === 0) {
        gameState.generateEncounters();
    }

    let selectedEncounter = gameState.currentEncounterIndex;
    let isTransitioning = false;

    // Background Nebula
    const bg = k.add([
        k.sprite("nebula"),
        k.scale(Math.max(SCREEN_WIDTH / 1024, SCREEN_HEIGHT / 768) * 1.1),
        k.pos(0, 0),
        k.opacity(0.8),
        k.z(-1),
        {
            update() {
                this.pos.x = Math.sin(k.time() * 0.1) * 20;
                this.pos.y = Math.cos(k.time() * 0.1) * 20;
            }
        }
    ]);

    // Create side panel
    const sidePanel = createSidePanel(gameState, { scene: "encounter_select" });

    // Title for the encounter selection area
    const titleContainer = k.add([
        k.pos(SCREEN_WIDTH / 2 + 160, 80),
        k.anchor("center"),
    ]);

    titleContainer.add([
        k.text("SELECT ENCOUNTER", { size: 36, font: "Viga" }),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.outline(4, [0, 0, 0]),
    ]);

    // Container for encounter cards
    const cardsContainer = k.add([
        k.pos(SCREEN_WIDTH / 2 + 160, SCREEN_HEIGHT / 2 + 20),
        k.anchor("center"),
    ]);

    const encounterCards = [];
    const cardWidth = 240;
    const cardHeight = 380;
    const cardSpacing = 280;

    // Create encounter cards
    gameState.encounters.forEach((encounter, index) => {
        const isCompleted = encounter.completed;
        const isCurrent = index === gameState.currentEncounterIndex;
        const isLocked = index > gameState.currentEncounterIndex;

        const xOffset = (index - 1) * cardSpacing;

        // Card container
        const card = cardsContainer.add([
            k.pos(xOffset, 0),
            k.anchor("center"),
            {
                index: index,
                isSelectable: isCurrent && !isCompleted,
                baseY: 0,
                update() {
                    // Don't modify position during scene transition (let GSAP handle it)
                    if (isTransitioning) return;
                    
                    // Hover animation for selectable cards
                    if (this.isSelectable && index === selectedEncounter) {
                        this.pos.y = this.baseY + Math.sin(k.time() * 4) * 5;
                    } else {
                        this.pos.y = this.baseY;
                    }
                }
            }
        ]);

        // Card background with area for click detection
        const cardBg = card.add([
            k.rect(cardWidth, cardHeight, { radius: 8 }),
            k.color(30, 25, 45),
            k.outline(UI.OUTLINE, COLORS.uiBorder),
            k.anchor("center"),
            k.area(), // Area component for click/hover detection
        ]);

        // Selection highlight (border only, not filling the card)
        if (isCurrent && !isCompleted) {
            card.add([
                k.rect(cardWidth + 10, cardHeight + 10, { radius: 10 }),
                k.color(0, 0, 0, 0), // Transparent fill
                k.outline(4, COLORS.highlight), // Pink border only
                k.anchor("center"),
                k.z(-1),
                k.opacity(1),
                {
                    update() {
                        this.opacity = 0.7 + Math.sin(k.time() * 3) * 0.3;
                    }
                }
            ]);
        }

        // Card content
        const contentY = -cardHeight / 2 + 30;

        // Status badge
        let statusText = isCompleted ? "COMPLETED" : (isLocked ? "LOCKED" : "AVAILABLE");
        let statusColor = isCompleted ? [100, 255, 100] : (isLocked ? [150, 150, 150] : COLORS.highlight);

        card.add([
            k.text(statusText, { size: 14, font: "Viga" }),
            k.pos(0, contentY),
            k.anchor("center"),
            k.color(statusColor),
        ]);

        // Encounter type badge
        const typeColors = {
            "Simple": [100, 200, 100],
            "Stronger": [255, 180, 80],
            "Boss": [255, 80, 80]
        };

        const typeBadge = card.add([
            k.rect(160, 40, { radius: 4 }),
            k.pos(0, contentY + 40),
            k.color(typeColors[encounter.type] || [150, 150, 150]),
            k.outline(3, [255, 255, 255]),
            k.anchor("center"),
        ]);

        typeBadge.add([
            k.text(encounter.type.toUpperCase(), { size: 18, font: "Viga" }),
            k.anchor("center"),
            k.color(255, 255, 255),
        ]);

        // Enemy preview area
        const previewY = contentY + 100;
        
        // Enemy icons based on count
        encounter.enemies.forEach((enemy, enemyIndex) => {
            const enemyX = (enemyIndex - (encounter.enemies.length - 1) / 2) * 60;
            const enemyColor = ATTRIBUTE_COLORS[enemy.attribute] || [200, 80, 80];
            
            const enemyPreview = card.add([
                k.circle(25),
                k.pos(enemyX, previewY),
                k.color(enemyColor[0], enemyColor[1], enemyColor[2]),
                k.outline(3, [255, 255, 255]),
                k.anchor("center"),
            ]);

            // Boss indicator
            if (enemy.isBoss) {
                card.add([
                    k.text("★", { size: 30 }),
                    k.pos(enemyX, previewY - 35),
                    k.anchor("center"),
                    k.color(255, 215, 0),
                ]);
            }
        });

        // Enemy names
        const namesY = previewY + 50;
        const displayName = encounter.enemies.length === 1 
            ? encounter.enemies[0].name 
            : `${encounter.enemies.length} Enemies`;
        
        card.add([
            k.text(displayName, { size: 14, font: "Inter", width: cardWidth - 20, align: "center" }),
            k.pos(0, namesY),
            k.anchor("center"),
            k.color(200, 200, 255),
        ]);

        // Divider line
        card.add([
            k.rect(cardWidth - 40, 2),
            k.pos(0, namesY + 40),
            k.color(100, 100, 150),
            k.anchor("center"),
        ]);

        // Score requirement
        const scoreY = namesY + 80;
        card.add([
            k.text("Score at least", { size: 12, font: "Viga" }),
            k.pos(0, scoreY),
            k.anchor("center"),
            k.color(180, 180, 200),
        ]);

        card.add([
            k.text(`❄️ ${encounter.targetScore.toLocaleString()}`, { size: 24, font: "Viga" }),
            k.pos(0, scoreY + 25),
            k.anchor("center"),
            k.color(255, 80, 120),
        ]);

        // Reward - moved up to make room for button
        const rewardY = scoreY + 55;
        card.add([
            k.text("Reward:", { size: 12, font: "Viga" }),
            k.pos(0, rewardY),
            k.anchor("center"),
            k.color(180, 180, 200),
        ]);

        const rewardText = "💰".repeat(Math.min(5, Math.ceil(encounter.reward / 25)));
        card.add([
            k.text(`${rewardText} +${encounter.reward}`, { size: 16, font: "Viga" }),
            k.pos(0, rewardY + 18),
            k.anchor("center"),
            k.color(255, 215, 0),
        ]);

        // Select button for current encounter - moved up
        if (isCurrent && !isCompleted) {
            const selectBtn = card.add([
                k.rect(140, 36, { radius: 4 }),
                k.pos(0, cardHeight / 2 ),
                k.color(COLORS.highlight[0], COLORS.highlight[1], COLORS.highlight[2]),
                k.outline(3, [255, 255, 255]),
                k.anchor("center"),
            ]);

            selectBtn.add([
                k.text("SELECT", { size: 18, font: "Viga" }),
                k.anchor("center"),
                k.color(255, 255, 255),
            ]);
        }

        // Locked overlay
        if (isLocked) {
            card.add([
                k.rect(cardWidth, cardHeight, { radius: 8 }),
                k.color(20, 20, 30),
                k.anchor("center"),
                k.opacity(0.7),
            ]);

            card.add([
                k.text("🔒", { size: 50 }),
                k.pos(0, 0),
                k.anchor("center"),
                k.opacity(0.8),
            ]);
        }

        // Completed overlay
        if (isCompleted) {
            card.add([
                k.rect(cardWidth, cardHeight, { radius: 8 }),
                k.color(20, 40, 20),
                k.anchor("center"),
                k.opacity(0.5),
            ]);

            card.add([
                k.text("✓", { size: 80 }),
                k.pos(0, 0),
                k.anchor("center"),
                k.color(100, 255, 100),
                k.opacity(0.8),
            ]);
        }

        encounterCards.push({ card, cardBg, isSelectable: isCurrent && !isCompleted });
    });

    // Instructions
    const instructions = k.add([
        k.text("Press SPACE or ENTER to select", { size: 18, font: "Inter" }),
        k.pos(SCREEN_WIDTH / 2 + 160, SCREEN_HEIGHT - 80),
        k.anchor("center"),
        k.color(200, 200, 200),
        k.opacity(1),
        {
            update() {
                this.opacity = 0.5 + Math.sin(k.time() * 3) * 0.5;
            }
        }
    ]);

    // Selection indicator arrows
    const leftArrow = k.add([
        k.text("◀", { size: 40, font: "Viga" }),
        k.pos(SCREEN_WIDTH / 2 - 80, SCREEN_HEIGHT / 2 + 20),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.opacity(0),
    ]);

    const rightArrow = k.add([
        k.text("▶", { size: 40, font: "Viga" }),
        k.pos(SCREEN_WIDTH / 2 + 400, SCREEN_HEIGHT / 2 + 20),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.opacity(0),
    ]);

    // Update arrow visibility
    k.onUpdate(() => {
        const currentCard = encounterCards[selectedEncounter];
        if (currentCard && currentCard.isSelectable && !isTransitioning) {
            leftArrow.opacity = k.lerp(leftArrow.opacity, selectedEncounter > 0 ? 0.5 : 0, k.dt() * 10);
            rightArrow.opacity = k.lerp(rightArrow.opacity, selectedEncounter < 2 ? 0.5 : 0, k.dt() * 10);
        } else {
            leftArrow.opacity = 0;
            rightArrow.opacity = 0;
        }
    });

    // Input handling
    function updateSelection() {
        encounterCards.forEach((item, index) => {
            if (item.isSelectable) {
                if (index === selectedEncounter) {
                    // Use a darker highlight color instead of bright pink
                    item.cardBg.color = k.rgb(60, 45, 75); // Darker purple highlight
                    item.cardBg.scale = k.vec2(1.02);
                } else {
                    item.cardBg.color = k.rgb(30, 25, 45);
                    item.cardBg.scale = k.vec2(1);
                }
            }
        });
    }

    function selectEncounter() {
        if (isTransitioning) return;
        
        const currentCard = encounterCards[selectedEncounter];
        if (!currentCard || !currentCard.isSelectable) return;

        isTransitioning = true;

        // Set up the encounter for battle before animation
        gameState.setupEncounterForBattle();

        // Animate all cards scrolling down off-screen
        const tl = gsap.timeline({
            onComplete: () => {
                // Go to battle scene after cards exit
                k.go("battle");
            }
        });

        // Add title to animation
        tl.to(titleContainer.pos, {
            y: SCREEN_HEIGHT + 100,
            duration: 0.4,
            ease: "power2.in"
        }, 0);

        // Add instructions to animation
        tl.to(instructions.pos, {
            y: SCREEN_HEIGHT + 100,
            duration: 0.4,
            ease: "power2.in"
        }, 0);

        // Animate side panel swiping left out of view
        tl.add(sidePanel.animateOut(), 0);


        // Animate each card scrolling down with stagger
        encounterCards.forEach((item, index) => {
            tl.to(item.card.pos, {
                y: SCREEN_HEIGHT + 300,
                duration: 0.5,
                ease: "power2.in"
            }, index * 0.1);
        });

        // Hide arrows immediately
        leftArrow.opacity = 0;
        rightArrow.opacity = 0;
    }

    // Keyboard input
    k.onKeyPress("left", () => {
        if (isTransitioning) return;
        // Only allow selecting current encounter
        // (In future could allow viewing all, but only current is selectable)
    });

    k.onKeyPress("right", () => {
        if (isTransitioning) return;
        // Only allow selecting current encounter
    });

    k.onKeyPress("space", selectEncounter);
    k.onKeyPress("enter", selectEncounter);

    // Click/tap on cards (using cardBg which has area() component)
    encounterCards.forEach((item, index) => {
        item.cardBg.onClick(() => {
            if (item.isSelectable && !isTransitioning) {
                selectedEncounter = index;
                updateSelection();
                selectEncounter();
            }
        });

        item.cardBg.onHover(() => {
            if (item.isSelectable && !isTransitioning) {
                k.setCursor("pointer");
            }
        });

        item.cardBg.onHoverEnd(() => {
            k.setCursor("default");
        });
    });

    // Initial selection update
    updateSelection();
}