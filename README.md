# js-is-prime
An outline of how to determine if a number is prime with increasing levels of efficiency.  We'll cover some simple methods first, then move on to some intermediate level methods which are much more optimized. Feel free to also take a look at our [Dev Page](https://bytethisstore.com/articles/pg/js-is-prime) on this topic, where we cover it in a bit more detail.

## Quick Refresher on Primes
Though most people know what prime numbers are, it may be helpful to have a quick refresher. A **prime number** is a number which is not *divisible* by any integer other than itself and 1. The first few prime numbers are: ``[2, 3, 5, 7, 11, 13, 17]``. Any process which checks if any given number is prime or not is called a **primality test**. There are many ways to check if a number is prime, ranging from simple methods to highly sophisticated methods.

## Brute Force
The simplest way to check if a number is prime is to iteratively check every single number from 2 up to the number itself, and for each of those numbers, divide and check if there is a remainder. If any number divides without a remainder, then the input number is not prime. Otherwise, it is prime. This is also known as a **modulus operation**: performing a division-like operation but getting the remainder as a result instead of the entire number. An example implementation is:
```javascript
function isPrime(num) {
    //iterate over all numbers 2<=i<n
    for (let i=2; i<num; i++) {
        //if modulus returns 0, then there is no remainder
        //if no remainder, return false
        if (num % i === 0) {
            return false;
        }
    }

    //if nothing gave a zero remainder, it is a prime
    return true;
}
```
If we take this approach, we'll need to perform one modulus operation for each number ``2 <= i < n``. For smaller numbers, such as numbers less than 100, this approach will not require many steps, but for a number such as 1,123,787,879, it will require over a billion seperate operations. More generically: with this method, to test a number ``n``, we'll need to do roughly ``n`` operations. There are much more efficient ways to test for primality.

## Even Numbers Optimization
We can reduce the number of steps by roughly half by making an observation on the nature of prime numbers; let's review the list of the first few primes again:
* ``[2, 3, 5, 7, 11, 13, 17, 19, 23]``.

Notice that 2 is the only item in that list which is an even number. This yields a fundamental property of prime numbers: **all prime numbers are odd (except 2)**. This is because all even numbers are divisible by 2. With this in mind, we can do a single check out front to see if the number is divisible by 2, or is 2 itself, and only proceed to the iterative logic if the number is not 2 or even:
```javascript
function isPrime(num) {
    //we can handle this as a special base case
    if (num === 2) {
        return true;
    }
    //check if the number is even, return false if it is
    if (num > 2 && num % 2 === 0) {
        return false;
    }

    //iterate over all odd numbers 2<=i<n
    for (let i=3; i<num; i+=2) {
        //if modulus returns 0, then there is no remainder
        //if no remainder, return false
        if (num % i === 0) {
            return false;
        }
    }

    //if nothing gave a zero remainder, it is a prime
    return true;
}
```
With this optimization, we can reduce the number of operations by roughly half by skipping even numbers. With this method, to check if a number ``n`` is prime, we need to do rougly ``1/2 n`` operations.

## Square Root Optimization
If we analyze the relationship between a number and its factors, we will be able to find a optimization which will allow us to significantly reduce the number of modulus operations required. A few non-prime numbers and their factors + factor pairs are listed below:
* **12**: 
    * **Factors:**  ``1, 2, 3, 4, 6, 12``
    * **Pairs:** ``1x12, 2x6, 3x4``
* **24**:
    * **Factors:**  ``1, 2, 3, 4, 6, 8, 12, 24``
    * **Pairs:** ``1x24, 2x12, 3x8, 4x6``
* **38**:
    * **Factors:**  ``1, 2, 19, 38``
    * **Pairs:** ``1x38, 2x19``

Notice that for each pair ``a x b``, ``a <= b``. We could also write the reverse pairs, but those pairs would be redundant. In other words, for each ``a x b`` pair, the pair ``b x a`` also exists. For a concrete example of the number 12: ``1x12 and 12x1, 2x6 and 6x2, 3x4 and 4x3``.

This hints at the fact that there is some type of threshold between 1 and the number we're testing; once we cross that threshold, we'll be performing redundant calculations. For the number 12, that threshold appears to lie somewhere near the number 3 or 4. If we consider the factors of 36, we'll see: ``1x36, 2x18, 3x12, 4x9, and 6x6``, where we have a pair of ``6x6``. 6 is the only number which appears in a single pair twice. Until this point, the values on the left side of the pair have been increasing, and the values on the right side have been decreasing. With 6, they've *met in the middle*, and any pair generated after this will be redundant. Therefore, the **square root** of the number we're testing determines that threshold (even for numbers that are not square, such as 38).

