import { getInput, splitOnLineBreak, printHeader } from './util';

const getUniqueParentColors = (rules, bagColor) => {
  const parents = rules.filter(rule => {
    const split = rule.split(' contain ');
    return split[1].indexOf(bagColor) > -1;
  });

  const parentColors = parents.map(parent => {
    return parent.split(' contain ')[0].replace(/\b bags?\b|/g, '');
  });

  if (parentColors.length === 0) {
    return [];
  }

  return new Set(
    [
      ...parentColors,
      ...parentColors.reduce(
        (sum, parent) => [...sum, ...getUniqueParentColors(rules, parent)], [],
      ),
    ],
  );
};

const getTotalNumberOfChildren = (rules, bagColor) => {
  const rule = rules.find(r => r.startsWith(bagColor));
  const children = rule.split(' contain ')[1].replace('.', '').split(', ');

  if (children.find(child => child === 'no other bags')) {
    return 0;
  }

  const numChildren = children.reduce((total, child) => total + +child.substr(0, child.indexOf(' ')), 0);
  return numChildren + children.reduce(
    (sum, child) => {
      const number = +child.substr(0, child.indexOf(' '));
      const color = child.substr(child.indexOf(' ') + 1).replace(/\b bags?\b|/g, '');
      return sum + number * getTotalNumberOfChildren(rules, color);
    }, 0,
  );
};

const MY_BAG = 'shiny gold';

const part1 = rules => {
  return getUniqueParentColors(rules, MY_BAG).size;
};

const part2 = rules => {
  return getTotalNumberOfChildren(rules, MY_BAG);
};

export const day7 = async () => {
  const input = await getInput(__filename);
  const rules = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(rules));
  printHeader(__filename, 2);
  console.log(part2(rules));
};
