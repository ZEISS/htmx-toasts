export {}

declare global {
  interface Window {
    HTMXToastsElement: typeof HTMXToastsElement
  }
  interface HTMLElementTagNameMap {
    'htmx-toasts': HTMXToastsElement
  }
}

type Level = 'info' | 'warn' | 'error'
type Code = number
type Message = string

type Notify = {
  message: Message
  level: Level
  code: Code
}

type Notification = {
  id: number
  message: Message
  level: Level
  code: Code
}

export class HTMXToastsElement extends HTMLElement {
  constructor() {
    super()
  }

  notifications = new Array<Notification>()

  connectedCallback(): void {
    window.addEventListener('htmx-toasts:notify', ((e: CustomEvent<Notify>) => this._handleNotify(e)) as EventListener)
  }

  private _handleNotify(e: CustomEvent<Notify>): void {
    const notifcation = {id: e.timeStamp, ...e.detail}
    this.notifications.push(notifcation)
    setTimeout(() => this._remove(notifcation), 3000)
    // this.requestUpdate();
  }

  private _remove(n: Notification): void {
    this.notifications = this.notifications.filter(i => i.id !== n.id)
  }

  disconnectedCallback(): void {
    window.removeEventListener('htmx-toasts:notify', ((e: CustomEvent<Notify>) =>
      this._handleNotify(e)) as EventListener)
  }
}

if (!window.customElements.get('htmx-toasts')) {
  window.HTMXToastsElement = HTMXToastsElement
  window.customElements.define('htmx-toats', HTMXToastsElement)
}

export const defineExampleElement = () => {
  customElements.define('htmx-toasts', HTMXToastsElement)
}
