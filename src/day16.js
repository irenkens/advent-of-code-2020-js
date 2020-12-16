import { getInput, splitOnLineBreak, splitOnEmptyLine, printHeader } from './util';

const getNumbers = rule => {
  const split = rule.split(' ');
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

const part1 = notes => {
  const rules = splitOnLineBreak(notes[0]);
  const tickets = splitOnLineBreak(notes[2]).slice(1);
  const numbers = rules.reduce((all, rule) => new Set([...all, ...getNumbers(rule)]), []);
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

const inRange = (number, rangeOne, rangeTwo) => {
  const inRangeOne = number >= rangeOne[0] && number <= rangeOne[1];
  const inRangeTwo = number >= rangeTwo[0] && number <= rangeTwo[1];
  return inRangeOne || inRangeTwo;
};

const validateRule = (numbers, rule) => {
  const split = rule.split(' ');
  const rangeOne = split[split.length - 3].split('-').map(n => +n);
  const rangeTwo = split[split.length - 1].split('-').map(n => +n);
  return numbers.every(number => inRange(+number, rangeOne, rangeTwo));
};

const getFieldName = field => {
  return field.split(':')[0];
};

const cleanOrder = order => {
  // return when every index has only one field option
  if (Array.from(order.values()).every(f => f.length === 1)) {
    return order;
  }

  order.forEach((value, key) => {
    // only one field option at this index, so remove this field from other indices in the map
    if (value.length === 1) {
      order.forEach((val, k) => {
        if (k !== key) {
          order.set(k, val.filter(v => v !== value[0]));
        }
      });
    }
  });
  return cleanOrder(order);
};

const part2 = notes => {
  const rules = splitOnLineBreak(notes[0]);
  const tickets = splitOnLineBreak(notes[2]).slice(1);
  const numbers = rules.reduce((all, rule) => new Set([...all, ...getNumbers(rule)]), []);
  const validTickets = getValidTickets(tickets, numbers);
  const myTicket = splitOnLineBreak(notes[1])[1].split(',');

  // create a map with all field options per ticket index. E.g. 0 => [ 'class', 'duration' ] means
  // that ticket[0] is either the field 'class' or 'duration'.
  const fieldOrder = new Map();
  for (let i = 0; i < rules.length; i++) {
    const ruleNums = validTickets.map(ticket => ticket.split(',')[i]);
    for (let k = 0; k < rules.length; k++) {
      const rule = rules[k];
      const fieldName = getFieldName(rule);
      if (validateRule(ruleNums, rule)) {
        if (fieldOrder.has(i)) {
          const names = fieldOrder.get(i);
          names.push(fieldName);
          fieldOrder.set(i, names);
        } else {
          fieldOrder.set(i, [fieldName]);
        }
      }
    }
  }

  // make sure each ticket index is linked to only one field
  cleanOrder(fieldOrder);

  let total = 1;
  fieldOrder.forEach((value, key) => {
    if (value[0].startsWith('departure')) {
      total *= +myTicket[key];
    }
  });

  return total;
};

export const day16 = async () => {
  const input = await getInput(__filename);
  const notes = splitOnEmptyLine(input);

  printHeader(__filename, 1);
  console.log(part1(notes));
  printHeader(__filename, 2);
  console.log(part2(notes));
};
