
const typewrite = ["Hello my name is Tommy Hall!", "I am currently a student at UNCC Charlotte focusing on a Bachelors in Computer Science.", "Aside from school I enjoy working on my own personal software projects and tinkering with hardware that I find fascinating."];
const typingSpeed = 50; // in MS
const erasingSpeed = 25;
const delayBetweenTexts = 1250; // Delay between typing and erasing

const waitTime = 15000; // 15 seconds before restarting

let textIndex = 0;
let charIndex = 0;
const typeWriterElement = document.getElementById("typewriterAboutme");

function typeText() {
    if (charIndex < typewrite[textIndex].length) {
        typeWriterElement.textContent += typewrite[textIndex].charAt(charIndex);
        charIndex++
        setTimeout(typeText, typingSpeed);
    } else {
        setTimeout(eraseText, delayBetweenTexts)
    }
}

function eraseText() {
    if (charIndex > 0) {
        typeWriterElement.textContent = typewrite[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseText, erasingSpeed);
    } else {
        textIndex = (textIndex + 1) % typewrite.length;
        setTimeout(typeText, typingSpeed);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    typeText();
});