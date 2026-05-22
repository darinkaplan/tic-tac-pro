export type Player = 'X' | 'O';

export type Cell = Player | null;

export type SmallBoardStatus = Player | 'draw' | null;

export type GameStatus = Player | 'draw' | null;

export interface Move {
  boardIdx: number;
  cellIdx: number;
  player: Player;
}

export interface GameState {
  /** 9 small boards, each an array of 9 cells (row-major). */
  smallBoards: readonly (readonly Cell[])[];
  /** Status of each small board: winner, 'draw', or null if in progress. */
  smallBoardStatuses: readonly SmallBoardStatus[];
  /** Whose turn it is. */
  currentPlayer: Player;
  /**
   * Which small board the next move must be played in (0-8), or null for free choice.
   * Free choice on first move, or when the forced board is already won/drawn/full.
   */
  forcedBoard: number | null;
  /** 'X' or 'O' if won, 'draw' if drawn, null if in progress. */
  winner: GameStatus;
  /** Full move history in chronological order. */
  history: readonly Move[];
}
