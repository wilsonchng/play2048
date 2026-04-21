import { useEffect, useRef } from 'react';
import './GameStatus.css';

interface GameStatusProps {
  won: boolean;
  gameOver: boolean;
  onNewGame: () => void;
  onClose: () => void;
}

const GameStatus = ({ won, gameOver, onNewGame, onClose }: GameStatusProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (won || gameOver) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [won, gameOver]);

  const isWin = won;
  const title = isWin ? 'YOU WIN!' : 'GAME OVER';
  const message = isWin ? 'You reached 2048!' : 'No more moves available';

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  };

  const handleNewGame = () => {
    handleClose();
    onNewGame();
  };

  return (
    <dialog ref={dialogRef} className="game-status-dialog">
      <div className="game-status-modal">
        <button className="dialog-close" onClick={handleClose} aria-label="Close">
          ×
        </button>
        <h2>{title}</h2>
        <p>{message}</p>
        <button className="modal-button" onClick={handleNewGame}>
          New Game
        </button>
      </div>
    </dialog>
  );
};

export default GameStatus;
