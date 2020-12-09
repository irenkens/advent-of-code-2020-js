import { getInput, splitOnLineBreak, printHeader } from './util';

const canMakeSum = (sum, previousNumbers) => {
  for (let i = 0; i < previousNumbers.length - 1; i++) {
    for (let k = i + 1; k < previousNumbers.length; k++) {
      const first = previousNumbers[i];
      const second = previousNumbers[k];

      if (second + first === sum && second !== first) {
        return true;
      }
    }
  }
  return false;
};

const MAX = 25;

const part1 = numbers => {
  for (let i = MAX; i < numbers.length; i++) {
    const previousNumbers = numbers.slice(i - MAX, i);
    const number = numbers[i];
    if (!canMakeSum(number, previousNumbers)) {
      return number;
    }
  }
  return -1;
};

const part2 = (number, numbers) => {
  for (let rangeStart = 0; rangeStart < numbers.length; rangeStart++) {
    let sum = numbers[rangeStart];
    let rangeEnd;

    for (let k = rangeStart + 1; k < numbers.length; k++) {
      if (sum >= number) {
        rangeEnd = k;
        break;
      }
      sum += numbers[k];
    }

    if (sum === number) {
      const range = numbers.slice(rangeStart, rangeEnd + 1);
      range.sort((a, b) => a - b);
      return range[0] + range[range.length - 1];
    }
  }
  return -1;
};

export const day9 = async () => {
  const input = await getInput(__filename);
  const numbers = splitOnLineBreak(input).map(n => +n);

  printHeader(__filename, 1);
  const answer = part1(numbers);
  console.log(answer);
  printHeader(__filename, 2);
  console.log(part2(answer, numbers));
};
