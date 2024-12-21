const canvas = document.getElementById('canvas');

const ctx = canvas.getContext("2d");
function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
sizeCanvas();
window.onresize = sizeCanvas;

function drawSphere(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
}

const G = 6.67430;

class Body {
    constructor(mass, radius, position = [0, 0], velocity = [0, 0]) {
        this.mass = mass;
        this.radius = radius;
        this.position = position;
        this.velocity = velocity;
    }

    pull(body) {
        const distance = Math.sqrt(Math.pow(this.position[0] - body.position[0], 2) + Math.pow(this.position[1] - body.position[1], 2));
        const force = G * ((this.mass * body.mass) / Math.pow(distance, 2));

        const alpha = Math.atan2(body.position[0] - this.position[0], body.position[1] - this.position[1]);

        const acceleration = force / this.mass;

        this.velocity[0] += acceleration * Math.sin(alpha);
        this.velocity[1] += acceleration * Math.cos(alpha);
    }
}

const bodies = [
    new Body(50, 100, [canvas.width / 2 - 300, canvas.height / 2], [0, .5]),
    new Body(50, 100, [canvas.width / 2 + 300, canvas.height / 2], [0, -.5])
];

setInterval(() => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    for (let i = 0; i < bodies.length; i++) {
        for (let j = 0; j < bodies.length; j++) {
            if (i !== j) {
                bodies[i].pull(bodies[j]);
            }
        } 
    }

    for (const body of bodies) {
        body.position[0] += body.velocity[0];
        body.position[1] += body.velocity[1];
        drawSphere(ctx, body.position[0], body.position[1], body.radius);
    }
}, 50);