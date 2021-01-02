import { intersection, difference } from 'lodash';
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

// Create a map with key = tile number and value = array of possible edges
const getTileEdges = tiles => {
  const edges = new Map();

  tiles.forEach(tile => {
    const lines = splitOnLineBreak(tile);
    const id = lines[0].split(' ')[1].slice(0, -1);
    lines.splice(0, 1);
    edges.set(id, getEdges(lines));
  });

  return edges;
};

// Create a map with key = tile number and value = array of possible neigbors
const getNeighbors = tileEdges => {
  const tileIds = Array.from(tileEdges.keys());
  const neighbors = new Map();

  tileEdges.forEach((allEdges, id) => {
    const toCheck = tileIds.filter(nr => nr !== id);
    const matches = [];
    toCheck.forEach(nr => {
      const otherEdges = tileEdges.get(nr);
      if (intersection(allEdges, otherEdges).length > 0) {
        matches.push(nr);
      }
    });
    neighbors.set(id, matches);
  });

  return neighbors;
};

// Extract the corner tiles (= tiles with only 2 neighbors)
const getCorners = neighbors => {
  const corners = [];

  neighbors.forEach((matches, id) => {
    if (matches.length === 2) {
      corners.push(id);
    }
  });

  return corners;
};

const part1 = tiles => {
  const edges = getTileEdges(tiles);
  const neighbors = getNeighbors(edges);
  const corners = getCorners(neighbors);

  return corners.reduce((total, id) => total * +id, 1);
};

const getMatchingEdge = (tileOneEdges, tileTwoEdges) => {
  return intersection(tileOneEdges, tileTwoEdges);
};

const rotateRight = tile => {
  const width = tile[0].length;
  const rotated = [];
  for (let i = 0; i < width; i++) {
    const row = tile.reduce((line, tileRow) => `${tileRow[i]}${line}`, '');
    rotated[i] = row;
  }

  return rotated;
};

const flip = tile => {
  return tile.map(line => reverseString(line));
};

const getAllConfigurations = tile => {
  const all = [[...tile], flip(tile)];

  let originalRotate = [...tile];
  for (let i = 0; i < 3; i++) {
    originalRotate = rotateRight(originalRotate);
    all.push(originalRotate);
  }

  let flippedRotate = flip(tile);
  for (let i = 0; i < 3; i++) {
    flippedRotate = rotateRight(flippedRotate);
    all.push(flippedRotate);
  }

  return all;
};

const getTileConfigurations = tiles => {
  const configurations = new Map();

  tiles.forEach(tile => {
    const lines = splitOnLineBreak(tile);
    const id = lines[0].split(' ')[1].slice(0, -1);
    lines.splice(0, 1);
    configurations.set(id, getAllConfigurations(lines));
  });
  return configurations;
};

const getRightEdge = tile => {
  return tile.reduce((line, tileRow) => `${line}${tileRow[tileRow.length - 1]}`, '');
};

const getLeftEdge = tile => {
  return tile.reduce((line, tileRow) => `${line}${tileRow[0]}`, '');
};

const getBottomEdge = tile => {
  return tile[tile.length - 1];
};

const getTopEdge = tile => {
  return tile[0];
};

const getTileSize = tiles => {
  const lines = splitOnLineBreak(tiles[0]);
  return lines[1].length;
};

const getGridSize = tiles => {
  return Math.sqrt(tiles.length);
};

const getStartGrid = tiles => {
  const gridSize = getGridSize(tiles);
  const tileSize = getTileSize(tiles);

  return Array(gridSize * tileSize).fill('');
};

const removeBorders = (image, tileSize) => {
  const newImage = [];

  for (let i = 0; i < image.length; i++) {
    // Remove horizontal borders
    if (i % tileSize !== 0 && i % tileSize !== tileSize - 1) {
      let str = '';
      const line = image[i];
      for (let k = 0; k < line.length; k++) {
        // Remove vertical borders
        if (k % tileSize !== 0 && k % tileSize !== tileSize - 1) {
          str += line[k];
        }
      }
      newImage.push(str);
    }
  }
  return newImage;
};

