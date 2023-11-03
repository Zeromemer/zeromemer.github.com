const canvas = document.getElementById('main');
const ctx = canvas.getContext("2d");
const generateButton = document.getElementById('generate');
const countElement = document.getElementById('count');
const sortButton = document.getElementById('sort');
const stopButton = document.getElementById('stop-sort');
const modeButton = document.getElementById('switch-mode');
const sortSelect = document.getElementById('alg');

const normalColor = '#00c3ff';
const swapColor = '#ff0000';

let values = [];
let count = null;

function draw(index) {
    ctx.clearRect(index, 0, 1, count);
    ctx.fillRect(index, count, 1, -values[index]);
}

function swap(a, b) {
    if (a == b) return;
    
    values[a] ^= values[b];
    values[b] ^= values[a];
    values[a] ^= values[b];

    draw(a);
    draw(b);
}

generateButton.addEventListener('click', () => {
    stopSort();
    values = [];
    count = parseInt(countElement.value);
    canvas.width = count;
    canvas.height = count;
    
    ctx.fillStyle = normalColor;
    for (let i = 0; i < count; i++) {
        values.push(i + 1);
        draw(i);
    }
});

let requestedFrame = null;

function stopSort() {
    if (requestedFrame !== null) cancelAnimationFrame(requestedFrame);
    requestedFrame = null;
    ctx.fillStyle = normalColor;
    for (let i = 0; i < count; i++) {
        values.push(i + 1);
        draw(i);
    }
}

sortButton.addEventListener('click', () => {
    stopSort();
    const sort = sorts[sortSelect.value]();
    let lastSwapped = null;
    
    requestedFrame = requestAnimationFrame(function genLoop() {
        const toSwap = sort.next();
        ctx.fillStyle = normalColor;
        if (lastSwapped !== null) {
            draw(lastSwapped[0]);
            draw(lastSwapped[1]);
        }
        if (toSwap.done) {
            ctx.fillStyle = normalColor;
            return;
        }
        ctx.fillStyle = swapColor;
        swap(toSwap.value[0], toSwap.value[1]);
        lastSwapped = toSwap.value;

        requestedFrame = requestAnimationFrame(genLoop);
    });
});

stopButton.addEventListener('click', stopSort);

const sorts = {
    "shuffle": function* shuffle() {
        for (let i = 0; i < count; i++) {
            const rand = Math.floor(Math.random() * (count - i)) + i;

            yield [i, rand];
        }
    },
    "invert": function* invert() {
        const half = Math.floor(count / 2);

        for (let i = 0; i < half; i++) {
            yield [i, count - i - 1];
        }
    },
    "bogo": function* bogo() {
        let done = false;

        while (!done) {
            done = true;
            for (let i = 0; i < count - 1; i++) {
                if (values[i] > values[i + 1]) {
                    done = false;
                    break;
                }
            }

            if (!done) {
                yield* this.shuffle();
            }
        }
    },
    "bubble": function* bubbleSort() {
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count - i - 1; j++) {
                if (values[j] > values[j + 1]) {
                    yield [j, j + 1];
                }
            }
        }
    },
    "insertion": function* insertionSort() {
        for (let i = 1; i < count; i++) {
            let j = i;
            while (j > 0 && values[j - 1] > values[j]) {
                yield [j, j - 1];
                j--;
            }
        }
    },
    "selection": function* selectionSort() {
        for (let i = 0; i < count; i++) {
            let min = i;
            for (let j = i + 1; j < count; j++) {
                if (values[j] < values[min]) {
                    min = j;
                }
            }
            yield [i, min];
        }
    },
    "quick": function* quickSort() {
        yield* quickSortHelper(0, count - 1);

        function* quickSortHelper(left, right) {
            if (left >= right) {
                return;
            }

            const pivot = values[Math.floor((left + right) / 2)];
            let i = left;
            let j = right;

            while (i <= j) {
                while (values[i] < pivot) {
                    i++;
                }
                while (values[j] > pivot) {
                    j--;
                }
                if (i <= j) {
                    yield [i, j];

                    i++;
                    j--;
                }
            }

            yield* quickSortHelper(left, j);
            yield* quickSortHelper(i, right);
        }
    }
};