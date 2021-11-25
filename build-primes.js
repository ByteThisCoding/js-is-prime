/**
 * Get a set of all prime numbers up to some limit
 */
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
        //start with the base * 2 and loop, removing numbers as we go
        let multiple = base*2;
        while (multiple <= limit) {
            //since any number generated here is not prime, remove from the set
            primeCandidatesSet.delete(multiple);
            //increment multiple by base
            multiple += base;
        }
    }

    //remaining numbers will be prime
    return primeCandidatesSet;
}