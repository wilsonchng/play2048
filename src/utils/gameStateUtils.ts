import type { Board } from '../types/index';
import { getValidMoves } from './moveUtils';

const WIN_SCORE = 2048;
const BEST_SCORE_KEY = 'play2048_bestScore';

// Check if any tile has reached 2048 (win condition)
export const hasWon = (board: Board): boolean => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === WIN_SCORE) {
        return true;
      }
    }
  }
  return false;
};

// Check if game is over (no valid moves left)
export const isGameOver = (board: Board): boolean => {
  return getValidMoves(board).length === 0;
};

// Get max tile on board
export const getMaxTile = (board: Board): number => {
  let max = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const tile = board[i][j];
      if (tile && tile > max) {
        max = tile;
      }
    }
  }
  return max;
};

// Load best score from localStorage
export const loadBestScore = (): number => {
  const stored = localStorage.getItem(BEST_SCORE_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

// Save best score to localStorage
export const saveBestScore = (score: number): void => {
  const currentBest = loadBestScore();
  if (score > currentBest) {
    localStorage.setItem(BEST_SCORE_KEY, score.toString());
  }
};

// Calculate total score on board (sum of all merged tiles)
export const calculateBoardScore = (board: Board): number => {
  let score = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const tile = board[i][j];
      if (tile) {
        // Score is based on log2 of tile value
        const power = Math.log2(tile);
        score += tile * (power - 1);
      }
    }
  }
  return Math.floor(score);
};
