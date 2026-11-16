"use client";

import {useEffect, useRef, useState} from "react";
import {
    COLS,
    HIDDEN,
    PIECE_COLORS,
    ROWS,
    cellsOf,
    createGame,
    ghostY,
    gravityInterval,
    hardDrop,
    holdPiece,
    isGrounded,
    lockPiece,
    moveHorizontal,
    previewCells,
    rotate,
    stepDown,
    type Game,
    type PieceType,
} from "../lib/tetris";

// The box is 30 blocks wide: Hold panel | 10-wide board | Next panel.
// Its height is the board's height (ROWS).
export const BOX_COLS = 30;
export const BOX_ROWS = ROWS;
const WELL_X = (BOX_COLS - COLS) / 2;

// Canvas resolution per block (the canvas is scaled down by CSS)
const CELL = 32;

// Hold / Next panels, in blocks. Pieces, labels and panel width are 30% larger
// than the original; the slot height is limited by the box being only 13 rows
// tall (3 Next slots + label must fit).
const PANEL_SCALE = 1.3;
const SIDE_COLS = (BOX_COLS - COLS) / 2; // free columns on each side of the board
const PANEL_W = 6 * PANEL_SCALE;
const PANEL_TOP = 1.9;
const SLOT_H = 3.45;

// Timing, in milliseconds
const MOVE_DELAY = 150; // hold ← / → this long before it starts repeating
const MOVE_REPEAT = 40; // then move once per this interval
const SOFT_DROP_INTERVAL = 50;
const LOCK_DELAY = 500; // time to slide a piece before it locks
const MAX_LOCK_RESETS = 15; // moving/rotating can only delay locking this many times
// Space is also "play again", so it's ignored briefly after game over; otherwise
// a double-tap on the last hard drop would skip the Game Over screen
const RESTART_GUARD = 700;

type Mode = "playing" | "paused" | "over";

type Props = {
    onExit: () => void;
    onScore: (score: number) => void;
};

/** True when a key press is meant for a text field, not the game. */
export function isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
    const edge = size * 0.12;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    // Bevel: light top-left edges, dark bottom-right edges
    ctx.fillStyle = "rgb(255 255 255 / 0.35)";
    ctx.fillRect(x, y, size, edge);
    ctx.fillRect(x, y, edge, size);
    ctx.fillStyle = "rgb(0 0 0 / 0.3)";
    ctx.fillRect(x, y + size - edge, size, edge);
    ctx.fillRect(x + size - edge, y, edge, size);
}

function drawPreview(
    ctx: CanvasRenderingContext2D,
    type: PieceType,
    area: {x: number; y: number; w: number; h: number},
    alpha = 1
) {
    const size = CELL * 0.8 * PANEL_SCALE;
    const cells = previewCells(type);
    const rows = cells.map(([r]) => r);
    const cols = cells.map(([, c]) => c);
    const minR = Math.min(...rows);
    const minC = Math.min(...cols);
    const width = (Math.max(...cols) - minC + 1) * size;
    const height = (Math.max(...rows) - minR + 1) * size;
    const left = area.x + (area.w - width) / 2;
    const top = area.y + (area.h - height) / 2;
    ctx.globalAlpha = alpha;
    for (const [r, c] of cells) {
        drawBlock(ctx, left + (c - minC) * size, top + (r - minR) * size, size, PIECE_COLORS[type]);
    }
    ctx.globalAlpha = 1;
}

