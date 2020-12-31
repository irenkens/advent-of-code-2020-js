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

// returns a map where the value of a key is the next number in the sequence.
// e.g. { 1: 5, 2: 9, 5: 7, 7: 2, 9: 1 } = [1, 5, 7, 2, 9]
const createList = cups => {
  const list = new Map();
  for (let i = 0; i < cups.length - 1; i++) {
    const nr = cups[i];
    const next = cups[i + 1];
    list.set(nr, next);
  }
  list.set(cups[cups.length - 1], cups[0]);
  return list;
};

const part2 = cups => {
  const fullCups = [...cups];
  for (let i = cups.length + 1; i < 1000001; i++) {
    fullCups.push(i);
  }

  const list = createList(fullCups);
  let current = fullCups[0];
  const maxCup = 1000000;
  for (let i = 0; i < 10000000; i++) {
    const one = list.get(current);
    const two = list.get(one);
    const three = list.get(two);
    const next = list.get(three);
    let destination = current === 1 ? maxCup : current - 1;

    while (destination === one || destination === two || destination === three) {
      destination = destination === 1 ? maxCup : destination - 1;
    }
    const test = list.get(destination);
    list.set(current, next);
    list.set(destination, one);
    list.set(three, test);
    current = next;
  }

  const one = +list.get(1);
  const two = +list.get(one);

  return one * two;
};

export const day23 = async () => {
  const input = await getInput(__filename);
  const cups = input.split('').map(cup => +cup);

  printHeader(__filename, 1);
  console.log(part1(cups));
  printHeader(__filename, 2);
  console.log(part2(cups));
};
