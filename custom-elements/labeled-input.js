customElements.define('labeled-input',
    class extends HTMLElement {
        #value;

        constructor() {
            super();

            const { label = '', name } = this.dataset;
            const style = document.createElement('style');

            style.textContent = `
                label {
                    display: flex;
                    justify-content: space-between;
                }

                label span {
                    padding-right: 8px;
                }
            `;

            this.attachShadow({ mode: 'open' });
            this.name = name;
            this.shadowRoot.innerHTML = `
            <label>
                <span>${label}</span>
                <input>
            </label>`;
            this.shadowRoot.addEventListener('input', ({ target: { value } }) => {
                this.value = value;
            });
            this.shadowRoot.append(style);
        }

        set value(v) {
            this.#value = v;
            this.shadowRoot.querySelector('input').value = v;
        }

        get value() {
            return this.#value;
        }
    }
);