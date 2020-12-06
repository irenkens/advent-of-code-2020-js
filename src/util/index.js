import { promises as fs } from 'fs';
import path, { resolve } from 'path';

export const getInput = async filename => {
  const file = path.basename(filename).replace('.js', '.txt');
  const inputPath = resolve(__dirname, `../input/${file}`);
  const input = await fs.readFile(inputPath);
  return input.toString('utf-8');
};

export const printHeader = (filename, part, info = '') => {
  const day = path.basename(filename).match(/\d+/)[0];
  console.log(`----- Day ${day} - Part ${part}${info} -----`);
};

export const splitOnWhitespace = str => {
  return str.split(/\s+/);
};

export const splitOnEmptyLine = str => {
  return str.split(/\r?\n\r?\n/);
};

export const splitOnLineBreak = str => {
  return str.split(/\r?\n/);
};

export const removeWhitespace = str => {
  return str.replace(/\s/g, '');
};
