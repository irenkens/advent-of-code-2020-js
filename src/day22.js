import { isEqual } from 'lodash';
import { getInput, splitOnEmptyLine, splitOnLineBreak, printHeader } from './util';

const getScore = deck => {
  let sum = 0;
  for (let i = 0; i < deck.length; i++) {
    sum += deck[i] * (deck.length - i);
  }
  return sum;
};

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

  return getScore([...deckOne, ...deckTwo]);
};

// Terribly slow solution...
const getWinner = (playerOne, playerTwo) => {
  const deckOne = [...playerOne];
  const deckTwo = [...playerTwo];
  const history = [];

  while (deckOne.length > 0 && deckTwo.length > 0) {
    const loop = history.find(round => {
      return isEqual(round.handOne, deckOne) && isEqual(round.handTwo, deckTwo);
    }) != null;

    if (loop) {
      return { winner: 'playerOne', winningDeck: deckOne };
    }

    history.push({ handOne: [...deckOne], handTwo: [...deckTwo] });
    const cardOne = deckOne.shift();
    const cardTwo = deckTwo.shift();
    if (deckOne.length >= cardOne && deckTwo.length >= cardTwo) {
      const { winner } = getWinner([...deckOne.slice(0, cardOne)], [...deckTwo.slice(0, cardTwo)]);
      if (winner === 'playerOne') {
        deckOne.push(cardOne);
        deckOne.push(cardTwo);
      } else {
        deckTwo.push(cardTwo);
        deckTwo.push(cardOne);
      }
    } else if (cardOne > cardTwo) {
      deckOne.push(cardOne);
      deckOne.push(cardTwo);
    } else {
      deckTwo.push(cardTwo);
      deckTwo.push(cardOne);
    }

    if (isEqual(playerOne, deckOne) && isEqual(playerTwo, deckTwo)) {
      return { winner: 'playerOne', winningDeck: deckOne };
    }
  }

  const winner = deckOne.length === 0 ? 'playerTwo' : 'playerOne';
  const winningDeck = deckOne.length === 0 ? deckTwo : deckOne;
  return { winner, winningDeck };
};

const part2 = (playerOne, playerTwo) => {
  const { winningDeck } = getWinner(playerOne, playerTwo);
  return getScore(winningDeck);
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
