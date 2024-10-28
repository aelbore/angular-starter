import { CustomElement, html } from '@lithium/elements/core'

import './avatar.scss'

export class AvatarElement extends CustomElement {
  static elementName = 'li-avatar'

  #src!: string
  #alt!: string

  get #img() {
    return this.root.querySelector<HTMLImageElement>('img')
  }

  get src() {
    return this.#src
  }

  set src(value: string) {
    this.#src = value
    this.setAttribute('src', value)
    this.#img?.setAttribute('src', value)
  }

  get alt() {
    return this.#alt
  }

  set alt(value: string) {
    this.#alt = value
    this.setAttribute('alt', value)
    this.#img?.setAttribute('alt', value)
  }

  override render() {
    return html `
      <div part="container">
        <img part="img" />
      </div>
    `
  }
}

customElements.define(AvatarElement.elementName, AvatarElement) 