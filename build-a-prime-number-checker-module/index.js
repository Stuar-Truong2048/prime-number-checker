function isPrime(num) {
  if (typeof num !== 'number' || num <= 1 || !Number.isInteger(num)) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}

module.exports = { isPrime };
