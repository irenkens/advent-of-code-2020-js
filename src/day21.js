import { intersection, difference } from 'lodash';
import { getInput, splitOnLineBreak, printHeader } from './util';

const part1 = list => {
  const ingredientsPerFood = [];
  const allergensPerFood = [];

  list.forEach(food => {
    const ingredients = food.split(' (')[0].split(' ');
    const allergens = food.split('contains ')[1].slice(0, -1).split(', ');
    ingredientsPerFood.push(ingredients);
    allergensPerFood.push(allergens);
  });

  const ingredients = new Set(ingredientsPerFood.flat());
  const allergens = new Set(allergensPerFood.flat());
  const contaminated = [];

  allergens.forEach(allergen => {
    const foods = [];
    for (let i = 0; i < allergensPerFood.length; i++) {
      if (allergensPerFood[i].includes(allergen)) {
        foods.push(ingredientsPerFood[i]);
      }
    }

    const risk = intersection(...foods);
    contaminated.push(risk);
  });

  const safe = difference(Array.from(ingredients), contaminated.flat());
  return ingredientsPerFood.flat().filter(ingredient => safe.includes(ingredient)).length;
};

const part2 = list => {
  return 'not implemented';
};

export const day21 = async () => {
  const input = await getInput(__filename);
  const list = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(list));
  printHeader(__filename, 2);
  console.log(part2(list));
};
