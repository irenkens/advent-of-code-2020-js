import { getInput, splitOnLineBreak, printHeader } from './util';

const part1 = expressions => {
  return 'not implemented';
};

const part2 = expressions => {
  return 'not implemented';
};

export const day18 = async () => {
  const input = await getInput(__filename);
  const expressions = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(expressions));
  printHeader(__filename, 2);
  console.log(part2(expressions));
};
