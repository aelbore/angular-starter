import '@lithium/elements/button'

import type { ButtonElement } from '@lithium/elements/types'
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'

export type ButtonProps = {
  text?: string
} & ButtonElement

@Component({
  selector: 'sb-button',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  template: `
    <li-button 
      [type]="options.type"
      [disabled]="options.disabled">{{options.text}}</li-button>
  `
})
export class ButtonComponent { 
  @Input() options!: ButtonProps
}