import { getInput, splitOnLineBreak, splitOnEmptyLine, printHeader } from './util';

const part1 = (rules, messages) => {
  return 'not implemented';
};

const part2 = (rules, messages) => {
  return 'not implemented';
};

export const day19 = async () => {
  const input = await getInput(__filename);
  const split = splitOnLineBreak(input);
  const rules = split[0];
  const messages = split[1];

  printHeader(__filename, 1);
  console.log(part1(rules, messages));
  printHeader(__filename, 2);
  console.log(part2(rules, messages));
};
