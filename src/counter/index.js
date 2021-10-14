const gui = document.getElementById('gui');
const display = gui.querySelector('input');
const button = gui.querySelector('button');

let count = 0;
display.value = count;

button.addEventListener('click', () => {
    count += 1;
    display.value = count;
});