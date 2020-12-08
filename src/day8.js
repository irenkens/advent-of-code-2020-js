import { getInput, splitOnLineBreak, printHeader } from './util';

const getValues = instruction => {
  const operation = instruction.substr(0, 3);
  const argument = +(instruction.split(' ')[1]);
  return { operation, argument };
};

const changeOperation = instruction => {
  const { operation } = getValues(instruction);
  return instruction.replace(operation, operation === 'jmp' ? 'nop' : 'jmp');
};

const getNewInstructions = (instructions, index) => {
  const newInstructions = [...instructions];
  newInstructions[index] = changeOperation(instructions[index]);
  return newInstructions;
};

const runInstructions = instructions => {
  let index = 0;
  let accumulator = 0;
  const visited = [];

  while (!visited.includes(index) && index < instructions.length) {
    visited.push(index);
    const { operation, argument } = getValues(instructions[index]);
    accumulator += operation === 'acc' ? argument : 0;
    index += operation === 'jmp' ? argument : 1;
  }
  const terminated = index === instructions.length;
  return { terminated, accumulator };
};

const part1 = instructions => {
  return runInstructions(instructions).accumulator;
};

const part2 = instructions => {
  for (let index = 0; index < instructions.length; index++) {
    const { operation } = getValues(instructions[index]);
    if (operation === 'acc') continue;

    const newInstructions = getNewInstructions(instructions, index);
    const { terminated, accumulator } = runInstructions(newInstructions);
    if (terminated) return accumulator;
  }

  return -1;
};

export const day8 = async () => {
  const input = await getInput(__filename);
  const instructions = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(instructions));
  printHeader(__filename, 2);
  console.log(part2(instructions));
};
