import { getInput, splitOnLineBreak, splitOnEmptyLine, printHeader } from './util';

const getNumbers = field => {
  const split = field.split(' ');
  const rangeOne = split[split.length - 3].split('-').map(n => +n);
  const rangeTwo = split[split.length - 1].split('-').map(n => +n);
  const numbers = [];
  for (let i = rangeOne[0]; i <= rangeOne[1]; i++) {
    numbers.push(i);
  }
  for (let i = rangeTwo[0]; i <= rangeTwo[1]; i++) {
    numbers.push(i);
  }
  return new Set(numbers);
};

const getValidTickets = (tickets, numbers) => {
  const valid = [];
  tickets.forEach(ticket => {
    const nums = ticket.split(',').map(n => +n);
    if (nums.every(n => numbers.has(n))) {
      valid.push(ticket);
    }
  });
  return valid;
};

const part1 = notes => {
  const fields = splitOnLineBreak(notes[0]);
  const tickets = splitOnLineBreak(notes[2]).slice(1);
  const numbers = fields.reduce((all, field) => new Set([...all, ...getNumbers(field)]), []);
  const invalid = [];

  tickets.forEach(ticket => {
    const nums = ticket.split(',').map(n => +n);
    nums.forEach(n => {
      if (!numbers.has(n)) {
        invalid.push(n);
      }
    });
  });

  return invalid.reduce((total, num) => total + num, 0);
};

const part2 = notes => {
  const fields = splitOnLineBreak(notes[0]);
  const tickets = splitOnLineBreak(notes[2]).slice(1);
  const numbers = fields.reduce((all, field) => new Set([...all, ...getNumbers(field)]), []);
  const validTickets = getValidTickets(tickets, numbers);

  return 'not implemented';
};

export const day16 = async () => {
  const input = await getInput(__filename);
  const notes = splitOnEmptyLine(input);

  printHeader(__filename, 1);
  console.log(part1(notes));
  printHeader(__filename, 2);
  console.log(part2(notes));
};
