import k from "../kaplayCtx";
import { COLORS, LAYOUT, SCREEN_WIDTH } from "../constants";

export function createBattleUI(gameState) {
    const uiContainer = k.add([
        k.fixed(),
        k.z(100),
    ]);

    // Create Player UI in Corners
    gameState.party.forEach((char, index) => {
        // Positions map to: 0:Top-Left, 1:Top-Right, 2:Bottom-Left, 3:Bottom-Right

        // Ensure index is within layout bounds
        const pos = LAYOUT.POSITIONS[index] || { x: 0, y: 0 };

        const container = uiContainer.add([
            k.pos(pos.x, pos.y),
        ]);

        // Portrait Frame/Background
        container.add([
            k.rect(200, 100),
            k.color(COLORS.uiBackground),
            k.outline(4, COLORS.uiBorder),
        ]);

        // Name
        container.add([
            k.text(char.name, { size: 18 }),
            k.pos(10, 10),
            k.color(COLORS.text),
        ]);

        // HP Bar
        const hpY = 40;
        container.add([
            k.rect(LAYOUT.BAR_WIDTH, LAYOUT.BAR_HEIGHT),
            k.pos(10, hpY),
            k.color(0, 0, 0),
        ]);
        container.add([
            k.rect(LAYOUT.BAR_WIDTH, LAYOUT.BAR_HEIGHT),
            k.pos(10, hpY),
            k.color(COLORS.hp),
            {
                update() {
                    this.width = (char.hp / char.maxHp) * LAYOUT.BAR_WIDTH;
                }
            }
        ]);
        container.add([
            k.text("HP", { size: 12 }),
            k.pos(10, hpY + 2),
            k.color(COLORS.text),
            k.z(101),
        ]);
        // HP Text
        container.add([
            k.text("", { size: 12 }),
            k.pos(LAYOUT.BAR_WIDTH - 10, hpY + 2),
            k.anchor("right"),
            k.z(101),
            {
                update() {
                    this.text = `${char.hp}/${char.maxHp}`;
                }
            }
        ]);


        // SP Bar
        const spY = 65;
        container.add([
            k.rect(LAYOUT.BAR_WIDTH, LAYOUT.BAR_HEIGHT),
            k.pos(10, spY),
            k.color(0, 0, 0),
        ]);
        container.add([
            k.rect(LAYOUT.BAR_WIDTH, LAYOUT.BAR_HEIGHT),
            k.pos(10, spY),
            k.color(COLORS.sp),
            {
                update() {
                    this.width = (char.sp / char.maxSp) * LAYOUT.BAR_WIDTH;
                }
            }
        ]);
        container.add([
            k.text("SP", { size: 12 }),
            k.pos(10, spY + 2),
            k.color(COLORS.text),
            k.z(101),
        ]);

        // Status (Dead/Defend) Overlay
        container.add([
            k.text("", { size: 24 }),
            k.pos(100, 50),
            k.anchor("center"),
            k.color(COLORS.highlight),
            k.z(102),
            {
                update() {
                    if (char.isDead) this.text = "DEAD";
                    else if (char.isDefending) this.text = "DEFEND";
                    else this.text = "";
                }
            }
        ]);
    });

    return uiContainer;
}

export function createMessageLog() {
    // Top box for messages
    const logBox = k.add([
        k.rect(SCREEN_WIDTH - 400, 60),
        k.pos(200, 10), // Centered top roughly
        k.color(0, 0, 0),
        k.opacity(0.8),
        k.outline(2, COLORS.uiBorder),
        k.fixed(),
        k.z(90),
    ]);

    const logText = k.add([
        k.text("Battle Started!", { size: 24 }),
        k.pos(SCREEN_WIDTH / 2, 40),
        k.anchor("center"),
        k.color(COLORS.text),
        k.fixed(),
        k.z(101),
        {
            updateLog(msg) {
                this.text = msg;
            }
        }
    ]);

    return logText;
}

export function createTurnCounter() {
    return k.add([
        k.text("Turn: 1", { size: 24 }),
        k.pos(20, 20 + 120), // Below Top-Left UI
        k.color(COLORS.text),
        k.fixed(),
        k.z(100),
        {
            updateCount(num) {
                this.text = `Turn: ${num}`;
            }
        }
    ]);
}
