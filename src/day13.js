import { getInput, splitOnLineBreak, printHeader } from './util';

const part1 = (timestamp, busses) => {
  const inService = busses.filter(bus => bus !== 'x').map(bus => +bus);
  const minutesToArrival = inService.map(bus => bus - (timestamp % bus));
  const busIndex = minutesToArrival.indexOf(Math.min.apply(null, minutesToArrival));

  return inService[busIndex] * minutesToArrival[busIndex];
};

const part2 = busses => {
  return 'not implemented';
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
