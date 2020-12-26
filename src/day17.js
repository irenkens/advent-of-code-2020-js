import { cloneDeep } from 'lodash';
import { getInput, splitOnLineBreak, printHeader } from './util';

const PATTERN_WIDTH = 8;

const getNeighbors3D = point => {
  const split = point.split(',');
  const p = { x: +split[0], y: +split[1], z: +split[2] };
  const neighbors = [];

  for (let z = p.z - 1; z < p.z + 2; z++) {
    for (let y = p.y - 1; y < p.y + 2; y++) {
      for (let x = p.x - 1; x < p.x + 2; x++) {
        neighbors.push(`${x},${y},${z}`);
      }
    }
  }

  return neighbors.filter(n => n !== `${p.x},${p.y},${p.z}`);
};

const updateState3D = (state, cycle) => {
  const newState = cloneDeep(state);
  for (let z = -cycle; z < cycle + 1; z++) {
    for (let y = -cycle; y < cycle + PATTERN_WIDTH + 1; y++) {
      for (let x = -cycle; x < cycle + PATTERN_WIDTH + 1; x++) {
        const self = `${x},${y},${z}`;
        const neighbors = getNeighbors3D(self);
        const active = neighbors.reduce((total, neighbor) => {
          return state[neighbor] === '#' ? total + 1 : total;
        }, 0);

        const current = state[self];
        if (current === undefined || current === '.') {
          newState[self] = active === 3 ? '#' : '.';
        } else if (current === '#') {
          newState[self] = active === 2 || active === 3 ? '#' : '.';
        }
      }
    }
  }
  return newState;
};

const update3D = (state, currentCycle = 1, maxCycle = 6) => {
  if (currentCycle === maxCycle + 1) {
    return state;
  }
  const newState = updateState3D(state, currentCycle);
  return update3D(newState, currentCycle + 1);
};

const part1 = state => {
  const newState = update3D(state);
  return Object.values(newState).reduce((total, value) => (value === '#' ? total + 1 : total), 0);
};

const getNeighbors4D = point => {
  const split = point.split(',');
  const p = { x: +split[0], y: +split[1], z: +split[2], w: +split[3] };
  const neighbors = [];

  for (let w = p.w - 1; w < p.w + 2; w++) {
    for (let z = p.z - 1; z < p.z + 2; z++) {
      for (let y = p.y - 1; y < p.y + 2; y++) {
        for (let x = p.x - 1; x < p.x + 2; x++) {
          neighbors.push(`${x},${y},${z},${w}`);
        }
      }
    }
  }

  return neighbors.filter(n => n !== `${p.x},${p.y},${p.z},${p.w}`);
};

const updateState4D = (state, cycle) => {
  const newState = cloneDeep(state);
  for (let w = -cycle; w < cycle + 1; w++) {
    for (let z = -cycle; z < cycle + 1; z++) {
      for (let y = -cycle; y < cycle + PATTERN_WIDTH + 1; y++) {
        for (let x = -cycle; x < cycle + PATTERN_WIDTH + 1; x++) {
          const self = `${x},${y},${z},${w}`;
          const neighbors = getNeighbors4D(self);
          const active = neighbors.reduce((total, neighbor) => {
            return state[neighbor] === '#' ? total + 1 : total;
          }, 0);

          const current = state[self];
          if (current === undefined || current === '.') {
            newState[self] = active === 3 ? '#' : '.';
          } else if (current === '#') {
            newState[self] = active === 2 || active === 3 ? '#' : '.';
          }
        }
      }
    }
  }
  return newState;
};

const update4D = (state, currentCycle = 1, maxCycle = 6) => {
  if (currentCycle === maxCycle + 1) {
    return state;
  }
  const newState = updateState4D(state, currentCycle);
  return update4D(newState, currentCycle + 1);
};

const part2 = state => {
  const newState = update4D(state);
  return Object.values(newState).reduce((total, value) => (value === '#' ? total + 1 : total), 0);
};

const getInitialState3D = input => {
  const lines = splitOnLineBreak(input);
  const state = {};
  for (let y = 0; y < lines.length; y++) {
    const split = lines[y].split('');
    for (let x = 0; x < split.length; x++) {
      state[`${x},${y},0`] = split[x];
    }
  }
  return state;
};

const getInitialState4D = input => {
  const lines = splitOnLineBreak(input);
  const state = {};
  for (let y = 0; y < lines.length; y++) {
    const split = lines[y].split('');
    for (let x = 0; x < split.length; x++) {
      state[`${x},${y},0,0`] = split[x];
    }
  }
  return state;
};

export const day17 = async () => {
  const input = await getInput(__filename);
  const state3d = getInitialState3D(input);
  const state4d = getInitialState4D(input);

  printHeader(__filename, 1);
  console.log(part1(state3d));
  printHeader(__filename, 2);
  console.log(part2(state4d));
};
