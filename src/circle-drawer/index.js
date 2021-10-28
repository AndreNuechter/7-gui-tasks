const gui = document.getElementById('gui');
const undoButton = gui.querySelector('#undo-button');
const redoButton = gui.querySelector('#redo-button');
const canvas = gui.querySelector('#canvas');
const circles = canvas.getElementsByTagName('circle');
const overlayMenu = gui.querySelector('#overlay-menu');
const overlayMenuItems = gui.querySelector('#overlay-menu-items');
const diameterConfig = gui.querySelector('#diameter-config');
const diameterConfigTargetDisplay = gui.querySelector('#diameter-config-target-display');
const diameterSlider = gui.querySelector('#diameter-slider');

const INITIAL_RADIUS = 10;
const CMDS = {
    ADD_CIRCLE: 'add_circle',
    CHANGE_RADIUS: 'change_radius'
};
const cmdFunctions = {
    [CMDS.ADD_CIRCLE]: addCircle,
    [CMDS.CHANGE_RADIUS]: changeRadius
};
const cmdInversions = {
    [CMDS.ADD_CIRCLE]: removeCircle,
    [CMDS.CHANGE_RADIUS]: changeRadiusBack
};
const history = [];
const future = [];
const circleTmpl = (() => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', INITIAL_RADIUS);
    circle.setAttribute('fill', '#fff');
    circle.setAttribute('stroke', '#000');
    return circle;
})();
const overlayMenuVariants = {
    'diameter-config': diameterConfig
};
const selectedCircle = [];
let previousRadius;

document.addEventListener('DOMContentLoaded', () => {
    diameterSlider.value = INITIAL_RADIUS;
});

document.addEventListener('click', ({ target }) => {
    if (!overlayMenu.contains(target)) {
        closeOverlay();
    }
});

undoButton.addEventListener('click', () => {
    if (history.length === 0) return;
    const action = history.pop();
    future.unshift(action);
    cmdInversions[action[0]](...action.slice(1));
    toggleButtons();
});

redoButton.addEventListener('click', () => {
    if (future.length === 0) return;
    const action = future.shift();
    history.push(action);
    cmdFunctions[action[0]](...action.slice(1));
    toggleButtons();
});

canvas.addEventListener('click', ({ target, currentTarget, x, y }) => {
    selectedCircle.length = 0;
    [...circles].forEach(circle => {
        circle.classList.remove('selected');
        circle.removeEventListener('contextmenu', showOverlay);
    });

    if (target === currentTarget) {
        const [cx, cy] = getSVGCoords(x, y);
        addCircle(cx, cy);
        writeHistory([CMDS.ADD_CIRCLE, cx, cy]);
    } else {
        target.classList.add('selected');
        target.addEventListener('contextmenu', showOverlay);
        previousRadius = target.getAttribute('r');
        selectedCircle.push(target.getAttribute('cx'), target.getAttribute('cy'));
        diameterConfigTargetDisplay.textContent = selectedCircle;
        diameterSlider.value = previousRadius;
    }
});

overlayMenuItems.addEventListener('click', ({ target: { dataset: { variantName } } }) => {
    if (variantName && overlayMenuVariants[variantName]) {
        overlayMenuItems.classList.add('overlayed');
        overlayMenuVariants[variantName].classList.add('active');
    }
});

diameterConfig.addEventListener('input', ({ target: { value } }) => {
    changeRadius(...selectedCircle, value);
});

diameterConfig.addEventListener('change', ({ target: { value: newRadius } }) => {
    writeHistory([CMDS.CHANGE_RADIUS, ...selectedCircle, newRadius, previousRadius]);
});

function writeHistory(action) {
    history.push(action);
    future.length = 0;
    toggleButtons();
}

function toggleButtons() {
    undoButton.disabled = history.length === 0;
    redoButton.disabled = future.length === 0;
}

function showOverlay(event) {
    event.preventDefault();
    gui.style = `--overlay-x: ${event.x}; --overlay-y: ${event.y};`;
    overlayMenu.classList.add('visible');
}

function closeOverlay() {
    overlayMenu.classList.remove('visible');
    overlayMenuItems.classList.remove('overlayed');
    Object.values(overlayMenuVariants).forEach(v => v.classList.remove('active'));
}

function changeRadius(cx, cy, value) {
    getCircle(cx, cy).setAttribute('r', value);
}

function changeRadiusBack(cx, cy, _, value) {
    getCircle(cx, cy).setAttribute('r', value);
}

function addCircle(cx, cy) {
    const circle = circleTmpl.cloneNode(true);
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    canvas.append(circle);
}

function removeCircle(cx, cy) {
    getCircle(cx, cy).remove();
}

function getCircle(cx, cy) {
    return canvas.querySelector(`[cx="${cx}"][cy="${cy}"]`);
}

const svgPoint = canvas.createSVGPoint();
const svgTransform = canvas.getScreenCTM().inverse();
function getSVGCoords(x, y) {
    const { x: svgX, y: svgY } = Object
        .assign(svgPoint, { x, y })
        .matrixTransform(svgTransform);

    return [svgX, svgY];
}