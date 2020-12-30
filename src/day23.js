import { getInput, printHeader } from './util';

const moveCups = (cups, maxCup = 9) => {
  const currentCup = cups[0];
  const threeCups = cups.splice(1, 3);
  let destinationCup = currentCup === 1 ? maxCup : currentCup - 1;

  while (cups.indexOf(destinationCup) === -1) {
    destinationCup = destinationCup === 1 ? maxCup : destinationCup - 1;
  }

  const sliceIndex = cups.indexOf(destinationCup) + 1;
  const newCups = [...cups.slice(0, sliceIndex), ...threeCups, ...cups.slice(sliceIndex)];

  // shift cups so that the next current cup is at index 0
  return newCups.concat(newCups.splice(0, 1));
};

const part1 = cups => {
  let newCups = [...cups];
  for (let i = 0; i < 100; i++) {
    newCups = moveCups(newCups);
  }

  // shift cups so that cup 1 is at index 0
  const indexOne = newCups.indexOf(1);
  const ordered = newCups.slice(indexOne).concat(newCups.splice(0, indexOne));
  return ordered.reduce((result, cup) => `${result}${cup}`, '').slice(1);
};

const part2 = cups => {
  return 'not implemented';
};

export const day23 = async () => {
  const input = await getInput(__filename);
  const cups = input.split('').map(cup => +cup);

  printHeader(__filename, 1);
  console.log(part1(cups));
  printHeader(__filename, 2);
  console.log(part2(cups));
};
