import { CustomElement, html } from '@lithium/elements/core'

import './content.scss'

export class ContentElement extends CustomElement {
  #scrollable!: boolean
  #noScrollbar!: boolean

  static elementName = 'li-content'

  get scrollable() {
    return this.#scrollable
  }

  set scrollable(value: boolean) {
    this.#scrollable = value
    this.setBooleanAttr('scrollable', value)
  }

  get noScrollbar() {
    return this.#noScrollbar
  }

  set noScrollbar(value: boolean) {
    this.#noScrollbar = value
    this.setBooleanAttr('no-scrollbar', value)
  }

  override render() {
    return html `
      <section part="content">
        <slot></slot>
      </section>
    `
  }
}

customElements.define(ContentElement.elementName, ContentElement)