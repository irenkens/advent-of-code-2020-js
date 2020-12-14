import { getInput, splitOnLineBreak, printHeader } from './util';

const getBinary = value => {
  let binary = value.toString(2);
  while (binary.length < 36) {
    binary = `0${binary}`;
  }
  return binary;
};

const getMask = value => {
  return value.substr(7);
};

const getMasked = (binary, mask) => {
  let masked = binary;
  for (let i = 0; i < mask.length; i++) {
    const bit = mask[i];
    if (bit === 'X') continue;
    masked = masked.substring(0, i) + bit + masked.substring(i + 1);
  }
  return parseInt(masked, 2);
};

const getValues = line => {
  const split = line.split(' ');
  const value = +split[2];
  const address = line.match(/\[(.*?)\]/)[1];
  return { address, binary: getBinary(value) };
};

const part1 = program => {
  let mask = getMask(program[0]);
  const mem = {};
  for (let i = 1; i < program.length; i++) {
    const instruction = program[i];
    if (instruction.startsWith('mask')) {
      mask = getMask(instruction);
    } else {
      const { address, binary } = getValues(instruction);
      mem[address] = getMasked(binary, mask);
    }
  }

  return Object.keys(mem).reduce((sum, key) => sum + mem[key], 0);
};

const part2 = program => {
  return 'not implemented';
};

export const day14 = async () => {
  const input = await getInput(__filename);
  const program = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(program));
  printHeader(__filename, 2);
  console.log(part2(program));
};