In other words: **we only need to test integers up to the square root** of the number we're testing. Any testing beyond that will be redundant. The code below builds upon our previous examples with this optimization:
```javascript
function isPrime(num) {
    //we can handle this as a special base case
    if (num === 2) {
        return true;
    }
    //check if the number is even, return false if it is
    if (num > 2 && num % 2 === 0) {
        return false;
    }

    //iterate over all odd numbers 2<=i<n
    const numSqrt = Math.sqrt(num);
    for (let i=3; i<=numSqrt; i+=2) {
        //if modulus returns 0, then there is no remainder
        //if no remainder, return false
        if (num % i === 0) {
            return false;
        }
    }

    //if nothing gave a zero remainder, it is a prime
    return true;
}
```
With this optimization, we can reduce the number of modulus calculations by a significant degree. To test if a number ``n`` is prime, we'll need roughly ``1/2 sqrt(n)`` operations. Note that the squre root optimization is much larger than the 1/2 optimization.

## Optimization with Six
A further optimization we can make, without increasing the complexity too much, is to check how the number we're testing relates to the number 6 by performing a modulus operation. Depending upon the modulus value, we can rule out many numbers ahead of time. If we consider the value of any ``n % 6``, we'll get a result of ``0 - 5``:
* **0:** a result of 0 means the number is a multiple of 6, so it is not a prime.
* **1:** the number is odd and not a multiple of 3, **so it is possibly prime.**
* **2:** the number is even, so it is not prime.
* **3:** the number is a multiple of 3, so it is not prime.
* **4:** the number is even, so it is not prime.
* **5:** the number is odd and not a multiple of 3, **so it is possibly prime.**

Based on the analysis above, we can rule out 4 of 6 cases with one single modulus operation; if the modulus yields anything other than 1 or 5, we immediately know the input is not prime. If it does yield 1 or 5, then we can move forward with the code we've previously written. Note that this modulus of 6 check does not conclusively tell us if a number is prime, it only conclusively tells us if a number is not prime within those cases listed above, so we still need to use our logic we've written in previous sections in those cases where the modulus is 1 or 5:
```javascript
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

    //if we get to this point, continue with previous logic ......
}
```
If we want to see how many operations there are total, we need to handle the distinct cases:
* 4/6 of the time, we will perform ``1`` operation.
* 2/6 of the time, we will perform ``1/2 sqrt(n)`` operations.

In the 'worst case' scenario, this will be no more efficient than the previous step, but for 2/3 of all possible inputs, the algorithm will return a response in roughly 1 operation.


## Building a Consecutive List of Primes
If we want to generate a consecutive list of primes, one possible approach would be to iterate over numbers 2 <= limit, check if each n is prime, and add it to some list or set if it is:
```javascript
const primesSet = new Set();
for (let n=2; n<=limit; n++) {
    if (isPrime(n)) {
        primesSet.add(n);
    }
}
```
However, that approach would involve redundant calculations. For any non-prime integer ``a``, ``a x C``, where C is any integer, will also not be prime, so any call to *isPrime* on such a number will be wasted. We can make a more efficient implementation by taking a dynamic programming approach. We'll create a set which, by default, will have the number 2 and all odd numbers <= limit. Then, we'll iteratively remove items by performing multiplications on smaller items.
```javascript
function buildPrimesSet(limit) {
    //start with a set of 2 + odd integers up to limit
    const primeCandidatesSet = new Set();
    primeCandidatesSet.add(2);

    const setLimit = Math.floor(limit / 2) - 1;
    for (let n=1; n<=setLimit; n++) {
        primeCandidatesSet.add(n*2 + 1)
    }

    const limDiv = limit / 2;
    //iterate over numbers 2 <= limit/2
    for (let base=2; base <= limDiv; base ++) {
        let multiple = base*2;
        while (multiple <= limit) {
            primeCandidatesSet.delete(multiple);
            multiple += base;
        }
    }

    return primeCandidatesSet;
}
```
This approach is not optimal for checking if any single number is prime, but is more optimal than using *isPrime* if we want to check mutiple numbers for primality within some number range. With this approach, we can do two things:
1. Get a full list of prime numbers from 1 to some limit.
2. Check if any number up to that limit is prime by checking if it exists within that Set (instead of calling isPrime and performing those calculations).