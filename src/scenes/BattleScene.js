import k from "../kaplayCtx";
import { gameState } from "../state/GameState";
import { COLORS, SCREEN_WIDTH, SCREEN_HEIGHT, GAMEPLAY, LAYOUT } from "../constants";
import { createBattleUI, createMessageLog, createTurnCounter } from "../ui/BattleUI";

export default function BattleScene() {
    // Reset state on restart (enemies regen)
    gameState.generateEnemies();

    // Logic State
    let turnPhase = "PLAYER_INPUT"; // PLAYER_INPUT, SELECT_TARGET, EXECUTING, END
    let currentHeroIndex = 0;
    let turnCount = 1;
    let playerActions = [];
    let selectedAction = null; // Store currently selected action while picking target
    let selectedEnemyIndex = 0; // For targeting cursor

    // UI Elements
    createBattleUI(gameState);
    const log = createMessageLog();
    const turnCounter = createTurnCounter();

    // Visuals for Enemies (Centered)
    const enemySprites = gameState.enemies.map((enemy, i) => {
        // Center them, slightly offset if multiple
        const xOffset = (i - (gameState.enemies.length - 1) / 2) * 150;

        const sprite = k.add([
            k.rect(100, 100),
            k.pos(LAYOUT.ENEMY_CENTER_X + xOffset, LAYOUT.ENEMY_CENTER_Y),
            k.color(COLORS.enemy),
            k.anchor("center"),
            "enemy",
            { char: enemy, id: i }
        ]);

        // Enemy HP Bar (Attached to Sprite)
        // Background
        sprite.add([
            k.rect(80, 8),
            k.pos(0, -60), // Above head (0,0 is center of 100x100 -> top is -50)
            k.anchor("center"),
            k.color(0, 0, 0),
        ]);

        // Fill
        sprite.add([
            k.rect(80, 8),
            k.pos(-40, -60), // Start from left edge relative to center
            k.color(COLORS.hp),
            {
                update() {
                    const ratio = enemy.hp / enemy.maxHp;
                    this.width = ratio * 80;
                }
            }
        ]);

        return sprite;
    });

    // Selection Cursor (Points to the active UI corner OR active enemy)
    const cursor = k.add([
        k.rect(20, 20),
        k.pos(0, 0),
        k.color(COLORS.highlight),
        k.rotate(45), // Diamond shape
        k.anchor("center"),
        k.z(200),
    ]);

    // Target Cursor (To show who we are selecting)
    const targetCursor = k.add([
        k.polygon([k.vec2(0, 0), k.vec2(20, -30), k.vec2(-20, -30)]), // Down arrow
        k.pos(0, 0),
        k.color(COLORS.highlight),
        k.z(200),
        {
            update() {
                // Bobbing animation
                this.role = (k.time() * 10);
                this.pos.y += Math.sin(k.time() * 10) * 0.5;
            }
        }
    ]);
    targetCursor.hidden = true;

    function updateCursor() {
        if (turnPhase === "PLAYER_INPUT") {
            cursor.hidden = false;
            targetCursor.hidden = true;
            if (currentHeroIndex < gameState.party.length) {
                // Point to the UI box of the current hero
                const pos = LAYOUT.POSITIONS[currentHeroIndex];
                if (pos) {
                    cursor.pos = k.vec2(pos.x + 100, pos.y - 30);
                    if (currentHeroIndex >= 2) {
                        cursor.pos = k.vec2(pos.x + 100, pos.y - 30);
                    }
                }
            }
        } else if (turnPhase === "SELECT_TARGET") {
            cursor.hidden = true; // Main cursor hidden or maybe use it? Let's use targetCursor
            targetCursor.hidden = false;

            // Should point to enemy
            const enemySprite = enemySprites[selectedEnemyIndex];
            if (enemySprite) {
                targetCursor.pos = k.vec2(enemySprite.pos.x, enemySprite.pos.y - 80);
            }
        }
    }
    updateCursor();

    // Input Menu Text
    const actions = ["FIGHT", "SKILL", "DEFEND", "ITEM"];
    let selectedActionIndex = 0;

    const menuContainer = k.add([
        k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 60),
        k.anchor("center"),
        k.z(200),
    ]);

    const menuText = menuContainer.add([
        k.text("", { size: 30 }),
        k.anchor("center"),
        k.color(COLORS.text),
    ]);

    // Input Handling
    k.onKeyPress("left", () => {
        if (turnPhase === "PLAYER_INPUT") {
            // Grid navigation: 0<->1, 2<->3
            if (selectedActionIndex % 2 === 1) selectedActionIndex -= 1;
            else selectedActionIndex += 1;
            updateMenuVisuals();
        } else if (turnPhase === "SELECT_TARGET") {
            cycleTarget(-1);
        }
    });

    k.onKeyPress("right", () => {
        if (turnPhase === "PLAYER_INPUT") {
            // Grid navigation: 0<->1, 2<->3
            if (selectedActionIndex % 2 === 0) selectedActionIndex += 1;
            else selectedActionIndex -= 1;
            updateMenuVisuals();
        } else if (turnPhase === "SELECT_TARGET") {
            cycleTarget(1);
        }
    });

    k.onKeyPress("up", () => {
        if (turnPhase === "PLAYER_INPUT") {
            // Grid navigation: 0<->2, 1<->3
            if (selectedActionIndex >= 2) selectedActionIndex -= 2;
            else selectedActionIndex += 2;
            updateMenuVisuals();
        }
    });

    k.onKeyPress("down", () => {
        if (turnPhase === "PLAYER_INPUT") {
            // Grid navigation: 0<->2, 1<->3
            if (selectedActionIndex < 2) selectedActionIndex += 2;
            else selectedActionIndex -= 2;
            updateMenuVisuals();
        }
    });

    function cycleTarget(direction) {
        let tries = 0;
        do {
            selectedEnemyIndex = (selectedEnemyIndex + direction + enemySprites.length) % enemySprites.length;
            tries++;
        } while (enemySprites[selectedEnemyIndex].char.isDead && tries < enemySprites.length);
        updateCursor();
    }

    k.onKeyPress("space", () => {
        if (turnPhase === "PLAYER_INPUT") {
            handleActionSelection(actions[selectedActionIndex]);
        } else if (turnPhase === "SELECT_TARGET") {
            confirmTarget();
        } else if (turnPhase === "END") {
            // Retry logic
            gameRestart();
        }
    });

    function updateMenuVisuals() {
        if (turnPhase !== "PLAYER_INPUT") {
            menuText.text = "";
            return;
        }

        // 2x2 Grid Layout
        // 0: FIGHT   1: SKILL
        // 2: DEFEND  3: ITEM

        const formatBtn = (i, label) => (i === selectedActionIndex ? `> ${label} <` : `  ${label}  `);

        const row1 = `${formatBtn(0, "FIGHT")}    ${formatBtn(1, "SKILL")}`;
        const row2 = `${formatBtn(2, "DEFEND")}    ${formatBtn(3, "ITEM")}`;

        menuText.text = `${row1}\n\n${row2}`;
    }
    updateMenuVisuals();

    function handleActionSelection(type) {
        const hero = gameState.party[currentHeroIndex];
        if (hero.isDead) { // Guard clause for dead leader/member
            nextHero();
            return;
        }

        if (type === "FIGHT") {
            // Enter targeting mode
            startTargeting(type);
        } else if (type === "SKILL") {
            if (hero.sp < 10) {
                log.updateLog("Not enough SP!");
                // Provide feedback for failure
                return;
            }
            // Auto-Target ALL
            commitAction({ type, source: hero, target: "ALL" });
        } else {
            // Defend / Item -> Self
            commitAction({ type, source: hero, target: hero });
        }
    }

    function startTargeting(type) {
        // Find first alive enemy to default selection
        selectedEnemyIndex = enemySprites.findIndex(s => !s.char.isDead);
        if (selectedEnemyIndex === -1) return; // All dead? (Should have won already)

        selectedAction = type;
        turnPhase = "SELECT_TARGET";
        log.updateLog("Select Target...");
        updateCursor();
        menuText.text = ""; // Hide menu while targeting
    }

    function confirmTarget() {
        const hero = gameState.party[currentHeroIndex];
        const target = enemySprites[selectedEnemyIndex].char;

        commitAction({ type: selectedAction, source: hero, target });
    }

    function commitAction(actionObj) {
        playerActions.push(actionObj);
        turnPhase = "PLAYER_INPUT"; // Reset for next
        nextHero();
    }

    function nextHero() {
        currentHeroIndex++;
        // Skip dead
        while (currentHeroIndex < gameState.party.length && gameState.party[currentHeroIndex].isDead) {
            currentHeroIndex++;
        }

        if (currentHeroIndex >= gameState.party.length) {
            turnPhase = "EXECUTING";
            menuText.text = "";
            cursor.hidden = true;
            targetCursor.hidden = true;
            log.updateLog("Processing Turn...");
            executeTurn();
        } else {
            updateCursor();
            updateMenuVisuals();
        }
    }

    async function executeTurn() {
        // Player Actions
        for (const action of playerActions) {
            if (gameState.areEnemiesDefeated()) break;
            if (action.source.isDead) continue;

            await performAction(action);
            await k.wait(0.8);
        }

        if (gameState.areEnemiesDefeated()) {
            endGame(true);
            return;
        }

        // Enemy Turn
        log.updateLog("Enemy Phase!");
        await k.wait(1.0);

        for (const enemy of gameState.enemies) {
            if (enemy.isDead) continue;
            if (gameState.isPartyDefeated()) break;

            const aliveHeroes = gameState.party.filter(h => !h.isDead);
            if (aliveHeroes.length === 0) break;

            const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            const roll = Math.random();
            let type = "FIGHT";
            if (roll < 0.2) type = "DEFEND";
            else if (roll < 0.5 && enemy.sp >= 10) type = "SKILL";

            await performAction({ type, source: enemy, target });
            await k.wait(0.8);
        }

        if (gameState.isPartyDefeated()) {
            endGame(false);
        } else {
            startNewRound();
        }
    }

    async function performAction(action) {
        const { type, source, target } = action;

        if (type === "DEFEND") {
            source.defend();
            log.updateLog(`${source.name} Defends!`);
        } else if (type === "FIGHT") {
            const dmg = target.takeDamage(source.attack);
            log.updateLog(`${source.name} attacks ${target.name} for ${dmg}!`);
            shakeScreen();
        } else if (type === "SKILL") {
            if (target === "ALL") {
                let totalDmg = 0;
                if (source.costSp(10)) {
                    // Apply to all alive enemies
                    gameState.enemies.forEach(e => {
                        if (!e.isDead) {
                            const dmg = e.takeDamage(source.attack * 0.8);
                            totalDmg = dmg; // Just tracking last one for now or we could sum
                        }
                    });
                    log.updateLog(`${source.name} uses Skill on ALL Enemies!`);
                    shakeScreen(5);
                }
            } else {
                if (source.costSp(10)) {
                    const dmg = target.takeDamage(source.attack * 0.8);
                    log.updateLog(`${source.name} Skills ${target.name} for ${dmg}!`);
                    shakeScreen(5);
                }
            }
        } else if (type === "ITEM") {
            const healAmount = Math.floor(GAMEPLAY.ITEM_HEAL_MIN + Math.random() * (GAMEPLAY.ITEM_HEAL_MAX - GAMEPLAY.ITEM_HEAL_MIN));
            source.heal(healAmount);
            log.updateLog(`${source.name} uses Item! +${healAmount} HP.`);
        }

        // Update Enemy Sprites
        enemySprites.forEach(s => {
            if (s.char.isDead) {
                s.color = k.rgb(50, 50, 50);
            }
        });
    }

    function startNewRound() {
        turnPhase = "PLAYER_INPUT";
        playerActions = [];
        currentHeroIndex = 0;
        turnCount++;
        turnCounter.updateCount(turnCount);

        while (currentHeroIndex < gameState.party.length && gameState.party[currentHeroIndex].isDead) {
            currentHeroIndex++;
        }

        gameState.party.forEach(h => h.resetTurn());
        gameState.enemies.forEach(e => e.resetTurn());

        cursor.hidden = false;
        targetCursor.hidden = true;
        updateCursor();
        updateMenuVisuals();
        log.updateLog(`Turn ${turnCount} Start!`);
    }

    function endGame(win) {
        turnPhase = "END";
        const msg = win ? "VICTORY!" : "GAME OVER";
        log.updateLog(msg + " Press SPACE to Retry");

        k.add([
            k.rect(SCREEN_WIDTH, SCREEN_HEIGHT),
            k.color(0, 0, 0),
            k.opacity(0.6),
            k.z(500),
        ]);

        k.add([
            k.text(msg, { size: 60 }),
            k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 20),
            k.anchor("center"),
            k.color(win ? COLORS.highlight : COLORS.hp),
            k.z(501),
        ]);

        k.add([
            k.text("Press SPACE to Retry", { size: 24 }),
            k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 50),
            k.anchor("center"),
            k.color(COLORS.text),
            k.z(501),
        ]);
    }

    function gameRestart() {
        gameState.party = [];
        gameState.initializeParty();
        k.go("battle");
    }

    function shakeScreen(amount = 2) {
        k.shake(amount);
    }
}
