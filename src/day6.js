import { intersection } from 'lodash';
import { getInput, removeWhitespace, splitOnLineBreak, splitOnEmptyLine, printHeader } from './util';

const getQuestionsAnswered = group => {
  return removeWhitespace(group).split('');
};

const getUniqueQuestionsAnswered = group => {
  return new Set(getQuestionsAnswered(group)).size;
};

const part1 = groups => {
  return groups.reduce((total, group) => total + getUniqueQuestionsAnswered(group), 0);
};

const part2 = groups => {
  const answersPerGroup = groups.map(group => splitOnLineBreak(group));
  return answersPerGroup.reduce((sum, answers) => {
    const questionsAnsweredPerPerson = answers.map(answer => answer.split(''));
    const questionsAnsweredByAll = intersection(...questionsAnsweredPerPerson);
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
