import { CustomElement, html } from '@lithium/elements/core'

import './card.scss'

export class CardElement extends CustomElement {

  static elementName = 'li-card'

  override render() {
    return html `
      <section part="card">
        <slot></slot>
      </section>
    `
  }
}

customElements.define(CardElement.elementName, CardElement)