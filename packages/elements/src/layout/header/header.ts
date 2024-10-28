import { CustomElement, html } from '@lithium/elements/core'

import './header.scss'

export class HeaderElement extends CustomElement {

  static elementName = 'li-header'

  override render() {
    return html `
      <header part="header">
        <slot></slot>
      </header>
    `
  }
}

customElements.define(HeaderElement.elementName, HeaderElement)