import type { ButtonType } from '@lithium/elements/types'
import { CustomElement, html } from '@lithium/elements/core'

import './button.scss'

export class ButtonElement extends CustomElement {
  #disabled!: boolean
  #type!: ButtonType

  get #button() {
    return this.queryRoot<HTMLButtonElement>('button')
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
    return this.#disabled ?? false
  }

  set disabled(value: boolean) {
    this.#disabled = value
    this.setBooleanAttr('disabled', value)
    this.setBooleanAttr('disabled', value, this.#button!)
  }

  get type() {
    return this.#type ?? 'button'
  }

  set type(value: ButtonType) {
    this.#type = value
    this.setAttribute('type', value)
  }

  connectedCallback() {
    this.createEventListener('click', this.#onButtonClickEvent)
  }

  override render() {
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