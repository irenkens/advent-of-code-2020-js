import { printHeader, getInput } from './util';

const getLineVars = line => {
  const parts = line.split(' ');
  const nums = parts[0].split('-');
  const min = nums[0];
  const max = nums[1];
  const letter = parts[1][0];
  const sequence = parts[2];

  return { min, max, letter, sequence };
};

const part1 = lines => {
  let validPasswords = 0;
  lines.forEach(line => {
    const { min, max, letter, sequence } = getLineVars(line);
    const regExp = new RegExp(letter, 'g');
    const occurences = (sequence.match(regExp) || []).length;

    if (occurences >= min && occurences <= max) {
      validPasswords++;
    }
  });
  return validPasswords;
};

const part2 = lines => {
  let validPasswords = 0;
  lines.forEach(line => {
    const { min, max, letter, sequence } = getLineVars(line);
    const hasPos1 = sequence[min - 1] === letter;
    const hasPos2 = sequence[max - 1] === letter;

    if ((hasPos1 && !hasPos2) || (!hasPos1 && hasPos2)) {
      validPasswords++;
    }
  });
  return validPasswords;
};

export const day2 = async () => {
  const input = await getInput(__filename);
  const lines = input.split('\n');

  printHeader(__filename, 1);
  console.log(part1(lines));
  printHeader(__filename, 2);
  console.log(part2(lines));
};
