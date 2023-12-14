function sumOfDivided(array) {
  const res = [];
  console.log(array);

  let biggest = array.reduce((acc, el) => (Math.abs(el) > acc ? Math.abs(el) : acc), 0);

  console.log(biggest);
  const primeArray = [];

  for (let i = 0; i <= biggest; i++) {
    isPrime(i) && primeArray.push(i);
  }

  for (let i = 0; i <= primeArray.length; i++) {
    const sum = array.reduce((acc, el) => (el % primeArray[i] === 0 ? acc + el : acc), null);

    if (sum === null) continue;
    res.push([primeArray[i], sum]);
  }

  return res;
}

function isPrime(number) {
  for (let divider = 2; divider < number; divider++) {
    if (number % divider === 0) return false;
  }
  return number > 1;
}

const inputArray = [
  59, 73, -56, 173, 66, -75, 115, -56, 138, 80, -94, 81, 54, 4, 41, 151, -72, -27, 25, -60, -62,
];

module.exports = { sumOfDivided };

console.log(sumOfDivided(inputArray));
