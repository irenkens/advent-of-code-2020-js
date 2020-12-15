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
  return { address, value };
};

const part1 = program => {
  let mask = getMask(program[0]);
  const mem = {};
  for (let i = 1; i < program.length; i++) {
    const instruction = program[i];
    if (instruction.startsWith('mask')) {
      mask = getMask(instruction);
    } else {
      const { address, value } = getValues(instruction);
      mem[address] = getMasked(getBinary(value), mask);
    }
  }

  return Object.keys(mem).reduce((sum, key) => sum + mem[key], 0);
};

// generate all possible binary sequences with length n.
// e.g. for n = 2 the return value is [ '00', '01', '10', '11' ]
function generateSequences(n) {
  const sequences = [];
  const maxDecimal = 2 ** n;
  for (let i = 0; i < maxDecimal; i++) {
    sequences.push(i.toString(2).padStart(n, '0'));
  }
  return sequences;
}

const getMaskedWithFloating = (address, mask) => {
  let masked = address.toString(2).padStart(mask.length, '0');
  for (let i = 0; i < mask.length; i++) {
    const bit = mask[i];
    if (bit === '1') {
      masked = masked.substring(0, i) + bit + masked.substring(i + 1);
    }
  }
  return masked;
};

const getAddresses = (address, mask, sequences) => {
  const numFloating = mask.split('X').length - 1;
  const addresses = [];

  for (let i = 0; i < 2 ** numFloating; i++) {
    const sequence = sequences[i];
    let binary = getMaskedWithFloating(+address, mask);
    let countX = 0;
    for (let k = 0; k < mask.length; k++) {
      if (mask[k] === 'X') {
        const bit = sequence.charAt(sequence.length - 1 - countX);
        binary = binary.substring(0, k) + bit + binary.substring(k + 1);
        countX++;
      }
    }
    addresses.push(parseInt(binary, 2));
  }
  return addresses;
};

const part2 = program => {
  const maxFloating = Math.max.apply(null, program.filter(p => p.startsWith('mask')).map(p => getMask(p).split('X').length - 1));
  const sequences = generateSequences(maxFloating);
  const mem = {};
  let mask = getMask(program[0]);

  for (let i = 1; i < program.length; i++) {
    const instruction = program[i];
    if (instruction.startsWith('mask')) {
      mask = getMask(instruction);
    } else {
      const { address, value } = getValues(instruction);
      const memAddresses = getAddresses(address, mask, sequences);
      memAddresses.forEach(a => {
        mem[a] = value;
      });
    }
  }

  return Object.keys(mem).reduce((sum, key) => sum + mem[key], 0);
};

export const day14 = async () => {
  const input = await getInput(__filename);
  const program = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(program));
  printHeader(__filename, 2);
  console.log(part2(program));
};
