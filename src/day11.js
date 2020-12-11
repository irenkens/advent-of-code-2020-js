import { cloneDeep, isEqual } from 'lodash';
import { getInput, splitOnLineBreak, printHeader } from './util';

const FLOOR = '.';
const OCCUPIED = '#';
const EMPTY = 'L';

const getCell = (x, y, map) => {
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

const getSeat = (x, y, plusX, plusY, map) => {
  const posX = x + plusX;
  const posY = y + plusY;
  const outOfBoundsX = posX < 0 || posX >= map[0].length;
  const outOfBoundsY = posY < 0 || posY >= map.length;

  if (outOfBoundsX || outOfBoundsY) {
    return 0;
  }

  if (map[posY][posX] === OCCUPIED) {
    return 1;
  }

  if (map[posY][posX] === FLOOR) {
    return getSeat(posX, posY, plusX, plusY, map);
  }

  return 0;
};

const getVisibleSeats = (x, y, map) => {
  return getSeat(x, y, -1, -1, map)
       + getSeat(x, y, -1, 0, map)
       + getSeat(x, y, -1, 1, map)
       + getSeat(x, y, 0, -1, map)
       + getSeat(x, y, 0, 1, map)
       + getSeat(x, y, 1, -1, map)
       + getSeat(x, y, 1, 0, map)
       + getSeat(x, y, 1, 1, map);
};

const getAdjacentSeats = (x, y, map) => {
  return getCell(x - 1, y - 1, map)
       + getCell(x - 1, y, map)
       + getCell(x - 1, y + 1, map)
       + getCell(x, y - 1, map)
       + getCell(x, y + 1, map)
       + getCell(x + 1, y - 1, map)
       + getCell(x + 1, y, map)
       + getCell(x + 1, y + 1, map);
};

const updateMap = (map, func, maxNeighbors) => {
  const newMap = cloneDeep(map);

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const neighbors = func(x, y, map);
      if (map[y][x] === EMPTY && neighbors === 0) {
        newMap[y][x] = OCCUPIED;
      }
      if (map[y][x] === OCCUPIED && neighbors >= maxNeighbors) {
        newMap[y][x] = EMPTY;
      }
    }
  }

  if (isEqual(newMap, map)) {
    return map;
  }

  return updateMap(newMap, func, maxNeighbors);
};

const getOccupiedSeats = map => {
  return map.flat().filter(seat => seat === OCCUPIED).length;
};

const part1 = map => {
  const finalMap = updateMap(map, getAdjacentSeats, 4);
  return getOccupiedSeats(finalMap);
};

const part2 = map => {
  const finalMap = updateMap(map, getVisibleSeats, 5);
  return getOccupiedSeats(finalMap);
};

export const day11 = async () => {
  const input = await getInput(__filename);
  const map = splitOnLineBreak(input).map(n => n.split(''));

  printHeader(__filename, 1);
  console.log(part1(map));
  printHeader(__filename, 2);
  console.log(part2(map));
};
