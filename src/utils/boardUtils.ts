import type { Board } from '../types/index';

export const initializeBoard = (): Board => {
  let board: Board = Array(4)
    .fill(null)
    .map(() => Array(4).fill(null));

  const count = Math.random() < 0.5 ? 2 : 3;
  for (let i = 0; i < count; i++) {
    board = addNewTile(board);
  }

  return board;
};

export const getEmptyCells = (board: Board): [number, number][] => {
  const empty: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === null) {
        empty.push([i, j]);
      }
    }
  }
  return empty;
};

export const addNewTile = (board: Board): Board => {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return board;

  const [row, col] = empty[Math.floor(Math.random() * empty.length)];
  const newBoard = board.map((r) => [...r]);
  newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;

  return newBoard;
};

export const boardChanged = (before: Board, after: Board): boolean => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (before[i][j] !== after[i][j]) {
        return true;
      }
    }
  }
  return false;
};
