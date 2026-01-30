import k from "../kaplayCtx";
import { COLORS, SCREEN_WIDTH, SCREEN_HEIGHT, UI } from "../constants";

export default function MainScreen() {
    let selectedOption = 0;
    const options = ["START", "QUIT"];

    // Background
    k.add([
        k.rect(SCREEN_WIDTH, SCREEN_HEIGHT),
        k.color(COLORS.background),
    ]);

    // Decorative sketchy lines (OMORI style)
    for (let i = 0; i < 5; i++) {
        k.add([
            k.rect(SCREEN_WIDTH, 2),
            k.pos(0, k.rand(0, SCREEN_HEIGHT)),
            k.color(COLORS.uiBackground),
            k.opacity(0.1),
        ]);
    }

    const title = k.add([
        k.text("BOSS RUSH", {
            size: 84,
            font: "Viga",
            align: "center"
        }),
        k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 3),
        k.anchor("center"),
        k.color(COLORS.highlight),
        k.scale(1),
        k.rotate(0),
        {
            update() {
                this.angle = Math.sin(k.time() * 2) * 2;
                this.scale = k.vec2(1 + Math.sin(k.time() * 4) * 0.02);
            }
        }
    ]);

    // Title Shadow
    k.add([
        k.text("BOSS RUSH", { size: 84, font: "Viga", align: "center" }),
        k.pos(SCREEN_WIDTH / 2 + UI.SHADOW, SCREEN_HEIGHT / 3 + UI.SHADOW),
        k.anchor("center"),
        k.color(COLORS.shadow),
        k.z(-1),
        k.scale(1),
        k.rotate(0),
        {
            update() {
                this.angle = title.angle;
                this.scale = title.scale;
            }
        }
    ]);

    const menuItems = options.map((opt, i) => {
        const container = k.add([
            k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 100 + i * 80),
            k.anchor("center"),
        ]);

        const text = container.add([
            k.text(opt, { size: 36, font: "Inter" }),
            k.anchor("center"),
            k.color(COLORS.text),
            { index: i }
        ]);

        return { container, text };
    });

    function updateMenu() {
        menuItems.forEach((item, i) => {
            const isSelected = i === selectedOption;
            if (isSelected) {
                item.text.color = COLORS.highlight;
                item.text.text = `> ${options[i]} <`;
                item.container.scale = k.vec2(UI.PUNCH_SCALE);
            } else {
                item.text.color = COLORS.text;
                item.text.text = options[i];
                item.container.scale = k.vec2(1);
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

    k.onKeyPress("space", () => {
        if (options[selectedOption] === "START") {
            k.go("battle");
        } else if (options[selectedOption] === "QUIT") {
            k.debug.log("Quit selected");
        }
    });

    k.onKeyPress("enter", () => {
        if (options[selectedOption] === "START") {
            k.go("battle");
        }
    });
}
