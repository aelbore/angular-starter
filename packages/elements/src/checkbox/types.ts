export type CheckboxType = 'checkbox' | 'button'

interface ShadowRootElement {
  root?: ShadowRoot | HTMLElement
}

export interface Checkbox extends HTMLElement, ShadowRootElement {
  checked?: boolean
  disabled?: boolean
  type?: CheckboxType
  value?: unknown
}

export interface CheckboxGroup extends HTMLElement, ShadowRootElement {
  selected?: unknown[]
  slots?: HTMLSlotElement
}

declare global {
  interface HTMLElementTagNameMap {
    'li-checkbox-group': CheckboxGroup
    'li-checkbox': Checkbox
  }
}