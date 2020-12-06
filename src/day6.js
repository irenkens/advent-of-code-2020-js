import { intersection } from 'lodash';
import { getInput, removeWhitespace, splitOnLineBreak, splitOnEmptyLine, printHeader } from './util';

const getQuestions = group => {
  return removeWhitespace(group).split('');
};

const getUniqueQuestions = group => {
  return new Set(getQuestions(group)).size;
};

const part1 = groups => {
  return groups.reduce((total, group) => total + getUniqueQuestions(group), 0);
};

const part2 = groups => {
  const personsPerGroup = groups.map(group => splitOnLineBreak(group));
  return personsPerGroup.reduce((sum, person) => {
    const questionsPerPerson = person.map(g => g.split(''));
    const questionsAnsweredByAll = intersection(...questionsPerPerson);
    return sum + questionsAnsweredByAll.length;
  }, 0);
};

export const day6 = async () => {
  const input = await getInput(__filename);
  const groups = splitOnEmptyLine(input);

  printHeader(__filename, 1);
  console.log(part1(groups));
  printHeader(__filename, 2);
  console.log(part2(groups));
};
