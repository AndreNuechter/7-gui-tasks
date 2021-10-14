const gui = document.getElementById('gui');
const celsiusInput = gui.querySelector('[id="celsius"]');
const fahrenheitInput = gui.querySelector('[id="fahrenheit"]');

const values = {
    celsius: {
        value: '0',
        input: celsiusInput,
        sibling: fahrenheitInput,
        conversion: (value) => +value * (9 / 5) + 32
    },
    fahrenheit: {
        value: '0',
        input: fahrenheitInput,
        sibling: celsiusInput,
        conversion: (value) => (+value - 32) * (5 / 9)
    }
};

const isValid = value => /^-?\d*$/.test(value);

[celsiusInput, fahrenheitInput].forEach((i) => i.value = '');

gui.addEventListener('input', ({ target: { id, value } }) => {
    if (isValid(value)) {
        values[id].value = value;
        values[id].sibling.value = values[id].conversion(value);
    } else {
        values[id].input.value = values[id].value;
    }
});