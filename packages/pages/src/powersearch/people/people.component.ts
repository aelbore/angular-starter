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

import { SearchPeopleService } from './people.service'
import { SortButtonComponent } from './sort-button.component'

import type { ProfileCardValue } from '@lithium/components/types'
import type { ButtonOutputValue } from './types'
import { ImageAlt } from './avatar-alt.pipe'

@Component({
  selector: 'search-people',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ ProfileCardComponent, SortButtonComponent, ImageAlt, AvatarComponent ],
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
          @for (person of people(); track person.nbkId) {
            <profile-card reverse
              exportparts="card:profile-card,name,title,role,ellipsis" 
              [value]="person">
              <avatar base64 [src]="person.image!" [alt]="person.name! | imgAlt" />
            </profile-card>
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
  #elementRef = inject(ElementRef)

  #effect = effect(() => {
    if (!this.searchText()) return
    this.#service.params.update(params => {
      return { ...params, searchText: this.searchText() }
    })
  })

  #totalCountEffect = effect(() => {
    const element = this.#elementRef.nativeElement as HTMLElement
    element.setAttribute('total-count', this.totalCount()?.toString() ?? '0')
  })
  
  searchText = input('')

  sort = signal('date')

  people = computed(() => this.#service.result()?.results as ProfileCardValue[])
  totalCount = computed(() => this.#service.result()?.totalCount)
  
  ngOnDestroy() {
    this.#effect.destroy()
    this.#totalCountEffect.destroy()
  }

  onSort(value: ButtonOutputValue) {
    this.sort.set(value.name)
  }
}