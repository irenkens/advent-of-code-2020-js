import { getInput, splitOnLineBreak, printHeader } from './util';

const part1 = initialState => {
  return 'not implemented';
};

const part2 = initialState => {
  return 'not implemented';
};

export const day17 = async () => {
  const input = await getInput(__filename);
  const initialState = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(initialState));
  printHeader(__filename, 2);
  console.log(part2(initialState));
};
