
const typewrite = ["Hello my name is Tommy Hall!",
    "I am currently a student at UNCC Charlotte focusing on a Bachelors in Computer Science.",
    "Aside from school I enjoy working on my own personal software projects and tinkering with hardware that I find fascinating."
];
const typingSpeed = 50; // in MS
const erasingSpeed = 25;
const delayBetweenTexts = 1250; // Delay between typing and erasing

const waitTime = 15000; // 15 seconds before restarting

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

// Array to hold the shapes
const shapes = [];

// Generate random shapes
const numShapes = 22; // Number of shapes to generate
for (let i = 0; i < numShapes; i++) {
  shapes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 40 + 20, // Random size between 20 and 60
    speedX: Math.random() * 0.5 - 0.25, // Random horizontal speed (-0.25 to 0.25)
    speedY: Math.random() * 0.5 - 0.25, // Random vertical speed (-0.25 to 0.25)
    sides: Math.floor(Math.random() * 7) + 2, // Random number of sides (1 to 4)
    color: `hsl(${Math.random() * 20}, 50%, 70%)`, // Random color
  });
}

// Function to draw a polygon
function drawShape(x, y, size, sides, color) {
  const angle = (Math.PI * 2) / sides;
  ctx.beginPath();
  ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

  for (let i = 1; i <= sides; i++) {
    ctx.lineTo(x + size * Math.cos(i * angle), y + size * Math.sin(i * angle));
  }

  ctx.fillStyle = color;
  ctx.fill();
}

// Function to update and draw all shapes
function animateShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  shapes.forEach(shape => {
    // Update shape position
    shape.x += shape.speedX;
    shape.y += shape.speedY;

    // Wrap around edges
    if (shape.x > canvas.width) shape.x = 0;
    if (shape.x < 0) shape.x = canvas.width;
    if (shape.y > canvas.height) shape.y = 0;
    if (shape.y < 0) shape.y = canvas.height;

    // Draw the shape
    drawShape(shape.x, shape.y, shape.size, shape.sides, shape.color);
  });

  requestAnimationFrame(animateShapes); // Request the next frame
}




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