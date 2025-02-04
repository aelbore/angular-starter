import { 
  ChangeDetectionStrategy, 
  Component, 
  computed, 
  CUSTOM_ELEMENTS_SCHEMA, 
  inject, 
  signal, 
  ViewEncapsulation
} from '@angular/core'

import { NgxPaginationModule } from 'ngx-pagination'

import { ProfileCardComponent } from '@lithium/components/profile-card'
import { AvatarComponent } from '@lithium/components/avatar'
import { PaginationComponent } from '@lithium/components/pagination'

import { SearchPeopleService } from './people.service'
import { SortButtonComponent } from './sort-button.component'
import { ImageAlt } from './avatar-alt.pipe'
import { SectionBase } from '../section-base'

import type { ProfileCardValue } from '@lithium/components/types'
import type { SortState, ButtonOutputValue } from './types'

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
    NgxPaginationModule
  ],
  providers: [ SearchPeopleService ],
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <li-card class="people" part="people">
      <li-header>
        <div part="header-title">People</div>
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
}