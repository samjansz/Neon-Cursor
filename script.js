const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const trailLength = 20; // Number of points to create the trail
const trailColor = "176, 38, 255"; // Neon purple
const trail = [];

let mouseTimeout; // To track the inactivity of the mouse
let cursorVisible = false; // To determine if the circle should show at the cursor's last position

// Function to draw the trail and the cursor point
function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.1)"; // Create a fading effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (trail.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);

        // Draw lines connecting the trail points
        for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i].x, trail[i].y);
        }

        const gradient = ctx.createLinearGradient(
            trail[0].x, trail[0].y,
            trail[trail.length - 1].x, trail[trail.length - 1].y
        );

        // Add neon gradient effect
        gradient.addColorStop(0, `rgba(${trailColor}, 1)`);
        gradient.addColorStop(1, `rgba(${trailColor}, 0.5)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
    }

    // Draw a circle at the current cursor position
    if (cursorVisible) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${trailColor}, 1)`; // Bright neon color for the cursor
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    window.requestAnimationFrame(draw);
}

// Function to add trail points
function addTrailPoint(x, y) {
    trail.push({ x, y });
    if (trail.length > trailLength) {
        trail.shift(); // Remove the oldest point to maintain the trail length
    }
}

// Function to clear the trail when the cursor stops
function clearTrail() {
    trail.length = 0; // Clear the trail array
}

// Update cursor position
let mouseX = 0,
    mouseY = 0;
const startDrawing = (e) => {
    const newX = e.clientX;
    const newY = e.clientY;
    addTrailPoint(newX, newY);
    mouseX = newX;
    mouseY = newY;

    // Ensure the cursor point is visible
    cursorVisible = true;

    // Reset the timeout whenever the mouse moves
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
        clearTrail();
        cursorVisible = true; // Keep the circle visible at the last position
    }, 100); // Clear trail after 100ms of inactivity
};

// Event listener for mouse movement
canvas.addEventListener("mousemove", startDrawing);

// Start the animation
window.onload = () => {
    window.requestAnimationFrame(draw);
};
