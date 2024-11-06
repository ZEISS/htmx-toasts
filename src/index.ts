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

  static get observedAttributes() {
    return []
  }

  get timeout(): number {
    return Number(this.getAttribute('timeout')) ?? 3000
  }

  get errorClass(): string {
    return this.getAttribute('error-class') ?? 'alert-error'
  }

  get infoClass(): string {
    return this.getAttribute('info-class') ?? 'alert-info'
  }

  get warnClass(): string {
    return this.getAttribute('warn-class') ?? 'alert-warning'
  }

  notifications = new Array<Notification>()

  connectedCallback(): void {
    window.addEventListener('htmx-toasts:notify', ((e: CustomEvent<Notify>) => this.addToast(e)) as EventListener)

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'alert')
    }

    if (!this.hasAttribute('aria-live')) {
      this.setAttribute('aria-live', 'polite')
    }

    if (!this.hasAttribute('aria-atomic')) {
      this.setAttribute('aria-atomic', 'true')
    }

    this.attachShadow({mode: 'open'})

    const styles = document.createElement('link')
    styles.rel = 'stylesheet'
    styles.href = 'https://unpkg.com/fiber-htmx@1.3.32/dist/out.css'
    styles.type = 'text/css'
    this.shadowRoot?.appendChild(styles)
  }

  disconnectedCallback(): void {
    window.removeEventListener('htmx-toasts:notify', ((e: CustomEvent<Notify>) => this.addToast(e)) as EventListener)
  }

  addToast(e: CustomEvent<Notify>): void {
    const notifcation = {id: e.timeStamp, ...e.detail}
    this.notifications.push(notifcation)
    const template = document.querySelector('#htmx-toasts-template') as HTMLTemplateElement
    const templateContent = template?.content as DocumentFragment
    const tpl = templateContent.cloneNode(true) as DocumentFragment

    const el = tpl.firstElementChild as HTMLElement
    el.setAttribute('data-htmx-toast', notifcation.id.toString())

    const message = tpl.querySelector('[slot="message"]') as HTMLElement
    if (message) {
      message.textContent = notifcation.message
    }

    const alert = tpl.querySelector('[slot="alert"]') as HTMLElement
    if (alert && notifcation.level === 'info') {
      alert.classList.add(this.infoClass)
    }

    if (alert && notifcation.level === 'warn') {
      alert.classList.add(this.warnClass)
    }

    if (alert && notifcation.level === 'error') {
      alert.classList.add(this.errorClass)
    }

    const close = tpl.querySelector('[slot="close"]') as HTMLButtonElement
    if (close && close.tagName === 'BUTTON') {
      close.addEventListener('click', () => this.removeToast(notifcation))
    }

    this.shadowRoot?.appendChild(tpl)
    setTimeout(() => this.removeToast(notifcation), this.timeout)
  }

  removeToast(n: Notification): void {
    this.notifications = this.notifications.filter(i => i.id !== n.id)
    this.shadowRoot?.querySelector(`[data-htmx-toast="${n.id}"]`)?.remove()
  }
}

if (!window.customElements.get('htmx-toasts')) {
  window.HTMXToastsElement = HTMXToastsElement
  window.customElements.define('htmx-toasts', HTMXToastsElement)
}

export const defineExampleElement = () => {
  customElements.define('htmx-toasts', HTMXToastsElement)
}