const part2 = tiles => {
  const tileConfigurations = getTileConfigurations(tiles);
  const tileEdges = getTileEdges(tiles);
  const tileNeighbors = getNeighbors(tileEdges);
  const corners = getCorners(tileNeighbors);

  // Create empty grid
  const MAX = getGridSize(tiles);
  const grid = [];
  for (let i = 0; i < MAX; i++) {
    grid[i] = [];
    for (let k = 0; k < MAX; k++) {
      grid[i][k] = '';
    }
  }
  const topLeftCorner = corners[0];
  const belowTopLeftCorner = tileNeighbors.get(topLeftCorner)[0];
  const rightTopLeftCorner = tileNeighbors.get(topLeftCorner)[1];

  // Fill the grid with the tile numbers
  grid[0][0] = topLeftCorner;
  grid[0][1] = belowTopLeftCorner;
  grid[1][0] = rightTopLeftCorner;

  for (let i = 0; i < MAX - 1; i++) {
    for (let k = 0; k < MAX; k++) {
      if (i === 0 && k > 0 && k < MAX - 1) {
        const me = grid[i][k];
        const neighbors = tileNeighbors.get(me);
        const possible = difference(neighbors, grid.flat());
        const right = possible.filter(id => tileNeighbors.get(id).length !== 4)[0];
        const bottom = possible.filter(id => id !== right)[0];

        grid[0][k + 1] = right;
        grid[1][k] = bottom;

        if (k === MAX - 2) {
          const belowTopRightCorner = difference(tileNeighbors.get(right), grid.flat())[0];
          grid[1][k + 1] = belowTopRightCorner;
        }
        continue;
      }

      if (i > 0) {
        const me = grid[i][k];
        const neighbors = tileNeighbors.get(me);
        const belowMe = difference(neighbors, grid.flat())[0];
        grid[i + 1][k] = belowMe;
      }
    }
  }

  const tileSize = getTileSize(tiles);
  const fullGrid = getStartGrid(tiles);

  for (let i = 0; i < MAX; i++) {
    for (let k = 0; k < MAX; k++) {
      // Get the top left corner tile
      if (i === 0 && k === 0) {
        const configs = tileConfigurations.get(grid[i][k]);
        const matchRight = getMatchingEdge(tileEdges.get(grid[i][k]), tileEdges.get(grid[i][k + 1]));
        const matchBottom = getMatchingEdge(tileEdges.get(grid[i][k]), tileEdges.get(grid[i + 1][k]));
        const match = configs.filter(tile => {
          return matchRight.includes(getRightEdge(tile)) && matchBottom.includes(getBottomEdge(tile));
        })[0];
        for (let m = 0; m < match.length; m++) {
          fullGrid[m] = `${fullGrid[m]}${match[m]}`;
        }
        continue;
      }
      // Get the rest of the top row tiles
      if (i === 0) {
        const configs = tileConfigurations.get(grid[i][k]);
        const matchLeft = getMatchingEdge(tileEdges.get(grid[i][k]), tileEdges.get(grid[i][k - 1]));
        const matchBottom = getMatchingEdge(tileEdges.get(grid[i][k]), tileEdges.get(grid[i + 1][k]));
        const match = configs.filter(tile => {
          return matchLeft.includes(getLeftEdge(tile)) && matchBottom.includes(getBottomEdge(tile));
        })[0];
        for (let m = 0; m < match.length; m++) {
          fullGrid[m] = `${fullGrid[m]}${match[m]}`;
        }
        continue;
      }
      // Get the left edge tiles
      if (i > 0 && k === 0) {
        const configs = tileConfigurations.get(grid[i][k]);
        const matchTop = getMatchingEdge(tileEdges.get(grid[i][k]), tileEdges.get(grid[i - 1][k]));
        const matchRight = getMatchingEdge(tileEdges.get(grid[i][k]), tileEdges.get(grid[i][k + 1]));

        const match = configs.filter(tile => {
          return matchTop.includes(getTopEdge(tile)) && matchRight.includes(getRightEdge(tile));
        })[0];

        for (let m = 0; m < match.length; m++) {
          fullGrid[tileSize * i + m] = `${fullGrid[tileSize * i + m]}${match[m]}`;
        }
        continue;
      }
      // Get all other tiles
      if (i > 0) {
        const configs = tileConfigurations.get(grid[i][k]);
        const matchTop = getMatchingEdge(tileEdges.get(grid[i][k]), tileEdges.get(grid[i - 1][k]));
        const matchLeft = getMatchingEdge(tileEdges.get(grid[i][k]), tileEdges.get(grid[i][k - 1]));

        const match = configs.filter(tile => {
          return matchTop.includes(getTopEdge(tile)) && matchLeft.includes(getLeftEdge(tile));
        })[0];

        for (let m = 0; m < match.length; m++) {
          fullGrid[tileSize * i + m] = `${fullGrid[tileSize * i + m]}${match[m]}`;
        }
      }
    }
  }

  const withoutBorders = removeBorders(fullGrid, tileSize);
  const allConfigs = getAllConfigurations(withoutBorders);

  let withoutMonsters = null;
  const monsterWidth = 20;
  const monsterHeight = 3;

  for (let m = 0; m < allConfigs.length; m++) {
    const config = allConfigs[m];
    withoutMonsters = config.map(c => c.split(''));
    let monsterCount = 0;
    for (let i = 0; i < config.length - monsterHeight; i++) {
      for (let k = 0; k < config[0].length - monsterWidth; k++) {
        if (config[i][k + 18] !== '#') continue;

        if (config[i + 1][k] !== '#') continue;
        if (config[i + 1][k + 5] !== '#') continue;
        if (config[i + 1][k + 6] !== '#') continue;
        if (config[i + 1][k + 11] !== '#') continue;
        if (config[i + 1][k + 12] !== '#') continue;
        if (config[i + 1][k + 17] !== '#') continue;
        if (config[i + 1][k + 18] !== '#') continue;
        if (config[i + 1][k + 19] !== '#') continue;

        if (config[i + 2][k + 1] !== '#') continue;
        if (config[i + 2][k + 4] !== '#') continue;
        if (config[i + 2][k + 7] !== '#') continue;
        if (config[i + 2][k + 10] !== '#') continue;
        if (config[i + 2][k + 13] !== '#') continue;
        if (config[i + 2][k + 16] !== '#') continue;

        monsterCount++;
        withoutMonsters[i][k + 18] = '0';
        withoutMonsters[i + 1][k] = '0';
        withoutMonsters[i + 1][k + 5] = '0';
        withoutMonsters[i + 1][k + 6] = '0';
        withoutMonsters[i + 1][k + 11] = '0';
        withoutMonsters[i + 1][k + 12] = '0';
        withoutMonsters[i + 1][k + 17] = '0';
        withoutMonsters[i + 1][k + 18] = '0';
        withoutMonsters[i + 1][k + 19] = '0';
        withoutMonsters[i + 2][k + 1] = '0';
        withoutMonsters[i + 2][k + 4] = '0';
        withoutMonsters[i + 2][k + 7] = '0';
        withoutMonsters[i + 2][k + 10] = '0';
        withoutMonsters[i + 2][k + 13] = '0';
        withoutMonsters[i + 2][k + 16] = '0';
      }
    }
    if (monsterCount > 0) break;
  }

  return withoutMonsters.flat().filter(x => x === '#').length;
};

export const day20 = async () => {
  const input = await getInput(__filename);
  const tiles = splitOnEmptyLine(input);

  printHeader(__filename, 1);
  console.log(part1(tiles));
  printHeader(__filename, 2);
  console.log(part2(tiles));
};
