const currentScript = document.currentScript;
const componentName = currentScript?.dataset?.name || 'my-select';

class MySelect extends HTMLElement {
    #shadow;
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;
    #options = [];

    constructor() {
        super();
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({mode: "open"});
        this.#createTemplate();
        this.#collectOptions();
        this.#renderOptions();

        this.#selectButton.addEventListener('click', () => {
            this.#openPopup();
        });
    }

    #createTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host {
                    position: relative;
                    display: inline-block;
                    font-family: system-ui, sans-serif;
                    --select-grey-100: #f1f5f9;
                    --select-grey-200: #CBD5E1;
                    --select-grey-300: #94A3B8;
                    --select-grey-400: #345;
                    --select-border: 1px solid var(--select-grey-200, #ccc);
                }

                .select-button {
                    width: 250px;
                    padding: 7px 10px;
                    border: var(--select-border, 1px solid #ccc);
                    border-radius: 4px;
                    background: white;
                    color: var(--select-grey-200, #ccc);
                    cursor: pointer;
                    text-align: left;
                    position: relative;
                }

                .select-button::after {
                    content: "▼";
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 12px;
                    color: var(--select-grey-300, #4e4e4e);
                }

                .select-button:hover {
                    border-color: var(--select-grey-400, #4e4e4e);
                }

                .select-popup {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: var(--select-border, 1px solid #ccc);
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    font-size: 14px;
                    z-index: 1000;
                }

                .select-popup.open {
                    display: block;
                }

                .select-popup-search {
                    width: 100%;
                    padding: 7px 10px;
                    border: var(--select-border, 1px solid #ccc);
                    border-radius: 4px;
                    margin: 0;
                    box-sizing: border-box;
                    outline: none;
                }
                
                .select-popup-search:focus {
                    border-color: var(--select-grey-400, #4e4e4e);
                }

                .select-popup-options {
                    max-height: 200px;
                    overflow-y: auto;
                }

                .option {
                    display: flex;
                    align-items: center;
                    padding: 7px 10px;
                    color: var(--select-grey-400, #4e4e4e);
                    cursor: pointer;
                }

                label.option:hover {
                    background: var(--select-grey-100, #fff);
                }

                .option input[type="checkbox"] {
                    margin-right: 7px;
                }
            </style>

            <button class="select-button">Select options...</button>
            <div class="select-popup">
                <div class="option">
                    <input type="checkbox" value="all"/>
                    <input class="select-popup-search" placeholder="Search..." />    
                </div>

                <div class="select-popup-options"></div>
            </div>
        `;

        this.#shadow.append(template.content.cloneNode(true));

        this.#selectButton = this.#shadow.querySelector(".select-button");
        this.#selectPopup = this.#shadow.querySelector(".select-popup");
        this.#selectPopupSearch = this.#shadow.querySelector(".select-popup-search");
        this.#optionsBox = this.#shadow.querySelector(".select-popup-options");
    }

    #collectOptions() {
        const optionElements = this.querySelectorAll('option');
        this.#options = Array.from(optionElements).map(option => ({
            value: option.value,
            text: option.textContent
        }));
        optionElements.forEach(option => option.remove());
    }

    #renderOptions() {
        if (!this.#optionsBox) return;

        this.#optionsBox.innerHTML = '';

        const optionsTemplate = document.createElement('template');

        const optionsHTML = this.#options.map(option => `
            <label class="option" data-value="${option.value}">
                <input type="checkbox" value="${option.value}"/>
                ${option.text}
            </label>
        `).join('');

        optionsTemplate.innerHTML = optionsHTML;
        this.#optionsBox.append(optionsTemplate.content.cloneNode(true));
    }

    #openPopup() {
        this.#selectPopup.classList.toggle("open");
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }

    attributeChangedCallback() {
    }
}

customElements.define(componentName, MySelect);
