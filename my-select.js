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
    }

    connectedCallback() {
        this.attachShadow({mode: "open"});
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

        // MySelect наследник HTMLElement, значит наследует и его методы, в том числе append().
        this.shadowRoot.append(template.content.cloneNode(true));

        this.#selectButton = this.shadowRoot.querySelector(".select-button");
        this.#selectPopup = this.shadowRoot.querySelector(".select-popup");
        this.#selectPopupSearch = this.shadowRoot.querySelector(".select-popup-search");
        this.#optionsBox = this.shadowRoot.querySelector(".select-popup-options");
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

        optionsTemplate.innerHTML = this.#options.map(option => `
            <label class="option" data-value="${option.value}">
                <input type="checkbox" value="${option.value}"/>
                ${option.text}
            </label>
        `).join('');

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
