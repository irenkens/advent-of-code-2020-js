import { concat } from 'lodash';
import { getInput, splitOnLineBreak, printHeader } from './util';

// Get the directions for a single tile as an array
const getDirections = tile => {
  const directions = [];
  for (let i = 0; i < tile.length; i++) {
    const letter = tile[i];
    if (letter === 'w' || letter === 'e') {
      directions.push(letter);
    } else {
      const nextLetter = tile[i + 1];
      directions.push(`${letter}${nextLetter}`);
      i++;
    }
  }
  return directions;
};

// Clean the tile directions so that the shortest path of directions is left
const cleanDirections = directions => {
  let countW = directions.filter(d => d === 'w').length;
  let countE = directions.filter(d => d === 'e').length;
  let countSw = directions.filter(d => d === 'sw').length;
  let countNe = directions.filter(d => d === 'ne').length;
  let countSe = directions.filter(d => d === 'se').length;
  let countNw = directions.filter(d => d === 'nw').length;

  // The following doubles cancel each other out: e w, sw ne, se nw
  // So we can remove any of these pairs safely from the directions.
  const removeEW = Math.min(countW, countE);
  const removeSwNe = Math.min(countSw, countNe);
  const removeSeNw = Math.min(countSe, countNw);

  countE -= removeEW;
  countW -= removeEW;
  countSw -= removeSwNe;
  countNe -= removeSwNe;
  countSe -= removeSeNw;
  countNw -= removeSeNw;

  // The following triples cancel each other out: w ne se, e nw sw
  // So we can remove any of these triples safely from the directions.
  const removeTripleW = Math.min(countW, countNe, countSe);
  const removeTripleE = Math.min(countE, countNw, countSw);

  countW -= removeTripleW;
  countE -= removeTripleE;
  countSw -= removeTripleE;
  countNe -= removeTripleW;
  countSe -= removeTripleW;
  countNw -= removeTripleE;

  // The following doubles can be replaced with a single direction:
  // w se = sw
  // e sw = se
  // w ne = nw
  // e nw = ne
  // nw sw = w
  // ne se = e
  // So find any of these doubles, remove them and add the new direction
  const replaceWSe = Math.min(countW, countSe);
  const replaceESw = Math.min(countE, countSw);
  const replaceWNe = Math.min(countW, countNe);
  const replaceENw = Math.min(countE, countNw);
  const replaceNwSw = Math.min(countNw, countSw);
  const replaceNeSe = Math.min(countNe, countSe);

  if (replaceWSe > 0) {
    countW -= replaceWSe;
    countSe -= replaceWSe;
    countSw += replaceWSe;
  }

  if (replaceESw > 0) {
    countE -= replaceESw;
    countSw -= replaceESw;
    countSe += replaceESw;
  }

  if (replaceWNe > 0) {
    countW -= replaceWNe;
    countNe -= replaceWNe;
    countNw += replaceWNe;
  }

  if (replaceENw > 0) {
    countE -= replaceENw;
    countNw -= replaceENw;
    countNe += replaceENw;
  }

  if (replaceNwSw > 0) {
    countNw -= replaceNwSw;
    countSw -= replaceNwSw;
    countW += replaceNwSw;
  }

  if (replaceNeSe > 0) {
    countNe -= replaceNeSe;
    countSe -= replaceNeSe;
    countE += replaceNeSe;
  }

  // Construct the shortest path of directions
  const w = Array(countW).fill('w');
  const e = Array(countE).fill('e');
  const sw = Array(countSw).fill('sw');
  const ne = Array(countNe).fill('ne');
  const se = Array(countSe).fill('se');
  const nw = Array(countNw).fill('nw');

  return concat(...w, ...e, ...sw, ...ne, ...se, ...nw).sort();
};

const getMap = list => {
  const cleaned = [];
  for (let i = 0; i < list.length; i++) {
    const directions = getDirections(list[i]);
    const clean = cleanDirections(directions);
    cleaned.push(clean);
  }

  // Map the shortest paths to strings again
  const cleanSorted = cleaned.map(c => c.reduce((total, r) => `${total}${r}`, ''));

  // Construct a map that keeps track of how many times a tile has been identified.
  const map = new Map();
  cleanSorted.forEach(clean => {
    const current = map.get(clean);
    map.set(clean, current ? current + 1 : 1);
  });

  return map;
};

const part1 = list => {
  const map = getMap(list);
  // Return the tiles that have been identified an odd number of times (= black tiles).
  return Array.from(map.values()).filter(v => v % 2 !== 0).length;
};

const updateMap = map => {
  const newMap = new Map(map);
  const tiles = Array.from(map.keys());

  tiles.forEach(tile => {
    const adjacent = ['w', 'e', 'se', 'sw', 'ne', 'nw']
      .map(d => cleanDirections(getDirections(`${tile}${d}`)))
      .map(c => c.reduce((total, r) => `${total}${r}`, ''));

    // get number of black adjacent tiles
    const adjacentBlack = adjacent.map(a => map.get(a) || 0).filter(v => v % 2 !== 0).length;
    const color = map.get(tile);
    if (color % 2 === 0 && adjacentBlack === 2) {
      newMap.set(tile, 1);
    } else if (color % 2 !== 0 && (adjacentBlack === 0 || adjacentBlack > 2)) {
      newMap.set(tile, 0);
    }

    // update map with tiles if they aren't in there yet
    adjacent.forEach(a => {
      if (!map.has(a)) {
        newMap.set(a, 0);
      }
    });
  });
  return newMap;
};

const addNeighbors = map => {
  const newMap = new Map(map);
  const tiles = Array.from(newMap.keys());
  tiles.forEach(tile => {
    const adjacent = ['w', 'e', 'se', 'sw', 'ne', 'nw']
      .map(d => cleanDirections(getDirections(`${tile}${d}`)))
      .map(c => c.reduce((total, r) => `${total}${r}`, ''));

    adjacent.forEach(a => {
      if (!newMap.has(a)) {
        newMap.set(a, 0);
      }
    });
  });
  return newMap;
};

// TODO: refactor to be faster, currently takes ~2m
const part2 = list => {
  let newMap = new Map(addNeighbors(getMap(list)));
  for (let i = 0; i < 100; i++) {
    newMap = updateMap(newMap);
  }
  return Array.from(newMap.values()).filter(v => v % 2 !== 0).length;
};

export const day24 = async () => {
  const input = await getInput(__filename);
  const list = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(list));
  printHeader(__filename, 2);
  console.log(part2(list));
};
