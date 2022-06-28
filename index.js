const main = document.getElementById('main'); // this is the main container, where the list will be rendered
const generateButton = document.getElementById('generate');
const countElement = document.getElementById('count');
const sortButton = document.getElementById('sort');
const stopButton = document.getElementById('stop-sort');
// const allowSoundButton = document.getElementById('allow-sound');

let rects = []; // this is the array that will hold the rectangles

const TIMEOUT = 1; // this is the time in milliseconds between each swap

function generate(count) {
    clearTimeout(sortState.timeout);
    sortState.timeout = null;

    for (let i = 1; i <= count; i++) {
        const rect = document.createElement('div');;
        rect.classList.add('rect');
        rect.style.height = `${i / count * 100}%`;
    
        rects.push({ element: rect, value: i });
        main.appendChild(rect);
    }
}

generateButton.addEventListener('click', () => {
    // delete all the rectangles in main
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
    rects = [];

    // generate new rectangles
    const count = parseInt(countElement.value);
    generate(count);
    
    console.log(rects);
});

const swapNodes = function (nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    // Move `nodeA` to before the `nodeB`
    nodeB.parentNode.insertBefore(nodeA, nodeB);

    // Move `nodeB` to before the sibling of `nodeA`
    parentA.insertBefore(nodeB, siblingA);
};

async function swap(id1, id2) {
    const temp = rects[id1];
    rects[id1] = rects[id2];
    rects[id2] = temp;

    swapNodes(rects[id1].element, rects[id2].element);
}

const sortState = {
    running: false,
    timeout: null,
    startTime: null,
    endTime: null,
}

stopButton.addEventListener('click', () => {
    clearTimeout(sortState.timeout);
    sortState.timeout = null;
    rects.forEach(rect => {
        rect.element.classList.remove('swap-rect');
    });
});

function runSwapper(generator) {
    if (sortState.timeout) {
        clearTimeout(sortState.timeout);
        sortState.timeout = null;
    }

    sortState.timeout = setTimeout(() => {
        // remove all the "swap-rect" classes from all the rectangles
        rects.forEach(rect => {
            rect.element.classList.remove('swap-rect');
        });
        
        const toSwap = generator.next();
        if (toSwap.done) {
            end = performance.now();
            const date = new Date();
            console.log(`${date.toLocaleString()}: ${end - sortState.startTime}`);
            return;
        }

        if (toSwap.value[0] === toSwap.value[1]) {
            console.log('same');
        }

        // set both rectangles to have the "swap-rect" class
        rects[toSwap.value[0]]?.element.classList.add('swap-rect');
        rects[toSwap.value[1]]?.element.classList.add('swap-rect');
        swap(toSwap.value[0], toSwap.value[1]);
        runSwapper(generator);
    }, TIMEOUT);
}

sortButton.addEventListener('click', () => {
    sortState.startTime = performance.now();
    const alg = algs[document.getElementById('alg').value];
    if (!alg) {
        throw new Error('Invalid algorithm');
    }

    runSwapper(alg());
});

// allowSoundButton.addEventListener('click', () => {
//     context.resume();
// });


const algs = {
    // each function in this object returns a generator that will yield each time a swap is performed



    "shuffle": function* shuffle() {
        for (let i = 0; i < rects.length; i++) {
            // chose a random element rand,
            // so that rand is in the set [i, rectts.length)
            const rand = Math.floor(Math.random() * (rects.length - i)) + i;

            yield [i, rand];
        }
    },
    "invert": function* invert() {
        const half = Math.floor(rects.length / 2);

        for (let i = 0; i < half; i++) {
            yield [i, rects.length - i - 1];
        }
    },
    "bogo": function* bogo() {
        let done = false;

        while (!done) {
            // check if we're already done
            done = true;
            for (let i = 0; i < rects.length - 1; i++) {
                if (rects[i].value > rects[i + 1].value) {
                    done = false;
                    break;
                }
            }

            if (!done) {
                yield* algs.shuffle();
            }
        }
    },
    "bubble": function* bubbleSort() {
        for (let i = 0; i < rects.length; i++) {
            for (let j = 0; j < rects.length - i - 1; j++) {
                if (rects[j].value > rects[j + 1].value) {
                    yield [j, j + 1];
                }
            }
        }
    },
    "insertion": function* insertionSort() {
        for (let i = 1; i < rects.length; i++) {
            let j = i;
            while (j > 0 && rects[j - 1].value > rects[j].value) {
                yield [j, j - 1];
                j--;
            }
        }
    },
    "selection": function* selectionSort() {
        for (let i = 0; i < rects.length; i++) {
            let min = i;
            for (let j = i + 1; j < rects.length; j++) {
                if (rects[j].value < rects[min].value) {
                    min = j;
                }
            }
            yield [i, min];
        }
    },
    "quick": function* quickSort() {
        yield* quickSortHelper(0, rects.length - 1);

        function* quickSortHelper(left, right) {
            if (left >= right) {
                return;
            }

            const pivot = rects[Math.floor((left + right) / 2)].value;
            let i = left;
            let j = right;

            while (i <= j) {
                while (rects[i].value < pivot) {
                    i++;
                }
                while (rects[j].value > pivot) {
                    j--;
                }
                if (i <= j) {
                    if (i !== j) {
                        yield [i, j];
                    }

                    i++;
                    j--;
                }
            }

            yield* quickSortHelper(left, j);
            yield* quickSortHelper(i, right);
        }
    }
}