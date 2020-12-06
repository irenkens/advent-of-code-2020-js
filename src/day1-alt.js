import { getInput, splitOnLineBreak, printHeader } from './util';

const part1 = (result, numbers) => {
  for (let i = 0; i < numbers.length - 1; i++) {
    const match = numbers.slice(i + 1, -1).find(n => n === result - numbers[i]);
    if (match) {
      return match * numbers[i];
    }
  }
  return -1;
};

const part2 = (result, numbers) => {
  for (let i = 0; i < numbers.length - 1; i++) {
    const match = part1(result - numbers[i], numbers.slice(i + 1, -1));
    if (match > -1) {
      return match * numbers[i];
    }
  }
  return -1;
};

export const day1Alt = async () => {
  const input = await getInput(__filename.replace('-alt', ''));
  const numbers = splitOnLineBreak(input).map(line => +line);

  printHeader(__filename, 1, ': alt');
  console.log(part1(2020, numbers));
  printHeader(__filename, 2, ': alt');
  console.log(part2(2020, numbers));
};
