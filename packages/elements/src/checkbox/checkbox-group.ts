import type { CoreEvent, Checkbox } from '../types'

import { CustomElement, html } from '../core'

import './checkbox-group.scss'

export class CheckboxGroup extends CustomElement {
  #selected: unknown[] = []

  #selectItem(value: unknown) {
    return this.selected?.findIndex(s => {
      return (typeof s == 'object'
        ? JSON.stringify(s) === JSON.stringify(value || {})
        : s?.toString() === value?.toString())
    })
  }

  #updateChecked(value: unknown, checked: boolean, fnUnchecked: (index?: number) => void) {
    const index = this.#selectItem(value)
    if (index === undefined) return

    if (!checked && index !== -1) fnUnchecked(index)
    if (checked && index === -1) this.selected = [ ...this.selected, value ]
  }

  #onItemChanged(event: Event) {
    const { detail } = event as CoreEvent<Checkbox>
    const { value, checked, disabled, type } = detail ?? {}

    const isDisabled = Boolean(disabled)
    if (isDisabled) return

    if (type === 'checkbox' || type === 'button') {
      this.#updateChecked(value, checked!, (index?: number) => this.selected.splice(index!, 1))
      this.dispatchEvent(new CustomEvent('selected-changed', {
        detail: { ...detail ?? {}, selected: this.selected },
        composed: false
      }))
    }
  }
  
  #slotChanged() {
    this.slots?.assignedElements().forEach(slot => {
      const c = slot as Checkbox
      this.#updateChecked(c.value, c.checked!, () => c.checked = true)
    })
  }

  get slots() {
    return this.root.querySelector<HTMLSlotElement>('slot')
  }

  get selected() {
    return this.#selected
  }

  set selected(value: unknown[]) {
    this.#selected = value
    this.slots?.dispatchEvent(new CustomEvent('slotchange'))
  }

  connectedCallback() {
    this.slots?.assignedElements().forEach(slot => {
      const attachTo = slot as Checkbox
      this.createEventListener('change', this.#onItemChanged, { attachTo })
    })
    this.createEventListener('slotchange', this.#slotChanged, { attachTo: this.slots })
  }

  override render() {
    return html `
      <section part="section">
        <slot></slot>
      </section>
    `
  }
}

customElements.define('li-checkbox-group', CheckboxGroup)