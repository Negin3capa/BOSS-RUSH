import k from "../kaplayCtx";
import { COLORS, SCREEN_WIDTH, SCREEN_HEIGHT, UI } from "../constants";
import { gameState } from "../state/GameState";
import gsap from "gsap";

export default function MainScreen() {
    let selectedOption = 0;
    const options = ["START", "QUIT"];
    let isTransitioning = false;

    // Black overlay for transition
    const blackOverlay = k.add([
        k.rect(SCREEN_WIDTH, SCREEN_HEIGHT),
        k.pos(0, 0),
        k.color(0, 0, 0),
        k.opacity(0),
        k.z(100),
    ]);

    // Background Nebula
    const bg = k.add([
        k.sprite("nebula"),
        k.scale(Math.max(SCREEN_WIDTH / 1024, SCREEN_HEIGHT / 768) * 1.1),
        k.pos(0, 0),
        k.opacity(0.8),
        {
            update() {
                this.pos.x = Math.sin(k.time() * 0.2) * 20;
                this.pos.y = Math.cos(k.time() * 0.2) * 20;
            }
        }
    ]);

    // Title Window (OMORI style white box)
    const titleWindow = k.add([
        k.rect(500, 120),
        k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4),
        k.anchor("center"),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
        {
            update() {
                this.angle = Math.sin(k.time() * 2) * 1.5;
            }
        }
    ]);

    titleWindow.add([
        k.text("BOSS RUSH", {
            size: 80,
            font: "Viga",
            align: "center"
        }),
        k.anchor("center"),
        k.color(COLORS.text),
    ]);

    // Menu Container
    const menuContainer = k.add([
        k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 100),
        k.anchor("center"),
    ]);

    const menuItems = options.map((opt, i) => {
        const itemWindow = menuContainer.add([
            k.rect(300, 70),
            k.pos(0, i * 90),
            k.anchor("center"),
            k.color(COLORS.uiBackground),
            k.outline(UI.OUTLINE, COLORS.uiBorder),
            k.scale(1),
            { index: i }
        ]);

        const text = itemWindow.add([
            k.text(opt, { size: 36, font: "Inter" }),
            k.anchor("center"),
            k.color(COLORS.text),
        ]);

        return { window: itemWindow, text };
    });

    function updateMenu() {
        menuItems.forEach((item, i) => {
            const isSelected = i === selectedOption;
            if (isSelected) {
                item.window.color = COLORS.highlight;
                item.text.text = `> ${options[i]} <`;
                item.window.scale = k.vec2(UI.PUNCH_SCALE);
            } else {
                item.window.color = COLORS.uiBackground;
                item.text.text = options[i];
                item.window.scale = k.vec2(1);
            }
        });
    }

    updateMenu();

    k.onKeyPress("up", () => {
        selectedOption = (selectedOption - 1 + options.length) % options.length;
        updateMenu();
    });

    k.onKeyPress("down", () => {
        selectedOption = (selectedOption + 1) % options.length;
        updateMenu();
    });

    function startGame() {
        if (isTransitioning) return;
        isTransitioning = true;

        gameState.initializeParty();
        gameState.generateEncounters();

        // Animate black overlay fade in
        gsap.to(blackOverlay, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                k.go("encounter_select");
            }
        });
    }

    k.onKeyPress("space", () => {
        if (options[selectedOption] === "START") {
            startGame();
        } else if (options[selectedOption] === "QUIT") {
            k.debug.log("Quit selected");
        }
    });

    k.onKeyPress("enter", () => {
        if (options[selectedOption] === "START") {
            startGame();
        }
    });
}
