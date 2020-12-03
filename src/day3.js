import { printHeader, getInput } from './util';

const part1 = (lines, right, down) => {
  const map = lines.map(line => line.split(''));
  const patternWidth = map[0].length - 1;

  let x = 0;
  let trees = 0;

  for (let y = 0; y < map.length; y += down) {
    if (map[y][x % patternWidth] === '#') {
      trees++;
    }
    x += right;
  }
  return trees;
};

const part2 = lines => {
  const slopes = [
    { right: 1, down: 1 },
    { right: 3, down: 1 },
    { right: 5, down: 1 },
    { right: 7, down: 1 },
    { right: 1, down: 2 },
  ];

  return slopes.reduce((total, slope) => total * part1(lines, slope.right, slope.down), 1);
};

export const day3 = async () => {
  const input = await getInput(__filename);
  const lines = input.split('\n');

  printHeader(__filename, 1);
  console.log(part1(lines, 3, 1));
  printHeader(__filename, 2);
  console.log(part2(lines));
};
