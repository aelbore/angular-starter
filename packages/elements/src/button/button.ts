import type { ButtonType } from '../types'
import { CustomElement, html } from '../core'

import './button.scss'

export class ButtonElement extends CustomElement {
  #disabled!: boolean
  #type!: ButtonType

  constructor() {
    super()

    this.disabled = false
    this.type = 'button'
  }

  get #button() {
    return this.root.querySelector<HTMLButtonElement>('button')
  }

  #onSubmit(element: HTMLElement) {
    const proxy = document.createElement('button')
    proxy.type = (element as HTMLButtonElement).type
    element.insertAdjacentElement('afterend', proxy)
    proxy.click()
    proxy.remove()
  }

  #onButtonClickEvent() {
    if (!this.disabled && this.type.includes('submit')) {
      this.#onSubmit(this)
    }
  }

  get disabled() {
    return this.#disabled
  }

  set disabled(value: boolean) {
    this.#disabled = value
    this.setBooleanAttr('disabled', value)
    this.setBooleanAttr('disabled', value, this.#button!)
  }

  get type() {
    return this.#type
  }

  set type(value: ButtonType) {
    this.#type = value
    this.setAttribute('type', value)
  }

  connectedCallback() {
    this.createEventListener('click', this.#onButtonClickEvent)
  }

  override render(): string {
    return html `
      <button part="button">
        <span part="span">
          <slot></slot>
        </span>
      </button>
    `
  }
}

customElements.define('li-button', ButtonElement)