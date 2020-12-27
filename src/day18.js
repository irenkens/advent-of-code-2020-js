import { getInput, splitOnLineBreak, printHeader } from './util';

const getPartialExpression = expression => {
  const split = expression.split('');

  if (split[0] !== '(') return expression;

  let otherBrackets = 0;
  for (let i = 1; i < split.length; i++) {
    if (split[i] === '(') {
      otherBrackets++;
    } else if (split[i] === ')' && otherBrackets > 0) {
      otherBrackets--;
    } else if (split[i] === ')' && otherBrackets === 0) {
      return expression.slice(0, i + 1);
    }
  }

  return expression;
};

const getFirstArgument = expression => {
  if (expression.startsWith('(')) {
    return getPartialExpression(expression);
  }

  return expression.split(' ')[0];
};

const withoutBrackets = expression => {
  return expression.startsWith('(') ? expression.slice(1, expression.length - 1) : expression;
};

const evaluate = (expression, partialResult = null) => {
  if (expression === '') {
    return partialResult;
  }

  if (expression.split(' ').length === 1) {
    return +expression;
  }

  if (partialResult == null) {
    let arg = getFirstArgument(expression);
    const newExpression = expression.substring(1 + arg.length);
    arg = withoutBrackets(arg);
    const value = evaluate(arg);
    return evaluate(newExpression, value);
  }

  const operator = expression[0];
  let arg = getFirstArgument(expression.substring(2));
  const newExpression = expression.substring(3 + arg.length);
  arg = withoutBrackets(arg);
  const value = evaluate(arg);

  // eslint-disable-next-line no-eval
  return evaluate(newExpression, eval(`${partialResult} ${operator} ${value}`));
};

const part1 = expressions => {
  return expressions.reduce((total, expression) => total + evaluate(expression), 0);
};

const getIndexToAddOpeningBracket = (expression, plusIndex) => {
  if (expression[expression.length - 1] !== ')') {
    return plusIndex - 2;
  }

  let otherBrackets = 0;
  for (let i = expression.length - 2; i > -1; i--) {
    if (expression[i] === ')') {
      otherBrackets++;
    } else if (expression[i] === '(' && otherBrackets > 0) {
      otherBrackets--;
    } else if (expression[i] === '(' && otherBrackets === 0) {
      return plusIndex - expression.length + i;
    }
  }

  throw new Error('could not find index');
};

const getIndexToAddClosingBracket = (expression, plusIndex) => {
  if (expression[0] !== '(') {
    return plusIndex + 3;
  }

  let otherBrackets = 0;
  for (let i = 1; i < expression.length; i++) {
    if (expression[i] === '(') {
      otherBrackets++;
    } else if (expression[i] === ')' && otherBrackets > 0) {
      otherBrackets--;
    } else if (expression[i] === ')' && otherBrackets === 0) {
      return plusIndex + 2 + i;
    }
  }

  throw new Error('could not find index');
};

const addBrackets = expression => {
  let withBrackets = expression;
  for (let i = 0; i < withBrackets.length; i++) {
    if (withBrackets[i] === '+') {
      const before = withBrackets.substring(0, i - 1);
      const after = withBrackets.substring(i + 2);

      const openingIndex = getIndexToAddOpeningBracket(before, i);
      const closingIndex = getIndexToAddClosingBracket(after, i);

      withBrackets = `${withBrackets.substring(0, openingIndex)}(${withBrackets.substring(openingIndex, withBrackets.length)}`;
      withBrackets = `${withBrackets.substring(0, closingIndex + 1)})${withBrackets.substring(closingIndex + 1, withBrackets.length)}`;
      i += 2;
    }
  }
  return withBrackets;
};

const part2 = expressions => {
  // eslint-disable-next-line no-eval
  return expressions.reduce((total, expression) => total + eval(addBrackets(expression)), 0);
};

export const day18 = async () => {
  const input = await getInput(__filename);
  const expressions = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(expressions));
  printHeader(__filename, 2);
  console.log(part2(expressions));
};
