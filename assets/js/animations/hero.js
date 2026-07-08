document.addEventListener("CMSContentReady", () => {
document.addEventListener('DOMContentLoaded', () => {
    const headlineElement = document.getElementById('hero-headline');
    if (!headlineElement) return;

    const text = headlineElement.textContent.trim();
    headlineElement.innerHTML = '';

    const words = text.split(' ');
    words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.whiteSpace = 'nowrap';
        wordSpan.style.display = 'inline-block';

        const chars = word.split('');
        chars.forEach((char) => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            charSpan.classList.add('char');
            wordSpan.appendChild(charSpan);
        });

        headlineElement.appendChild(wordSpan);

        if (wordIndex < words.length - 1) {
            const space = document.createTextNode(' ');
            headlineElement.appendChild(space);
        }
    });

    const charElements = headlineElement.querySelectorAll('.char');
    charElements.forEach((char, index) => {
        setTimeout(() => {
            char.classList.add('reveal');
        }, index * 40);
    });

    const subheadline = document.querySelector('.hero-subheadline');
    const ctaGroup = document.querySelector('.hero-cta-group');

    if (subheadline) {
        setTimeout(() => {
            subheadline.classList.add('reveal');
        }, charElements.length * 40 + 200);
    }

    if (ctaGroup) {
        setTimeout(() => {
            ctaGroup.classList.add('reveal');
        }, charElements.length * 40 + 400);
    }
});
});