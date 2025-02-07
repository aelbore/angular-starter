import { 
  Component, 
  CUSTOM_ELEMENTS_SCHEMA, 
  signal, 
  output, 
  input, 
  ViewEncapsulation 
} from '@angular/core'

import type { 
  ArrowState, 
  ButtonOutputValue, 
  SortState 
} from '@lithium/pages/powersearch/common/types'

@Component({
  selector: 'sort-button',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <li-button exportparts="button,span" (click)="onSortClick()">
      <span>
        <ng-content></ng-content>
      </span>
      @if (active()) {
        <svg part="arrow" viewBox="0 0 24 24" class="arrow-{{state()}}">
          <path
            d="M11.0001 
              3.67157L13.0001 3.67157L13.0001 16.4999L16.2426 
              13.2574L17.6568 14.6716L12 20.3284L6.34314
              14.6716L7.75735 13.2574L11.0001 16.5001L11.0001 3.67157Z"
            fill="currentColor"
          />
        </svg>
      }
    </li-button>
  `,
  styleUrl: './sort-button.component.scss'
})
export class SortButtonComponent { 
  state = signal<ArrowState>('down')

  active = input<boolean>(false)
  name = input<SortState>()
  onSort = output<ButtonOutputValue>()

  onSortClick() {
    if (this.state() === 'down') this.state.set('up')
    else this.state.set('down')

    this.onSort.emit({ state: this.state(), name: this.name()! })
  }
}