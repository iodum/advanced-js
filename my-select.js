const currentScript = document.currentScript;
const componentName = currentScript?.dataset?.name || 'my-select';

class MySelect extends HTMLElement {
    constructor() {
        super();
        console.log('Hello World');
    }
}

customElements.define(componentName, MySelect);
