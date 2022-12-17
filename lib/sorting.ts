import colors from '../components/VerticalBar.module.scss'

function arraySwap(
  array: number[],
  idx1: number,
  idx2: number
) {
  const tmp = array[idx1];
  array[idx1] = array[idx2];
  array[idx2] = tmp;
}

type Action = "height" | "color";

interface SortAnimation {
  index: number,
  action: Action,
  value: string | number
}

const COLOR_OG = colors.primaryBarColor;
const COLOR_AL = colors.alterBarColor;
const COLOR_PI = colors.pivotBarColor;

//#region nlog(n) algorithms
//#region Merge Sort 
export function mergeSort(array: number[]) {
  const animations: SortAnimation[] = [];
  if (array.length <= 1) return animations;

  const copy = array.slice();
  mergeSortHelper(array, 0, array.length - 1, copy, animations);
  return animations;
}

function mergeSortHelper(
  array: number[],
  lo: number,
  hi: number,
  copy: number[],
  animations: SortAnimation[]
) {
  if (lo === hi) return;
  const mid = Math.floor((lo + hi) / 2);
  mergeSortHelper(copy, lo, mid, array, animations);
  mergeSortHelper(copy, mid + 1, hi, array, animations);
  doMerge(array, lo, mid, hi, copy, animations);
}

function doMerge(
  array: number[],
  lo: number,
  mid: number,
  hi: number,
  copy: number[],
  animations: SortAnimation[]
) {
  let k = lo, i = lo, j = mid + 1;
  while (i <= mid && j <= hi) {
    // Current indices we're comparing; add to animation to change their color
    animations.push({ index: i, action: "color", value: COLOR_AL });
    animations.push({ index: j, action: "color", value: COLOR_AL });
    // add to animations to revert their color
    animations.push({ index: i, action: "color", value: COLOR_OG });
    animations.push({ index: j, action: "color", value: COLOR_OG });

    if (copy[i] <= copy[j]) {
      // overwrite the value at index k in the original array with the value at 
      // index i in the copy array so we don't mess up the two parts
      animations.push({ index: k, action: "height", value: copy[i] });
      array[k++] = copy[i++];
    } else {
      // same as above
      animations.push({ index: k, action: "height", value: copy[j] });
      array[k++] = copy[j++];
    }
  }

  while (i <= mid) {
    // push twice to change color and revert back
    animations.push({ index: i, action: "color", value: COLOR_AL });
    animations.push({ index: k, action: "height", value: copy[i] });
    animations.push({ index: i, action: "color", value: COLOR_OG });

    array[k++] = copy[i++];
  }
  while (j <= hi) {
    // same as above
    animations.push({ index: j, action: "color", value: COLOR_AL });
    animations.push({ index: k, action: "height", value: copy[j] });
    animations.push({ index: j, action: "color", value: COLOR_OG });

    array[k++] = copy[j++];
  }
}
//#endregion

//#region Quick Sort
export function quickSort(array: number[]) {
  const animations: SortAnimation[] = [];
  if (array.length <= 1) return animations;
  quickSortHelper(array, 0, array.length - 1, animations);
  return animations;
}

// using last index as pivot
function quickSortHelper(
  array: number[],
  lo: number,
  hi: number,
  animations: SortAnimation[]
) {
  if (lo >= hi) return;
  // partition
  const pivot = quickSortPartition(array, lo, hi, animations);
  // sort recursively
  quickSortHelper(array, lo, pivot - 1, animations);
  quickSortHelper(array, pivot + 1, hi, animations);
}

