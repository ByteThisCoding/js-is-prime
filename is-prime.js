/**
 * Check if a number is prime
 * 1. Check if number is a base case
 * 2. If not, check if num is of the form 6n +- 1
 * 3. If it is, then call helper method
 */
function isPrime(num) {
    //handle special base cases
    switch (num) {
        case 1:
            return false;
        case 2:
        case 3:
            return true;
    }

    //primes are never even (except for 2)
    if (num % 2 === 0) {
        return false;
    }

    //determine if num is of the form 6n - 1 or 6n + 1
    const sixMod = num % 6;
    if (sixMod !== 1 && sixMod !== 5) {
        return false;
    }

    return _determineIsPrime(num);
}

/**
 * Helper method to determine if a number is prime
 * If the "isPrime" method is inconclusive, this will be called
 */
function _determineIsPrime(num) {
    //optimize by only searching up to sqrt of num
    const limit = Math.sqrt(num);

    //iterate over numbers
    //return false if any divides
    for (let i=3; i<=limit; i+=2) {
        if (num % i === 0) {
            return false;
        }
    }

    //if nothing was divisible, return true
    return true;
}