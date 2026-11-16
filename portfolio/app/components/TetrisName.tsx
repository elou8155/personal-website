"use client";

import {useEffect, useState, type CSSProperties} from "react";
import TetrisGame, {BOX_COLS, BOX_ROWS, isTypingTarget} from "./TetrisGame";

type Letter = {
    // "#" is a block, "." is empty. Every letter is 8 rows tall.
    rows: string[];
    color: string;
    // Empty columns between this letter and the previous one (default 1;
    // negative values tuck the letter under/over the previous one)
    gapBefore?: number;
};

// Each letter is a fully formed shape in its own classic Tetris piece color,
// in rainbow order from left to right.
const LETTERS: Letter[] = [
    {
        color: "#e83838", // Z red
        rows: ["#####", "#....", "#....", "#####", "#....", "#....", "#....", "#####"],
    },
    {
        color: "#f09020", // L orange
        rows: ["#.....#", "##...##", "###.###", "#.###.#", "#.....#", "#.....#", "#.....#", "#.....#"],
    },
    {
        color: "#f0d000", // O yellow
        rows: ["###", ".#.", ".#.", ".#.", ".#.", ".#.", ".#.", "###"],
    },
    {
        color: "#30c840", // S green
        rows: ["#...", "#...", "#...", "#...", "#...", "#...", "#...", "####"],
    },
    {
        color: "#3060f0", // J blue
        // Overlaps the L's columns: the Y's arms sit above the end of the L's
        // foot, leaving one empty block between the foot and the Y's stem
        gapBefore: -1,
        rows: ["#...#", "#...#", "#####", ".###.", "..#..", "..#..", "..#..", "..#.."],
    },
];

const DEFAULT_GAP = 1;
const WORD_ROWS = 8;
const gapBefore = (index: number) => (index === 0 ? 0 : LETTERS[index].gapBefore ?? DEFAULT_GAP);
const WORD_COLS = LETTERS.reduce((sum, letter, i) => sum + gapBefore(i) + letter.rows[0].length, 0);
// The word is centered in the box, both ways. Vertically that is 2.5 blocks of
// space above and below (the CSS shifts the faint grid by half a block to match).
const PAD_COLS = (BOX_COLS - WORD_COLS) / 2;
const WORD_TOP = (BOX_ROWS - WORD_ROWS) / 2;

// Left column of each letter inside the box
const LETTER_X = LETTERS.map((_, i) =>
    PAD_COLS + LETTERS.slice(0, i + 1).reduce((sum, letter, j) => sum + gapBefore(j) + (j < i ? letter.rows[0].length : 0), 0)
);

const DELAY_BETWEEN_LETTERS_MS = 450;
// How long the letters take to fade out (keep in sync with .is-fading in globals.css)
const FADE_MS = 500;

// idle: EMILY on the floor, waiting for Space
// fading: the letters fade out after Space
// playing: the game
type Phase = "idle" | "fading" | "playing";

export default function TetrisName() {
    const [phase, setPhase] = useState<Phase>("idle");
    const [score, setScore] = useState(0);

    // Space starts the game
    useEffect(() => {
        if (phase !== "idle") return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== " " || event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
            event.preventDefault(); // don't scroll the page
            if (event.repeat) return;
            // Make sure a focused nav button doesn't also react to Space
            if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
            setPhase("fading");
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [phase]);

    // Once the letters have faded, remove them and start the game
    useEffect(() => {
        if (phase !== "fading") return;
        const timer = window.setTimeout(() => {
            setScore(0);
            setPhase("playing");
        }, FADE_MS);
        return () => window.clearTimeout(timer);
    }, [phase]);

    const playing = phase === "playing";

    return (
        <div className="tetris-wrap">
            <div
                className={`tetris-box${phase === "fading" ? " is-fading" : ""}`}
                role={playing ? undefined : "img"}
                aria-label={playing ? undefined : "Emily"}
                style={{"--cols": BOX_COLS, "--rows": BOX_ROWS} as CSSProperties}
            >
                {!playing &&
                    LETTERS.map((letter, index) => (
                        <div
                            key={index}
                            className="tetris-letter"
                            style={{
                                "--x": LETTER_X[index],
                                "--y": WORD_TOP,
                                // Start just above the box and fall one row per step
                                // (a whole number of steps, so rounded up)
                                "--fall": Math.ceil(WORD_TOP + WORD_ROWS),
                                "--delay": `${index * DELAY_BETWEEN_LETTERS_MS}ms`,
                                "--color": letter.color,
                            } as CSSProperties}
                        >
                            {letter.rows.flatMap((row, r) =>
                                [...row].map((cell, c) =>
                                    cell === "#" ? (
                                        <span
                                            key={`${r}-${c}`}
                                            className="tetris-block"
                                            style={{"--x": c, "--y": r} as CSSProperties}
                                        />
                                    ) : null
                                )
                            )}
                        </div>
                    ))}
                {playing && <TetrisGame onScore={setScore} onExit={() => setPhase("idle")} />}
            </div>

            {playing ? (
                <>
                    <p className="tetris-score">Score {score}</p>
                    <p className="tetris-hint">← → move · ↓ soft drop · Space hard drop · Z / X rotate · C hold · Esc pause</p>
                </>
            ) : (
                <p className="tetris-hint motion-safe:animate-pulse">Press SPACE to play</p>
            )}
        </div>
    );
}
