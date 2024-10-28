import { CustomElement, html } from '@lithium/elements/core'

import './layout.scss'

export class LayoutElement extends CustomElement {

  static elementName = 'li-layout'

  override render() {
    return html `
      <main part="layout">
        <slot></slot>
      </main>
    `
  }
}

customElements.define(LayoutElement.elementName, LayoutElement)