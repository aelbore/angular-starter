import { 
  ChangeDetectionStrategy, 
  Component, 
  computed, 
  contentChild, 
  CUSTOM_ELEMENTS_SCHEMA, 
  inject, 
  signal, 
  TemplateRef 
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

import { NgxPaginationModule } from 'ngx-pagination'
import { PaginationComponent } from '@lithium/components/pagination'

import { SectionBase, SortButtonComponent } from '@lithium/pages/powersearch/common/components'
import { PageCardComponent } from './page-card/page-card.component'
import { SearchPagesService } from './pages.service'

import type { ButtonOutputValue, SortState } from '@lithium/pages/powersearch/common/types'
import type { PageValue } from './types'

@Component({
  selector: 'search-pages',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ 
    PageCardComponent, 
    PaginationComponent,
    NgxPaginationModule,
    SortButtonComponent,
    NgTemplateOutlet
  ],
  providers: [ SearchPagesService ],
  template: ` 
    <li-card class="search-pages">
      <li-header class="search-pages--header">
        <div class="title">Pages</div>
        <div class="sort-header">
          <sort-button name="date" exportparts="button:sort-button,arrow,span" 
            [active]="sort() === 'date'" 
            (onSort)="onSort($event)">Published Date</sort-button>
          <span class="sort-header--divider">|</span>
          <sort-button name="title" exportparts="button:sort-button,arrow,span"
            [active]="sort() === 'title'"
            (onSort)="onSort($event)">Title</sort-button>
        </div>
      </li-header>
      <li-content>
        <section>
          @for (page of pages() | paginate: paginateArgs(); track page.id) {
            <page-card [value]="page" class="page-card">
              <ng-container 
                [class]="'bookmark'"
                [ngTemplateOutlet]="bookmark()!" 
                [ngTemplateOutletContext]="{ $implicit: page }"
              />
            </page-card>
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
  styleUrl: './pages.component.scss'
})
export class SearchPagesComponent extends SectionBase { 
  override service = inject(SearchPagesService)

  bookmark = contentChild(TemplateRef)

  sort = signal<SortState>('date')
  pages = computed(() => this.results() as PageValue[])

  onRedirect() { }

  onSort(value: ButtonOutputValue) {
    this.sort.set(value.name)
  }
}