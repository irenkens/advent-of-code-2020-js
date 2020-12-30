import { concat } from 'lodash';
import { getInput, splitOnLineBreak, printHeader } from './util';

const getDirections = line => {
  const directions = [];
  for (let i = 0; i < line.length; i++) {
    const letter = line[i];
    if (letter === 'w' || letter === 'e') {
      directions.push(letter);
    } else {
      const nextLetter = line[i + 1];
      directions.push(`${letter}${nextLetter}`);
      i++;
    }
  }
  return directions;
};

// TODO: refactor
const cleanDirections = directions => {
  const countW = directions.filter(d => d === 'w').length;
  const countE = directions.filter(d => d === 'e').length;
  const countSw = directions.filter(d => d === 'sw').length;
  const countNe = directions.filter(d => d === 'ne').length;
  const countSe = directions.filter(d => d === 'se').length;
  const countNw = directions.filter(d => d === 'nw').length;

  // the following doubles cancel each other out:
  // e + w, sw + ne, se + nw
  const removeWE = Math.min(countW, countE);
  const removeSwNe = Math.min(countSw, countNe);
  const removeSeNw = Math.min(countSe, countNw);

  const actualW = countW - removeWE;
  const actualE = countE - removeWE;
  const actualSw = countSw - removeSwNe;
  const actualNe = countNe - removeSwNe;
  const actualSe = countSe - removeSeNw;
  const actualNw = countNw - removeSeNw;

  // the following triples cancel each other out:
  // w + ne + se, e + nw + sw
  const removeTripleE = Math.min(actualE, actualNw, actualSw);
  const removeTripleW = Math.min(actualW, actualNe, actualSe);

  let numberW = countW - removeWE - removeTripleW;
  let numberE = countE - removeWE - removeTripleE;
  let numberSw = countSw - removeSwNe - removeTripleE;
  let numberNe = countNe - removeSwNe - removeTripleW;
  let numberSe = countSe - removeSeNw - removeTripleW;
  let numberNw = countNw - removeSeNw - removeTripleE;

  // the following doubles can be replaced with a single direction:
  // w + se = sw
  // e + sw = se
  // w + ne = nw
  // e + nw = ne
  // nw + sw = w
  // ne + se = e
  const replaceWSe = Math.min(numberW, numberSe);
  const replaceESw = Math.min(numberE, numberSw);
  const replaceWNe = Math.min(numberW, numberNe);
  const replaceENw = Math.min(numberE, numberNw);
  const replaceNwSw = Math.min(numberNw, numberSw);
  const replaceNeSe = Math.min(numberNe, numberSe);

  if (replaceWSe > 0) {
    numberW -= replaceWSe;
    numberSe -= replaceWSe;
    numberSw += replaceWSe;
  }

  if (replaceESw > 0) {
    numberE -= replaceESw;
    numberSw -= replaceESw;
    numberSe += replaceESw;
  }

  if (replaceWNe > 0) {
    numberW -= replaceWNe;
    numberNe -= replaceWNe;
    numberNw += replaceWNe;
  }

  if (replaceENw > 0) {
    numberE -= replaceENw;
    numberNw -= replaceENw;
    numberNe += replaceENw;
  }

  if (replaceNwSw > 0) {
    numberNw -= replaceNwSw;
    numberSw -= replaceNwSw;
    numberW += replaceNwSw;
  }

  if (replaceNeSe > 0) {
    numberNe -= replaceNeSe;
    numberSe -= replaceNeSe;
    numberE += replaceNeSe;
  }

  const realW = Array(numberW).fill('w');
  const realE = Array(numberE).fill('e');
  const realSw = Array(numberSw).fill('sw');
  const realNe = Array(numberNe).fill('ne');
  const realSe = Array(numberSe).fill('se');
  const realNw = Array(numberNw).fill('nw');

  return concat(...realW, ...realE, ...realSw, ...realNe, ...realSe, ...realNw);
};

const part1 = list => {
  const cleaned = [];
  for (let i = 0; i < list.length; i++) {
    const directions = getDirections(list[i]);
    const clean = cleanDirections(directions);
    cleaned.push(clean);
  }
  const cleanSorted = cleaned.map(c => c.sort().reduce((total, r) => `${total}${r}`, ''));
  const map = {};
  cleanSorted.forEach(clean => {
    const current = map[clean];
    map[clean] = current ? current + 1 : 1;
  });

  return Object.values(map).filter(v => v % 2 !== 0).length;
};

const part2 = directions => {
  return 'not implemented';
};

export const day24 = async () => {
  const input = await getInput(__filename);
  const list = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(list));
  printHeader(__filename, 2);
  console.log(part2(list));
};
