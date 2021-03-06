import { intersection, difference } from 'lodash';
import { getInput, splitOnLineBreak, printHeader } from './util';

const getArrays = list => {
  const ingredientsPerFood = [];
  const allergensPerFood = [];

  list.forEach(food => {
    const ingredients = food.split(' (')[0].split(' ');
    const allergens = food.split('contains ')[1].slice(0, -1).split(', ');
    ingredientsPerFood.push(ingredients);
    allergensPerFood.push(allergens);
  });
  return { ingredientsPerFood, allergensPerFood };
};

const part1 = list => {
  const { ingredientsPerFood, allergensPerFood } = getArrays(list);

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

const findMapping = (allergensPerFood, ingredientsPerFood, allergens, map = {}) => {
  const contaminated = [];
  if (Object.keys(map).length === allergens.length) {
    return map;
  }

  let newIngredientsPerFood = [...ingredientsPerFood];
  const newMap = { ...map };
  allergens.forEach(allergen => {
    const foods = [];
    for (let i = 0; i < allergensPerFood.length; i++) {
      if (allergensPerFood[i].includes(allergen)) {
        foods.push(ingredientsPerFood[i]);
      }
    }

    const risk = intersection(...foods);
    contaminated.push(risk);

    if (risk.length === 1) {
      const match = risk[0];
      newMap[allergen] = match;
      newIngredientsPerFood = [...ingredientsPerFood].map(t => t.filter(f => f !== match));
    }
  });

  return findMapping(allergensPerFood, newIngredientsPerFood, allergens, newMap);
};

const part2 = list => {
  const { ingredientsPerFood, allergensPerFood } = getArrays(list);
  const allergens = Array.from(new Set(allergensPerFood.flat()));
  const map = findMapping(allergensPerFood, ingredientsPerFood, allergens);
  const solution = [];
  allergens.sort().map(allergen => solution.push(map[allergen]));
  return solution.join(',');
};

export const day21 = async () => {
  const input = await getInput(__filename);
  const list = splitOnLineBreak(input);

  printHeader(__filename, 1);
  console.log(part1(list));
  printHeader(__filename, 2);
  console.log(part2(list));
};
