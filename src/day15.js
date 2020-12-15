import { getInput, printHeader } from './util';

const part1 = numbers => {
  const spoken = [...numbers];

  for (let i = spoken.length - 1; i < 2020; i++) {
    const number = spoken[i];
    const slice = spoken.slice(0, i);
    const next = slice.includes(number) ? i - slice.lastIndexOf(number) : 0;
    spoken.push(next);
  }
  return spoken[2019];
};

// faster than part1 but still kinda slow (~5s)
const part2 = numbers => {
  const spoken = [...numbers];
  const lastIndices = new Map();
  spoken.forEach(num => {
    lastIndices.set(num, spoken.indexOf(num));
  });

  for (let i = spoken.length - 1; i < 30000000; i++) {
    const number = spoken[i];
    const next = lastIndices.has(number) ? i - lastIndices.get(number) : 0;
    spoken.push(next);
    lastIndices.set(number, i);
  }

  return spoken[30000000 - 1];
};

export const day15 = async () => {
  const input = await getInput(__filename);
  const numbers = input.split(',').map(n => +n);

  printHeader(__filename, 1);
  console.log(part1(numbers));
  printHeader(__filename, 2);
  console.log(part2(numbers));
};
