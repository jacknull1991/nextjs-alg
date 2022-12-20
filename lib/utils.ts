import { useRef, useEffect } from "react";

export enum GridNodeType {
  EMPTY_NODE = 0,
  START_NODE = 1,
  TARGET_NODE = 2,
  WALL_NODE = 3,
  VISITED_NODE = 4,
  PATH_NODE = 5,
  WEIGHT_NODE = 6,
}

export type Coord = [number, number];

export type GridNode = {
  // row: number,
  // col: number,
  coord: Coord,
  type: GridNodeType,
  distance: number,
  previous: GridNode | null
}

const useCommitCount = () => {
  const commitCountRef = useRef(0);
  useEffect(() => {
    commitCountRef.current += 1;
  });
  return commitCountRef.current;
};