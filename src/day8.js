import { getInput, splitOnLineBreak, printHeader } from './util';

const getValues = instruction => {
  const operation = instruction.substr(0, 3);
  const argument = +(instruction.split(' ')[1]);
  return { operation, argument };
};

const doesTerminate = instructions => {
  let currentIndex = 0;
  const visited = [];

  while (!visited.includes(currentIndex)) {
    if (currentIndex === instructions.length) {
      return true;
    }

    visited.push(currentIndex);
    const instruction = instructions[currentIndex];
    const { operation, argument } = getValues(instruction);

    if (operation === 'acc') {
      currentIndex++;
    } else if (operation === 'jmp') {
      currentIndex += argument;
    } else if (operation === 'nop') {
      currentIndex++;
    }
  }
  return false;
};

const part1 = instructions => {
  let accumulator = 0;
  let currentIndex = 0;
  const visited = [];

  while (!visited.includes(currentIndex) && currentIndex < instructions.length) {
    visited.push(currentIndex);
    const { operation, argument } = getValues(instructions[currentIndex]);

    if (operation === 'acc') {
      accumulator += argument;
      currentIndex++;
    } else if (operation === 'jmp') {
      currentIndex += argument;
    } else if (operation === 'nop') {
      currentIndex++;
    }
  }
  return accumulator;
};

const part2 = instructions => {
  let newInstructions = [...instructions];
  let currentIndex = 0;

  while (!doesTerminate(newInstructions)) {
    const instruction = instructions[currentIndex];
    const { operation, argument } = getValues(instruction);

    newInstructions = [...instructions];
    if (operation === 'jmp') {
      newInstructions[currentIndex] = `nop ${argument}`;
    } else if (operation === 'nop') {
      newInstructions[currentIndex] = `jmp ${argument}`;
    }
    currentIndex++;
  }

  return part1(newInstructions);
};

export const day8 = async () => {
  const input = await getInput(__filename);
  const instructions = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(instructions));
  printHeader(__filename, 2);
  console.log(part2(instructions));
};
