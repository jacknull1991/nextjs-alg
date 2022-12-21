import { GridNode, GridNodeType } from "./utils";

interface SortAnimation {
  visited: GridNode[], // excludes start and target node
  path: GridNode[] // from start to target
}

//#region DFS
export function depthFirstSearch(
  grid: GridNode[][],
  start: GridNode,
  target: GridNode
): SortAnimation {
  const stack: GridNode[] = [];
  const visited: GridNode[] = [];
  const path: GridNode[] = [];
  stack.push(start);

  while (stack.length !== 0) {
    const currentNode = stack.pop()!;
    if (grid[currentNode.coord[0]][currentNode.coord[1]].type === GridNodeType.WALL_NODE
      || grid[currentNode.coord[0]][currentNode.coord[1]].type === GridNodeType.VISITED_NODE) {
      continue;
    }

    currentNode.type = GridNodeType.VISITED_NODE;
    grid[currentNode.coord[0]][currentNode.coord[1]] = { ...currentNode };
    if ((currentNode.coord[0] !== target.coord[0] || currentNode.coord[1] !== target.coord[1])
      && (currentNode.coord[0] !== start.coord[0] || currentNode.coord[1] !== start.coord[1])) {
      visited.push(currentNode);
    }

    if (currentNode.coord[0] === target.coord[0] && currentNode.coord[1] === target.coord[1]) {
      getPath(currentNode, path);
      return { visited, path }
    }

    const [row, col] = currentNode.coord;
    // go east first and clockwise
    if (row > 0 && grid[row - 1][col].type !== GridNodeType.VISITED_NODE) {
      const nextNode = { ...grid[row - 1][col], previous: currentNode };
      stack.push(nextNode);
    }
    if (col > 0 && grid[row][col - 1].type !== GridNodeType.VISITED_NODE) {
      const nextNode = { ...grid[row][col - 1], previous: currentNode };
      stack.push(nextNode);
    }
    if (row < grid.length - 1 && grid[row + 1][col].type !== GridNodeType.VISITED_NODE) {
      const nextNode = { ...grid[row + 1][col], previous: currentNode };
      stack.push(nextNode);
    }
    if (col < grid[0].length - 1 && grid[row][col + 1].type !== GridNodeType.VISITED_NODE) {
      const nextNode = { ...grid[row][col + 1], previous: currentNode };
      stack.push(nextNode);
    }
  }

  return { visited, path }
}
//#endregion

//#region BFS
export function breadthFirstSearch(
  grid: GridNode[][],
  start: GridNode,
  target: GridNode
) {
  const queue: GridNode[] = [];
  const visited: GridNode[] = [];
  const path: GridNode[] = [];
  queue.push(start);

  while (queue.length !== 0) {
    const currentNode = queue.shift()!;

    if (grid[currentNode.coord[0]][currentNode.coord[1]].type === GridNodeType.WALL_NODE
      || grid[currentNode.coord[0]][currentNode.coord[1]].type === GridNodeType.VISITED_NODE) {
      continue;
    }

    currentNode.type = GridNodeType.VISITED_NODE;
    grid[currentNode.coord[0]][currentNode.coord[1]] = { ...currentNode };
    if ((currentNode.coord[0] !== target.coord[0] || currentNode.coord[1] !== target.coord[1])
      && (currentNode.coord[0] !== start.coord[0] || currentNode.coord[1] !== start.coord[1])) {
      visited.push(currentNode);
    }

    if (currentNode.coord[0] === target.coord[0] && currentNode.coord[1] === target.coord[1]) {
      getPath(currentNode, path);
      return { visited, path }
    }

    const [row, col] = currentNode.coord;
    // go east first and clockwise
    if (row > 0 && grid[row - 1][col].type !== GridNodeType.VISITED_NODE) {
      const nextNode = { ...grid[row - 1][col], previous: currentNode };
      queue.push(nextNode);
    }
    if (col > 0 && grid[row][col - 1].type !== GridNodeType.VISITED_NODE) {
      const nextNode = { ...grid[row][col - 1], previous: currentNode };
      queue.push(nextNode);
    }
    if (row < grid.length - 1 && grid[row + 1][col].type !== GridNodeType.VISITED_NODE) {
      const nextNode = { ...grid[row + 1][col], previous: currentNode };
      queue.push(nextNode);
    }
    if (col < grid[0].length - 1 && grid[row][col + 1].type !== GridNodeType.VISITED_NODE) {
      const nextNode = { ...grid[row][col + 1], previous: currentNode };
      queue.push(nextNode);
    }
  }

  return { visited, path }
}
//#endregion

function getPath(
  node: GridNode,
  path: GridNode[]
) {
  path.unshift(node);
  if (node.previous !== null) {
    getPath(node.previous, path);
  }
}

export default [
  depthFirstSearch,
  breadthFirstSearch
]