function quickSortPartition(
  array: number[],
  lo: number,
  hi: number,
  animations: SortAnimation[]
) {
  let pivot = array[hi];
  let i = lo;
  // mark pivot for this iteration
  // animation.push([hi, hi, array[hi], array[hi]]);
  animations.push({ index: hi, action: "color", value: COLOR_PI });

  for (let j = lo; j < hi; j++) {
    // mark index i & j
    animations.push({ index: i, action: "color", value: COLOR_AL });
    animations.push({ index: j, action: "color", value: COLOR_AL });

    if (array[j] < pivot) {
      // swap bar heights at index i & j
      animations.push({ index: i, action: "height", value: array[j] });
      animations.push({ index: j, action: "height", value: array[i] });
      // unmark index i & j
      animations.push({ index: i, action: "color", value: COLOR_OG });
      animations.push({ index: j, action: "color", value: COLOR_OG });

      arraySwap(array, i, j);
      i++;
    } else {
      // unmark index i & j
      animations.push({ index: i, action: "color", value: COLOR_OG });
      animations.push({ index: j, action: "color", value: COLOR_OG });
    }
  }
  // swap pivot to correct position
  animations.push({ index: i, action: "color", value: COLOR_AL });
  animations.push({ index: hi, action: "color", value: COLOR_AL });

  animations.push({ index: i, action: "height", value: array[hi] });
  animations.push({ index: hi, action: "height", value: array[i] });

  animations.push({ index: i, action: "color", value: COLOR_OG });
  animations.push({ index: hi, action: "color", value: COLOR_OG });

  arraySwap(array, i, hi);
  return i;
}
//#endregion

//#region Heap Sort
export function heapSort(array: number[]) {
  const animations: SortAnimation[] = [];
  if (array.length <= 1) return animations;
  heapSortHelper(array, animations);
  return animations;
}

function heapSortHelper(
  array: number[],
  animations: SortAnimation[]
) {
  let len = array.length;

  // Build heap (rearrange array)
  heapify(array, animations);

  let end = len - 1;
  while (end > 0) {
    // mark and swap root with last index
    animations.push({ index: end, action: "color", value: COLOR_AL });
    animations.push({ index: 0, action: "color", value: COLOR_AL });

    animations.push({ index: end, action: "height", value: array[0] });
    animations.push({ index: 0, action: "height", value: array[end] });

    animations.push({ index: end, action: "color", value: COLOR_OG });
    animations.push({ index: 0, action: "color", value: COLOR_OG });
    arraySwap(array, end, 0);
    end--;
    swapDown(array, 0, end, animations);
  }
}

/*parent(i) = (i-1)/2
  leftChild(i) = i*2 + 1
  rightChild(i) = i*2 + 2*/
function heapify(
  array: number[],
  animations: SortAnimation[]
) {
  let len = array.length;
  let start = Math.floor(len / 2 - 1); // crucial using floor function

  while (start >= 0) {
    // swap down the node at start s.t. all nodes below the start index are in heap order
    swapDown(array, start, len - 1, animations);
    start--;
  }
}

function swapDown(
  array: number[],
  start: number,
  end: number,
  animations: SortAnimation[]
) {
  let root = start;

  // while the root has atleast 1 child
  while (root * 2 + 1 <= end) {
    let child = root * 2 + 1;
    let swap = root; // keep track of which node to swap with

    if (array[swap] < array[child]) {
      swap = child;
    }
    // if there is a right child and it is greater than whatever is to be swapped
    if (child + 1 <= end && array[swap] < array[child + 1]) {
      swap = child + 1;
    }
    if (swap === root) {
      return; // no swap needed
    } else {
      animations.push({ index: root, action: "color", value: COLOR_AL });
      animations.push({ index: swap, action: "color", value: COLOR_AL });

      animations.push({ index: root, action: "height", value: array[swap] });
      animations.push({ index: swap, action: "height", value: array[root] });

      animations.push({ index: root, action: "color", value: COLOR_OG });
      animations.push({ index: swap, action: "color", value: COLOR_OG });
      arraySwap(array, root, swap);
      root = swap;
    }
  }
}
//#endregion
//#endregion

//#region n^2 algorithms
//#region Bubble Sort
export function bubbleSort(array: number[]) {
  const animations: SortAnimation[] = [];
  if (array.length <= 1) return animations;
  bubbleSortHelper(array, animations);
  return animations;
}

