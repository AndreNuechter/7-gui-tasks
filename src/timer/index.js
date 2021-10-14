const gui = document.getElementById('gui');
const durationVizualization = gui.querySelector('#duration-visualization');
const elapsedTimeDisplay = gui.querySelector('#elapsed-time');
const totalTimeDisplay = gui.querySelector('#total-time');
const durationConfig = gui.querySelector('#duration-config');
const resetButton = gui.querySelector('button');

// TODO use raf
const timer = {
    intervalId: null,
    start() {
        this.stop();
        this.intervalId = setInterval(countdown, 100);
    },
    stop() {
        clearInterval(this.intervalId);
    }
};
const duration = {
    total: 0,
    elapsed: 0,
    get onePercent() {
        return this.total * 0.01;
    },
    get remaining() {
        return this.total - this.elapsed;
    },
    get elapsedPercent() {
        return fixPrecision(this.elapsed / this.onePercent);
    }
};

resetButton.addEventListener('click', () => {
    setElapsedValue(0);
    timer.start();
});

durationConfig.addEventListener('input', ({ target: { value } }) => {
    value = Number(value);

    if (duration.total <= value) {
        timer.start();
    } else if (duration.elapsed >= value) {
        timer.stop();
        setElapsedValue(value);
    }

    setTotalValue(value);
});

document.addEventListener('DOMContentLoaded', () => {
    setTotalValue(+durationConfig.value);
    timer.start();
}, { once: true });

function countdown() {
    if (duration.elapsed >= duration.total) {
        timer.stop();
        return;
    }

    setElapsedValue(duration.elapsed + 0.1);
}

function fixPrecision(num) {
    return Number(num.toFixed(1));
}

function setElapsedValue(value) {
    duration.elapsed = fixPrecision(value);
    elapsedTimeDisplay.textContent = `${duration.elapsed}s`;
    setElapsedTimeVisualization();
}

function setTotalValue(value) {
    duration.total = value;
    totalTimeDisplay.textContent = `${duration.total}s`;
    setElapsedTimeVisualization();
}

function setElapsedTimeVisualization() {
    gui.style = `--elapsed-percent: ${duration.elapsedPercent}%`;
}