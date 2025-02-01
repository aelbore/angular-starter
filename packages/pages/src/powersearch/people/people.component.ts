import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, EffectRef, inject, input, OnDestroy, signal, ViewEncapsulation } from '@angular/core'
import { ProfileCardComponent } from '@lithium/components/profile-card'

import { SearchPeopleService } from './people.service'
import { ProfileCardValue } from '@lithium/components/types'
import { ButtonOutputValue, SortState } from './types'
import { SortButtonComponent } from './sort-button.component'

@Component({
  selector: 'search-people',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ ProfileCardComponent, SortButtonComponent ],
  providers: [ SearchPeopleService ],
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <li-card class="people" part="people">
      <li-header>
        <div part="header-title">People</div>
        <div class="sort-header">
          <sort-button name="date" exportparts="button:sort-button,arrow,span" 
            [active]="sortState() === 'date'" 
            (onSort)="onSort($event)">Published Date</sort-button>
          <span part="sort-divider" class="sort-header--divider">|</span>
          <sort-button name="title" exportparts="button:sort-button,arrow,span"
            [active]="sortState() === 'title'" 
            (onSort)="onSort($event)">Title</sort-button>
        </div>
      </li-header>
      <li-content>
        <section>
          @for (person of people(); track person.nbkId) {
            <profile-card reverse
              exportparts="card:profile-card,name,title,role,ellipsis" 
              [value]="person"></profile-card>
          }
        </section>
      </li-content>
      <li-footer>
        <ng-content></ng-content>
      </li-footer>
    </li-card> 
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './people.component.scss'
})
export class SearchPeopleComponent implements OnDestroy { 
  #service = inject(SearchPeopleService)
  #effect!: EffectRef

  searchText = input('')

  people = computed(() => this.#service.result()?.results as ProfileCardValue[])
  totalCount = computed(() => this.#service.result()?.totalCount)
  sortState = signal<SortState>('date')

  constructor() {
    this.#effect = effect(() => {
      if (!this.searchText()) return
      this.#service.params.update(params => {
        return { ...params, searchText: this.searchText() }
      })
    })
  }

  ngOnDestroy() {
    this.#effect.destroy()
  }

  onSort(value: ButtonOutputValue) {
    this.sortState.set(value.name)
  }
}