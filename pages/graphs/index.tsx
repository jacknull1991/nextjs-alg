import Layout from "../../components/layout"
import Head from "next/head"
import Modal from "../../components/Modal"
import ControlButton from "../../components/ControlButton"
import GraphNode from "../../components/GraphNode"
import { GridNodeType, GridNode, Coord } from "../../lib/utils"
import { useEffect } from 'react'
import { atom, useAtom } from "jotai"
import { atomWithImmer } from "jotai/immer"

import Algorithms from "../../lib/graph"
import styles from './index.module.scss'

//#region CONSTANTS
const ROW_NUM = 20;
const COL_NUM = 20;

const START_ROW = 3;
const START_COL = 3;
const TARGET_ROW = 15;
const TARGET_COL = 18;

const ANIMATION_SPEED = 20; // milliseconds per interval
//#endregion

//#region React states definitions
const gridAtom = atomWithImmer<GridNode[][]>([])
const startPosAtom = atom<Coord>([START_ROW, START_COL]);
const targetPosAtom = atom<Coord>([TARGET_ROW, TARGET_COL]);

const animatedAtom = atom(false);
const mouseObjectAtom = atom<GridNodeType>(GridNodeType.EMPTY_NODE);
const drawingAtom = atom(false);
const handleMouseDownAtom = atom(
  null,
  (get, set, update: Coord) => {
    set(drawingAtom, true);
    const type = get(gridAtom)[update[0]][update[1]].type;
    set(mouseObjectAtom, type);
  }
)
const handleMouseUpAtom = atom(
  null,
  (_get, set, _update: Coord) => {
    set(drawingAtom, false);
    set(mouseObjectAtom, GridNodeType.EMPTY_NODE);
  }
)
const handleMouseEnterAtom = atom(
  null,
  (get, set, update: Coord) => {
    if (get(drawingAtom)) {
      const prev = get(startPosAtom);
      set(startPosAtom, update);
      set(gridAtom, (draft) => {
        draft[prev[0]][prev[1]].type = GridNodeType.EMPTY_NODE;
        draft[update[0]][update[1]].type = GridNodeType.START_NODE;
        return draft;
      });
    }
  }
)

const algoAtom = atom(0);
const modalAtom = atom(false);
const resultAtom = atom<number[]>([0, 0])

const handleResetAtom = atom(
  null,
  (get, set) => {
    const newGrid: GridNode[][] = [];
    const startPos = get(startPosAtom);
    const targetPos = get(targetPosAtom);
    for (let row = 0; row < ROW_NUM; row++) {
      const currentRow: GridNode[] = [];
      for (let col = 0; col < COL_NUM; col++) {
        const type =
          (row === startPos[0] && col === startPos[1]) ? GridNodeType.START_NODE :
            (row === targetPos[0] && col === targetPos[1]) ? GridNodeType.TARGET_NODE :
              (Math.random() * 10 < 3) ? GridNodeType.WALL_NODE : GridNodeType.EMPTY_NODE;
        const coord: Coord = [row, col];
        currentRow.push({
          coord,
          type,
          distance: Infinity,
          previous: null
        });
      }
      newGrid.push(currentRow);
    }
    set(gridAtom, newGrid);
  }
)
const handleAnimationAtom = atom(
  (get) => get(animatedAtom),
  (get, set) => {
    const g = get(gridAtom).map(arr => arr.slice());
    const startPos = get(startPosAtom);
    const targetPos = get(targetPosAtom);
    const s = { ...g[startPos[0]][startPos[1]] };
    const t = { ...g[targetPos[0]][targetPos[1]] };
    const { visited, path } = Algorithms[get(algoAtom)](g, s, t);

    set(resultAtom, [visited.length, path.length]);
    set(animatedAtom, true);
    setTimeout(() => {
      set(animatedAtom, false);
      set(modalAtom, true);
    }, (visited.length + path.length) * ANIMATION_SPEED);

    for (let i = 0; i < visited.length; i++) {
      setTimeout(() => {
        const node = visited[i];
        set(gridAtom, (draft) => {
          draft[node.coord[0]][node.coord[1]].type = GridNodeType.VISITED_NODE;
        });

        if (i === visited.length - 1) {
          setTimeout(() => {
            if (path.length === 0) {
              // no path found
            } else {
              for (let j = 1; j < path.length; j++) {
                const pathnode = path[j];
                setTimeout(() => {
                  set(gridAtom, (draft) => {
                    if (j !== path.length - 1) {
                      draft[pathnode.coord[0]][pathnode.coord[1]].type = GridNodeType.PATH_NODE;
                    }
                    // check connection
                    if (draft[pathnode.coord[0]][pathnode.coord[1]].connection === undefined) {
                      draft[pathnode.coord[0]][pathnode.coord[1]].connection = new Array<number>(4);
                    }
                    if (draft[path[j - 1].coord[0]][path[j - 1].coord[1]].connection === undefined) {
                      draft[path[j - 1].coord[0]][path[j - 1].coord[1]].connection = new Array<number>(4);
                    }

                    if (pathnode.coord[1] === path[j - 1].coord[1] + 1) { // from left
                      draft[pathnode.coord[0]][pathnode.coord[1]].connection![3] = 1;
                      draft[path[j - 1].coord[0]][path[j - 1].coord[1]].connection![1] = 1;
                    }
                    else if (pathnode.coord[1] === path[j - 1].coord[1] - 1) { // from right
                      draft[pathnode.coord[0]][pathnode.coord[1]].connection![1] = 1;
                      draft[path[j - 1].coord[0]][path[j - 1].coord[1]].connection![3] = 1;
                    }
                    else if (pathnode.coord[0] === path[j - 1].coord[0] + 1) { // from up
                      draft[pathnode.coord[0]][pathnode.coord[1]].connection![0] = 1;
                      draft[path[j - 1].coord[0]][path[j - 1].coord[1]].connection![2] = 1;
                    }
                    else if (pathnode.coord[0] === path[j - 1].coord[0] - 1) { // from down
                      draft[pathnode.coord[0]][pathnode.coord[1]].connection![2] = 1;
                      draft[path[j - 1].coord[0]][path[j - 1].coord[1]].connection![0] = 1;
                    }
                  })
                }, j * ANIMATION_SPEED);
              }
            }
          })
        }
      }, i * ANIMATION_SPEED)
    }
  }
)
const handleAlgorithmAtom = atom(
  (get) => get(algoAtom),
  (_get, set, update: number) => {
    set(algoAtom, update);
  }
)
//#endregion

