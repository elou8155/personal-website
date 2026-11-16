// Tetris rules: a 10 x 13 board (65% of the standard 20 rows), the standard
// rotation system (SRS) with wall kicks, a 7-bag randomizer, hold, ghost piece
// and scoring. No React or DOM in here, so it can be tested on its own.

export const COLS = 10;
export const ROWS = 13;
// Extra rows above the visible board where new pieces spawn
export const HIDDEN = 2;

export type PieceType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export type Rotation = 0 | 1 | 2 | 3;
export type Cell = PieceType | null;
export type Board = Cell[][]; // ROWS + HIDDEN rows, top to bottom

export type Piece = {type: PieceType; rot: Rotation; x: number; y: number};

export type Game = {
    board: Board;
    current: Piece;
    queue: PieceType[]; // upcoming pieces
    hold: PieceType | null;
    canHold: boolean;
    score: number;
    lines: number; // only used to speed up gravity; not shown
    over: boolean;
    rng: () => number;
};

export const PIECE_TYPES: PieceType[] = ["I", "O", "T", "S", "Z", "J", "L"];

// Classic Tetris colors
export const PIECE_COLORS: Record<PieceType, string> = {
    I: "#00c8e8",
    O: "#f0d000",
    T: "#a040e0",
    S: "#30c840",
    Z: "#e83838",
    J: "#3060f0",
    L: "#f09020",
};

type Cells = [number, number][]; // [row, col]

// Spawn orientation of each piece, inside its bounding box
const SPAWN: Record<PieceType, {size: number; cells: Cells}> = {
    I: {size: 4, cells: [[1, 0], [1, 1], [1, 2], [1, 3]]},
    O: {size: 4, cells: [[0, 1], [0, 2], [1, 1], [1, 2]]},
    T: {size: 3, cells: [[0, 1], [1, 0], [1, 1], [1, 2]]},
    S: {size: 3, cells: [[0, 1], [0, 2], [1, 0], [1, 1]]},
    Z: {size: 3, cells: [[0, 0], [0, 1], [1, 1], [1, 2]]},
    J: {size: 3, cells: [[0, 0], [1, 0], [1, 1], [1, 2]]},
    L: {size: 3, cells: [[0, 2], [1, 0], [1, 1], [1, 2]]},
};

// Cells of every piece in each of its 4 rotation states (0 = spawn, 1 = clockwise)
const SHAPES = Object.fromEntries(
    PIECE_TYPES.map((type) => {
        const {size, cells} = SPAWN[type];
        const states: Cells[] = [cells];
        for (let i = 1; i < 4; i++) {
            states.push(states[i - 1].map(([r, c]) => [c, size - 1 - r]));
        }
        return [type, states];
    })
) as Record<PieceType, Cells[]>;

// Wall kick offsets as [dx, dy] with dy pointing UP (as in the SRS tables)
const KICKS: Record<string, [number, number][]> = {
    "0>1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    "1>0": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    "1>2": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    "2>1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    "2>3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    "3>2": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    "3>0": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    "0>3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
};
const KICKS_I: Record<string, [number, number][]> = {
    "0>1": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    "1>0": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    "1>2": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
    "2>1": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    "2>3": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    "3>2": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    "3>0": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    "0>3": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
};

const LINE_SCORES = [0, 100, 300, 500, 800];

/** Cells of a piece in its spawn orientation, for previews (Hold / Next). */
export function previewCells(type: PieceType): Cells {
    return SHAPES[type][0];
}

/** Absolute [row, col] board cells covered by a piece. */
export function cellsOf(piece: Piece): Cells {
    return SHAPES[piece.type][piece.rot].map(([r, c]) => [piece.y + r, piece.x + c]);
}

function emptyBoard(): Board {
    return Array.from({length: ROWS + HIDDEN}, () => Array<Cell>(COLS).fill(null));
}

function fits(board: Board, type: PieceType, rot: Rotation, x: number, y: number): boolean {
    return SHAPES[type][rot].every(([r, c]) => {
        const row = y + r;
        const col = x + c;
        return row >= 0 && row < ROWS + HIDDEN && col >= 0 && col < COLS && board[row][col] === null;
    });
}

function shuffled(rng: () => number): PieceType[] {
    const bag = [...PIECE_TYPES];
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag;
}

// Keep at least 7 pieces queued. Whole shuffled bags are appended, so every
// piece shows up once per 7 before any repeats.
function fillQueue(queue: PieceType[], rng: () => number): PieceType[] {
    const next = queue.slice();
    while (next.length < 7) next.push(...shuffled(rng));
    return next;
}

