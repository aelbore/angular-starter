import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'

import { SortButtonComponent } from '@lithium/pages/powersearch/common/components'

import type { SortParams } from '@lithium/pages/powersearch/common/types'
import type { SortButtons } from './types'

@Component({
  selector: 'sort-buttons',
  standalone: true,
  imports: [ SortButtonComponent ],
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
  styleUrl: './sort-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortButtonsComponent {
  value = input<SortButtons[]>([])
  active = input<SortParams>({ arrow: 'down' }) 

  onSort = output<SortParams | Event>()
}