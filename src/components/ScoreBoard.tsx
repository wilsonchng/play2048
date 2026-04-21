import './ScoreBoard.css';

interface ScoreBoardProps {
  score: number;
  best: number;
}

const ScoreBoard = ({ score, best }: ScoreBoardProps) => {
  return (
    <div className="scoreboard">
      <div className="score-container">
        <div className="score-label">SCORE</div>
        <div className="score-value">{score}</div>
      </div>
      <div className="score-container">
        <div className="score-label">BEST</div>
        <div className="score-value">{best}</div>
      </div>
    </div>
  );
};

export default ScoreBoard;
