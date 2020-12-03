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
