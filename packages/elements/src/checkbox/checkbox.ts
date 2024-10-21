import type { CheckboxType, CoreEvent } from '../types'

import { CustomElement, html } from '../core'

import './checkbox.scss'

export class Checkbox extends CustomElement {
  #checked!: boolean
  #value!: unknown
  #disabled!: boolean
  #type!: CheckboxType

  constructor() {
    super()
    this.checked = false
    this.disabled = false
    this.type = 'checkbox'
  }

  get #input() {
    return this.root.querySelector<HTMLInputElement>('input')
  }

  #inputDispatchEvent() {
    if (this.#input?.checked) {
      this.#input.dispatchEvent(new CustomEvent('change'))
    }
  }

  #onValueChanged(event: Event) {
    const { target: { value, checked, disabled } } = event as CoreEvent<Checkbox>
    this.dispatchEvent(new CustomEvent('change', { 
      detail: { value, checked, disabled, type: this.type } 
    }))
  }

  get checked() {
    return this.#checked
  }

  set checked(value: boolean) {
    this.#checked = value
    this.setBooleanAttr('checked', value)
    this.setBooleanAttr('checked', value, this.#input!)
  }

  get disabled() {
    return this.#disabled
  }

  set disabled(value: boolean) {
    this.#disabled = value
    this.setBooleanAttr('disabled', value)
    this.setBooleanAttr('disabled', value, this.#input!)
  }

  get type() {
    return this.#type
  }

  set type(value: CheckboxType) {
    this.#type = value
    this.setAttribute('type', value)
  }

  get value() {
    return this.#value
  }

  set value(value: unknown) {
    this.#value = value
    this.setAttribute('value', value as string)
    this.#input?.setAttribute('value', value as string)
  }

  connectedCallback() {
    this.createEventListener('change', this.#onValueChanged, { attachTo: this.#input })
    this.#inputDispatchEvent()
  }

  override render() {
    return html `
      <label part="label">
        <input part="input" aria-label="toggle" type="checkbox" />
        <span part="span">        
          <slot></slot>
        </span>
      </label>    
    `
  }
}

customElements.define('li-checkbox', Checkbox)