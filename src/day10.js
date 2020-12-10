import { getInput, splitOnLineBreak, printHeader } from './util';

const part1 = adapters => {
  let ones = 0;
  let threes = 0;
  for (let i = 1; i < adapters.length; i++) {
    const difference = adapters[i] - adapters[i - 1];
    ones += difference === 1 ? 1 : 0;
    threes += difference === 3 ? 1 : 0;
  }

  return ones * threes;
};

const part2 = () => {
  return 'not implemented';
};

export const day10 = async () => {
  const input = await getInput(__filename);
  const adapters = splitOnLineBreak(input).map(n => +n);
  adapters.push(0);
  adapters.sort((a, b) => a - b);
  adapters.push(adapters[adapters.length - 1] + 3);

  printHeader(__filename, 1);
  console.log(part1(adapters));
  printHeader(__filename, 2);
  console.log(part2(adapters));
};
