import { getInput, splitOnLineBreak, printHeader } from './util';

const DIRECTION = Object.freeze({
  NORTH: Symbol('north'),
  EAST: Symbol('east'),
  SOUTH: Symbol('south'),
  WEST: Symbol('west'),
});

const DIRECTIONS = [DIRECTION.NORTH, DIRECTION.EAST, DIRECTION.SOUTH, DIRECTION.WEST];

const getValues = instruction => {
  const action = instruction[0];
  const value = +instruction.substr(1);
  return { action, value };
};

const moveShip = (action, value, location, direction) => {
  const { x, y } = location;

  if (action === 'N') return { x, y: y + value };
  if (action === 'S') return { x, y: y - value };
  if (action === 'E') return { x: x + value, y };
  if (action === 'W') return { x: x - value, y };
  if (action === 'F') {
    if (direction === DIRECTION.NORTH) return { x, y: y + value };
    if (direction === DIRECTION.SOUTH) return { x, y: y - value };
    if (direction === DIRECTION.EAST) return { x: x + value, y };
    if (direction === DIRECTION.WEST) return { x: x - value, y };
  }

  return location;
};

const turnShip = (action, value, direction) => {
  const pos = DIRECTIONS.indexOf(direction);

  if (action === 'L') {
    if (value === 90) return DIRECTIONS[(pos + 3) % 4];
    if (value === 180) return DIRECTIONS[(pos + 2) % 4];
    if (value === 270) return DIRECTIONS[(pos + 1) % 4];
  }

  if (action === 'R') {
    if (value === 90) return DIRECTIONS[(pos + 1) % 4];
    if (value === 180) return DIRECTIONS[(pos + 2) % 4];
    if (value === 270) return DIRECTIONS[(pos + 3) % 4];
  }

  return direction;
};

const getManhattanDistance = location => {
  const { x, y } = location;
  return Math.abs(x) + Math.abs(y);
};

const part1 = instructions => {
  let direction = DIRECTION.EAST;
  let location = { x: 0, y: 0 };

  instructions.forEach(instruction => {
    const { action, value } = getValues(instruction);
    if (action === 'L' || action === 'R') {
      direction = turnShip(action, value, direction);
    } else {
      location = moveShip(action, value, location, direction);
    }
  });

  return getManhattanDistance(location);
};

const moveWaypoint = (action, value, waypoint) => {
  const { x, y } = waypoint;
  if (action === 'N') return { x, y: y + value };
  if (action === 'S') return { x, y: y - value };
  if (action === 'E') return { x: x + value, y };
  if (action === 'W') return { x: x - value, y };

  return waypoint;
};

const turnWaypoint = (action, value, waypoint) => {
  const { x, y } = waypoint;
  if (action === 'L') {
    if (value === 90) return { x: -y, y: x };
    if (value === 180) return { x: -x, y: -y };
    if (value === 270) return { x: y, y: -x };
  }
  if (action === 'R') {
    if (value === 90) return { x: y, y: -x };
    if (value === 180) return { x: -x, y: -y };
    if (value === 270) return { x: -y, y: x };
  }
  return waypoint;
};

const moveToWaypoint = (value, waypoint, location) => {
  const { x, y } = location;
  return { x: x + value * waypoint.x, y: y + value * waypoint.y };
};

const part2 = instructions => {
  let location = { x: 0, y: 0 };
  let waypoint = { x: 10, y: 1 };

  instructions.forEach(instruction => {
    const { action, value } = getValues(instruction);
    if (action === 'L' || action === 'R') {
      waypoint = turnWaypoint(action, value, waypoint);
    } else if (action === 'F') {
      location = moveToWaypoint(value, waypoint, location);
    } else {
      waypoint = moveWaypoint(action, value, waypoint);
    }
  });

  return getManhattanDistance(location);
};

export const day12 = async () => {
  const input = await getInput(__filename);
  const instructions = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(instructions));
  printHeader(__filename, 2);
  console.log(part2(instructions));
};
