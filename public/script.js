
const typewrite = ["Hello my name is Tommy Hall!",
    "I am currently a student at UNCC Charlotte focusing on a Bachelors in Computer Science.",
    "Aside from school I enjoy working on my own personal software projects and tinkering with hardware that I find fascinating."
];
const typingSpeed = 15; // in MS
const erasingSpeed = 25;
const delayBetweenTexts = 1250; // Delay between typing and erasing

let textIndex = 0;
let charIndex = 0;
let count = 0;
const typeWriterElement = document.getElementById("typewriterAboutme");

const width = window.innerWidth;
const height = window.innerHeight;

function typeText() {
    if (charIndex < typewrite[textIndex].length) {
        // Add the next character to the element
        typeWriterElement.textContent += typewrite[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeText, typingSpeed); // Continue typing
    } else {
        // Once the full text is typed, start erasing after a delay
        setTimeout(eraseText, delayBetweenTexts);
    }
}

function eraseText() {
    if (charIndex > 0) {
        // Remove the last character from the element
        typeWriterElement.textContent = typewrite[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseText, erasingSpeed); // Continue erasing
    } else {
        // Move to the next text in the array
        textIndex++;

        if (textIndex < typewrite.length) {
            // Type the next text if there are more in the array
            setTimeout(typeText, typingSpeed);
        } else {
            // Final display: types first text to show permanently
            typeWriterElement.textContent = '';
            final();
        }
    }
}
/**
 * Finally types the first string of the index leaving the client with hello!
 */
let i = 0;
function final() {
    if (i < typewrite[0].length) {
        typeWriterElement.textContent += typewrite[0].charAt(i);
        setTimeout(final, typingSpeed);
        i++;
    }
        
}

// Get the canvas and its context
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas when window size changes
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Array to hold the shapes (particles)
const shapes = [];
const originX = canvas.width / 2;
const originY = canvas.height / 2 + 350;
const slowdownStartTime = 3000; // Time in milliseconds after which to start slowing down

// Generate random shapes (particles)
const numShapes = 22;
for (let i = 0; i < numShapes; i++) {
  shapes.push({
    angle: Math.random() * Math.PI * 2, // Random initial angle
    radius: Math.random() * 500 + 100, // Random initial radius
    size: Math.random() * 20 + 5, // Random radius between 5 and 25
    speedAngle: Math.random() * 0.05 + 0.01, // Random angular speed
    speedRadius: Math.random() * 2 - 1, // Random radial speed (-1 to 1)
    slowdownRate: 0.989999, // Slowdown rate (close to 1 for gradual slowdown)
    color: `hsl(${Math.random() * 360}, 50%, 70%)`,
    isSlowingDown: false, // Flag to indicate whether slowing down has started
  });

  // Start slowing down each shape after a specified time
  setTimeout(() => {
    shapes[i].isSlowingDown = true;
  }, slowdownStartTime);
}

// Function to draw a circle (particle)
function drawCircle(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

// Function to update and draw all shapes (particles)
function animateShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  shapes.forEach(shape => {
    if (shape.isSlowingDown) {
      // Gradually slow down the angular and radial speeds
      shape.speedAngle *= shape.slowdownRate;
      shape.speedRadius *= shape.slowdownRate;

      // Stop reducing speed when it's near zero to avoid jitter
      if (Math.abs(shape.speedAngle) < 0.001) shape.speedAngle = 0;
      if (Math.abs(shape.speedRadius) < 0.001) shape.speedRadius = 0;
    }

    // Update angle for circular motion
    shape.angle += shape.speedAngle;

    // Update radius for inward/outward motion
    shape.radius += shape.speedRadius;

    // Convert polar coordinates to Cartesian coordinates
    const x = originX + shape.radius * Math.cos(shape.angle);
    const y = originY + shape.radius * Math.sin(shape.angle);

    // Draw the circle (particle)
    drawCircle(x, y, shape.size, shape.color);
  });

  requestAnimationFrame(animateShapes); // Request the next frame
}

// Start the animation
animateShapes();




document.addEventListener("DOMContentLoaded", () => {    
    const imageItems = document.querySelectorAll('.working-item');
    const totalItems = imageItems.length;
    let currentIndex = 0;

    function updateDisplay() {
        imageItems.forEach((img, index) => {
            if (index === currentIndex) {
                img.classList.remove('hidden');
            } else {
                img.classList.add('hidden');
            }
        });
    }

    document.getElementById("next").addEventListener('click', () => {
        currentIndex = (currentIndex + 1 + totalItems) % totalItems;
        updateDisplay();
    });

    // Start the animation
    animateShapes();

    updateDisplay();
    typeText();
});