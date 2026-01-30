import k from "../kaplayCtx";
import { gameState } from "../state/GameState";
import { COLORS, SCREEN_WIDTH, SCREEN_HEIGHT, GAMEPLAY, LAYOUT } from "../constants";
import { createBattleUI, createMessageLog, createTurnCounter, createMenuSystem } from "../ui/BattleUI";

export default function BattleScene() {
    // Reset state on restart (enemies regen)
    gameState.generateEnemies();

    // Logic State
    let turnPhase = "PLAYER_INPUT"; // PLAYER_INPUT, SELECT_SKILL, SELECT_TARGET, EXECUTING, END
    let currentHeroIndex = 0;
    let turnCount = 1;
    let playerActions = [];
    let selectedAction = null; // Store currently selected action
    let selectedSkillIndex = 0; // For Skill Menu
    let selectedEnemyIndex = 0; // For targeting cursor

    // UI Elements
    createBattleUI(gameState);
    const log = createMessageLog();
    const turnCounter = createTurnCounter();
    const menuSystem = createMenuSystem();

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
        if (turnPhase === "PLAYER_INPUT" || turnPhase === "SELECT_SKILL") {
            cursor.hidden = false;
            targetCursor.hidden = true;
            if (currentHeroIndex < gameState.party.length) {
                const pos = LAYOUT.POSITIONS[currentHeroIndex];
                if (pos) {
                    cursor.pos = k.vec2(pos.x + 100, pos.y - 30);
                    if (currentHeroIndex >= 2) {
                        cursor.pos = k.vec2(pos.x + 100, pos.y - 30);
                    }
                }
            }
        } else if (turnPhase === "SELECT_TARGET") {
            cursor.hidden = true;
            targetCursor.hidden = false;

            if (selectedAction.targetMode === "ALLIES") {
                const pos = LAYOUT.POSITIONS[selectedEnemyIndex];
                if (pos) {
                    targetCursor.pos = k.vec2(pos.x + 100, pos.y - 30);
                }
            } else {
                const enemySprite = enemySprites[selectedEnemyIndex];
                if (enemySprite) {
                    targetCursor.pos = k.vec2(enemySprite.pos.x, enemySprite.pos.y - 80);
                }
            }
        }
    }
    updateCursor();

    // Input Variables
    const actions = ["FIGHT", "SKILL", "DEFEND", "ITEM"];
    let selectedActionIndex = 0;

    // Input Handling
    k.onKeyPress("left", () => {
        if (turnPhase === "PLAYER_INPUT") {
            if (selectedActionIndex % 2 === 1) selectedActionIndex -= 1;
            else selectedActionIndex += 1;
            updateMenuVisuals();
        } else if (turnPhase === "SELECT_SKILL") {
            if (selectedSkillIndex % 2 === 1) selectedSkillIndex -= 1;
            else selectedSkillIndex += 1;
            updateMenuVisuals();
        } else if (turnPhase === "SELECT_TARGET") {
            cycleTarget(-1);
        }
    });

    k.onKeyPress("right", () => {
        if (turnPhase === "PLAYER_INPUT") {
            if (selectedActionIndex % 2 === 0) selectedActionIndex += 1;
            else selectedActionIndex -= 1;
            updateMenuVisuals();
        } else if (turnPhase === "SELECT_SKILL") {
            if (selectedSkillIndex % 2 === 0) selectedSkillIndex += 1;
            else selectedSkillIndex -= 1;
            updateMenuVisuals();
        } else if (turnPhase === "SELECT_TARGET") {
            cycleTarget(1);
        }
    });

    k.onKeyPress("up", () => {
        if (turnPhase === "PLAYER_INPUT") {
            if (selectedActionIndex >= 2) selectedActionIndex -= 2;
            else selectedActionIndex += 2;
            updateMenuVisuals();
        } else if (turnPhase === "SELECT_SKILL") {
            if (selectedSkillIndex >= 2) selectedSkillIndex -= 2;
            else selectedSkillIndex += 2;
            updateMenuVisuals();
        }
    });

    k.onKeyPress("down", () => {
        if (turnPhase === "PLAYER_INPUT") {
            if (selectedActionIndex < 2) selectedActionIndex += 2;
            else selectedActionIndex -= 2;
            updateMenuVisuals();
        } else if (turnPhase === "SELECT_SKILL") {
            if (selectedSkillIndex < 2) selectedSkillIndex += 2;
            else selectedSkillIndex -= 2;
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
        } else if (turnPhase === "SELECT_SKILL") {
            // Confirm Skill Selection
            handleSkillSelection();
        } else if (turnPhase === "SELECT_TARGET") {
            confirmTarget();
        } else if (turnPhase === "END") {
            // Retry logic
            gameRestart();
        }
    });

    k.onKeyPress("backspace", () => {
        if (turnPhase === "SELECT_SKILL") {
            turnPhase = "PLAYER_INPUT";
            updateMenuVisuals();
        } else if (turnPhase === "SELECT_TARGET") {
            // If we came from SKILL, go back to SKILL, else go back to PLAYER_INPUT
            if (selectedAction && selectedAction.type === "SKILL") { // Note: selectedAction structure might need adjustment
                turnPhase = "SELECT_SKILL";
                if (selectedAction.target === "ALL_ENEMIES" || selectedAction.target === "ALL_ALLIES") {
                    // For ALL targets, we skip targeting phase usually, but if we are here it might be different.
                    // Actually for ALL target skills we usually commit immediately in handleSkillSelection.
                    // So likely we only cancel single target selection here.
                }
                updateCursor(); // Hide target cursor
                updateMenuVisuals();
                log.updateLog("Select Skill...");
            } else {
                turnPhase = "PLAYER_INPUT";
                updateCursor();
                updateMenuVisuals();
                log.updateLog("Select Action");
            }
        }
    });

    function updateMenuVisuals() {
        if (turnPhase === "PLAYER_INPUT") {
            menuSystem.updateMainMenu(selectedActionIndex);
        } else if (turnPhase === "SELECT_SKILL") {
            const hero = gameState.party[currentHeroIndex];
            menuSystem.updateSkillMenu(hero.skills, selectedSkillIndex);
        } else {
            menuSystem.hide();
        }
    }
    updateMenuVisuals();

    function handleActionSelection(type) {
        const hero = gameState.party[currentHeroIndex];
        if (hero.isDead) {
            nextHero(); // Should be skipped already but safeguard
            return;
        }

        if (type === "FIGHT") {
            startTargeting(type, "ENEMIES");
        } else if (type === "SKILL") {
            turnPhase = "SELECT_SKILL";
            selectedSkillIndex = 0;
            updateMenuVisuals();
            log.updateLog("Select Skill...");
        } else {
            // Defend / Item -> Self
            commitAction({ type, source: hero, target: hero });
        }
    }

    function handleSkillSelection() {
        const hero = gameState.party[currentHeroIndex];
        const skill = hero.skills[selectedSkillIndex];

        if (!skill) return;

        if (hero.sp < skill.spCost) {
            log.updateLog("Not enough SP!");
            return;
        }

        selectedAction = { type: "SKILL", skill, source: hero }; // Store skill in selectedAction

        // Determine Targets
        if (skill.target === "ONE_ENEMY") {
            startTargeting("SKILL", "ENEMIES");
        } else if (skill.target === "ONE_ALLY") {
            startTargeting("SKILL", "ALLIES");
        } else if (skill.target === "ALL_ENEMIES") {
            // Auto-commit
            commitAction({ ...selectedAction, target: "ALL_ENEMIES" });
        } else if (skill.target === "ALL_ALLIES") {
            // Auto-commit
            commitAction({ ...selectedAction, target: "ALL_ALLIES" });
        } else if (skill.target === "SELF") {
            commitAction({ ...selectedAction, target: hero });
        }
    }

    function startTargeting(type, mode) {
        if (mode === "ENEMIES") {
            selectedEnemyIndex = enemySprites.findIndex(s => !s.char.isDead);
            if (selectedEnemyIndex === -1) return;
        } else if (mode === "ALLIES") {
            // Reset to 0 or current hero index? Let's reset to 0
            selectedEnemyIndex = 0;
        }

        // If this is a new simple action (FIGHT), create a fresh object
        // If it's SKILL, selectedAction is already set in handleSkillSelection
        if (type !== "SKILL") {
            selectedAction = { type };
        }

        selectedAction.targetMode = mode; // Store mode

        turnPhase = "SELECT_TARGET";
        log.updateLog(mode === "ALLIES" ? "Select Ally..." : "Select Enemy...");
        updateCursor();
        updateMenuVisuals();
    }

    function cycleTarget(direction) {
        if (selectedAction.targetMode === "ALLIES") {
            // Cycle through party
            let tries = 0;
            do {
                selectedEnemyIndex = (selectedEnemyIndex + direction + gameState.party.length) % gameState.party.length;
                tries++;
            } while (gameState.party[selectedEnemyIndex].isDead && tries < gameState.party.length);
        } else {
            // Enemies
            let tries = 0;
            do {
                selectedEnemyIndex = (selectedEnemyIndex + direction + enemySprites.length) % enemySprites.length;
                tries++;
            } while (enemySprites[selectedEnemyIndex].char.isDead && tries < enemySprites.length);
        }
        updateCursor();
    }

    // Need to handle cursor for Allies
    // ... updateCursor logic needs changes ...



    function confirmTarget() {
        const hero = gameState.party[currentHeroIndex];
        let target;

        if (selectedAction.targetMode === "ALLIES") {
            target = gameState.party[selectedEnemyIndex];
        } else {
            target = enemySprites[selectedEnemyIndex].char;
        }

        commitAction({ ...selectedAction, source: hero, target });
    }

    function commitAction(actionObj) {
        playerActions.push(actionObj);
        turnPhase = "PLAYER_INPUT"; // Reset for next
        nextHero();
    }

    function nextHero() {
        selectedAction = null; // Clear previous action
        currentHeroIndex++;
        // Skip dead
        while (currentHeroIndex < gameState.party.length && gameState.party[currentHeroIndex].isDead) {
            currentHeroIndex++;
        }

        if (currentHeroIndex >= gameState.party.length) {
            turnPhase = "EXECUTING";
            menuSystem.hide();
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
        try {
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

                const roll = Math.random();
                if (roll < 0.2) {
                    await performAction({ type: "DEFEND", source: enemy, target: enemy }); // Defend
                } else if (roll < 0.6 && enemy.sp >= 10 && enemy.skills.length > 0) {
                    // Use Random Skill
                    const skill = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
                    let skillTarget;

                    // Smart-ish target selection based on Skill Target Type
                    if (skill.target === "ONE_ALLY" || skill.target === "ALL_ALLIES") {
                        // Friendly Target (Another Enemy)
                        const aliveEnemies = gameState.enemies.filter(e => !e.isDead);
                        skillTarget = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                    } else if (skill.target === "SELF") {
                        skillTarget = enemy;
                    } else {
                        // Hostile Target (Player)
                        skillTarget = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
                    }

                    // For ALL_X targets, we pass the flag string, performAction handles context
                    if (skill.target === "ALL_ENEMIES" || skill.target === "ALL_ALLIES") {
                        skillTarget = skill.target;
                    }

                    await performAction({ type: "SKILL", source: enemy, target: skillTarget, skill });
                } else {
                    const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
                    await performAction({ type: "FIGHT", source: enemy, target });
                }
                await k.wait(0.8);
            }

            if (gameState.isPartyDefeated()) {
                endGame(false);
            } else {
                startNewRound();
            }
        } catch (e) {
            console.error(e);
            log.updateLog("Error: " + e.message);
        }
    }

    async function performAction(action) {
        try {
            const { type, source, target, skill } = action;

            if (type === "DEFEND") {
                source.defend();
                log.updateLog(`${source.name} Defends!`);
            } else if (type === "FIGHT") {
                const dmg = target.takeDamage(source.attack);
                log.updateLog(`${source.name} attacks ${target.name} for ${dmg}!`);
                shakeScreen();
            } else if (type === "SKILL") {
                if (!skill) {
                    throw new Error("Skill is undefined in performAction");
                }
                if (!source.costSp(skill.spCost)) {
                    log.updateLog(`${source.name} failed (No SP)!`);
                    return;
                }

                log.updateLog(`${source.name} uses ${skill.name}!`);

                // Resolve Targets Contextually
                let targets = [];

                // Determine groups based on source
                const isPlayer = gameState.party.includes(source);
                const friends = isPlayer ? gameState.party : gameState.enemies;
                const foes = isPlayer ? gameState.enemies : gameState.party;

                if (target === "ALL_ENEMIES") {
                    targets = foes.filter(u => !u.isDead);
                } else if (target === "ALL_ALLIES") {
                    targets = friends.filter(u => !u.isDead);
                } else {
                    // Single target object
                    if (target) targets = [target];
                }

                for (const t of targets) {
                    if (!t) continue;
                    // Effects
                    if (skill.type === "Damage") {
                        // Formula: (Atk + Power) * Variance - Def/2
                        let calcDmg = Math.floor((source.attack + skill.power) * (0.9 + Math.random() * 0.2) - (t.defense / 2));
                        calcDmg = Math.max(1, calcDmg);
                        t.takeDamage(calcDmg);
                        playAnimation(t, "DAMAGE");
                    } else if (skill.type === "Heal") {
                        t.heal(skill.power);
                        playAnimation(t, "HEAL");
                    } else if (skill.type === "Buff") {
                        playAnimation(t, "BUFF");
                        if (skill.effect) {
                            if (skill.effect.stat === "attack") t.attack = Math.floor(t.attack * skill.effect.amount);
                            if (skill.effect.stat === "defense") t.defense = Math.floor(t.defense * skill.effect.amount);
                        }
                    } else if (skill.type === "Debuff") {
                        playAnimation(t, "DEBUFF");
                        if (skill.effect) {
                            if (skill.effect.stat === "attack") t.attack = Math.floor(t.attack * skill.effect.amount);
                            if (skill.effect.stat === "defense") t.defense = Math.floor(t.defense * skill.effect.amount);
                        }
                    }
                }

                if (skill.type === "Damage") shakeScreen(5);
                await k.wait(0.5);

            } else if (type === "ITEM") {
                const healAmount = Math.floor(GAMEPLAY.ITEM_HEAL_MIN + Math.random() * (GAMEPLAY.ITEM_HEAL_MAX - GAMEPLAY.ITEM_HEAL_MIN));
                source.heal(healAmount);
                log.updateLog(`${source.name} uses Item! +${healAmount} HP.`);
                playAnimation(source, "HEAL");
            }

            // Update Enemy Sprites (Visual Dead State)
            enemySprites.forEach(s => {
                if (s.char.isDead) {
                    s.color = k.rgb(50, 50, 50);
                }
            });
        } catch (e) {
            console.error("Action Failed", e);
            log.updateLog("Action Failed!");
        }
    }

    function playAnimation(target, type) {
        // Find screen position of target
        let pos;
        if (target.className === "Enemy") { // Assuming we added className to enemies too
            // Find sprite
            const sprite = enemySprites.find(s => s.char === target);
            if (sprite) pos = sprite.pos;
        } else {
            // Hero
            const index = gameState.party.indexOf(target);
            if (index !== -1) {
                const p = LAYOUT.POSITIONS[index];
                pos = k.vec2(p.x + 100, p.y + 50); // Center of box roughly
            }
        }

        if (!pos) return;

        let text = "";
        let color = k.rgb(255, 255, 255);
        let moveVec = k.vec2(0, -50); // Move Up

        if (type === "HEAL") {
            text = "+";
            color = k.rgb(0, 255, 0);
        } else if (type === "BUFF") {
            text = "^";
            color = k.rgb(50, 50, 255);
        } else if (type === "DEBUFF") {
            text = "v";
            color = k.rgb(150, 50, 50);
            moveVec = k.vec2(0, 50); // Move Down
        } else if (type === "DAMAGE") {
            // Damage usually shakes, maybe red flash?
            // We can skip text for damage or show number?
            // For now just skip as we shake screen.
            return;
        }

        k.add([
            k.text(text, { size: 40 }),
            k.pos(pos),
            k.color(color),
            k.lifespan(0.5),
            k.z(300),
            {
                update() {
                    this.pos.x += moveVec.x * k.dt();
                    this.pos.y += moveVec.y * k.dt();
                }
            }
        ]);
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
