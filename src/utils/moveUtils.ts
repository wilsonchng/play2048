import type { Board, Move } from '../types/index';
import { boardChanged } from './boardUtils';

// Helper: Merge a line of tiles and return the merged line + score
// If reverse=true, merge from right-to-left (for right/down moves)
const mergeLine = (
  line: (number | null)[],
  reverse: boolean = false
): { line: (number | null)[]; score: number } => {
  let tiles = line.filter((tile) => tile !== null);
  if (reverse) tiles.reverse();

  let score = 0;
  const result: (number | null)[] = [];

  for (let i = 0; i < tiles.length; i++) {
    if (i < tiles.length - 1 && tiles[i] === tiles[i + 1]) {
      // Merge two adjacent tiles
      const merged = tiles[i]! * 2;
      result.push(merged);
      score += merged;
      i++; // Skip next tile as it's already merged
    } else {
      result.push(tiles[i]);
    }
  }

  // Pad with nulls to fill 4 slots
  while (result.length < 4) {
    result.push(null);
  }

  if (reverse) result.reverse();

  return { line: result, score };
};

// Slide and merge tiles to the left
const mergeLeft = (board: Board): { board: Board; score: number } => {
  let totalScore = 0;
  const newBoard = board.map((row) => {
    const { line, score } = mergeLine(row);
    totalScore += score;
    return line;
  });

  return { board: newBoard, score: totalScore };
};

// Slide and merge tiles to the right
const mergeRight = (board: Board): { board: Board; score: number } => {
  let totalScore = 0;
  const newBoard = board.map((row) => {
    const { line, score } = mergeLine(row, true);
    totalScore += score;
    return line;
  });

  return { board: newBoard, score: totalScore };
};

// Slide and merge tiles upward
const mergeUp = (board: Board): { board: Board; score: number } => {
  const newBoard = board.map((row) => [...row]);
  let totalScore = 0;

  for (let col = 0; col < 4; col++) {
    // Extract column
    const column = Array(4)
      .fill(null)
      .map((_, row) => newBoard[row][col]);

    const { line, score } = mergeLine(column);
    totalScore += score;

    // Write merged column back
    for (let row = 0; row < 4; row++) {
      newBoard[row][col] = line[row];
    }
  }

  return { board: newBoard, score: totalScore };
};

// Slide and merge tiles downward
const mergeDown = (board: Board): { board: Board; score: number } => {
  const newBoard = board.map((row) => [...row]);
  let totalScore = 0;

  for (let col = 0; col < 4; col++) {
    // Extract column
    const column = Array(4)
      .fill(null)
      .map((_, row) => newBoard[row][col]);

    const { line, score } = mergeLine(column, true);
    totalScore += score;

    // Write merged column back
    for (let row = 0; row < 4; row++) {
      newBoard[row][col] = line[row];
    }
  }

  return { board: newBoard, score: totalScore };
};

export const executeMove = (board: Board, direction: Move): { board: Board; score: number } => {
  let result;

  switch (direction) {
    case 'left':
      result = mergeLeft(board);
      break;
    case 'right':
      result = mergeRight(board);
      break;
    case 'up':
      result = mergeUp(board);
      break;
    case 'down':
      result = mergeDown(board);
      break;
  }

  return result;
};

export const isValidMove = (board: Board, direction: Move): boolean => {
  const { board: newBoard } = executeMove(board, direction);
  return boardChanged(board, newBoard);
};

export const getValidMoves = (board: Board): Move[] => {
  const moves: Move[] = [];
  const directions: Move[] = ['up', 'down', 'left', 'right'];

  for (const direction of directions) {
    if (isValidMove(board, direction)) {
      moves.push(direction);
    }
  }

  return moves;
};
