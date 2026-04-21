import './Tile.css';

interface TileProps {
  value: number | null;
}

const Tile = ({ value }: TileProps) => {
  return <div className={`tile ${value ? `tile-${value}` : 'empty'}`}>{value}</div>;
};

export default Tile;
