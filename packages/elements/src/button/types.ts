export type ButtonType = 'button' | 'submit'

interface ShadowRootElement {
  root?: ShadowRoot | HTMLElement
}

export interface ButtonElement extends HTMLElement, ShadowRootElement {
  disabled?: boolean
  type?: ButtonType
}

declare global {
  interface HTMLElementTagNameMap {
    'li-button': ButtonElement
  }
}