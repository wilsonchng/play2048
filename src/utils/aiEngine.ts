import type { Board, AIMove } from '../types/index';
import { executeMove, getValidMoves } from './moveUtils';
import { getEmptyCells } from './boardUtils';

export const getAISuggestion = (board: Board): AIMove | null => {
  const validMoves = getValidMoves(board);
  if (validMoves.length === 0) return null;

  let bestMove = validMoves[0];
  let bestScore = -Infinity;

  // Evaluate each top-level move with depth 4 lookahead
  for (const move of validMoves) {
    const { board: newBoard } = executeMove(board, move);
    const score = searchDepth(newBoard, 3);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return {
    direction: bestMove,
    score: bestScore,
  };
};

// Recursive depth search to evaluate board state at given depth
const searchDepth = (board: Board, depth: number): number => {
  // Base case: reached max depth or no valid moves
  if (depth === 0) {
    return getEmptyCells(board).length;
  }

  const validMoves = getValidMoves(board);
  if (validMoves.length === 0) {
    return getEmptyCells(board).length;
  }

  // Try all moves and pick the best outcome
  let bestScore = -Infinity;
  for (const move of validMoves) {
    const { board: newBoard } = executeMove(board, move);
    const score = searchDepth(newBoard, depth - 1);
    bestScore = Math.max(bestScore, score);
  }

  return bestScore;
};
