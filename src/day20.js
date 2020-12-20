import { getInput, splitOnLineBreak, splitOnEmptyLine, printHeader } from './util';

const part1 = tiles => {
  return 'not implemented';
};

const part2 = tiles => {
  return 'not implemented';
};

export const day20 = async () => {
  const input = await getInput(__filename);
  const tiles = splitOnEmptyLine(input);

  printHeader(__filename, 1);
  console.log(part1(tiles));
  printHeader(__filename, 2);
  console.log(part2(tiles));
};
