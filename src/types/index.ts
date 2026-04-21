export type Board = (number | null)[][];
export type Move = 'up' | 'down' | 'left' | 'right';

export interface TileMetadata {
  value: number | null;
  isNew?: boolean;
  isMerged?: boolean;
}

export interface AnimationState {
  newTiles: Set<string>;
  mergedTiles: Set<string>;
}

export interface GameState {
  board: Board;
  score: number;
  best: number;
  gameOver: boolean;
  won: boolean;
  moved: boolean;
  animationState?: AnimationState;
}

export interface AIMove {
  direction: Move;
  score: number;
}
