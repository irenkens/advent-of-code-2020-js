import { cloneDeep, isEqual } from 'lodash';
import { getInput, splitOnLineBreak, printHeader } from './util';

const FLOOR = '.';
const OCCUPIED = '#';
const EMPTY = 'L';

const getCell = ({ x, y }, map) => {
  const outOfBoundsX = x < 0 || x >= map[0].length;
  const outOfBoundsY = y < 0 || y >= map.length;

  if (outOfBoundsX || outOfBoundsY) {
    return 0;
  }

  if (map[y][x] === OCCUPIED) {
    return 1;
  }

  return 0;
};

const getEmptyCell = ({ x, y }, plusX, plusY, map) => {
  const outOfBoundsX = x < 0 || x >= map[0].length;
  const outOfBoundsY = y < 0 || y >= map.length;

  if (outOfBoundsX || outOfBoundsY) {
    return 0;
  }

  if (map[y][x] === OCCUPIED) {
    return 1;
  }

  if (map[y][x] === FLOOR) {
    return getEmptyCell({ x: x + plusX, y: y + plusY }, plusX, plusY, map);
  }

  return 0;
};

const getEmpty = (point, map) => {
  const { x, y } = point;

  return getEmptyCell({ x: x - 1, y: y - 1 }, -1, -1, map)
       + getEmptyCell({ x: x - 1, y }, -1, 0, map)
       + getEmptyCell({ x: x - 1, y: y + 1 }, -1, 1, map)
       + getEmptyCell({ x, y: y - 1 }, 0, -1, map)
       + getEmptyCell({ x, y: y + 1 }, 0, 1, map)
       + getEmptyCell({ x: x + 1, y: y - 1 }, 1, -1, map)
       + getEmptyCell({ x: x + 1, y }, 1, 0, map)
       + getEmptyCell({ x: x + 1, y: y + 1 }, 1, 1, map);
};

const getNeighbors = (point, map) => {
  const { x, y } = point;

  return getCell({ x: x - 1, y: y - 1 }, map)
       + getCell({ x: x - 1, y }, map)
       + getCell({ x: x - 1, y: y + 1 }, map)
       + getCell({ x, y: y - 1 }, map)
       + getCell({ x, y: y + 1 }, map)
       + getCell({ x: x + 1, y: y - 1 }, map)
       + getCell({ x: x + 1, y }, map)
       + getCell({ x: x + 1, y: y + 1 }, map);
};

const updateMap = (map, func, maxNeighbors) => {
  const newMap = cloneDeep(map);

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const neighbors = func({ x, y }, map);
      if (map[y][x] === EMPTY && neighbors === 0) {
        newMap[y][x] = OCCUPIED;
      }
      if (map[y][x] === OCCUPIED && neighbors >= maxNeighbors) {
        newMap[y][x] = EMPTY;
      }
    }
  }

  if (isEqual(newMap, map)) {
    return map.flat().filter(position => position === OCCUPIED).length;
  }

  return updateMap(newMap, func, maxNeighbors);
};

const part1 = map => {
  return updateMap(map, getNeighbors, 4);
};

const part2 = map => {
  return updateMap(map, getEmpty, 5);
};

export const day11 = async () => {
  const input = await getInput(__filename);
  const map = splitOnLineBreak(input).map(n => n.split(''));

  printHeader(__filename, 1);
  console.log(part1(map));
  printHeader(__filename, 2);
  console.log(part2(map));
};
