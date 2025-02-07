import { 
  ChangeDetectionStrategy, 
  Component, 
  computed, 
  CUSTOM_ELEMENTS_SCHEMA, 
  inject, 
  signal
} from '@angular/core'

import { NgxPaginationModule } from 'ngx-pagination'
import { MatTooltipModule } from '@angular/material/tooltip'

import { ProfileCardComponent } from '@lithium/components/profile-card'
import { AvatarComponent } from '@lithium/components/avatar'
import { PaginationComponent } from '@lithium/components/pagination'
import { SectionBase, SortButtonComponent } from '@lithium/pages/powersearch/common/components'

import { SearchPeopleService } from './people.service'
import { ImageAlt } from './avatar-alt.pipe'

import type { ProfileCardValue } from '@lithium/components/types'
import type { SortState, ButtonOutputValue } from '@lithium/pages/powersearch/common/types'

@Component({
  selector: 'search-people',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ 
    ProfileCardComponent, 
    SortButtonComponent, 
    ImageAlt, 
    AvatarComponent,
    PaginationComponent,
    NgxPaginationModule,
    MatTooltipModule
  ],
  providers: [ SearchPeopleService ],
  template: `
    <li-card class="search-people">
      <li-header class="search-people--header">
        <div class="title">People</div>
        <div class="sort-header">
          <sort-button name="date" exportparts="button:sort-button,arrow,span" 
            [active]="sort() === 'date'" 
            (onSort)="onSort($event)">Published Date</sort-button>
          <span part="sort-divider" class="sort-header--divider">|</span>
          <sort-button name="title" exportparts="button:sort-button,arrow,span"
            [active]="sort() === 'title'" 
            (onSort)="onSort($event)">Title</sort-button>
        </div>
      </li-header>
      <li-content>
        <section>
          @for (person of people() | paginate: paginateArgs(); track person.nbkId) {
            <profile-card reverse
              exportparts="card:profile-card,name,title,role,ellipsis" 
              [value]="person"        
              [matTooltipPosition]="'before'"
              [matTooltipClass]="'search-tooltip'"
              [matTooltip]="tooltip(person)"
              (onClick)="onRedirect()">
              <avatar base64 [src]="person.image!" [alt]="person.name! | imgAlt" />
            </profile-card>
          }
        </section>
      </li-content>
      <li-footer>
        <pagination 
          [paginateArgs]="paginateArgs()" 
          (pageChange)="onPageChange($event)" />
      </li-footer>
    </li-card> 
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './people.component.scss'
})
export class SearchPeopleComponent extends SectionBase { 
  override service = inject(SearchPeopleService)

  sort = signal<SortState>('date')
  people = computed(() => this.results() as ProfileCardValue[])

  onRedirect() { }

  onSort(value: ButtonOutputValue) {
    this.sort.set(value.name)
  }

  tooltip(person: ProfileCardValue) {
    return `${person.name}\n${person.title}\n${person.role ?? ''}`
  }
}