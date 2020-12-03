import { printHeader, getInput } from './util';

const part1 = numbers => {
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let k = i + 1; k < numbers.length; k++) {
      if (numbers[i] + numbers[k] === 2020) {
        return numbers[i] * numbers[k];
      }
    }
  }
  return -1;
};

const part2 = numbers => {
  for (let i = 0; i < numbers.length - 2; i++) {
    for (let k = i + 1; k < numbers.length - 1; k++) {
      for (let n = i + 2; n < numbers.length; n++) {
        if (numbers[i] + numbers[k] + numbers[n] === 2020) {
          return numbers[i] * numbers[k] * numbers[n];
        }
      }
    }
  }
  return -1;
};

export const day1 = async () => {
  const input = await getInput(__filename);
  const numbers = input.split('\n').map(line => +line);

  printHeader(__filename, 1);
  console.log(part1(numbers));
  printHeader(__filename, 2);
  console.log(part2(numbers));
};
