import Tile from './Tile';
import type { Board } from '../types/index';
import './Board.css';

interface BoardProps {
  board: Board;
  disabled?: boolean;
}

const GameBoard = ({ board, disabled = false }: BoardProps) => {
  return (
    <div
      className="board"
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((tile, colIndex) => <Tile key={`${rowIndex}-${colIndex}`} value={tile} />)
      )}
    </div>
  );
};

export default GameBoard;
