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

const getGroupsOfThree = numbers => {
  let groups = 0;
  for (let i = 0; i < numbers.length; i += 1) {
    const current = numbers[i];
    const next = numbers[i + 1];
    const nextNext = numbers[i + 2];

    if (current + 1 === next && next + 1 === nextNext) {
      groups++;
      i += 2;
    }
  }
  return groups;
};

const getPossibilities = adapters => {
  const optionalAdapters = [];
  for (let i = 1; i < adapters.length - 1; i++) {
    const previous = adapters[i - 1];
    const next = adapters[i + 1];
    if (next - previous <= 3) {
      optionalAdapters.push(adapters[i]);
    }
  }

  const numOptional = optionalAdapters.length;
  /*  There are [numOptional] optional adapters. So the number of possible sequences would normally
      be 2^[numOptional]. However, if there is any sequence of adapters with three successive
      joltage ratings such as [1,2,3] then we have to use at least one of those adapters, otherwise
      we would end up with an invalid sequence of adapters (joltage difference would be > 3). So for
      any groups of three the number of possibilities is not 2^3 but 2^3 - 1 = 7. Each remaining
      optional adapter has 2 possibilities (either you choose it or not).
  */
  const groupsOfThree = getGroupsOfThree(optionalAdapters);
  const remaining = numOptional - (groupsOfThree * 3);

  return 7 ** groupsOfThree * 2 ** remaining;
};

const part2 = adapters => {
  return getPossibilities(adapters);
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
