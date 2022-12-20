import { GridNode, Coord, GridNodeType } from '../lib/utils';
import styles from './GraphNode.module.scss'

const EMPTY_NODE = 0;
const START_NODE = 1;
const TARGET_NODE = 2;
const WALL_NODE = 3;
const VISITED_NODE = 4;
const PATH_NODE = 5;
const WEIGHT_NODE = 6;

export default function GraphNode({
  type,
  row,
  col,
  mouseDown,
  mouseEnter,
  mouseUp
}: {
  type: GridNodeType,
  row: number,
  col: number,
  mouseDown: (update: Coord) => void,
  mouseEnter: (update: Coord) => void,
  mouseUp: (update: Coord) => void,
}) {
  const firstRowStyle = row === 0 ? styles.firstRow : '';
  const firstColStyle = col === 0 ? styles.firstCol : '';
  const typeStyle = type === START_NODE ? styles.start :
    type === TARGET_NODE ? styles.target :
      type === WALL_NODE ? styles.wall :
        type === VISITED_NODE ? styles.visited :
          type === PATH_NODE ? styles.path :
            type === WEIGHT_NODE ? styles.weighted : styles.empty;
  return (
    <div
      className={`${styles.node} ${firstRowStyle} ${firstColStyle} ${typeStyle}`}
      onMouseDown={(e) => {
        e.preventDefault();
        mouseDown([row, col])
      }}
      onMouseEnter={(e) => {
        e.preventDefault();
        mouseEnter([row, col])
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        mouseUp([row, col])
      }}
    />
  )
}