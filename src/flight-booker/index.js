const gui = document.getElementById('gui');
const modalitySelect = gui.querySelector('[id="modality"]');
const departureInput = gui.querySelector('[id="departure"]');
const returnInput = gui.querySelector('[id="return"]');
const submitButton = gui.querySelector('button');

const initialModalityValue = 'one-way flight';
const initialDateValue = new Date;

const state = {
    modality: initialModalityValue,
    departure: initialDateValue,
    return: initialDateValue,
    get isOneWay() {
        return this.modality === initialModalityValue;
    }
};

returnInput.disabled = true;
modalitySelect.value = state.modality;
[departureInput, returnInput].forEach((e) => e.valueAsDate = state[e.id]);

gui.addEventListener('change', ({ target: { id, value } }) => {
    state[id] = value;

    const noDepartureDate = state.departure === '';

    if (id === 'modality') {
        returnInput.disabled = state.isOneWay;
        submitButton.disabled = noDepartureDate;
    } else {
        submitButton.disabled = noDepartureDate || !state.isOneWay && !(
            state.return !== ''
            && departureInput.valueAsNumber <= returnInput.valueAsNumber
        );
    }
});

submitButton.addEventListener('click', () => {
    alert(
        `Your flight is on the ${state.departure}.${state.isOneWay
            ? ''
            : ` Your return trip is on the ${state.return}`
        }`);
});