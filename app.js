// Consts
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const canvasSize = 400;
const radius = 200;
const rangeOfTower = 50;
const numberOfTowers = 20;
const precision = 100;

// Canvas
canvas.width = canvasSize;
canvas.height = canvasSize;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Drawing main circle
context.beginPath();
context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
context.stroke();
context.clip();

// Point class
class Point {
    constructor(id, x, y, hz) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.hz = hz;
    }

    draw(color) {
        context.beginPath();
        context.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
    }

    drawRange(color, range) {
        context.beginPath();
        context.arc(this.x, this.y, range, 0, 2 * Math.PI);
        context.strokeStyle = color;
        context.stroke();
        this.draw(color);
    }

    static getDistance(p1, p2) {
        return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    }
}

// Point creating
const points = Array.from({ length: numberOfTowers }, (_, i) => {
    const angle = Math.random() * 2 * Math.PI;
    const innerRadius = Math.random() * radius;
    const x = Math.round((centerX + innerRadius * Math.cos(angle)) * precision) / precision;
    const y = Math.round((centerY + innerRadius * Math.sin(angle)) * precision) / precision;
    const point = new Point(i, x, y, 1);
    point.draw("black");
    return point;
});

// Calculate hz
points.forEach((pointA, i) => {
    points.slice(i + 1).forEach((pointB) => {
        if (Point.getDistance(pointA, pointB) < rangeOfTower && pointA.hz === pointB.hz) {
            pointB.hz++;
        }
    });
});

// Create array of colors
const numOfFrequencies = new Set(points.map(point => point.hz)).size;
const colors = Array.from({ length: numOfFrequencies }, (_, i) =>
    `hsl(${i * 360 / numOfFrequencies}, 100%, 50%)`
);

// Draw range of points
points.forEach((point) => {
    const color = colors[point.hz % numOfFrequencies];
    point.drawRange(color, rangeOfTower);
});

// Click event to show properties of specific point
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    points.some((point) => {
        if (Point.getDistance(point, { x, y }) <= 5) {
            console.log(`Signal tower nr.${point.id} (x:${point.x}, y:${point.y}) hz:${point.hz}`);
            return true;
        }
        return false;
    });
});