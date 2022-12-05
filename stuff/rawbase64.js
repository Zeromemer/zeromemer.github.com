const upperLetters = [];
const lowerLetters = [];

for (let i = 65; i <= 90; i++) {
    upperLetters.push(String.fromCharCode(i));
    lowerLetters.push(String.fromCharCode(i ^ 32));
}

const numbers = [];

for (let i = 48; i <= 57; i++) {
    numbers.push(String.fromCharCode(i));
}

const table = [...upperLetters, ...lowerLetters, ...numbers, '+', '/'];

const sextet_mask = 0b111_111;

/**
 * @param {Uint8Array} arr
 * returns {string}
 */
export function uint8ArrayToBase64(arr) {
    const sextets = [];
    
    let offset = 2;
    for (let i = 0; i < arr.length; i++) {
        const mask = sextet_mask << offset;
        const maskFirstHalf = mask >> 8;
        const maskSecondHalf = mask & 0b1111_1111;
        const prev = arr[i - 1] || 0;
        
        const a = (prev & maskFirstHalf) << (8 - offset);
        const b = (arr[i] & maskSecondHalf) >> offset;
        
        sextets.push(a | b);

        offset += 2;
        if (offset > 6) {
            offset = 0;
            i--;
        }
    }
    
    if (offset !== 2) {
        const mask = sextet_mask << offset;
        const maskFirstHalf = mask >> 8;
        
        const a = (arr[arr.length - 1] & maskFirstHalf) << (8 - offset);
        
        sextets.push(a);
    }

    return sextets.map(i => table[i]).join('') + '='.repeat((3 - (offset / 2)) % 3);
}