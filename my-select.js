const currentScript = document.currentScript;
const componentName = currentScript?.dataset?.name || 'my-select';

class MySelect extends HTMLElement {
    constructor() {
        super();
    }
}

if (!customElements.get(componentName)) {
    customElements.define(componentName, MySelect);
}
