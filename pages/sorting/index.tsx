import Layout from "../../components/layout"
import Head from "next/head"
import Modal from "../../components/Modal"
import ControlButton from "../../components/ControlButton"
import Slider from "../../components/Slider"
import VerticalBar from "../../components/VerticalBar"
import { useEffect } from 'react'
import { atom, useAtom } from "jotai"
import { atomWithImmer } from "jotai/immer"

import Algorithms from '../../lib/sorting'

import styles from './index.module.scss'
import colors from '../../components/VerticalBar.module.scss'
import { ArrayBar } from "../../lib/utils"

//#region CONSTANTS
const SIZE = 20;
const MAX_HEIGHT = 600;
const MIN_HEIGHT = 10;
const ANIMATION_SPEED = 20; // milliseconds per interval
//#endregion

//#region States definitions
const arrayAtom = atomWithImmer<ArrayBar[]>([]);
const arraySizeAtom = atom(SIZE);
const algorithmAtom = atom(0);
const animatedAtom = atom(false);
const modalAtom = atom(false);
const countCompareAtom = atom(0);
const countSwapAtom = atom(0);
const timeElapsedAtom = atom(0);

const handleResetAtom = atom(
  null,
  (get, set) => {
    const arr: ArrayBar[] = [];
    for (let i = 0; i < get(arraySizeAtom); i++) {
      const height = Math.min(randomIntFromInterval(MIN_HEIGHT, MAX_HEIGHT));
      arr.push({ height: height, backgroundColor: colors.primaryBarColor });
    }
    set(arrayAtom, arr);
  }
)

const handleAnimationAtom = atom(
  (get) => get(animatedAtom),
  (get, set) => {
    set(animatedAtom, true);

    const heights = get(arrayAtom).map(bar => bar.height);
    let numberOfComparison = 0;
    let numberOfSwap = 0;
    const startTime = performance.now();
    const animations = Algorithms[get(algorithmAtom)](heights);
    const duration = performance.now() - startTime;

    setTimeout(() => {
      set(animatedAtom, false);
      set(modalAtom, true);
    }, (animations.length + 1) * ANIMATION_SPEED);

    for (let i = 0; i < animations.length; i++) {
      const { index, action, value } = animations[i];
      switch (action) {
        case "color":
          numberOfComparison++;
          setTimeout(() => {
            set(arrayAtom, (draft) => {
              draft[index].backgroundColor = value as string;
              return draft;
            })
          }, i * ANIMATION_SPEED)
          break;
        case "height":
          numberOfSwap++;
          setTimeout(() => {
            set(arrayAtom, (draft) => {
              draft[index].height = value as number;
              return draft;
            })
          }, i * ANIMATION_SPEED)
          break;
        default:
          throw new Error("Invalid action:", action);
      }
    }

    set(countCompareAtom, Math.floor(numberOfComparison / 2));
    set(countSwapAtom, numberOfSwap);
    set(timeElapsedAtom, duration);
  }
)

const handleAlgorithmAtom = atom(
  (get) => get(algorithmAtom),
  (_get, set, update: number) => {
    set(algorithmAtom, update)
  }
)
//#endregion

//#region Controls
function ControlPanel() {
  const [, handleReset] = useAtom(handleResetAtom);
  const [isAnimated, handleAnimation] = useAtom(handleAnimationAtom);
  const [currentAlgo, setCurrentAlgo] = useAtom(handleAlgorithmAtom);
  const [arraySize, setArraySize] = useAtom(arraySizeAtom);

  useEffect(() => {
    handleReset();
  }, []);

  return (
    <div className={styles.controlContainer}>
      <h2 className={styles.heading}>Sorting Visualization</h2>
      <Slider label={"Size:"} min={10} max={250} value={arraySize} setValue={setArraySize} />
      <ControlButton text="Reset" action={handleReset} disabled={isAnimated} />
      <div className={styles.buttonGroup}>
        <ControlButton text="Merge Sort" action={() => setCurrentAlgo(0)} active={currentAlgo === 0} />
        <ControlButton text="Quick Sort" action={() => setCurrentAlgo(1)} active={currentAlgo === 1} />
        <ControlButton text="Heap Sort" action={() => setCurrentAlgo(2)} active={currentAlgo === 2} />
        <div className={styles.separator}></div>
        <ControlButton text="Bubble Sort" action={() => setCurrentAlgo(3)} active={currentAlgo === 3} />
        <ControlButton text="Selection Sort" action={() => setCurrentAlgo(4)} active={currentAlgo === 4} />
        <ControlButton text="Cocktail Sort" action={() => setCurrentAlgo(5)} active={currentAlgo === 5} />
      </div>
      <ControlButton text="START!" action={handleAnimation} disabled={isAnimated} />
    </div>
  )
}
//#endregion

//#region Animation
function AnimationPanel() {
  const [array] = useAtom(arrayAtom);

  return (
    <div className={styles.animationContainer}>
      {array.map((bar, index) => (
        <VerticalBar key={index} {...bar} />
      ))}
    </div>
  )
}
//#endregion

//#region Page
export default function IndexPage() {
  const [arraySize] = useAtom(arraySizeAtom);
  const [modalShow, setModalShow] = useAtom(modalAtom);
  const [countCompare] = useAtom(countCompareAtom);
  const [countSwap] = useAtom(countSwapAtom);
  const [timeElapsed] = useAtom(timeElapsedAtom);

  return (
    <Layout >
      <Head>
        <title>Next.js Algorithm - Sorting Visualization</title>
      </Head>
      <Modal show={modalShow} setShow={setModalShow} title="Sort Result">
        <ul>
          <li>Array size: {arraySize} </li>
          <li>Algorithm time elapsed: {timeElapsed.toFixed(4)} milliseconds </li>
          <li>Number of comparisons: {countCompare} </li>
          <li>Number of Swaps: {countSwap} </li>
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

// helper function
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}