import { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import GameStatus from './components/GameStatus';
import type { Move, GameState } from './types/index';
import { initializeBoard, addNewTile } from './utils/boardUtils';
import { executeMove } from './utils/moveUtils';
import { hasWon, isGameOver } from './utils/gameStateUtils';
import { getAISuggestion } from './utils/aiEngine';

import './App.css';

const loadBest = (): number => {
  const stored = localStorage.getItem('play2048_best');
  return stored ? parseInt(stored, 10) : 0;
};

const saveBest = (best: number): void => {
  localStorage.setItem('play2048_best', best.toString());
};

const App = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const board = initializeBoard();
    const best = loadBest();
    return {
      board,
      score: 0,
      best,
      gameOver: false,
      won: false,
      moved: false,
    };
  });

  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleMove = useCallback(
    (direction: Move) => {
      if (gameState.gameOver || gameState.won) {
        return;
      }

      const { board: newBoard, score: moveScore } = executeMove(gameState.board, direction);

      let boardChanged = false;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (gameState.board[i][j] !== newBoard[i][j]) {
            boardChanged = true;
            break;
          }
        }
        if (boardChanged) break;
      }

      if (!boardChanged) return;

      const boardWithNewTile = addNewTile(newBoard);
      const newScore = gameState.score + moveScore;
      const won = hasWon(boardWithNewTile);
      const gameOver = !won && isGameOver(boardWithNewTile);
      const newBest = Math.max(gameState.best, newScore);

      setGameState({
        board: boardWithNewTile,
        score: newScore,
        best: newBest,
        gameOver,
        won,
        moved: true,
      });

      if (newBest > gameState.best) {
        saveBest(newBest);
      }

      setAiSuggestion(null);
    },
    [gameState]
  );

  const handleNewGame = useCallback(() => {
    const board = initializeBoard();
    setGameState({
      board,
      score: 0,
      best: gameState.best,
      gameOver: false,
      won: false,
      moved: false,
    });
    setAiSuggestion(null);
  }, [gameState.best]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          e.preventDefault();
          handleMove('up');
          break;
        case 'arrowdown':
        case 's':
          e.preventDefault();
          handleMove('down');
          break;
        case 'arrowleft':
        case 'a':
          e.preventDefault();
          handleMove('left');
          break;
        case 'arrowright':
        case 'd':
          e.preventDefault();
          handleMove('right');
          break;
        case 'n':
          handleNewGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handleNewGame]);

  const handleAISuggestion = useCallback(() => {
    if (gameState.gameOver || gameState.won || loadingAI) {
      return;
    }

    setLoadingAI(true);
    setTimeout(() => {
      const suggestion = getAISuggestion(gameState.board);
      if (suggestion) setAiSuggestion(`AI suggests: ${suggestion.direction.toUpperCase()}`);

      setLoadingAI(false);
    }, 100);
  }, [gameState, loadingAI]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>2048</h1>
        <p className="subtitle">Reach 2048 to win!</p>
      </div>

      <ScoreBoard score={gameState.score} best={gameState.best} />

      <GameBoard board={gameState.board} disabled={gameState.gameOver || gameState.won} />

      <div className="controls">
        <button className="button button-new" onClick={handleNewGame} title="Press N">
          New Game
        </button>
        <button
          className="button button-ai"
          onClick={handleAISuggestion}
          disabled={loadingAI || gameState.gameOver || gameState.won}
          title="Get AI suggestion"
        >
          {loadingAI ? 'Thinking...' : 'AI Suggestion'}
        </button>
      </div>

      {aiSuggestion && <div className="ai-suggestion">{aiSuggestion}</div>}

      <div className="instructions">
        <p>
          <strong>Controls:</strong> Arrow Keys or WASD to move • N for New Game
        </p>
        <p>
          <strong>Goal:</strong> Combine tiles to reach 2048!
        </p>
      </div>

      <GameStatus
        won={gameState.won}
        gameOver={gameState.gameOver}
        onNewGame={handleNewGame}
        onClose={() => {}}
      />
    </div>
  );
};

export default App;
