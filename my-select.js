const currentScript = document.currentScript;
const componentName = currentScript?.dataset?.name || 'my-select';

class MySelect extends HTMLElement {
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;
    #options = [];

    constructor() {
        super();
        console.log('Hello World');
    }

    connectedCallback() {
        this.#createTemplate();
        this.#collectOptions();
        this.#renderOptions();
    }

    #createTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <button class="select-button">Select options...</button>
            <div class="select-popup">
                <input class="select-popup-search" placeholder="Search..." />
                <div class="select-popup-options"></div>
            </div>
        `;

        this.append(template.content.cloneNode(true));

        this.#selectButton = this.querySelector(".select-button");
        this.#selectPopup = this.querySelector(".select-popup");
        this.#selectPopupSearch = this.querySelector(".select-popup-search");
        this.#optionsBox = this.querySelector(".select-popup-options");
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

    disconnectedCallback() {
    }

    adoptedCallback() {
    }

    attributeChangedCallback() {
    }
}

customElements.define(componentName, MySelect);
