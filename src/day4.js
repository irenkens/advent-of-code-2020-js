import { printHeader, getInput } from './util';

const REQUIRED_FIELDS = Object.freeze([
  'byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid',
]);

const EYE_COLORS = Object.freeze([
  'amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth',
]);

const isValidField = field => {
  const split = field.split(':');
  const key = split[0];
  const value = split[1];

  switch (key) {
    case 'byr':
      return +value >= 1920 && +value <= 2002;
    case 'iyr':
      return +value >= 2010 && +value <= 2020;
    case 'eyr':
      return +value >= 2020 && +value <= 2030;
    case 'hgt': {
      const height = value.slice(0, -2);
      if (value.endsWith('cm')) {
        return +height >= 150 && +height <= 193;
      }
      if (value.endsWith('in')) {
        return +height >= 59 && +height <= 76;
      }
      return false;
    }
    case 'hcl':
      return RegExp(/^#([0-9a-f]{6})$/i).test(value);
    case 'ecl':
      return EYE_COLORS.indexOf(value) > -1;
    case 'pid':
      return RegExp(/^[0-9]{9}$/i).test(value);
    case 'cid':
      return true;
    default:
      return false;
  }
};

const getFields = passport => {
  return passport.split(/\s+/).filter(field => field !== '');
};

const hasRequiredFields = passport => {
  return REQUIRED_FIELDS.every(field => passport.indexOf(`${field}:`) > -1);
};

const validPassport = passport => {
  if (!hasRequiredFields(passport)) {
    return false;
  }
  return getFields(passport).every(field => isValidField(field));
};

const part1 = passports => {
  return passports.reduce((validTotal, passport) => {
    return hasRequiredFields(passport) ? validTotal + 1 : validTotal;
  }, 0);
};

const part2 = passports => {
  return passports.reduce((validTotal, passport) => {
    return validPassport(passport) ? validTotal + 1 : validTotal;
  }, 0);
};

export const day4 = async () => {
  const input = await getInput(__filename);
  const passports = input.split('\n\r');

  printHeader(__filename, 1);
  console.log(part1(passports));
  printHeader(__filename, 2);
  console.log(part2(passports));
};
