import { intersection } from 'lodash';
import { getInput, splitOnLineBreak, splitOnEmptyLine, printHeader } from './util';

const getVars = rule => {
  const split = rule.split(': ');
  const number = split[0];
  const combo = split[1];
  const dependencies = split[1].split(' ').filter(n => n !== '|');
  return { number, combo, dependencies };
};

const getMapping = rules => {
  const mapping = new Map();
  const startRules = rules.filter(rule => rule.includes('"'));
  startRules.forEach(rule => {
    const split = rule.split(':');
    const number = split[0];
    const char = split[1].split('"')[1];
    mapping.set(number, [char]);
  });

  while (mapping.size !== rules.length) {
    const remaining = rules.filter(rule => {
      const number = rule.split(':')[0];
      return !mapping.has(number);
    });

    remaining.forEach(rule => {
      const { number, combo, dependencies } = getVars(rule);

      if (dependencies.every(d => mapping.has(d))) {
        const split = combo.split(' | ');
        const options = [];
        split.forEach(option => {
          const part = option.split(' ');
          if (part.length === 1) {
            mapping.get(part[0]).forEach(s => {
              options.push(s);
            });
          } else if (part.length === 2) {
            mapping.get(part[0]).forEach(s => {
              mapping.get(part[1]).forEach(s2 => {
                options.push(s + s2);
              });
            });
          }
        });
        mapping.set(number, options);
      }
    });
  }
  return mapping;
};

const part1 = (mapping, messages) => {
  const mapZero = mapping.get('0');
  return intersection(mapZero, messages).length;
};

const part2 = (mapping, messages) => {
  const options42 = mapping.get('42');
  const options31 = mapping.get('31');

  // The new rules are:
  // 0: 8 11
  // 8: 42 | 42 8
  // 11: 42 31 | 42 11 31
  //
  // The general sequence is: 42 42 ... ... 31 meaning that the message starts with a
  // bunch of 42's and ends with a bunch of 31's. The message must start with at least
  // 2x 42 and end with at least 1x 31. Because of rule 11 it must be that for n sequences
  // of 31, there must be at least n+1 sequences of 42.
  //
  // The sequence options for 42 and 31 are both 8 letters long, so the length of every
  // valid message should be a multiple of 8.
  const candidates = messages.filter(m => m.length % 8 === 0);

  const ok = candidates.filter(c => {
    const split = c.match(/.{8}/g);
    const startOk = options42.includes(split[0]) && options42.includes(split[1]);
    const endOk = options31.includes(split[split.length - 1]);
    if (!startOk || !endOk) return false;
    const remaining = split.splice(2, split.length - 3);
    if (remaining.length === 0) return true;
    let mustBe31 = false;
    let nrOf31 = 1;
    for (let i = 0; i < remaining.length; i++) {
      const in42 = options42.includes(remaining[i]);
      const in31 = options31.includes(remaining[i]);
      if (!in42 && !in31) return false;

      if (mustBe31 && in42) return false;

      if (in31) {
        nrOf31++;
        mustBe31 = true;
      }
    }
    const nrOf42 = (c.length / 8) - nrOf31;
    return nrOf42 >= nrOf31 + 1;
  });
  return ok.length;
};

export const day19 = async () => {
  const input = await getInput(__filename);
  const split = splitOnEmptyLine(input);
  const rules = splitOnLineBreak(split[0]);
  const messages = splitOnLineBreak(split[1]);
  const mapping = getMapping(rules);

  printHeader(__filename, 1);
  console.log(part1(mapping, messages));
  printHeader(__filename, 2);
  console.log(part2(mapping, messages));
};
