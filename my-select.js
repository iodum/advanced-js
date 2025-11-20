const selectCurrentScript = document.currentScript;
const selectComponentName = selectCurrentScript?.dataset?.name || 'my-select';

class MySelect extends HTMLElement {
    #shadow;
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;
    #options = [];
    #allCheckbox;
    #isOpen = false;

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.shadowRoot) return;

        this.#shadow = this.attachShadow({mode: "open"});
        this.#createTemplate();
        this.#collectOptions();
        this.#renderOptions();

        this.#selectButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.#togglePopup();
        });

        this.#selectPopupSearch.addEventListener('input', () => {
            this.#filterOptions();
        });

        this.#allCheckbox.addEventListener('change', () => {
            this.#toggleAllOptions();
        });

        document.addEventListener('click', () => {
            this.#closePopup();
        });

        this.#selectPopup.addEventListener('click', (e) => {
            e.stopPropagation();
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
                    cursor: pointer;
                    text-align: left;
                    position: relative;
                }
                
                .select-button.placeholder {
                    color: var(--select-grey-200, #ccc);
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

            <button class="select-button placeholder">Select options...</button>
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
        this.#allCheckbox = this.#shadow.querySelector('input[value="all"]');
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

        const optionCheckboxes = this.#optionsBox.querySelectorAll('.option input[type="checkbox"]:not([value="all"])');
        optionCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.#updateValue();
                this.#updateAllCheckboxState();
            });
        });
    }

    #togglePopup() {
        this.#isOpen = !this.#isOpen;
        this.#selectPopup.classList.toggle("open", this.#isOpen);

        if (this.#isOpen) {
            this.#selectPopupSearch.focus();
        }
    }

    #closePopup() {
        this.#isOpen = false;
        this.#selectPopup.classList.remove("open");
    }

    #filterOptions() {
        const searchText = this.#selectPopupSearch.value.toLowerCase();
        const options = this.#optionsBox.querySelectorAll('.option');

        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            const isVisible = text.includes(searchText);
            option.style.display = isVisible ? 'flex' : 'none';
        });

        this.#updateAllCheckboxState();
    }

    #toggleAllOptions() {
        const options = this.#optionsBox.querySelectorAll('.option input[type="checkbox"]:not([value="all"])');
        const isChecked = this.#allCheckbox.checked;

        options.forEach(option => {
            if (option.closest('.option').style.display !== 'none') {
                option.checked = isChecked;
            }
        });

        this.#updateValue();
    }

    #updateValue() {
        const selectedOptions = Array.from(this.#optionsBox.querySelectorAll('.option input[type="checkbox"]:checked:not([value="all"])')).map(checkbox => checkbox.value);

        this.value = selectedOptions.join(',');

        if (selectedOptions.length === 0) {
            this.#selectButton.textContent = 'Select options...';
            this.#selectButton.classList.add('placeholder');
        } else {
            this.#selectButton.textContent = selectedOptions.join(", ");
            this.#selectButton.classList.remove('placeholder');
        }
    }

    #updateAllCheckboxState() {
        const visibleOptions = Array.from(this.#optionsBox.querySelectorAll('.option input[type="checkbox"]:not([value="all"])'))
            .filter(checkbox => checkbox.closest('.option').style.display !== 'none');

        if (visibleOptions.length === 0) {
            this.#allCheckbox.checked = false;
            this.#allCheckbox.indeterminate = false;
            return;
        }

        const checkedCount = visibleOptions.filter(checkbox => checkbox.checked).length;

        if (checkedCount === 0) {
            this.#allCheckbox.checked = false;
            this.#allCheckbox.indeterminate = false;
        } else if (checkedCount === visibleOptions.length) {
            this.#allCheckbox.checked = true;
            this.#allCheckbox.indeterminate = false;
        } else {
            this.#allCheckbox.checked = false;
            this.#allCheckbox.indeterminate = true;
        }
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.#closePopup);
    }

    adoptedCallback() {
    }

    attributeChangedCallback() {
    }
}

customElements.define(selectComponentName, MySelect);

document.addEventListener('DOMContentLoaded', () => {
    const existingElements = document.querySelectorAll(selectComponentName);
    existingElements.forEach(element => {
        if (!element.shadowRoot) {
            element.connectedCallback();
        }
    });
});
