import '@lithium/elements/checkbox'

import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@Component({
  selector: 'sb-checkbox',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  template: `
    <li-checkbox-group [selected]="selected">
      <li-checkbox value="1">Orange</li-checkbox>
      <li-checkbox value="2" checked>Apple</li-checkbox>
      <li-checkbox value="3">Grapes</li-checkbox>
    </li-checkbox-group>
  `
})
export class CheckboxComponent { 
  selected = [ '1' ]
}