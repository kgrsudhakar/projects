// str = "sudhakarkamana"
// out= {s:1,u:3,.....}

const str = "sudhakarkamana"

const result = [...str].reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
}, {});

const maxChar = Object.keys(result).reduce((a, b) =>
    result[a] > result[b] ? a : b
);

// console.log(Object.keys(result))

console.log(result)
// { s: 1, u: 2, d: 1, h: 1, a: 4, k: 2, r: 1, m: 1, n: 1 }

console.log({ char: maxChar, count: result[maxChar] })
// { char: 'a', count: 4 }