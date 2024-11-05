export {}

declare global {
  interface Window {
    ExampleElement: typeof ExampleElement
  }
  interface HTMLElementTagNameMap {
    'example-element': ExampleElement
  }
}

export class ExampleElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.textContent = 'Hello, World!'
  }
}

customElements.define('example-element', ExampleElement)

export const defineExampleElement = () => {
  customElements.define('example-element', ExampleElement)
}
