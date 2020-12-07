import { getInput, splitOnLineBreak, printHeader } from './util';

const getUniqueParentColors = (rules, bagColor) => {
  const parents = rules.filter(rule => !rule.startsWith(bagColor) && rule.indexOf(bagColor) > -1);

  if (parents.length === 0) {
    return [];
  }

  const parentColors = parents.map(parent => parent.split(' ').slice(0, 2).join(' '));

  return new Set(
    [
      ...parentColors,
      ...parentColors.reduce(
        (colors, parent) => [...colors, ...getUniqueParentColors(rules, parent)], [],
      ),
    ],
  );
};

const getNumberOfChildren = child => +child.substr(0, child.indexOf(' '));

const getColor = child => {
  const firstSpace = child.indexOf(' ');
  const lastSpace = child.lastIndexOf(' ');
  return child.substr(firstSpace + 1, lastSpace - 2);
};

const getBagsRequired = (rules, bagColor) => {
  const bagRule = rules.find(r => r.startsWith(bagColor));

  if (bagRule.includes('no other bags')) {
    return 0;
  }

  const children = bagRule.split('contain ')[1].split(', ');

  return children.reduce((total, child) => {
    const color = getColor(child);
    const numChilds = getNumberOfChildren(child);
    return total + numChilds + numChilds * getBagsRequired(rules, color);
  }, 0);
};

const MY_BAG = 'shiny gold';

const part1 = rules => {
  return getUniqueParentColors(rules, MY_BAG).size;
};

const part2 = rules => {
  return getBagsRequired(rules, MY_BAG);
};

export const day7 = async () => {
  const input = await getInput(__filename);
  const rules = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(rules));
  printHeader(__filename, 2);
  console.log(part2(rules));
};