function spawn(type: PieceType): Piece {
    return {type, rot: 0, x: 3, y: 1};
}

export function createGame(rng: () => number = Math.random): Game {
    const queue = fillQueue([], rng);
    return {
        board: emptyBoard(),
        current: spawn(queue[0]),
        queue: fillQueue(queue.slice(1), rng),
        hold: null,
        canHold: true,
        score: 0,
        lines: 0,
        over: false,
        rng,
    };
}

export function moveHorizontal(game: Game, dx: -1 | 1): Game {
    const {type, rot, x, y} = game.current;
    if (game.over || !fits(game.board, type, rot, x + dx, y)) return game;
    return {...game, current: {...game.current, x: x + dx}};
}

/** Rotate clockwise (dir = 1) or counter-clockwise (dir = -1), using wall kicks. */
export function rotate(game: Game, dir: 1 | -1): Game {
    const {type, rot, x, y} = game.current;
    if (game.over || type === "O") return game;
    const to = ((rot + dir + 4) % 4) as Rotation;
    const kicks = (type === "I" ? KICKS_I : KICKS)[`${rot}>${to}`];
    for (const [dx, dy] of kicks) {
        if (fits(game.board, type, to, x + dx, y - dy)) {
            return {...game, current: {type, rot: to, x: x + dx, y: y - dy}};
        }
    }
    return game;
}

export function isGrounded(game: Game): boolean {
    const {type, rot, x, y} = game.current;
    return !fits(game.board, type, rot, x, y + 1);
}

/** Move down one row (soft drop scores 1 point per row). No-op if grounded. */
export function stepDown(game: Game, soft = false): Game {
    if (game.over || isGrounded(game)) return game;
    return {
        ...game,
        current: {...game.current, y: game.current.y + 1},
        score: game.score + (soft ? 1 : 0),
    };
}

/** Row the current piece would land on (for the ghost piece). */
export function ghostY(game: Game): number {
    const {type, rot, x} = game.current;
    let y = game.current.y;
    while (fits(game.board, type, rot, x, y + 1)) y++;
    return y;
}

/** Fix the current piece into the board, clear lines, and spawn the next piece. */
export function lockPiece(game: Game): Game {
    if (game.over) return game;
    const board = game.board.map((row) => [...row]);
    const cells = cellsOf(game.current);
    for (const [r, c] of cells) board[r][c] = game.current.type;
    // Locked completely above the visible board: game over
    const lockedOut = cells.every(([r]) => r < HIDDEN);

    const kept = board.filter((row) => row.some((cell) => cell === null));
    const cleared = board.length - kept.length;
    while (kept.length < board.length) kept.unshift(Array<Cell>(COLS).fill(null));

    const piece = spawn(game.queue[0]);
    return {
        ...game,
        board: kept,
        current: piece,
        queue: fillQueue(game.queue.slice(1), game.rng),
        canHold: true,
        score: game.score + LINE_SCORES[cleared],
        lines: game.lines + cleared,
        over: lockedOut || !fits(kept, piece.type, piece.rot, piece.x, piece.y),
    };
}

/** Drop straight down and lock (2 points per row). */
export function hardDrop(game: Game): Game {
    if (game.over) return game;
    const y = ghostY(game);
    const rows = y - game.current.y;
    return lockPiece({...game, current: {...game.current, y}, score: game.score + rows * 2});
}

/** Swap the current piece with the held one. Allowed once per piece. */
export function holdPiece(game: Game): Game {
    if (game.over || !game.canHold) return game;
    let type: PieceType;
    let queue = game.queue;
    if (game.hold) {
        type = game.hold;
    } else {
        type = queue[0];
        queue = fillQueue(queue.slice(1), game.rng);
    }
    const piece = spawn(type);
    return {
        ...game,
        hold: game.current.type,
        current: piece,
        queue,
        canHold: false,
        over: !fits(game.board, piece.type, piece.rot, piece.x, piece.y),
    };
}

/**
 * Milliseconds per gravity step: 800ms at the start, getting a little faster
 * with every line cleared (about 380ms after 10 lines), down to 50ms at best
 * (reached after about 38 lines). The wait shrinks to 90% for every 1/0.7
 * (about 1.4) lines cleared, so this is the earlier "10% faster every 2 lines"
 * curve running 40% faster.
 */
export function gravityInterval(lines: number): number {
    return Math.max(50, 800 * 0.9 ** (lines * 0.7));
}