function draw(ctx: CanvasRenderingContext2D, game: Game) {
    ctx.clearRect(0, 0, BOX_COLS * CELL, BOX_ROWS * CELL);

    // Board background, faint grid and side walls
    const wx = WELL_X * CELL;
    ctx.fillStyle = "#0b0907";
    ctx.fillRect(wx, 0, COLS * CELL, ROWS * CELL);
    ctx.fillStyle = "rgb(255 255 255 / 0.05)";
    for (let c = 1; c < COLS; c++) ctx.fillRect(wx + c * CELL, 0, 1, ROWS * CELL);
    for (let r = 1; r < ROWS; r++) ctx.fillRect(wx, r * CELL, COLS * CELL, 1);
    ctx.fillStyle = "#48494b";
    ctx.fillRect(wx - 3, 0, 3, ROWS * CELL);
    ctx.fillRect(wx + COLS * CELL, 0, 3, ROWS * CELL);

    // Locked blocks (skip the hidden rows above the board)
    for (let r = HIDDEN; r < ROWS + HIDDEN; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = game.board[r][c];
            if (cell) drawBlock(ctx, wx + c * CELL, (r - HIDDEN) * CELL, CELL, PIECE_COLORS[cell]);
        }
    }

    if (!game.over) {
        // Ghost piece: where the current piece will land
        const ghost = {...game.current, y: ghostY(game)};
        ctx.globalAlpha = 0.25;
        for (const [r, c] of cellsOf(ghost)) {
            if (r >= HIDDEN) drawBlock(ctx, wx + c * CELL, (r - HIDDEN) * CELL, CELL, PIECE_COLORS[ghost.type]);
        }
        ctx.globalAlpha = 1;
    }

    for (const [r, c] of cellsOf(game.current)) {
        if (r >= HIDDEN) drawBlock(ctx, wx + c * CELL, (r - HIDDEN) * CELL, CELL, PIECE_COLORS[game.current.type]);
    }

    // Hold (left) and Next (right) panels
    // Each panel is centered in the free columns beside the board
    const panelW = PANEL_W * CELL;
    const holdX = ((SIDE_COLS - PANEL_W) / 2) * CELL;
    const nextX = (WELL_X + COLS + (SIDE_COLS - PANEL_W) / 2) * CELL;
    const top = PANEL_TOP * CELL;
    const slotH = SLOT_H * CELL;
    ctx.font = `bold ${CELL * 0.5 * PANEL_SCALE}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgb(255 255 255 / 0.6)";
    ctx.fillText("HOLD", holdX + panelW / 2, (PANEL_TOP / 2) * CELL);
    ctx.fillText("NEXT", nextX + panelW / 2, (PANEL_TOP / 2) * CELL);
    ctx.strokeStyle = "rgb(255 255 255 / 0.15)";
    ctx.lineWidth = 2 * PANEL_SCALE;
    ctx.strokeRect(holdX, top, panelW, slotH);
    ctx.strokeRect(nextX, top, panelW, slotH * 3);

    if (game.hold) {
        // Dimmed when hold isn't allowed again until the next piece
        drawPreview(ctx, game.hold, {x: holdX, y: top, w: panelW, h: slotH}, game.canHold ? 1 : 0.35);
    }
    game.queue.slice(0, 3).forEach((type, i) => {
        drawPreview(ctx, type, {x: nextX, y: top + i * slotH, w: panelW, h: slotH});
    });
}

export default function TetrisGame({onExit, onScore}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const callbacks = useRef({onExit, onScore});
    const [mode, setMode] = useState<Mode>("playing");
    const [finalScore, setFinalScore] = useState(0);

    useEffect(() => {
        callbacks.current = {onExit, onScore};
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        let game = createGame();
        let current: Mode = "playing";
        let gravityTime = 0;
        let lockTime = 0;
        let lockResets = 0;
        let softDrop = false;
        let heldDir: -1 | 0 | 1 = 0;
        let heldTime = 0;
        let repeatTime = 0;
        let reportedScore = -1;
        let overAt = 0;
        let last = performance.now();
        let frame = 0;

        const changeMode = (next: Mode) => {
            current = next;
            setMode(next);
        };

        const releaseKeys = () => {
            softDrop = false;
            heldDir = 0;
        };

        // The piece changed (a new piece spawned, or the game restarted)
        const newPiece = (next: Game) => {
            game = next;
            gravityTime = 0;
            lockTime = 0;
            lockResets = 0;
            if (game.over) {
                releaseKeys();
                overAt = performance.now();
                setFinalScore(game.score);
                changeMode("over");
            }
        };

        // A move or rotation: restarts the lock timer if the piece is resting
        const apply = (next: Game) => {
            if (next === game) return;
            game = next;
            if (isGrounded(game) && lockResets < MAX_LOCK_RESETS) {
                lockTime = 0;
                lockResets++;
            }
        };

        const restart = () => {
            releaseKeys();
            newPiece(createGame());
            changeMode("playing");
            last = performance.now();
        };

        const pause = () => {
            if (current !== "playing") return;
            releaseKeys();
            changeMode("paused");
        };

        const resume = () => {
            last = performance.now();
            changeMode("playing");
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
            const key = event.key;

            // Arrows and Space must never scroll the page while the game is open
            if (key === " " || key.startsWith("Arrow")) event.preventDefault();

            // Space: hard drop while playing, resume when paused, play again after game over
            if (key === " ") {
                if (event.repeat) return; // holding Space must not drop piece after piece
                if (current === "playing") newPiece(hardDrop(game));
                else if (current === "paused") resume();
                else if (performance.now() - overAt > RESTART_GUARD) restart();
                return;
            }
            if (key === "Escape") {
                if (event.repeat) return;
                if (current === "playing") pause();
                else callbacks.current.onExit();
                return;
            }
            if (current !== "playing") return;

            switch (key) {
                case "ArrowLeft":
                case "ArrowRight": {
                    if (event.repeat) return; // repeating is handled by the game loop
                    const dir = key === "ArrowLeft" ? -1 : 1;
                    heldDir = dir;
                    heldTime = 0;
                    repeatTime = 0;
                    apply(moveHorizontal(game, dir));
                    break;
                }
                case "ArrowDown":
                    if (event.repeat) return;
                    softDrop = true;
                    gravityTime = 0;
                    apply(stepDown(game, true));
                    break;
                case "z":
                case "Z":
                    if (!event.repeat) apply(rotate(game, -1));
                    break;
                case "x":
                case "X":
                    if (!event.repeat) apply(rotate(game, 1));
                    break;
                case "c":
                case "C":
                    if (!event.repeat) {
                        const held = holdPiece(game);
                        if (held !== game) newPiece(held);
                    }
                    break;
            }
        };

        const onKeyUp = (event: KeyboardEvent) => {
            if (event.key === "ArrowDown") softDrop = false;
            if (event.key === "ArrowLeft" && heldDir === -1) heldDir = 0;
            if (event.key === "ArrowRight" && heldDir === 1) heldDir = 0;
        };

        const onVisibility = () => {
            if (document.hidden) pause();
        };

        const tick = (now: number) => {
            const dt = Math.min(now - last, 100);
            last = now;

            if (current === "playing") {
                // Held ← / →: wait, then repeat
                if (heldDir !== 0) {
                    heldTime += dt;
                    if (heldTime >= MOVE_DELAY) {
                        repeatTime += dt;
                        while (repeatTime >= MOVE_REPEAT) {
                            repeatTime -= MOVE_REPEAT;
                            apply(moveHorizontal(game, heldDir));
                        }
                    }
                }

                if (isGrounded(game)) {
                    lockTime += dt;
                    if (lockTime >= LOCK_DELAY) newPiece(lockPiece(game));
                } else {
                    lockTime = 0;
                    gravityTime += dt;
                    const interval = softDrop
                        ? Math.min(SOFT_DROP_INTERVAL, gravityInterval(game.lines))
                        : gravityInterval(game.lines);
                    while (gravityTime >= interval && !isGrounded(game)) {
                        gravityTime -= interval;
                        game = stepDown(game, softDrop);
                    }
                }
            }

            if (game.score !== reportedScore) {
                reportedScore = game.score;
                callbacks.current.onScore(game.score);
            }
            draw(ctx, game);
            frame = requestAnimationFrame(tick);
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("blur", pause);
        document.addEventListener("visibilitychange", onVisibility);
        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("blur", pause);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="tetris-canvas"
                width={BOX_COLS * CELL}
                height={BOX_ROWS * CELL}
                role="img"
                aria-label="Tetris game"
            />
            {mode !== "playing" && (
                <div className="tetris-overlay">
                    {mode === "over" ? (
                        <>
                            <strong>GAME OVER</strong>
                            <span>Score {finalScore}</span>
                            <span className="tetris-overlay-action">Press Space to play again</span>
                            <span className="tetris-overlay-sub">Esc to exit</span>
                        </>
                    ) : (
                        <>
                            <strong>PAUSED</strong>
                            <span className="tetris-overlay-action">Space to resume</span>
                            <span className="tetris-overlay-sub">Esc to exit</span>
                        </>
                    )}
                </div>
            )}
            <div className="sr-only" role="status">
                {mode === "over" ? `Game over. Score ${finalScore}. Press Space to play again.` : mode === "paused" ? "Paused" : ""}
            </div>
        </>
    );
}
