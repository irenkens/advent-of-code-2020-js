import { printHeader, getInput } from './util';

const getPosition = (lower, upper, lowerLetter, upperLetter, sequence) => {
  const range = [lower, upper];
  for (let i = 0; i < sequence.length; i++) {
    const letter = sequence[i];
    const rangeHalf = Math.ceil((range[1] - range[0]) / 2);

    if (letter === lowerLetter) {
      range[1] -= rangeHalf;
    } else if (letter === upperLetter) {
      range[0] += rangeHalf;
    }
  }

  return range[0];
};

const getSeatId = boardingPass => {
  const row = getPosition(0, 127, 'F', 'B', boardingPass.slice(0, 7));
  const column = getPosition(0, 7, 'L', 'R', boardingPass.slice(7, 10));
  return row * 8 + column;
};

const part1 = boardingPasses => {
  const seatIds = boardingPasses.map(boardingPass => getSeatId(boardingPass));
  return Math.max(...seatIds);
};

const part2 = boardingPasses => {
  const seatIds = boardingPasses.map(boardingPass => getSeatId(boardingPass));
  seatIds.sort();
  return seatIds.find(seat => seatIds.indexOf(seat + 1) === -1) + 1;
};

export const day5 = async () => {
  const input = await getInput(__filename);
  const boardingPasses = input.split('\n');

  printHeader(__filename, 1);
  console.log(part1(boardingPasses));
  printHeader(__filename, 2);
  console.log(part2(boardingPasses));
};
