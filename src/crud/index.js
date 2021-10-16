const gui = document.getElementById('gui');
const filterInput = gui.querySelector('[id="filter-input"]');
const nameForm = gui.querySelector('[id="update-form"]');
const nameInput = gui.querySelector('[id="name-input"]');
const surnameInput = gui.querySelector('[id="surname-input"]');
const listBox = gui.querySelector('[id="list-box"]');
const listBoxItems = gui.getElementsByClassName('list-box__item');
const createButton = gui.querySelector('[id="create-button"]');
const updateButton = gui.querySelector('[id="update-button"]');
const deleteButton = gui.querySelector('[id="delete-button"]');

const persons = JSON.parse(localStorage.getItem('7gui-crud-persons')) || [
    Person('Hans', 'Emil'),
    Person('Max', 'Mustermann'),
    Person('Berta', 'Bertholds')
];
const tempPerson = Person('', '');

const listItemTmpl = Object.assign(document.createElement('li'), {
    className: 'list-box__item'
});

document.addEventListener('DOMContentLoaded', () => {
    [createButton, updateButton, deleteButton].forEach((btn) => btn.disabled = true);
    persons.forEach(person => listBox.append(ListItem(`${person.surname}, ${person.name}`, person.id)));
}, { once: true });

filterInput.addEventListener('input', ({ target: { value } }) => {
    persons.forEach(({ surname }, index) => {
        listBoxItems[index].classList[
            surname.startsWith(value)
                ? 'remove'
                : 'add'
        ]('filtered-out');
    });
});

listBox.addEventListener('click', ({ target }) => {
    [...listBoxItems].forEach(li => li.classList.remove('selected'));
    persons.forEach(p => p.selected = false);

    target = target.closest('.list-box__item');

    if (target) {
        target.classList.add('selected');
        persons.find(({ id }) => id === target.dataset.id).selected = true;
    }

    toggleUpdateButton();
    toggleDeleteButton();
});

nameForm.addEventListener('input', ({ target: { value, name } }) => {
    Object.assign(tempPerson, { [name]: value });
    toggleCreateButton();
    toggleUpdateButton();
});

createButton.addEventListener('click', () => {
    const newPerson = Person(tempPerson.name, tempPerson.surname);
    persons.push(newPerson);
    listBox.append(ListItem(`${newPerson.surname}, ${newPerson.name}`, newPerson.id));
    Object.assign(tempPerson, { name: '', surname: '' });
    [nameInput, surnameInput].forEach(i => i.value = '');
    savePersons();
});

updateButton.addEventListener('click', () => {
    const updated = persons.find(({ selected }) => selected);
    Object.assign(updated, { name: tempPerson.name, surname: tempPerson.surname });
    Object.assign(tempPerson, { name: '', surname: '' });
    document.querySelector(`[data-id="${updated.id}"]`).textContent = `${updated.surname}, ${updated.name}`;
    savePersons();
});

deleteButton.addEventListener('click', () => {
    const deletedId = persons.findIndex(({ selected }) => selected);
    persons.splice(deletedId, 1);
    listBoxItems[deletedId].remove();
    savePersons();
    toggleUpdateButton();
    toggleDeleteButton();
});

function savePersons() {
    localStorage.setItem('7gui-crud-persons', JSON.stringify(persons));
}

function toggleCreateButton() {
    createButton.disabled = !completeNameEntered();
}

function completeNameEntered() {
    return tempPerson.name && tempPerson.surname;
}

function toggleUpdateButton() {
    updateButton.disabled = !completeNameEntered() || !entrySelected();
}

function entrySelected() {
    return persons.find(({ selected }) => selected);
}

function toggleDeleteButton() {
    deleteButton.disabled = !entrySelected();
}

function ListItem(textContent, id) {
    const li = Object.assign(listItemTmpl.cloneNode(true), {
        textContent
    });
    li.dataset.id = id;
    return li;
}

function Person(name, surname) {
    return { name, surname, id: fakeIds(), selected: false };
}

function fakeIds() {
    return Math.random().toString().replace('.', '');
}