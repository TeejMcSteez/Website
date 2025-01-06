
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

const svgs = document.querySelectorAll('#floating-svg svg');
const svg = document.getElementById('floating-svg');
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


function animateSVG() {
     svgs.forEach((pic, index) => {
        pic.style.transform = `translate(${Math.random() * width}px, ${Math.random() * height}px) scale(${Math.random() * 0.5 + 0.5})`; 
    });
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
    animateSVG();
    setInterval(animateSVG, 30000);

    updateDisplay();
    typeText();
});