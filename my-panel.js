const panelCurrentScript = document.currentScript;
const panelComponentName = panelCurrentScript?.dataset?.name || 'my-panel';

class MyPanel extends HTMLElement {
    #shadow;
    #header;
    #toggleButton;
    #content;
    #isExpanded = true;

    static observedAttributes = ["header", "sub-header"];

    constructor() {
        super();
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({mode: "open"});
        this.#createTemplate();
        this.#setupEventListeners();
        this.#updateHeader();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.#updateHeader();
        }
    }

    #createTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: system-ui, sans-serif;
                    --panel-border: 1px solid #CBD5E1;
                    --panel-text-color: #334155;
                }

                .panel {
                    border: var(--panel-border);
                    border-radius: 4px;
                    background: white;
                }

                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 7px 10px;
                    cursor: pointer;
                    user-select: none;
                }

                .panel-header-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    font-size: 14px;
                    color: var(--panel-text-color);
                    font-weight: 600;
                }

                .panel-sub-header {
                    font-size: 12px;
                    font-weight: normal;
                    color: #64748b;
                    margin-top: 2px;
                }

                .panel-toggle {
                    background: none;
                    border: none;
                    font-size: 1rem;
                    cursor: pointer;
                    padding: 0.25rem;
                    color: var(--panel-text-color);
                }

                .panel-content {
                    padding: 10px;
                }

                .panel-content.collapsed {
                    display: none;
                }
            </style>

            <div class="panel">
                <div class="panel-header">
                    <div class="panel-header-content">
                        <div class="panel-main-header">Default header</div>
                        <div class="panel-sub-header"></div>
                    </div>
                    <button class="panel-toggle">-</button>
                </div>
                <div class="panel-content">
                    <slot></slot>
                </div>
            </div>
        `;

        this.#shadow.append(template.content.cloneNode(true));

        this.#header = this.#shadow.querySelector('.panel-header');
        this.#toggleButton = this.#shadow.querySelector('.panel-toggle');
        this.#content = this.#shadow.querySelector('.panel-content');
    }

    #setupEventListeners() {
        this.#header.addEventListener('click', () => {
            this.#toggle();
        });

        this.#toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.#toggle();
        });
    }

    #updateHeader() {
        const mainHeader = this.#shadow.querySelector('.panel-main-header');
        const subHeader = this.#shadow.querySelector('.panel-sub-header');

        const headerAttr = this.getAttribute('header');
        const subHeaderAttr = this.getAttribute('sub-header');

        if (mainHeader && headerAttr) {
            mainHeader.textContent = headerAttr;
        }

        if (subHeader && subHeaderAttr) {
            subHeader.textContent = subHeaderAttr;
            subHeader.style.display = 'block';
        } else {
            subHeader.textContent = '';
            subHeader.style.display = 'none';

        }
    }

    #toggle() {
        this.#isExpanded = !this.#isExpanded;

        if (this.#isExpanded) {
            this.#content.classList.remove('collapsed');
            this.#toggleButton.textContent = '-';
        } else {
            this.#content.classList.add('collapsed');
            this.#toggleButton.textContent = '+';
        }
    }
}

customElements.define(panelComponentName, MyPanel);

document.addEventListener('DOMContentLoaded', () => {
    const existingElements = document.querySelectorAll(panelComponentName);
    existingElements.forEach(element => {
        if (!element.shadowRoot) {
            element.connectedCallback();
        }
    });
});
