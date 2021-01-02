import { getInput, splitOnLineBreak, printHeader } from './util';

const getLoopSize = (key, subjectNumber = 7) => {
  let value = 1;
  let loop = 0;
  while (value !== key) {
    loop++;
    value *= subjectNumber;
    value %= 20201227;
  }
  return loop;
};

const getEncryptionKey = (subjectNumber, loopSize) => {
  let value = 1;
  for (let i = 0; i < loopSize; i++) {
    value *= subjectNumber;
    value %= 20201227;
  }
  return value;
};

const part1 = publicKeys => {
  const cardKey = publicKeys[0];
  const doorKey = publicKeys[1];
  const cardLoop = getLoopSize(+cardKey);

  return getEncryptionKey(doorKey, cardLoop);
};

const part2 = () => {
  return 'DONE!';
};

export const day25 = async () => {
  const input = await getInput(__filename);
  const publicKeys = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(publicKeys));
  printHeader(__filename, 2);
  console.log(part2());
};
