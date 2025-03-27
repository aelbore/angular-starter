import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'

import type { SortParams, SortButtons } from '@lithium/pages/common/types'

@Component({
  selector: 'sort-buttons',
  standalone: false,
  template: `
    @for (button of value(); track button.value) {
      <sort-button exportparts="button:sort-button,arrow,span" 
        [name]="button.value"
        [state]="active()"
        (onSort)="onSort.emit($event)">{{button.label}}</sort-button>
      @if (button.hasDivider) {
        <span class="sort-header--divider">|</span>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortButtonsComponent {
  value = input<SortButtons[]>([])
  active = input<SortParams>({ sortOrder: 'down' }) 

  onSort = output<SortParams | Event>()
}