//#region Controls
function ControlPanel() {
  const [, handleReset] = useAtom(handleResetAtom);
  const [isAnimated, handleAnimation] = useAtom(handleAnimationAtom);
  const [currentAlgorithm, setCurrentAlgorithm] = useAtom(handleAlgorithmAtom);

  useEffect(() => {
    handleReset();
  }, [])

  return (
    <div className={styles.controlContainer}>
      <h2 className={styles.heading}>Paht in Graphs</h2>
      <ControlButton text={"Reset"} action={handleReset} disabled={isAnimated} />
      <div className={styles.buttonGroup}>
        <ControlButton text={"Depth-first Search"}
          action={() => setCurrentAlgorithm(0)}
          active={currentAlgorithm === 0} />
        <ControlButton text={"Breadth-first Search"}
          action={() => setCurrentAlgorithm(1)}
          active={currentAlgorithm === 1} />
      </div>
      <ControlButton text="START!" action={handleAnimation} disabled={isAnimated} />
    </div>
  )
}
//#endregion

//#region Animation
function AnimationPanel() {
  const [grid] = useAtom(gridAtom);
  const [, handleMouseDown] = useAtom(handleMouseDownAtom);
  const [, handleMouseUp] = useAtom(handleMouseUpAtom);
  const [, handleMouseEnter] = useAtom(handleMouseEnterAtom);

  return (
    <div className={styles.animationContainer}>
      {grid.map((currentRow, row) => {
        return (
          <div key={row} className={styles.gridRow}>
            {currentRow.map((node, col) => {
              return (
                <GraphNode
                  key={col}
                  type={node.type}
                  row={node.coord[0]}
                  col={node.coord[1]}
                  mouseDown={handleMouseDown}
                  mouseUp={handleMouseUp}
                  mouseEnter={handleMouseEnter}
                  connection={node.connection}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
//#endregion

//#region Page
export default function IndexPage() {
  const [modalShow, setModalShow] = useAtom(modalAtom);
  const [result] = useAtom(resultAtom);

  return (
    <Layout >
      <Head>
        <title>Next.js Algorithm - Graphs Visualization</title>
      </Head>
      <Modal show={modalShow} setShow={setModalShow} title="Search Result">
        <ul>
          <li>Grid size: {ROW_NUM * COL_NUM} </li>
          <li>Number of nodes visited: {result[0]} </li>
          <li>Length of path: {result[1]} </li>
        </ul>
      </Modal>
      <div className={styles.mainContainer}>
        <ControlPanel />
        <AnimationPanel />
      </div>
    </Layout>
  )
}
//#endregion