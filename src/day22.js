import { getInput, splitOnEmptyLine, splitOnLineBreak, printHeader } from './util';

const part1 = (playerOne, playerTwo) => {
  const deckOne = [...playerOne];
  const deckTwo = [...playerTwo];
  while (deckOne.length > 0 && deckTwo.length > 0) {
    const cardOne = deckOne.shift();
    const cardTwo = deckTwo.shift();

    if (cardOne > cardTwo) {
      deckOne.push(cardOne);
      deckOne.push(cardTwo);
    } else {
      deckTwo.push(cardTwo);
      deckTwo.push(cardOne);
    }
  }

  const resultArray = [...deckOne, ...deckTwo];
  let sum = 0;
  for (let i = 0; i < resultArray.length; i++) {
    sum += resultArray[i] * (resultArray.length - i);
  }
  return sum;
};

const part2 = list => {
  return 'not implemented';
};

export const day22 = async () => {
  const input = await getInput(__filename);
  const players = splitOnEmptyLine(input);
  const playerOne = splitOnLineBreak(players[0]).map(n => +n);
  const playerTwo = splitOnLineBreak(players[1]).map(n => +n);

  playerOne.shift();
  playerTwo.shift();

  printHeader(__filename, 1);
  console.log(part1(playerOne, playerTwo));
  printHeader(__filename, 2);
  console.log(part2(playerOne, playerTwo));
};
