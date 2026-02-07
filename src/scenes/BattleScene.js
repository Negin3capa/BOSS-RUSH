import k from "../kaplayCtx";
import { gameState } from "../state/GameState";
import { COLORS, SCREEN_WIDTH, SCREEN_HEIGHT, GAMEPLAY, LAYOUT, ATTRIBUTE_COLORS, ATTRIBUTES, UI } from "../constants";
import { createBattleUI, createMessageLog, createTurnCounter, createRoundCounter, createMenuSystem, createTargetingInfo } from "../ui/BattleUI";
import { createSidePanel } from "../ui/SidePanel";
import { RARITY_COLORS } from "../data/skills";
import gsap from "gsap";

export default function BattleScene() {
    // Set up enemies from current encounter instead of generating new ones
    if (!gameState.setupEncounterForBattle()) {
        // Fallback if no encounter is set up
        gameState.generateEnemies();
    }

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
    let isInputEnabled = false; // NEW: Input lock during entry animation

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

    // Create global side panel first (shows objectives and enemy name)
    const sidePanel = createSidePanel(gameState, { scene: "battle", initialTurnCount: turnCount });
    
    // Update side panel with enemy name immediately
    const primaryEnemy = gameState.enemies.find(e => e.isBoss) || gameState.enemies[0];
    if (primaryEnemy) {
        sidePanel.updateEnemyName(primaryEnemy.name);
    }

    // UI Elements - Create but position off-screen initially
    const battleUI = createBattleUI(gameState, turnCount);
    const log = createMessageLog();
    const menuSystem = createMenuSystem(log);
    const targetingInfo = createTargetingInfo();
    
    // Hide elements initially for entry animation
    battleUI.ui.hidden = true;
    log.frame.hidden = true;
    menuSystem.hide();
    
    // Store references for animation
    const enemySprites = [];
    
    // Visuals for Enemies - Create at scale 0 for "expand from background" effect
    gameState.enemies.forEach((enemy, i) => {
        const xOffset = (i - (gameState.enemies.length - 1) / 2) * 180;

        // Container for better layering - start at scale 0
        const container = k.add([
            k.pos(LAYOUT.ENEMY_CENTER_X + xOffset, LAYOUT.ENEMY_CENTER_Y),
            k.anchor("center"),
            k.opacity(0), // Start invisible
            k.scale(0), // Start at scale 0 for expand effect
            "enemy",
            {
                char: enemy,
                id: i,
                update() {
                    const baseScale = enemy.isBoss ? 2.5 : 1;
                    const visual = this.get("visual")[0];
                    if (!this.char.isDead) {
                        this.angle = Math.sin(k.time() * 1.0 + i) * 1.2;
                        // Apply base scale to the current animated scale
                        const animatedScale = this.scale.x; // Get the animated scale from GSAP
                        this.scale = k.vec2(baseScale * (animatedScale > 0 ? animatedScale : 0.001));
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

        enemySprites.push({ sprite: container, border, hpBar });
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
        // Reset all enemy borders
        enemySprites.forEach(e => {
            e.border.hidden = true;
            e.hpBar.hidden = (turnPhase !== "EXECUTING"); // Only show HP bars during execution
        });
        targetingInfo.hide();

        if (turnPhase === "PLAYER_INPUT" || turnPhase === "SELECT_SKILL") {
            battleUI.updateSelection(currentHeroIndex);
            targetCursor.hidden = true;
        } else if (turnPhase === "SELECT_TARGET" && selectedAction) {
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
                        }
                    });
                } else {
                    const targetEnemy = enemySprites[selectedEnemyIndex];
                    if (targetEnemy) {
                        targetEnemy.border.hidden = false;
                        targetingInfo.show(targetEnemy.sprite.char, targetEnemy.sprite.pos);
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

    function spawnNumbers(pos, amount, size, color) {
        if (!pos) return;
        const n = k.add([
            k.text(amount.toString(), { size, font: "Viga" }),
            k.pos(pos.x, pos.y - 40),
            k.color(color),
            k.anchor("center"),
            k.z(400),
            k.outline(4, [0, 0, 0]),
            k.move(270, 100),
            {
                update() {
                    this.opacity = k.lerp(this.opacity, 0, k.dt() * 2);
                    if (this.opacity <= 0.1) k.destroy(this);
                }
            }
        ]);
        n.opacity = 1;
    }

    function getTargetPos(target) {
        if (!target || target === "ALL_ENEMIES" || target === "ALL_ALLIES") {
            return k.vec2(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        }
        if (gameState.party.includes(target)) {
            const idx = gameState.party.indexOf(target);
            return k.vec2(LAYOUT.POSITIONS[idx].x + 100, LAYOUT.POSITIONS[idx].y - 20);
        }
        const idx = gameState.enemies.indexOf(target);
        if (idx !== -1) {
            return enemySprites[idx].sprite.pos;
        }
        return k.vec2(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    }

    function getActionPriority(action) {
        const { type, skill } = action;
        if (type === "SKILL" && skill && skill.isSpeedScaling) return 3;
        if (type === "DEFEND") return 2;
        if (type === "SKILL" && skill && (skill.type === "Heal" || skill.type === "Buff" || skill.type === "Debuff")) return 1;
        return 0;
    }

    // Input Handling
    const actions = ["FIGHT", "SKILL", "DEFEND", "ITEM"];

    const handleLeft = () => {
        if (!isInputEnabled) return; // NEW: Check input lock
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
        if (!isInputEnabled) return; // NEW: Check input lock
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
        if (!isInputEnabled) return; // NEW: Check input lock
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
        if (!isInputEnabled) return; // NEW: Check input lock
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
        if (!isInputEnabled) return; // NEW: Check input lock
        if (turnPhase === "PLAYER_INPUT") {
            lastActionIndexDuringTurn = selectedActionIndex;
            handleActionSelection(actions[selectedActionIndex]);
        } else if (turnPhase === "SELECT_SKILL") {
            handleSkillSelection();
        } else if (turnPhase === "SELECT_TARGET") {
            confirmTarget();
        } else if (turnPhase === "END") {
            if (gameState.isPartyDefeated()) {
                // Game over screen
                if (endOptionIndex === 0) {
                    gameRestart(true); // New Game
                } else {
                    k.go("main");
                }
            } else {
                // Victory screen
                if (endOptionIndex === 0) {
                    // Cash out action
                    const goldReward = calculateGoldReward();
                    gameState.gold += goldReward;
                    sidePanel.updateGold(gameState.gold);
                    gameRestart(false); // Continue to next round
                } else {
                    k.go("main");
                }
            }
        }
    };

    const handleBack = () => {
        if (!isInputEnabled) return; // NEW: Check input lock
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
                // Allow targeting dead if it's a heal action (item or skill), otherwise skip dead
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
            log.updateLog(`What will ${hero.name} do?`, false, COLORS.text);
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

    function handleActionSelection(type) {
        const hero = gameState.party[currentHeroIndex];
        // Start action - reset hurt state
        hero.startAction();
        
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
        if (!skill || hero.juice < skill.mpCost) return;

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
            updateSelectionVisuals(); // Hide targeting UI
            executeTurn();
        } else {
            turnPhase = "PLAYER_INPUT";
            updateMenuVisuals();
            log.updateLog(`What will ${gameState.party[currentHeroIndex].name} do?`, false, COLORS.text);
        }
    }

    async function executeTurn() {
        menuSystem.hide();

        // Phase 1: Collect Enemy Actions
        const allActions = [...playerActions];
        for (const enemy of gameState.enemies) {
            if (enemy.isDead) continue;
            const enemyAction = await getEnemyAction(enemy);
            if (enemyAction) allActions.push(enemyAction);
        }

        // Phase 2: Execution
        // Sort by priority first, then speed
        allActions.sort((a, b) => {
            const prioA = getActionPriority(a);
            const prioB = getActionPriority(b);
            if (prioA !== prioB) return prioB - prioA;
            return b.source.effectiveSpeed - a.source.effectiveSpeed;
        });

        // Phase 2: Execute all actions, record if victory/defeat conditions were met
        let enemiesDefeated = false;
        let partyDefeated = false;
        
        for (const action of allActions) {
            if (enemiesDefeated || partyDefeated) break;
            if (action.source.isDead) continue;
            await performAction(action);
            await k.wait(0.6);
            
            // Check for victory/defeat conditions but continue with scoring first
            if (gameState.areEnemiesDefeated()) enemiesDefeated = true;
            if (gameState.isPartyDefeated()) partyDefeated = true;
        }

        // After all actions are processed, check victory/defeat
        if (enemiesDefeated) endGame(true);
        else if (partyDefeated) endGame(false);
        else startNewRound();
    }

    async function getEnemyAction(enemy) {
        const aliveHeroes = gameState.party.filter(h => !h.isDead);
        if (aliveHeroes.length === 0) return null;

        const roll = Math.random();
        if (roll < 0.2) return { type: "DEFEND", source: enemy, target: enemy };
        else if (roll < 0.6 && enemy.juice >= 10 && enemy.skills.length > 0) {
            const skill = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
            const isHealSkill = skill.type === "Heal" || skill.type === "Buff";
            const targetGroup = isHealSkill ? gameState.enemies.filter(e => !e.isDead) : aliveHeroes;

            if (targetGroup.length > 0) {
                const target = targetGroup[Math.floor(Math.random() * targetGroup.length)];
                return { type: "SKILL", source: enemy, target, skill };
            }
        }
        return { type: "FIGHT", source: enemy, target: aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)] };
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

        // Trigger hurt state for targets taking damage
        if (type === "FIGHT" || (type === "SKILL" && skill.type === "Damage")) {
            const targets = (target === "ALL_ENEMIES") ? gameState.enemies.filter(e => !e.isDead) :
                (target === "ALL_ALLIES") ? gameState.party.filter(p => !p.isDead) : [target];

            targets.forEach(t => {
                if (t && !t.isDead) {
                    t.triggerHurt();
                }
            });
        }

        const rarityTag = (type === "SKILL" && skill) ? skill.rarity : null;
        const skillNameFormatted = rarityTag ? `[${rarityTag}]${skill.name}[/${rarityTag}]` : (type === "SKILL" && skill ? skill.name : type);
        log.updateLog(`${source.name} uses ${skillNameFormatted}!`, false);
        await k.wait(0.5);

        const targetPos = getTargetPos(target);

        if (type === "FIGHT" || (type === "SKILL" && skill.type === "Damage")) {
            const isSkill = type === "SKILL";
            const targets = (target === "ALL_ENEMIES") ? gameState.enemies.filter(e => !e.isDead) :
                (target === "ALL_ALLIES") ? gameState.party.filter(p => !p.isDead) : [target];

            for (const t of targets) {
                if (!t || t.isDead) continue;
                showTargetHp(t);

                // Use Attack for Physical, SpecialAttack for Special Skills
                // Special case: Speed-Scaling skills use Speed
                const category = isSkill ? (skill.category || "Physical") : "Physical";
                const skillType = isSkill ? skill.attribute : source.types[0];

                let srcStat = 0;
                if (isSkill && skill && skill.isSpeedScaling) {
                    srcStat = source.effectiveSpeed;
                } else {
                    srcStat = (category === "Physical") ? source.effectiveAttack : source.effectiveSpAttack;
                }
                const basePower = (srcStat * 0.5) + (isSkill ? skill.power : 15);

                const result = t.takeDamage(basePower, skillType, source, isSkill, category);

                if (!result.hit) {
                    log.updateLog("MISS!", true, [200, 200, 200]);
                    spawnParticles(getTargetPos(t), "X", [200, 200, 200]);
                } else {
                    if (result.crit) {
                        log.updateLog("CRITICAL HIT!", true, COLORS.highlight);
                        shakeScreen(15);
                    }
                    if (result.mult > 1.5) {
                        log.updateLog("It's super effective!", true, [180, 80, 0]); // Dark Orange
                        gameState.scoringState.battleMetrics.superEffectiveHits++;
                        
                        // Check for super effective objective (infinite)
                        gameState.scoringState.objectives.forEach((obj, index) => {
                            if (obj.id === "super_effective") {
                                obj.currentCount++;
                                
                                // Calculate score
                                let baseScore = obj.points;
                                let totalScore = baseScore;
                                if (obj.bonus.type === "additive") {
                                    totalScore += obj.bonus.value;
                                } else if (obj.bonus.type === "multiplicative") {
                                    totalScore = Math.floor(baseScore * obj.bonus.value);
                                }
                                
                                const scoreAdded = gameState.addScore(totalScore);
                                if (scoreAdded) {
                                    sidePanel.activateObjective(index);
                                    log.updateLog(`Objective: ${obj.label}! +${totalScore} points`, true, [255, 255, 0]);
                                } else {
                                    log.updateLog(`Objective: ${obj.label}! (Scoring locked)`, true, [120, 120, 120]);
                                }
                            }
                        });
                    }
                    else if (result.mult > 1 && isSkill && source.types.includes(skillType)) log.updateLog("STAB Bonus!", true, [0, 120, 120]); // Dark Teal

                    if (result.mult < 1 && result.mult > 0) log.updateLog("It's not very effective...", true, [100, 100, 150]);
                    if (result.mult === 0) log.updateLog("It had no effect...", true, [80, 80, 80]);

                    const damageColor = (category === "Physical") ? [255, 255, 255] : (ATTRIBUTE_COLORS[skillType] || [255, 255, 255]);
                    spawnNumbers(getTargetPos(t), result.damage, result.crit ? 50 : 32, damageColor);
                    shakeScreen(result.crit ? 10 : 5);

                    // Add score based on damage dealt (1 point per damage dealt) - only for player party
                    const isPlayerAction = gameState.party.includes(source);
                    if (isPlayerAction) {
                        const scoreAdded = gameState.addScore(result.damage);
                        if (scoreAdded) {
                            sidePanel.updateRoundScore(gameState.scoringState.roundScore);
                        }
                    }
                }
                await k.wait(0.3);
            }
        } else if (type === "DEFEND") {
            // Start action - reset hurt state
            source.startAction();
            source.defend();
            spawnParticles(targetPos, "🛡️", [255, 255, 150]);
        } else if (type === "ITEM" || (type === "SKILL" && skill.type === "Heal")) {
            // Start action - reset hurt state
            source.startAction();
        const amount = skill ? skill.power : 50;
        const targets = (target === "ALL_ALLIES") ? gameState.party : [target]; // Support reviving allies even in AOE
        targets.forEach(t => {
            if (!t) return;
            t.heal(amount);
            spawnNumbers(getTargetPos(t), amount, 32, [100, 255, 100]);
            spawnParticles(getTargetPos(t), "✨", [100, 255, 100]);
        });
        
        // Check for heal juice objective (infinite)
        if (amount >= 50) {
            gameState.scoringState.objectives.forEach((obj, index) => {
                if (obj.id === "heal_juice") {
                    obj.currentCount++;
                    
                    // Calculate score
                    let baseScore = obj.points;
                    let totalScore = baseScore;
                    if (obj.bonus.type === "additive") {
                        totalScore += obj.bonus.value;
                    } else if (obj.bonus.type === "multiplicative") {
                        totalScore = Math.floor(baseScore * obj.bonus.value);
                    }
                    
                    const scoreAdded = gameState.addScore(totalScore);
                    if (scoreAdded) {
                        sidePanel.activateObjective(index);
                        log.updateLog(`Objective: ${obj.label}! +${totalScore} points`, true, [255, 255, 0]);
                    } else {
                        log.updateLog(`Objective: ${obj.label}! (Scoring locked)`, true, [120, 120, 120]);
                    }
                }
            });
        }
        
        if (skill) {
            await k.wait(0.4);
            log.updateLog(`${source.name} used ${skillNameFormatted}.`, true);
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
                if (skill.effect.stat === "spAttack" || skill.effect.stat === "specialAttack") color = [180, 80, 255];
                if (skill.effect.stat === "spDefense" || skill.effect.stat === "specialDefense") color = [80, 150, 255];
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
            log.updateLog(`${target.name || "Target"}'s ${statName} ${change}!`, true);
        }

        // Scoring Logic Integration - Infinite objectives (only for player actions)
        const isPlayerAction = gameState.party.includes(source);
        if (isPlayerAction) {
        gameState.scoringState.objectives.forEach((obj, index) => {
            let objectiveAchieved = false;

            if (obj.id === "deal_type" && (type === "FIGHT" || (type === "SKILL" && skill.type === "Damage"))) {
                if (skill && skill.attribute === obj.targetData.type) {
                    objectiveAchieved = true;
                }
            } else if (obj.id === "use_skill" && type === "SKILL" && skill) {
                if (skill.rarity === obj.targetData.rarity) {
                    objectiveAchieved = true;
                }
            } else if (obj.id === "super_effective" && (type === "FIGHT" || (type === "SKILL" && skill.type === "Damage"))) {
                // Handled earlier when dealing damage
            } else if (obj.id === "heal_juice" && (type === "ITEM" || (type === "SKILL" && skill.type === "Heal"))) {
                // Handled earlier when healing
            }

            if (objectiveAchieved) {
                obj.currentCount++;
                
                // Calculate score based on objective type and base value
                let baseScore = obj.points;
                
                // Adjust base score based on skill type
                if (type === "SKILL") {
                    if (skill.type === "Heal") {
                        baseScore = Math.floor(baseScore * 1.2); // Healing skills get 20% bonus
                    } else if (skill.type === "Damage") {
                        baseScore = Math.floor(baseScore * 0.9); // Damage skills get 10% reduction
                    }
                }

                // Apply bonus
                let totalScore = baseScore;
                if (obj.bonus.type === "additive") {
                    totalScore += obj.bonus.value;
                } else if (obj.bonus.type === "multiplicative") {
                    totalScore = Math.floor(baseScore * obj.bonus.value);
                }

                gameState.addScore(totalScore);
                
                // Activate visual effect
                const scoreAdded = gameState.addScore(totalScore);
                if (scoreAdded) {
                    sidePanel.activateObjective(index);
                    log.updateLog(`Objective: ${obj.label}! +${totalScore} points`, true, [255, 255, 0]);
                } else {
                    log.updateLog(`Objective: ${obj.label}! (Scoring locked)`, true, [120, 120, 120]);
                }
            }
        });
        } // End of if (isPlayerAction) block

        if (type === "SKILL" && skill) source.costJuice(skill.mpCost);

        await k.wait(0.4);

        // Hide enemy HP bars after action
        enemySprites.forEach(e => e.hpBar.hidden = true);
    }

    function startNewRound() {
        turnCount++;
        sidePanel.updateTurn(turnCount);
        
        // Decrement attempts each turn - if reaches 0, scoring is locked
        const attemptsLeft = gameState.decrementAttempts();
        sidePanel.updateAttempts(attemptsLeft);
        
        if (gameState.scoringLocked) {
            log.updateLog("⚠️ Scoring locked! No more points this round.", true, [255, 60, 60]);
        }
        
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

    // Track party deaths
    let previousAliveCount = gameState.party.filter(h => !h.isDead).length;
    k.onUpdate(() => {
        const currentAliveCount = gameState.party.filter(h => !h.isDead).length;
        if (currentAliveCount < previousAliveCount) {
            gameState.scoringState.battleMetrics.partyDeaths += previousAliveCount - currentAliveCount;
        }
        previousAliveCount = currentAliveCount;

        gameState.party.forEach(h => h.updateHurtState(k.dt()));
        gameState.enemies.forEach(e => e.updateHurtState(k.dt()));
    });

    function calculateGoldReward() {
        // Base gold reward
        let baseGold = 100 + (gameState.roundCounter * 50);

        // Turn count penalty (more turns = less gold)
        const turnPenalty = Math.max(0.1, 1 - (turnCount / 20));
        baseGold = Math.floor(baseGold * turnPenalty);

        // Round score bonus
        const scoreBonus = Math.floor(gameState.scoringState.roundScore / 100);
        baseGold += scoreBonus;

        // Objectives met bonus
        const completedObjectives = gameState.scoringState.objectives.filter(obj => obj.completed).length;
        baseGold += completedObjectives * 25;

        // Super effective hits bonus
        baseGold += gameState.scoringState.battleMetrics.superEffectiveHits * 15;

        // Party deaths penalty
        const deathPenalty = Math.max(0.5, 1 - (gameState.scoringState.battleMetrics.partyDeaths * 0.1));
        baseGold = Math.floor(baseGold * deathPenalty);

        // Boss round bonus
        if (gameState.roundCounter % 3 === 0) {
            baseGold = Math.floor(baseGold * 1.5);
        }

        // Scaling factor
        baseGold = Math.floor(baseGold * gameState.scalingFactor);

        return Math.max(10, baseGold);
    }

    function endGame(win) {
        turnPhase = "END";

        // Handle EXP and Rewards
        let expReward = 0;
        let goldReward = 0;
        if (win) {
            // Calculate rewards but don't award gold yet
            goldReward = calculateGoldReward();
            log.updateLog("Your party was victorious!", true, [255, 215, 0]);
            log.updateLog(`You earned ${goldReward} gold!`, true, [255, 215, 0]);

            // Base EXP = 50 per enemy + bonus for boss/round
            const totalEnemyLevels = gameState.enemies.reduce((acc, e) => acc + e.level, 0);
            expReward = Math.floor(totalEnemyLevels * 25 * gameState.scalingFactor);

            // Give EXP to alive party members
            gameState.party.forEach(hero => {
                if (!hero.isDead) {
                    const result = hero.gainExp(expReward);
                    if (result.leveledUp) {
                        log.updateLog(`${hero.name} leveled up to ${hero.level}!`, true, [255, 215, 0]);
                    }
                }
            });

            // Increment scaling after a boss battle victory
            if (gameState.roundCounter % 3 === 0) {
                gameState.scalingFactor += 0.2;
                
                // Increment ante on boss defeat
                const newAnte = gameState.incrementAnte();
                sidePanel.updateAnte(newAnte);
                log.updateLog(`Ante increased to ${newAnte}/8!`, true, [255, 215, 0]);
                
                // Check for game win condition (ante reached 8)
                if (gameState.hasWonGame()) {
                    showGameWinScreen();
                    return;
                }
            }

            // Show victory screen
            showVictoryScreen(goldReward);
        } else {
            // Show game over screen
            k.add([k.rect(SCREEN_WIDTH, SCREEN_HEIGHT), k.color(0, 0, 0), k.opacity(0.6), k.z(500)]);
            const winBox = k.add([k.rect(600, 300), k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2), k.anchor("center"), k.color(COLORS.uiBackground), k.outline(UI.OUTLINE, COLORS.uiBorder), k.z(501)]);
            winBox.add([k.text("GAMEOVER", { size: 60, font: "Viga" }), k.anchor("center"), k.pos(0, -50), k.color(COLORS.text)]);

            const retry = winBox.add([k.rect(200, 60), k.pos(-120, 80), k.anchor("center"), k.outline(4, COLORS.uiBorder), k.color(COLORS.uiBackground)]);
            retry.add([k.text("RETRY", { size: 24, font: "Viga" }), k.anchor("center"), k.color(COLORS.text)]);

            const quit = winBox.add([k.rect(200, 60), k.pos(120, 80), k.anchor("center"), k.outline(4, COLORS.uiBorder), k.color(COLORS.uiBackground)]);
            quit.add([k.text("QUIT", { size: 24, font: "Viga" }), k.anchor("center"), k.color(COLORS.text)]);

            const btns = [retry, quit];

            k.onUpdate(() => {
                btns.forEach((b, i) => {
                    b.color = i === endOptionIndex ? k.rgb(COLORS.highlight[0], COLORS.highlight[1], COLORS.highlight[2]) : k.rgb(COLORS.uiBackground[0], COLORS.uiBackground[1], COLORS.uiBackground[2]);
                });
            });
        }
    }

    function showVictoryScreen(goldReward) {
        // Create victory screen that slides in from the bottom
        const victoryBox = k.add([
            k.rect(480, 180),
            k.pos(LAYOUT.CENTER_X, SCREEN_HEIGHT + 100), // Start below screen
            k.anchor("center"),
            k.color(0, 0, 0), // Black background
            k.z(501),
            {
                // Animation state
                targetY: SCREEN_HEIGHT - 70,
                startTime: k.time(),
                duration: 0.5,
                update() {
                    const elapsed = k.time() - this.startTime;
                    const progress = Math.min(elapsed / this.duration, 1);
                    // Ease out quad animation
                    const easedProgress = 1 - Math.pow(1 - progress, 2);
                    this.pos.y = SCREEN_HEIGHT + 100 + (this.targetY - (SCREEN_HEIGHT + 100)) * easedProgress;
                }
            }
        ]);

        // Create a separate border rectangle
        const border = k.add([
            k.rect(480 + 10, 180 + 10), // Thinner border
            k.pos(LAYOUT.CENTER_X, SCREEN_HEIGHT + 100),
            k.anchor("center"),
            k.color(255, 255, 255), // White border
            k.outline(2, [0, 0, 0]), // Black outline
            k.z(500), // Behind the victory box
            {
                targetY: SCREEN_HEIGHT - 70,
                startTime: k.time(),
                duration: 0.5,
                update() {
                    const elapsed = k.time() - this.startTime;
                    const progress = Math.min(elapsed / this.duration, 1);
                    const easedProgress = 1 - Math.pow(1 - progress, 2);
                    this.pos.y = SCREEN_HEIGHT + 100 + (this.targetY - (SCREEN_HEIGHT + 100)) * easedProgress;
                }
            }
        ]);

        victoryBox.add([
            k.text("VICTORY!", { size: 40, font: "Viga" }),
            k.anchor("center"),
            k.pos(0, -40),
            k.color(255, 255, 255), // White text
        ]);

        const cashOutBtn = victoryBox.add([
            k.rect(220, 50),
            k.pos(0, 30), // Centered
            k.anchor("center"),
            k.outline(4, [255, 255, 255]), // White border
            k.color(139, 69, 19), // Brown/Gold color (same as side panel)
        ]);
        cashOutBtn.add([
            k.text(`Cash out ${goldReward}`, { size: 20, font: "Viga" }),
            k.anchor("center"),
            k.color(255, 215, 0), // Gold text (same as side panel)
        ]);

        const btns = [cashOutBtn];

        k.onUpdate(() => {
            btns.forEach((b, i) => {
                b.color = i === endOptionIndex ? k.rgb(160, 80, 30) : k.rgb(139, 69, 19); // Darker brown when selected
            });
        });

        // Handle cash out action
        const handleCashOut = () => {
            gameState.gold += goldReward;
            sidePanel.updateGold(gameState.gold);
            gameRestart(false); // Continue to next round
        };

        // Update the existing handleConfirm function to handle victory screen
        // We'll modify the existing handleConfirm instead of adding new listeners
    }

    function showGameWinScreen() {
        // Create game win screen overlay
        k.add([k.rect(SCREEN_WIDTH, SCREEN_HEIGHT), k.color(0, 0, 0), k.opacity(0.8), k.z(600)]);
        
        const winBox = k.add([
            k.rect(700, 400),
            k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2),
            k.anchor("center"),
            k.color(40, 30, 60),
            k.outline(6, [255, 215, 0]),
            k.z(601)
        ]);
        
        winBox.add([
            k.text("🏆 YOU WON! 🏆", { size: 60, font: "Viga" }),
            k.anchor("center"),
            k.pos(0, -100),
            k.color(255, 215, 0)
        ]);
        
        winBox.add([
            k.text(`You defeated 8 bosses and conquered\nthe BOSS RUSH!`, { size: 24, font: "Viga", align: "center" }),
            k.anchor("center"),
            k.pos(0, -20),
            k.color(255, 255, 255)
        ]);
        
        winBox.add([
            k.text(`Final Gold: ${gameState.gold}`, { size: 28, font: "Viga" }),
            k.anchor("center"),
            k.pos(0, 50),
            k.color(255, 215, 0)
        ]);
        
        const newGameBtn = winBox.add([
            k.rect(200, 60),
            k.pos(0, 130),
            k.anchor("center"),
            k.outline(4, COLORS.uiBorder),
            k.color(COLORS.highlight),
            k.z(602)
        ]);
        newGameBtn.add([
            k.text("NEW GAME", { size: 24, font: "Viga" }),
            k.anchor("center"),
            k.color(255, 255, 255)
        ]);
        
        // Simple click to restart
        newGameBtn.onClick(() => {
            gameState.initializeParty();
            k.go("main");
        });
    }

    function gameRestart(newGame = false) {
        // Reset battle metrics
        gameState.scoringState.battleMetrics = {
            superEffectiveHits: 0,
            partyDeaths: 0,
            totalTurns: 0
        };
        
        if (newGame) {
            gameState.initializeParty();
            gameState.generateEncounters();
            k.go("encounter_select");
        } else {
            // Complete current encounter and check if there are more
            const hasMoreEncounters = gameState.completeCurrentEncounter();
            
            if (hasMoreEncounters) {
                // Still have encounters in this ante, go back to encounter select
                gameState.roundCounter++;
                gameState.resetAttempts();
                gameState.party.forEach(h => h.resetTurn());
                k.go("encounter_select");
            } else {
                // All encounters done - check if this was a boss (last encounter)
                // Increment ante and generate new encounters
                gameState.roundCounter++;
                gameState.incrementAnte();
                gameState.resetAttempts();
                gameState.party.forEach(h => h.resetTurn());
                
                // Check for game win
                if (gameState.hasWonGame()) {
                    // Game won - will be handled by showGameWinScreen
                    return;
                }
                
                // Generate new encounters for next ante
                gameState.generateEncounters();
                k.go("encounter_select");
            }
        }
    }

    function shakeScreen(amount) { k.shake(amount); }

    // NEW: Entry Animation Sequence
    function playEntryAnimation() {
        const tl = gsap.timeline({
            onComplete: () => {
                // Enable input after all animations complete
                isInputEnabled = true;
                // Show initial menu
                updateMenuVisuals();
            }
        });

        // Phase 1: Side Panel (immediate - already sliding in via its own animation)
        // Side panel is already created and animating via its own GSAP

        // Phase 2: Party Members (0.2s delay) - Scroll in from corners
        battleUI.ui.hidden = false;
        const partyStartPositions = [
            { x: -250, y: 220 },      // Top-left from left
            { x: SCREEN_WIDTH + 50, y: 220 },  // Top-right from right
            { x: -250, y: SCREEN_HEIGHT - 77 }, // Bottom-left from left
            { x: SCREEN_WIDTH + 50, y: SCREEN_HEIGHT - 77 }  // Bottom-right from right
        ];

        // Get the party member containers from battleUI
        const partyContainers = battleUI.ui.get("*");
        
        partyContainers.forEach((container, index) => {
            if (index < 4) {
                const startPos = partyStartPositions[index];
                const endPos = LAYOUT.POSITIONS[index];
                
                // Set initial position off-screen
                container.pos.x = startPos.x;
                container.pos.y = startPos.y;
                container.opacity = 0;

                // Animate to final position
                tl.to(container.pos, {
                    x: endPos.x,
                    y: endPos.y,
                    duration: 0.5,
                    ease: "power2.out"
                }, 0.2 + (index * 0.1));

                tl.to(container, {
                    opacity: 1,
                    duration: 0.3
                }, 0.2 + (index * 0.1));
            }
        });

        // Phase 3: Enemy (0.6s delay) - Expand from background (scale 0 to full)
        enemySprites.forEach((enemyData, index) => {
            tl.to(enemyData.sprite.scale, {
                x: 1,
                y: 1,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, 0.6 + (index * 0.15));

            tl.to(enemyData.sprite, {
                opacity: 1,
                duration: 0.4
            }, 0.6 + (index * 0.15));
        });

        // Phase 4: Action Menu (1.0s delay) - Slide up from bottom
        tl.call(() => {
            menuSystem.show();
        }, null, 1.0);

        // Phase 5: Message Log (1.3s delay) - Fade in
        tl.call(() => {
            log.frame.hidden = false;
            log.frame.opacity = 0;
        }, null, 1.3);

        tl.to(log.frame, {
            opacity: 1,
            duration: 0.3
        }, 1.3);
    }

    // Start entry animation after a brief delay to ensure everything is created
    k.wait(0.1).then(() => {
        playEntryAnimation();
    });
}