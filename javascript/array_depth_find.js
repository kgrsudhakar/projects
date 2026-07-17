const arr3 = [1, [2, [3, [4]]]];

function findDepth(arr) {
    let depth = 0;
    const queue = [arr]

    while (queue.length) {
        depth++;
        const size = queue.length;
        for (let i = 0; i < size; i++) {
            const current = queue.shift();
            for (const item of current) {
                if (Array.isArray(item)) {
                    queue.push(item)
                }
            }
        }
    }
    return depth;
}

console.log(findDepth(arr3))
// 4

//second way
function findDepthRecursive(arr, depth = 0) {
    let maxDepth = depth;

    for (const item of arr) {
        if (Array.isArray(item)) {
            maxDepth = Math.max(maxDepth, findDepthRecursive(item, depth + 1));
        }
    }

    return maxDepth;
}

console.log(findDepthRecursive(arr3)); // 4
