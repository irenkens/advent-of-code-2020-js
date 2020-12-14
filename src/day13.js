import { xgcd } from 'mathjs';
import { getInput, splitOnLineBreak, printHeader } from './util';

const part1 = (timestamp, busses) => {
  const inService = busses.filter(bus => bus !== 'x').map(bus => +bus);
  const minutesToArrival = inService.map(bus => bus - (timestamp % bus));
  const busIndex = minutesToArrival.indexOf(Math.min.apply(null, minutesToArrival));

  return inService[busIndex] * minutesToArrival[busIndex];
};

const getA = (a, n) => {
  if (a === n) return 0;

  let posA = a;
  while (posA < 0) {
    posA += n;
  }
  return posA;
};

// Implementation makes use of Chinese Remainder Theorem
const part2 = busses => {
  const nums = busses.filter(bus => bus !== 'x').map(bus => +bus);
  const indices = nums.map(n => busses.indexOf(n.toString()));
  const remainders = nums.map(num => getA(num - indices[nums.indexOf(num)], num));
  const N = nums.reduce((total, n) => total * n, 1);

  let sum = BigInt(0);
  for (let i = 0; i < nums.length; i++) {
    const a = remainders[i];
    const y = N / nums[i];
    const z = xgcd(nums[i], y).get([2]);
    sum += BigInt(BigInt(a) * BigInt(y) * BigInt(z));
  }

  return sum % BigInt(N);
};

export const day13 = async () => {
  const input = await getInput(__filename);
  const lines = splitOnLineBreak(input);
  const timestamp = +lines[0];
  const busses = lines[1].split(',');

  printHeader(__filename, 1);
  console.log(part1(timestamp, busses));
  printHeader(__filename, 2);
  console.log(part2(busses));
};
