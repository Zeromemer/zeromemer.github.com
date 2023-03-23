const equation = document.getElementById("equation");
const input = document.getElementById("input");
input.focus();

const rand = (min, max) => Math.random() * (max - min) + min;
const rand_int = (min, max) => Math.floor(rand(min, max));

function generateRandomEquation(min, max) {
    const op = rand_int(0, 4);
    const a = rand_int(min, max);
    const b = rand_int(min, max);

    if (op === 0) return ['+', a, b, a + b];
    if (op === 1) return ['*', a, b, a * b];
    if (op === 2) return ['-', a + b, a, b];
    if (op === 3) return ['/', a * b, a, b];
}

let current_equation;

function resetRandomEquation() {
    current_equation = generateRandomEquation(1, 10);
    equation.innerText = `${current_equation[1]} ${current_equation[0]} ${current_equation[2]} =`;
}
resetRandomEquation();

input.addEventListener('input', () => {
    const value = parseInt(input.value);

    if (current_equation[3] === value) {
        resetRandomEquation();
        input.value = '';
    }
})