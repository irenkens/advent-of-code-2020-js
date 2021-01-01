import { intersection } from 'lodash';
import { getInput, splitOnLineBreak, splitOnEmptyLine, printHeader } from './util';

const reverseString = str => {
  return str.split('').reverse().join('');
};

// Each tile can have 8 possible edges since the tiles can be flipped
const getEdges = tile => {
  const top = tile[0];
  const right = tile.reduce((total, value) => `${total}${value[value.length - 1]}`, '');
  const bottom = tile[tile.length - 1];
  const left = tile.reduce((total, value) => `${total}${value[0]}`, '');

  return [top, right, bottom, left, reverseString(top), reverseString(right),
    reverseString(bottom), reverseString(left)];
};

const part1 = tiles => {
  // Create a map with key = tile number and value = array of possible edges
  const edges = new Map();
  tiles.forEach(tile => {
    const lines = splitOnLineBreak(tile);
    const id = lines[0].split(' ')[1].slice(0, -1);
    lines.splice(0, 1);
    edges.set(id, getEdges(lines));
  });

  const tileIds = Array.from(edges.keys());

  // Create a map with key = tile number and value = array of possible neigbors
  const neighbors = new Map();
  edges.forEach((allEdges, id) => {
    const toCheck = tileIds.filter(nr => nr !== id);
    const matches = [];
    toCheck.forEach(nr => {
      const otherEdges = edges.get(nr);
      if (intersection(allEdges, otherEdges).length > 0) {
        matches.push(nr);
      }
    });
    neighbors.set(id, matches);
  });

  // Extract the corner tiles (= tiles with only 2 neighbors)
  const corners = [];
  neighbors.forEach((matches, id) => {
    if (matches.length === 2) {
      corners.push(id);
    }
  });

  return corners.reduce((total, id) => total * +id, 1);
};

const part2 = tiles => {
  return 'not implemented';
};

export const day20 = async () => {
  const input = await getInput(__filename);
  const tiles = splitOnEmptyLine(input);

  printHeader(__filename, 1);
  console.log(part1(tiles));
  printHeader(__filename, 2);
  console.log(part2(tiles));
};
