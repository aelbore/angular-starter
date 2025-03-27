import { 
  Component,
  output, 
  input, 
  ViewEncapsulation, 
  computed
} from '@angular/core'

import type { SortBy, SortParams } from '@lithium/pages/common/types'

@Component({
  selector: 'sort-button',
  standalone: false,
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <li-button exportparts="button,span" (click)="onSortClick()">
      <span>
        <ng-content></ng-content>
      </span>
      @if (active()) {
        <svg part="arrow" viewBox="0 0 24 24" class="arrow-{{state().sortOrder}}">
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
  name = input<SortBy>()
  state = input<SortParams>({ sortOrder: 'down' })

  onSort = output<SortParams | Event>()

  active = computed(() => this.state().sortBy === this.name())
  
  onSortClick() {
    this.onSort.emit({ 
      sortOrder: this.state().sortOrder,
      sortBy: this.name()! 
    })
  }
}