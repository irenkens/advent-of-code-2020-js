import { intersection } from 'lodash';
import { getInput, splitOnLineBreak, splitOnEmptyLine, printHeader } from './util';

const getVars = rule => {
  const split = rule.split(': ');
  const number = split[0];
  const combo = split[1];
  const dependencies = split[1].split(' ').filter(n => n !== '|');
  return { number, combo, dependencies };
};

const part1 = (rules, messages) => {
  const mapping = {};
  const startRules = rules.filter(rule => rule.includes('"'));
  startRules.forEach(rule => {
    const split = rule.split(':');
    const number = split[0];
    const char = split[1].split('"')[1];
    mapping[number] = [char];
  });

  while (Object.keys(mapping).length !== rules.length) {
    const remaining = rules.filter(rule => {
      const number = rule.split(':')[0];
      return !Object.keys(mapping).includes(number);
    });

    remaining.forEach(rule => {
      const { number, combo, dependencies } = getVars(rule);
      if (dependencies.every(d => Object.keys(mapping).includes(d))) {
        const split = combo.split(' | ');
        const options = [];
        split.forEach(option => {
          const part = option.split(' ');
          if (part.length === 1) {
            mapping[part[0]].forEach(s => {
              options.push(s);
            });
          } else if (part.length === 2) {
            mapping[part[0]].forEach(s => {
              mapping[part[1]].forEach(s2 => {
                options.push(s + s2);
              });
            });
          }
        });
        mapping[number] = options;
      }
    });
  }

  const mapZero = mapping['0'];
  return intersection(mapZero, messages).length;
};

const part2 = (rules, messages) => {
  return 'not implemented';
};

export const day19 = async () => {
  const input = await getInput(__filename);
  const split = splitOnEmptyLine(input);
  const rules = splitOnLineBreak(split[0]);
  const messages = splitOnLineBreak(split[1]);

  printHeader(__filename, 1);
  console.log(part1(rules, messages));
  printHeader(__filename, 2);
  console.log(part2(rules, messages));
};
