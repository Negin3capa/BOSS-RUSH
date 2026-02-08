import k from "../../kaplayCtx";
import { COLORS, LAYOUT, UI } from "../../constants";

/**
 * Creates a player portrait UI component with HP/Juice bars and status effects
 * @param {Object} gameState - The current game state
 * @param {Object} uiContainer - The parent UI container
 * @returns {Object} Object containing portraitUIs array and updateSelection function
 */
export function createPlayerPortraits(gameState, uiContainer) {
    const portraitUIs = [];

    // Create Player UI in Corners
    gameState.party.forEach((char, index) => {
        const pos = LAYOUT.POSITIONS[index] || { x: 0, y: 0 };

        const container = uiContainer.add([
            k.pos(pos.x, pos.y),
        ]);

        // Selection Border (Red)
        const selectionBorder = container.add([
            k.rect(210, 272),
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
        const portraitSprite = portraitBox.add([
            k.sprite(`${char.name}Sprite`),
            k.anchor("center"),
            k.pos(100, 100),
            k.scale(0.34), // Fit inside 200x200
        ]);

        // Hurt Sprite (hidden by default)
        const hurtSprite = portraitBox.add([
            k.sprite(`Hurt${char.name}`),
            k.anchor("center"),
            k.pos(100, 100),
            k.scale(0.34),
            k.opacity(0), // Hidden by default
        ]);

        // Downed Sprite (hidden by default)
        const downedSprite = portraitBox.add([
            k.sprite(`Downed${char.name}`),
            k.anchor("center"),
            k.pos(100, 100),
            k.scale(0.34),
            k.opacity(0), // Hidden by default
        ]);

        // Victory Sprite (hidden by default)
        const victorySprite = portraitBox.add([
            k.sprite(`Victory${char.name}`),
            k.anchor("center"),
            k.pos(100, 100),
            k.scale(0.34),
            k.opacity(0), // Hidden by default
        ]);

        // Header Label (e.g., NEUTRAL)
        const statusLabelBg = portraitBox.add([
            k.rect(133, 30),
            k.pos(98, 5), // Lowered slightly
            k.anchor("center"),
            k.color(COLORS.uiBorder),
            k.outline(2, COLORS.uiBackground),
            k.z(80),
        ]);

        const statusLabelText = portraitBox.add([
            k.text("NEUTRAL", { size: 16, font: "Viga" }),
            k.pos(100, 5), // Lowered slightly
            k.anchor("center"),
            k.color(COLORS.uiBackground),
            k.z(80),
            {
                update() {
                    // Update label based on character state
                    if (char.isDead) {
                        this.text = "DOWNED";
                        this.color = k.rgb(150, 150, 150); // Gray text for downed
                    } else {
                        this.text = "NEUTRAL";
                        this.color = k.rgb(COLORS.uiBackground[0], COLORS.uiBackground[1], COLORS.uiBackground[2]);
                    }
                }
            }
        ]);

        // Window Background (White) - Stats Box
        const mainBox = container.add([
            k.rect(200, 62),
            k.color(COLORS.uiBackground),
            k.outline(UI.OUTLINE, COLORS.uiBorder),
        ]);

        // Fallen Overlay
        const fallenOverlay = container.add([
            k.rect(200, 262), // Covers both portrait and stats
            k.pos(0, -200),
            k.color(100, 100, 120),
            k.opacity(0.5),
            k.z(10),
        ]);
        fallenOverlay.hidden = true;

        // Level Display (Moved to portrait box)
        portraitBox.add([
            k.text(`LV: ${char.level}`, { size: 14, font: "Viga" }),
            k.pos(190, 190),
            k.anchor("botright"),
            k.color(COLORS.text),
            {
                update() {
                    this.text = `LV: ${char.level}`;
                }
            }
        ]);

        // HP Bar
        const hpY = 8;
        const barX = 10;
        const barOffset = 35;
        const barWidth = 145;
        const barHeight = 18;

        container.add([
            k.sprite("heart"),
            k.pos(barX + 10, hpY + barHeight / 2),
            k.anchor("center"),
            k.scale(0.03),
            k.z(5),
            // Use multiply blend to make white background transparent on colored bars
            // @ts-ignore
            { blend: "multiply" },
        ]);

        container.add([
            k.rect(barWidth, barHeight),
            k.pos(barX + barOffset, hpY),
            k.color(COLORS.uiBorder),
            k.outline(2, COLORS.uiBorder),
        ]);

        const hpFill = container.add([
            k.rect(barWidth - 4, barHeight - 4),
            k.pos(barX + barOffset + 2, hpY + 2),
            k.color(COLORS.hp),
            {
                update() {
                    const targetWidth = Math.max(0, (char.hp / char.maxHp)) * (barWidth - 4);
                    this.width = k.lerp(this.width, targetWidth, k.dt() * 10);
                }
            }
        ]);

        const hpText = container.add([
            k.text(`${Math.floor(char.hp)}/${char.maxHp}`, { size: 12, font: "Viga" }),
            k.pos(barX + barOffset + barWidth - 6, hpY + barHeight / 2),
            k.anchor("right"),
            k.color(255, 255, 255),
            k.z(6),
            {
                update() {
                    const currentHp = Math.floor(char.hp);
                    this.text = `${currentHp}/${char.maxHp}`;
                }
            }
        ]);

        // Juice Bar
        const juiceY = 32;

        container.add([
            k.sprite("droplet"),
            k.pos(barX + 10, juiceY + barHeight / 2),
            k.anchor("center"),
            k.scale(0.03),
            k.z(5),
            // Use multiply blend to make white background transparent on colored bars
            // @ts-ignore
            { blend: "multiply" },
        ]);

        container.add([
            k.rect(barWidth, barHeight),
            k.pos(barX + barOffset, juiceY),
            k.color(COLORS.uiBorder),
            k.outline(2, COLORS.uiBorder),
        ]);

        const juiceFill = container.add([
            k.rect(barWidth - 4, barHeight - 4),
            k.pos(barX + barOffset + 2, juiceY + 2),
            k.color(COLORS.mp),
            {
                update() {
                    const targetWidth = (char.juice / char.maxJuice) * (barWidth - 4);
                    this.width = k.lerp(this.width, Math.max(0, targetWidth), k.dt() * 10);
                }
            }
        ]);

        const juiceText = container.add([
            k.text(`${Math.floor(char.juice)}/${char.maxJuice}`, { size: 12, font: "Viga" }),
            k.pos(barX + barOffset + barWidth - 6, juiceY + barHeight / 2),
            k.anchor("right"),
            k.color(255, 255, 255),
            k.z(6),
            {
                update() {
                    const currentJuice = Math.max(0, Math.floor(char.juice));
                    this.text = `${currentJuice}/${char.maxJuice}`;
                }
            }
        ]);

        // Status Icons (Arrows & Shield)
        const statusContainer = container.add([
            k.pos(15, -185), // Move to top of portrait box
            k.z(15), // Higher than fallenOverlay (z: 10) so it appears on top
        ]);

        ["attack", "defense"].forEach((stat, i) => {
            statusContainer.add([
                k.text("", { size: 24, font: "Inter" }),
                k.pos(i * 20, 0),
                k.anchor("center"),
                k.outline(3, [0, 0, 0]),
                k.z(15), // Higher than fallenOverlay (z: 10)
                {
                    update() {
                        const effect = char.statusEffects.find(e => e.stat === stat);
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

        const shieldIcon = container.add([
            k.text("🛡️", { size: 24 }),
            k.pos(195, 40),
            k.anchor("botright"),
            k.z(102),
        ]);
        shieldIcon.hidden = true;

        // Auto-update visuals based on character state
        container.onUpdate(() => {
            shieldIcon.hidden = !char.isDefending || char.isDead;
            fallenOverlay.hidden = !char.isDead;

            // Check for critical health (10% or less)
            const isCriticalHealth = !char.isDead && char.hp / char.maxHp <= 0.1;

            // Sprite State Management
            if (char.isVictorious) {
                // Show victory sprite, hide others
                portraitSprite.opacity = 0;
                hurtSprite.opacity = 0;
                downedSprite.opacity = 0;
                victorySprite.opacity = 1;
            } else if (char.isDead) {
                // Show downed sprite, hide others
                portraitSprite.opacity = 0;
                hurtSprite.opacity = 0;
                downedSprite.opacity = 1;
                victorySprite.opacity = 0;
            } else if (char.isHurt || isCriticalHealth) {
                // Show hurt sprite when damaged or at critical health
                portraitSprite.opacity = 0;
                hurtSprite.opacity = 1;
                downedSprite.opacity = 0;
                victorySprite.opacity = 0;
            } else {
                // Show normal sprite, hide others
                portraitSprite.opacity = 1;
                hurtSprite.opacity = 0;
                downedSprite.opacity = 0;
                victorySprite.opacity = 0;
            }
        });

        portraitUIs.push({ selectionBorder });
    });

    return {
        portraitUIs,
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
