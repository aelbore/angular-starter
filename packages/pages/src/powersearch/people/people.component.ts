import { 
  ChangeDetectionStrategy, 
  Component, 
  computed, 
  CUSTOM_ELEMENTS_SCHEMA, 
  effect, 
  ElementRef, 
  inject, 
  input, 
  OnDestroy, 
  signal, 
  ViewEncapsulation
} from '@angular/core'
import { ProfileCardComponent } from '@lithium/components/profile-card'
import { AvatarComponent } from '@lithium/components/avatar'
import { PaginationComponent } from '@lithium/components/pagination'

import { NgxPaginationModule, PaginatePipeArgs } from 'ngx-pagination'

import { SearchPeopleService } from './people.service'
import { SortButtonComponent } from './sort-button.component'
import { ImageAlt } from './avatar-alt.pipe'

import type { ProfileCardValue } from '@lithium/components/types'
import type { PaginateArgs } from '@lithium/components/pagination/types'
import { SortState, type ButtonOutputValue } from './types'
import type { SearchParams } from '../types'

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
              [value]="person">
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
export class SearchPeopleComponent implements OnDestroy { 
  #service = inject(SearchPeopleService)
  #elementRef = inject<ElementRef<HTMLElement>>(ElementRef)

  #effect = effect(() => {
    if (!this.searchText()) return
    this.#updateParams({ searchText: this.searchText() })
  })

  #totalCountEffect = effect(() => {
    const element = this.#elementRef.nativeElement
    element.setAttribute('total-count', this.totalCount()?.toString() ?? '0')
  })
  
  searchText = input('')

  sort = signal<SortState>('date')
  paginateArgs = signal<PaginatePipeArgs & PaginateArgs>({
    itemsPerPage: 2,
    currentPage: 1,
    maxSize: 10
  })

  people = computed(() => (this.#service.result()?.results ?? []) as ProfileCardValue[])
  totalCount = computed(() => this.#service.result()?.totalCount)

  #updateParams(params: SearchParams) {
    this.#service.params.update(value => ({ ...value, ...params }))
  }
  
  ngOnDestroy() {
    this.#effect.destroy()
    this.#totalCountEffect.destroy()
  }

  onSort(value: ButtonOutputValue) {
    this.sort.set(value.name)
  }

  onPageChange(currentPage: number) {
    this.paginateArgs.update(args => ({ ...args, currentPage}))
    this.#updateParams({ PageIndex: currentPage })
  }
}