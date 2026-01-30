import k from "../kaplayCtx";
import { gameState } from "../state/GameState";
import { COLORS, SCREEN_WIDTH, SCREEN_HEIGHT, GAMEPLAY, LAYOUT, ATTRIBUTE_COLORS, ATTRIBUTES, UI } from "../constants";
import { createBattleUI, createMessageLog, createTurnCounter, createRoundCounter, createMenuSystem } from "../ui/BattleUI";
import { RARITY_COLORS } from "../data/skills";

export default function BattleScene() {
    // Reset state on restart (enemies regen)
    gameState.generateEnemies();

    // Logic State
    let turnPhase = "PLAYER_INPUT"; // PLAYER_INPUT, SELECT_SKILL, SELECT_TARGET, EXECUTING, END
    let currentHeroIndex = 0;
    let turnCount = 1;
    let playerActions = [];
    let selectedAction = null;
    let selectedSkillIndex = 0;
    let selectedEnemyIndex = 0;
    let endOptionIndex = 0;
    let selectedActionIndex = 0;

    // Command Memory
    let lastActionIndexDuringTurn = 0;

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

    // UI Elements
    const battleUI = createBattleUI(gameState);
    const log = createMessageLog();
    const turnCounter = createTurnCounter();
    const roundCounter = createRoundCounter(gameState);
    const menuSystem = createMenuSystem();

    // Visuals for Enemies
    const enemySprites = gameState.enemies.map((enemy, i) => {
        const xOffset = (i - (gameState.enemies.length - 1) / 2) * 180;

        // Container for better layering
        const container = k.add([
            k.pos(LAYOUT.ENEMY_CENTER_X + xOffset, LAYOUT.ENEMY_CENTER_Y),
            k.anchor("center"),
            k.opacity(1),
            "enemy",
            {
                char: enemy,
                id: i,
                update() {
                    const baseScale = enemy.isBoss ? 2.5 : 1;
                    const visual = this.get("visual")[0];
                    if (!this.char.isDead) {
                        this.angle = Math.sin(k.time() * 1.0 + i) * 1.2;
                        this.scale = k.vec2(baseScale + Math.sin(k.time() * 2.5 + i) * 0.015);
                        this.opacity = 1;
                        if (visual) visual.color = k.rgb(...(ATTRIBUTE_COLORS[enemy.attribute] || COLORS.enemy));
                    } else {
                        this.angle = 0;
                        this.scale = k.vec2(baseScale);
                        this.opacity = 0.2;
                        if (visual) visual.color = k.rgb(100, 100, 120);
                    }
                }
            }
        ]);

        // Selection Border (Red square behind)
        const border = container.add([
            k.rect(130, 130),
            k.anchor("center"),
            k.color(COLORS.hp),
            k.z(-1),
        ]);
        border.hidden = true;

        // Main Visual (Rect)
        container.add([
            k.rect(120, 120),
            k.color(...(ATTRIBUTE_COLORS[enemy.attribute] || COLORS.enemy)),
            k.anchor("center"),
            k.outline(UI.OUTLINE, COLORS.uiBorder),
            k.opacity(1),
            k.z(0),
            "visual", // Tag for easy access
        ]);

        // HP Bar Container for conditional visibility
        const hpBar = container.add([
            k.pos(0, enemy.isBoss ? -80 : -100), // Moved non-boss up to -100
            k.z(5),
            "hpBar",
        ]);
        hpBar.hidden = true;

        // Enemy HP Bar frame
        hpBar.add([
            k.rect(94, 14),
            k.anchor("center"),
            k.color(0, 0, 0), // Black background
            k.outline(UI.OUTLINE, COLORS.uiBorder),
        ]);

        // Enemy HP Bar fill
        hpBar.add([
            k.rect(90, 10),
            k.pos(-45, -5),
            k.color(COLORS.hp),
            k.z(1),
            {
                update() {
                    const ratio = enemy.hp / enemy.maxHp;
                    this.width = k.lerp(this.width, Math.max(0, ratio * 90), k.dt() * 10);
                }
            }
        ]);

        // Status Indicators for Enemies
        const statusContainer = container.add([
            k.pos(0, enemy.isBoss ? -180 : -130), // Adjusted for higher HP bars
            k.anchor("center"),
            k.z(10),
        ]);

        ["attack", "defense"].forEach((stat, idx) => {
            statusContainer.add([
                k.text("", { size: 24, font: "Inter" }),
                k.pos((idx - 0.5) * 40, 0),
                k.anchor("center"),
                k.outline(3, [0, 0, 0]),
                {
                    update() {
                        const effect = enemy.statusEffects.find(e => e.stat === stat);
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

        return { sprite: container, border, hpBar };
    });

    const targetCursor = k.add([
        k.text("▼", { size: 40 }),
        k.pos(0, 0),
        k.color(COLORS.highlight),
        k.anchor("center"),
        k.z(200),
        {
            update() {
                this.pos.y += Math.sin(k.time() * 10) * 0.8;
            }
        }
    ]);
    targetCursor.hidden = true;

    function updateSelectionVisuals() {
        // Reset all enemy borders and HP bars
        enemySprites.forEach(e => {
            e.border.hidden = true;
            e.hpBar.hidden = true;
        });

        if (turnPhase === "PLAYER_INPUT" || turnPhase === "SELECT_SKILL") {
            battleUI.updateSelection(currentHeroIndex);
            targetCursor.hidden = true;
        } else if (turnPhase === "SELECT_TARGET") {
            if (selectedAction.targetMode === "ALLIES") {
                targetCursor.hidden = false;
                if (selectedAction.skill && selectedAction.skill.target === "ALL_ALLIES") {
                    battleUI.updateSelection("ALL_ALLIES");
                    targetCursor.pos = k.vec2(SCREEN_WIDTH / 2, 80);
                } else {
                    battleUI.updateSelection(selectedEnemyIndex);
                    const pos = LAYOUT.POSITIONS[selectedEnemyIndex];
                    targetCursor.pos = k.vec2(pos.x + 100, pos.y - 40);
                }
            } else {
                // Enemy Targeting - No Arrow
                targetCursor.hidden = true;
                battleUI.updateSelection(-1);

                if (selectedAction.skill && selectedAction.skill.target === "ALL_ENEMIES") {
                    enemySprites.forEach(e => {
                        if (!e.sprite.char.isDead) {
                            e.border.hidden = false;
                            e.hpBar.hidden = false;
                        }
                    });
                } else {
                    const targetEnemy = enemySprites[selectedEnemyIndex];
                    if (targetEnemy) {
                        targetEnemy.border.hidden = false;
                        targetEnemy.hpBar.hidden = false;
                    }
                }
            }
        } else {
            battleUI.updateSelection(-1);
            targetCursor.hidden = true;
        }
    }

    // Particle Helper
    function spawnParticles(pos, charType, color) {
        if (!pos) return;
        for (let i = 0; i < 12; i++) {
            k.add([
                k.text(charType, { size: k.rand(24, 40) }),
                k.pos(pos.x + k.rand(-50, 50), pos.y + k.rand(-50, 50)),
                k.color(color),
                k.opacity(1),
                k.anchor("center"),
                k.z(300),
                k.move(charType === "↓" ? 90 : 270, k.rand(50, 150)),
                {
                    update() {
                        this.opacity -= k.dt() * 1.5;
                        if (this.opacity <= 0) k.destroy(this);
                    }
                }
            ]);
        }
    }

    function getTargetPos(target) {
        if (!target || target === "ALL_ENEMIES" || target === "ALL_ALLIES") {
            return k.vec2(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        }

        const enemyIdx = gameState.enemies.indexOf(target);
        if (enemyIdx !== -1) {
            return enemySprites[enemyIdx].sprite.pos;
        }

        const partyIdx = gameState.party.indexOf(target);
        if (partyIdx !== -1) {
            const layoutPos = LAYOUT.POSITIONS[partyIdx];
            return k.vec2(layoutPos.x + 100, layoutPos.y + 50);
        }

        return k.vec2(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    }

    // Input Handling
    const actions = ["FIGHT", "SKILL", "DEFEND", "ITEM"];

    const handleLeft = () => {
        if (turnPhase === "PLAYER_INPUT") {
            selectedActionIndex = selectedActionIndex % 2 === 1 ? selectedActionIndex - 1 : selectedActionIndex + 1;
        } else if (turnPhase === "SELECT_SKILL") {
            selectedSkillIndex = selectedSkillIndex % 2 === 1 ? selectedSkillIndex - 1 : selectedSkillIndex + 1;
        } else if (turnPhase === "SELECT_TARGET") {
            cycleTarget(-1);
        } else if (turnPhase === "END") {
            endOptionIndex = 0;
        }
        updateMenuVisuals();
    };

    const handleRight = () => {
        if (turnPhase === "PLAYER_INPUT") {
            selectedActionIndex = selectedActionIndex % 2 === 0 ? selectedActionIndex + 1 : selectedActionIndex - 1;
        } else if (turnPhase === "SELECT_SKILL") {
            selectedSkillIndex = selectedSkillIndex % 2 === 0 ? selectedSkillIndex + 1 : selectedSkillIndex - 1;
        } else if (turnPhase === "SELECT_TARGET") {
            cycleTarget(1);
        } else if (turnPhase === "END") {
            endOptionIndex = 1;
        }
        updateMenuVisuals();
    };

    const handleUp = () => {
        if (turnPhase === "PLAYER_INPUT") {
            selectedActionIndex = selectedActionIndex >= 2 ? selectedActionIndex - 2 : selectedActionIndex + 2;
        } else if (turnPhase === "SELECT_SKILL") {
            selectedSkillIndex = selectedSkillIndex >= 2 ? selectedSkillIndex - 2 : selectedSkillIndex + 2;
        } else if (turnPhase === "SELECT_TARGET") {
            if (selectedAction.targetMode === "ALLIES") cycleTarget(-2);
        }
        updateMenuVisuals();
    };

    const handleDown = () => {
        if (turnPhase === "PLAYER_INPUT") {
            selectedActionIndex = selectedActionIndex < 2 ? selectedActionIndex + 2 : selectedActionIndex - 2;
        } else if (turnPhase === "SELECT_SKILL") {
            selectedSkillIndex = selectedSkillIndex < 2 ? selectedSkillIndex + 2 : selectedSkillIndex - 2;
        } else if (turnPhase === "SELECT_TARGET") {
            if (selectedAction.targetMode === "ALLIES") cycleTarget(2);
        }
        updateMenuVisuals();
    };

    const handleConfirm = () => {
        if (turnPhase === "PLAYER_INPUT") {
            lastActionIndexDuringTurn = selectedActionIndex;
            handleActionSelection(actions[selectedActionIndex]);
        } else if (turnPhase === "SELECT_SKILL") {
            handleSkillSelection();
        } else if (turnPhase === "SELECT_TARGET") {
            confirmTarget();
        } else if (turnPhase === "END") {
            if (endOptionIndex === 0) {
                if (gameState.isPartyDefeated()) {
                    gameRestart(true); // New Game
                } else {
                    gameRestart(false); // Continue
                }
            }
            else k.go("main");
        }
    };

    const handleBack = () => {
        if (turnPhase === "SELECT_SKILL") {
            turnPhase = "PLAYER_INPUT";
            updateMenuVisuals();
        } else if (turnPhase === "SELECT_TARGET") {
            turnPhase = (selectedAction && selectedAction.type === "SKILL") ? "SELECT_SKILL" : "PLAYER_INPUT";
            updateMenuVisuals();
        } else if (turnPhase === "PLAYER_INPUT" && currentHeroIndex > 0) {
            // Undo logic
            playerActions.pop();
            do {
                currentHeroIndex--;
            } while (currentHeroIndex > 0 && gameState.party[currentHeroIndex].isDead);

            // Re-sync UI state to last hero's choice (optional, but good for UX)
            selectedActionIndex = lastActionIndexDuringTurn;
            updateMenuVisuals();
        }
    };

    // Bind inputs
    ["left", "a"].forEach(key => k.onKeyPress(key, handleLeft));
    ["right", "d"].forEach(key => k.onKeyPress(key, handleRight));
    ["up", "w"].forEach(key => k.onKeyPress(key, handleUp));
    ["down", "s"].forEach(key => k.onKeyPress(key, handleDown));
    ["space", "enter"].forEach(key => k.onKeyPress(key, handleConfirm));
    ["backspace", "shift", "escape"].forEach(key => k.onKeyPress(key, handleBack));

    function cycleTarget(dir) {
        if (selectedAction.targetMode === "ALLIES") {
            const isHealAction = selectedAction.type === "ITEM" || (selectedAction.skill && selectedAction.skill.type === "Heal");
            let tries = 0;
            do {
                selectedEnemyIndex = (selectedEnemyIndex + dir + gameState.party.length) % gameState.party.length;
                tries++;
                // Allow targeting dead if it's a heal action, otherwise skip dead
            } while (!isHealAction && gameState.party[selectedEnemyIndex].isDead && tries < gameState.party.length);
        } else {
            let tries = 0;
            do {
                selectedEnemyIndex = (selectedEnemyIndex + dir + enemySprites.length) % enemySprites.length;
                tries++;
            } while (enemySprites[selectedEnemyIndex].sprite.char.isDead && tries < enemySprites.length);
        }
        updateSelectionVisuals();
    }

    function updateMenuVisuals() {
        if (turnPhase === "PLAYER_INPUT") {
            const hero = gameState.party[currentHeroIndex];
            log.updateLog(`What will ${hero.name} do?`, true, COLORS.text);
            menuSystem.show();
            menuSystem.updateMainMenu(selectedActionIndex);
        } else if (turnPhase === "SELECT_SKILL") {
            menuSystem.show();
            menuSystem.updateSkillMenu(gameState.party[currentHeroIndex].skills, selectedSkillIndex);
        } else {
            menuSystem.hide();
        }
        updateSelectionVisuals();
    }

    // Call immediately to show Turn 1
    updateMenuVisuals();

    function handleActionSelection(type) {
        const hero = gameState.party[currentHeroIndex];
        if (type === "FIGHT") startTargeting(type, "ENEMIES");
        else if (type === "SKILL") {
            turnPhase = "SELECT_SKILL";
            selectedSkillIndex = 0;
            updateMenuVisuals();
        } else commitAction({ type, source: hero, target: hero });
    }

    function handleSkillSelection() {
        const hero = gameState.party[currentHeroIndex];
        const skill = hero.skills[selectedSkillIndex];
        if (!skill || hero.sp < skill.spCost) return;

        selectedAction = { type: "SKILL", skill, source: hero };
        if (skill.target === "ONE_ENEMY") startTargeting("SKILL", "ENEMIES");
        else if (skill.target === "ONE_ALLY") startTargeting("SKILL", "ALLIES");
        else if (skill.target === "ALL_ENEMIES") startTargeting("SKILL", "ENEMIES"); // Now enter targeting phase for AOE
        else if (skill.target === "ALL_ALLIES") startTargeting("SKILL", "ALLIES");  // Now enter targeting phase for AOE
        else commitAction({ ...selectedAction, target: hero });
    }

    function startTargeting(type, mode) {
        if (type !== "SKILL") selectedAction = { type };
        selectedAction.targetMode = mode;

        if (mode === "ENEMIES") {
            selectedEnemyIndex = enemySprites.findIndex(s => !s.sprite.char.isDead);
        } else {
            // Allies: If heal, start on first (even if dead). If damage/other, start on first alive.
            const isHealAction = selectedAction.type === "ITEM" || (selectedAction.skill && selectedAction.skill.type === "Heal");
            selectedEnemyIndex = gameState.party.findIndex(h => isHealAction || !h.isDead);
        }

        if (selectedEnemyIndex === -1) selectedEnemyIndex = 0;
        turnPhase = "SELECT_TARGET";
        updateMenuVisuals();
    }

    function confirmTarget() {
        // Handle AOE targets
        let target;
        if (selectedAction.skill) {
            if (selectedAction.skill.target === "ALL_ENEMIES") target = "ALL_ENEMIES";
            else if (selectedAction.skill.target === "ALL_ALLIES") target = "ALL_ALLIES";
            else target = selectedAction.targetMode === "ALLIES" ? gameState.party[selectedEnemyIndex] : enemySprites[selectedEnemyIndex].sprite.char;
        } else {
            target = selectedAction.targetMode === "ALLIES" ? gameState.party[selectedEnemyIndex] : enemySprites[selectedEnemyIndex].sprite.char;
        }

        commitAction({ ...selectedAction, source: gameState.party[currentHeroIndex], target });
    }

    function commitAction(actionObj) {
        playerActions.push(actionObj);
        nextHero();
    }

    function nextHero() {
        currentHeroIndex++;
        // Use memory for next hero
        selectedActionIndex = lastActionIndexDuringTurn;
        selectedSkillIndex = 0;
        selectedAction = null;

        while (currentHeroIndex < gameState.party.length && gameState.party[currentHeroIndex].isDead) currentHeroIndex++;

        if (currentHeroIndex >= gameState.party.length) {
            turnPhase = "EXECUTING";
            executeTurn();
        } else {
            turnPhase = "PLAYER_INPUT";
            updateMenuVisuals();
            log.updateLog(`What will ${gameState.party[currentHeroIndex].name} do?`, false, COLORS.text);
        }
    }

    async function executeTurn() {
        menuSystem.hide();
        for (const action of playerActions) {
            if (gameState.areEnemiesDefeated() || action.source.isDead) continue;
            await performAction(action);
            await k.wait(0.6);
        }
        if (gameState.areEnemiesDefeated()) return endGame(true);

        for (const enemy of gameState.enemies) {
            if (enemy.isDead || gameState.isPartyDefeated()) continue;
            await enemyTurn(enemy);
            await k.wait(0.6);
        }

        if (gameState.isPartyDefeated()) endGame(false);
        else startNewRound();
    }

    async function enemyTurn(enemy) {
        const aliveHeroes = gameState.party.filter(h => !h.isDead);
        if (aliveHeroes.length === 0) return; // Should not happen if game over check works

        const roll = Math.random();
        // Enemies only use skills on alive heroes or themselves/allies
        if (roll < 0.2) await performAction({ type: "DEFEND", source: enemy, target: enemy });
        else if (roll < 0.6 && enemy.sp >= 10) {
            const skill = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
            const isHealSkill = skill.type === "Heal" || skill.type === "Buff";
            const targetGroup = isHealSkill ? gameState.enemies.filter(e => !e.isDead) : aliveHeroes;

            if (targetGroup.length > 0) {
                const target = targetGroup[Math.floor(Math.random() * targetGroup.length)];
                await performAction({ type: "SKILL", source: enemy, target, skill });
            }
        } else {
            await performAction({ type: "FIGHT", source: enemy, target: aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)] });
        }
    }

    async function performAction(action) {
        let { type, source, target, skill } = action;

        // Reset enemy HP bar visibility and hide all borders
        enemySprites.forEach(e => {
            e.hpBar.hidden = true;
            e.border.hidden = true;
        });
        battleUI.updateSelection(-1); // Hide party selection too

        // Helper to show target HP bar
        const showTargetHp = (t) => {
            const idx = gameState.enemies.indexOf(t);
            if (idx !== -1) enemySprites[idx].hpBar.hidden = false;
        };

        // Target Redirection Logic: If target is invalid (dead for damage, or non-existent), redirect
        const isHealAction = type === "ITEM" || (skill && skill.type === "Heal");
        if (target && target.isDead && !isHealAction && target !== "ALL_ENEMIES" && target !== "ALL_ALLIES") {
            const isEnemyGroup = gameState.enemies.includes(target);
            const group = isEnemyGroup ? gameState.enemies : gameState.party;
            const aliveTargets = group.filter(e => !e.isDead);

            if (aliveTargets.length > 0) {
                target = aliveTargets[Math.floor(Math.random() * aliveTargets.length)];
                log.updateLog(`${source.name} redirects attack to ${target.name}!`, false);
                await k.wait(0.6);
            } else {
                return;
            }
        }

        const rarityTag = (type === "SKILL" && skill) ? skill.rarity : null;
        const skillNameFormatted = rarityTag ? `[${rarityTag}]${skill.name}[/${rarityTag}]` : (type === "SKILL" ? skill.name : type);
        log.updateLog(`${source.name} uses ${skillNameFormatted}!`, false);
        await k.wait(0.5);

        const targetPos = getTargetPos(target);

        if (type === "FIGHT" || (type === "SKILL" && skill.type === "Damage")) {
            const targets = (target === "ALL_ENEMIES") ? gameState.enemies.filter(e => !e.isDead) :
                (target === "ALL_ALLIES") ? gameState.party.filter(p => !p.isDead) : [target];

            targets.forEach(t => {
                if (!t || t.isDead) return;
                showTargetHp(t);
                const basePower = (type === "FIGHT" || !skill) ? source.attack : source.attack + skill.power;
                t.takeDamage(basePower, (type === "SKILL" && skill) ? skill.attribute : source.attribute);
            });
            shakeScreen(5);
        } else if (type === "DEFEND") {
            source.defend();
            spawnParticles(targetPos, "↑", [255, 255, 150]);
        } else if (type === "ITEM" || (type === "SKILL" && skill.type === "Heal")) {
            const amount = skill ? skill.power : 50;
            const targets = (target === "ALL_ALLIES") ? gameState.party.filter(p => !p.isDead) : [target];
            targets.forEach(t => {
                if (!t || t.isDead) return;
                t.heal(amount);
                spawnParticles(getTargetPos(t), "+", [100, 255, 100]);
            });
            if (skill) {
                await k.wait(0.4);
                log.updateLog(`${source.name} used ${skillNameFormatted}. ${target.name || "Party"} healed ${amount} HP!`, false);
            }
        } else if (type === "SKILL" && (skill.type === "Buff" || skill.type === "Debuff")) {
            const targets = (target === "ALL_ALLIES") ? gameState.party.filter(p => !p.isDead) :
                (target === "ALL_ENEMIES") ? gameState.enemies.filter(e => !e.isDead) : [target];

            const isBuff = skill.type === "Buff";
            const charType = isBuff ? "↑" : "↓";
            let color = [255, 255, 255];

            if (skill.effect) {
                if (skill.effect.stat === "attack") color = [240, 80, 120];
                if (skill.effect.stat === "defense") color = [255, 255, 150];
                if (skill.effect.stat === "speed") color = [80, 240, 210];
            }

            targets.forEach(t => {
                if (!t || t.isDead) return;
                showTargetHp(t);
                if (skill.effect) {
                    t.addStatusEffect({
                        stat: skill.effect.stat,
                        amount: skill.effect.amount,
                        type: isBuff ? "BUFF" : "DEBUFF"
                    });
                }
                spawnParticles(getTargetPos(t), charType, color);
            });

            await k.wait(0.4);
            const change = isBuff ? "increased" : "decreased";
            const statName = skill.effect ? skill.effect.stat : "stats";
            log.updateLog(`${source.name} used ${skillNameFormatted}. ${target.name || "Target"}'s ${statName} ${change}!`, false);
        }

        if (type === "SKILL" && skill) source.costSp(skill.spCost);

        await k.wait(0.4);

        // Hide enemy HP bars after action
        enemySprites.forEach(e => e.hpBar.hidden = true);
    }

    function startNewRound() {
        turnCount++;
        turnCounter.updateCount(turnCount);
        gameState.party.forEach(h => h.resetTurn());
        gameState.enemies.forEach(e => e.resetTurn());
        playerActions = [];
        currentHeroIndex = 0;
        selectedActionIndex = 0;
        lastActionIndexDuringTurn = 0;
        selectedSkillIndex = 0;
        while (currentHeroIndex < gameState.party.length && gameState.party[currentHeroIndex].isDead) currentHeroIndex++;
        turnPhase = "PLAYER_INPUT";
        updateMenuVisuals();
    }

    function endGame(win) {
        turnPhase = "END";

        // Increment scaling after a boss battle victory
        if (win && gameState.roundCounter % 3 === 0) {
            gameState.scalingFactor += 0.2;
        }

        k.add([k.rect(SCREEN_WIDTH, SCREEN_HEIGHT), k.color(0, 0, 0), k.opacity(0.6), k.z(500)]);
        const winBox = k.add([k.rect(600, 300), k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2), k.anchor("center"), k.color(COLORS.uiBackground), k.outline(UI.OUTLINE, COLORS.uiBorder), k.z(501)]);
        winBox.add([k.text(win ? "VICTORY" : "GAMEOVER", { size: 60, font: "Viga" }), k.anchor("center"), k.pos(0, -50), k.color(COLORS.text)]);

        const primaryBtnLabel = win ? "CONTINUE" : "RETRY";
        const retry = winBox.add([k.rect(200, 60), k.pos(-120, 80), k.anchor("center"), k.outline(4, COLORS.uiBorder), k.color(COLORS.uiBackground)]);
        retry.add([k.text(primaryBtnLabel, { size: 24, font: "Viga" }), k.anchor("center"), k.color(COLORS.text)]);

        const quit = winBox.add([k.rect(200, 60), k.pos(120, 80), k.anchor("center"), k.outline(4, COLORS.uiBorder), k.color(COLORS.uiBackground)]);
        quit.add([k.text("QUIT", { size: 24, font: "Viga" }), k.anchor("center"), k.color(COLORS.text)]);

        const btns = [retry, quit];

        k.onUpdate(() => {
            btns.forEach((b, i) => {
                b.color = i === endOptionIndex ? k.rgb(COLORS.highlight[0], COLORS.highlight[1], COLORS.highlight[2]) : k.rgb(COLORS.uiBackground[0], COLORS.uiBackground[1], COLORS.uiBackground[2]);
            });
        });
    }

    function gameRestart(newGame = false) {
        if (newGame) {
            gameState.initializeParty();
        } else {
            gameState.roundCounter++;
            gameState.party.forEach(h => h.resetTurn());
        }
        k.go("battle");
    }

    function shakeScreen(amount) { k.shake(amount); }
}
