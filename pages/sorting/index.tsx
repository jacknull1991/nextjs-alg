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

type Bar = {
  height: number,
  backgroundColor: string
}

const SIZE = 20;
const arraySizeAtom = atom(SIZE);
const MAX_HEIGHT = 600;
const MIN_HEIGHT = 10;
const ANIMATION_SPEED = 3;

const arrAtom = atomWithImmer<Bar[]>([]);
const algoAtom = atom(0);
const animateAtom = atom(false);
const modalAtom = atom(false);
const countCompareAtom = atom(0);
const countSwapAtom = atom(0);
const timeElapsedAtom = atom(0);

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function IndexPage() {
  const [currentAlgo, setCurrentAlgo] = useAtom(algoAtom);
  const [array, setArray] = useAtom(arrAtom);
  const [arraySize, setArraySize] = useAtom(arraySizeAtom);
  const [animated, setAnimated] = useAtom(animateAtom);
  const [modalShow, setModalShow] = useAtom(modalAtom);
  const [countCompare, setCountCompare] = useAtom(countCompareAtom);
  const [countSwap, setCountSwap] = useAtom(countSwapAtom);
  const [timeElapsed, setTimeElapsed] = useAtom(timeElapsedAtom);

  // reset array on first render
  useEffect(() => {
    resetArray();
  }, []);

  function resetArray() {
    const arr: Bar[] = [];
    for (let i = 0; i < arraySize; i++) {
      const height = Math.min(randomIntFromInterval(MIN_HEIGHT, MAX_HEIGHT));
      arr.push({ height: height, backgroundColor: colors.primaryBarColor });
    }
    setArray(arr);
  }

  // start animation
  function startSorting() {
    setAnimated(true);

    const heights = array.map(bar => bar.height);
    let numberOfComparison = 0;
    let numberOfSwap = 0;
    const startTime = performance.now();
    const animations = Algorithms[currentAlgo](heights);
    const duration = performance.now() - startTime;

    setTimeout(() => {
      setAnimated(false);
      setModalShow(true);
    }, (animations.length + 1) * ANIMATION_SPEED);

    for (let i = 0; i < animations.length; i++) {
      const { index, action, value } = animations[i];
      switch (action) {
        case "color":
          numberOfComparison++;
          setTimeout(() => {
            setArray((draft) => {
              draft[index].backgroundColor = value as string;
              return draft;
            })
          }, i * ANIMATION_SPEED)
          break;
        case "height":
          numberOfSwap++;
          setTimeout(() => {
            setArray((draft) => {
              draft[index].height = value as number;
              return draft;
            })
          }, i * ANIMATION_SPEED)
          break;
        default:
          throw new Error("Invalid action:", action);
      }
    }

    setCountCompare(Math.floor(numberOfComparison / 2));
    setCountSwap(numberOfSwap);
    setTimeElapsed(duration);
  }

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
        <div className={styles.controlContainer}>
          <h2 className={styles.heading}>Sorting Visualization</h2>
          <Slider label={"Size:"} min={10} max={250} value={arraySize} setValue={setArraySize} />
          <ControlButton text="Reset" action={resetArray} disabled={animated} />
          <div className={styles.buttonGroup}>
            <ControlButton text="Merge Sort" action={() => setCurrentAlgo(0)} active={currentAlgo === 0} />
            <ControlButton text="Quick Sort" action={() => setCurrentAlgo(1)} active={currentAlgo === 1} />
            <ControlButton text="Heap Sort" action={() => setCurrentAlgo(2)} active={currentAlgo === 2} />
            <div className={styles.separator}></div>
            <ControlButton text="Bubble Sort" action={() => setCurrentAlgo(3)} active={currentAlgo === 3} />
            <ControlButton text="Selection Sort" action={() => setCurrentAlgo(4)} active={currentAlgo === 4} />
            <ControlButton text="Cocktail Sort" action={() => setCurrentAlgo(5)} active={currentAlgo === 5} />
          </div>
          <ControlButton text="START!" action={startSorting} disabled={animated} />
        </div>

        <div className={styles.animationContainer}>
          {array.map((bar, index) => (
            <VerticalBar key={index} {...bar} />
          ))}
        </div>
      </div>
    </Layout>
  )
}