// naive implementation
function bubbleSortHelper(
  array: number[],
  animations: SortAnimation[]) {
  let len = array.length;
  let swapped;
  do {
    swapped = false;
    for (let i = 1; i < len; i++) {
      animations.push({ index: i - 1, action: "color", value: COLOR_AL });
      animations.push({ index: i, action: "color", value: COLOR_AL });
      if (array[i - 1] > array[i]) {
        animations.push({ index: i - 1, action: "height", value: array[i] });
        animations.push({ index: i, action: "height", value: array[i - 1] });
        arraySwap(array, i - 1, i);
        swapped = true;
      } else {
        // do-nothing animation
      }
      animations.push({ index: i - 1, action: "color", value: COLOR_OG });
      animations.push({ index: i, action: "color", value: COLOR_OG });
    }
    len = len - 1;
  } while (swapped)
}
//#endregion

//#region Selection Sort
export function selectionSort(array: number[]) {
  const animations: SortAnimation[] = [];
  if (array.length <= 1) return animations;
  selectionSortHelper(array, 0, animations);
  return animations;
}

function selectionSortHelper(
  array: number[],
  start: number,
  animations: SortAnimation[]
) {
  if (start >= array.length - 1) return;

  let min_idx = start;
  for (let i = start + 1; i < array.length; i++) {
    animations.push({ index: min_idx, action: "color", value: COLOR_PI });
    animations.push({ index: i, action: "color", value: COLOR_AL });

    animations.push({ index: min_idx, action: "color", value: COLOR_OG });
    animations.push({ index: i, action: "color", value: COLOR_OG });
    if (array[i] < array[min_idx]) {
      min_idx = i;
    }
  }
  animations.push({ index: min_idx, action: "color", value: COLOR_PI });
  animations.push({ index: start, action: "color", value: COLOR_AL });

  animations.push({ index: min_idx, action: "height", value: array[start] });
  animations.push({ index: start, action: "height", value: array[min_idx] });

  animations.push({ index: min_idx, action: "color", value: COLOR_OG });
  animations.push({ index: start, action: "color", value: COLOR_OG });
  arraySwap(array, start, min_idx);
  selectionSortHelper(array, start + 1, animations);
}
//#endregion

//#region Cocktail Sort
export function cocktailSort(array: number[]) {
  const animations: SortAnimation[] = [];
  if (array.length <= 1) return animations;
  cocktailSortHelper(array, 0, array.length - 1, animations);
  return animations;
}

function cocktailSortHelper(
  array: number[],
  start: number,
  end: number,
  animations: SortAnimation[]
) {
  if (start >= end) return;
  let swapped = false;
  // forward
  for (let i = start + 1; i <= end; i++) {
    // animations.push([i - 1, i, array[i-1], array[i]]);
    animations.push({ index: i - 1, action: "color", value: COLOR_AL });
    animations.push({ index: i, action: "color", value: COLOR_AL });
    if (array[i - 1] > array[i]) {
      // animations.push([i - 1, i, array[i-1], array[i]]);
      animations.push({ index: i - 1, action: "height", value: array[i] });
      animations.push({ index: i, action: "height", value: array[i - 1] });
      arraySwap(array, i - 1, i);
      swapped = true;
    } else {
      // animations.push([i - 1, i, -1, -1]);
    }
    animations.push({ index: i - 1, action: "color", value: COLOR_OG });
    animations.push({ index: i, action: "color", value: COLOR_OG });
  }

  // backward
  for (let i = end - 2; i >= start; i--) {
    animations.push({ index: i, action: "color", value: COLOR_AL });
    animations.push({ index: i + 1, action: "color", value: COLOR_AL });
    if (array[i] > array[i + 1]) {
      // animations.push([i, i + 1, array[i], array[i + 1]]);
      animations.push({ index: i, action: "height", value: array[i + 1] });
      animations.push({ index: i + 1, action: "height", value: array[i] });
      arraySwap(array, i, i + 1);
      swapped = true;
    } else {
      // animations.push([i, i + 1, -1, -1]);
    }
    animations.push({ index: i, action: "color", value: COLOR_OG });
    animations.push({ index: i + 1, action: "color", value: COLOR_OG });
  }

  if (swapped) {
    cocktailSortHelper(array, start + 1, end - 1, animations);
  }
}
//#endregion
//#endregion

export default [
  mergeSort,
  quickSort,
  heapSort,
  bubbleSort,
  selectionSort,
  cocktailSort
]