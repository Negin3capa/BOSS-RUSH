import k from "../../kaplayCtx";
import { COLORS, LAYOUT, UI } from "../../constants";
import { getTextStyles } from "./uiUtils.js";

/**
 * Creates a battle message log component
 * @returns {Object} Message log object with frame and updateLog function
 */
export function createMessageLog() {
    const frameWidth = 500;
    const frameHeight = 90; // Slightly shorter for 3 lines

    const frame = k.add([
        k.rect(frameWidth, frameHeight),
        k.pos(LAYOUT.CENTER_X, 15),
        k.color(COLORS.uiBackground),
        k.outline(UI.OUTLINE, COLORS.uiBorder),
        k.anchor("top"),
        k.fixed(),
        k.z(90),
    ]);

    const messages = []; // Array of { label }
    const MAX_MESSAGES = 3;
    const LINE_HEIGHT = 22;

    const logContainer = k.add([
        k.pos(LAYOUT.CENTER_X - (frameWidth / 2) + 15, 25),
        k.fixed(),
        k.z(101),
    ]);

    const refreshPositions = () => {
        messages.forEach((m, i) => {
            m.pos.y = i * LINE_HEIGHT;
            // Opacity logic: latest is brightest, others dim slightly for focus
            m.opacity = (i === messages.length - 1) ? 1 : 0.7;
        });
    };

    const logObj = {
        frame,
        updateLog(msg, scroll = false, color = [0, 0, 0]) {
            // Avoid duplicate consecutive messages (only if we are NOT scrolling/clearing)
            if (!scroll && messages.length > 0 && messages[messages.length - 1].text === msg) return;

            if (!scroll) {
                // Replace Mode (Clear all)
                messages.forEach(m => k.destroy(m));
                messages.length = 0;
            }

            // Create new label
            const label = logContainer.add([
                k.pos(0, 0),
                k.text(msg, {
                    size: 16,
                    width: frameWidth - 30,
                    font: "Viga",
                    styles: getTextStyles()
                }),
                k.color(color[0], color[1], color[2]),
                k.opacity(1),
            ]);

            messages.push(label);

            if (messages.length > MAX_MESSAGES) {
                const oldest = messages.shift();
                k.destroy(oldest);
            }

            refreshPositions();
        }
    };

    return logObj;
}
