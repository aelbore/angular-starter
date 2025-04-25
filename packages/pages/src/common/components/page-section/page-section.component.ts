import { 
  ChangeDetectionStrategy, 
  Component, 
  computed,  
  contentChild, 
  CUSTOM_ELEMENTS_SCHEMA,
  TemplateRef 
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'


import { PaginationModule } from '@lithium/components/pagination'
import { getSectionService } from '@lithium/pages/common/core'

import type { SearchService } from '@lithium/pages/common/types'

@Component({
  selector: 'page-section',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ PaginationModule, NgTemplateOutlet ],
  template: `
    <li-card class="page-section">
      <li-header>
        <ng-content select="header"></ng-content>
      </li-header>
      <li-content>
        <section>
          @for (item of results()! | paginate: paginateArgs()!; track item) {
            <ng-container 
              [ngTemplateOutlet]="outlet()!" 
              [ngTemplateOutletContext]="{ $implicit: item }"
            />
          }
        </section>
      </li-content>
      <li-footer>
        <pagination 
          [paginateArgs]="paginateArgs()" 
          (pageChange)="onPageChanged($event)" />
      </li-footer>
    </li-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './page-section.component.scss'
})
export class PageSectionComponent {
  outlet = contentChild(TemplateRef)
  section = getSectionService<SearchService>()

  paginateArgs = computed(() => this.section.paginateArgs())
  results = computed(() => this.section.result()?.results ?? [])

  onPageChanged(currentPage: number) {
    this.section.updateCurrentPage(currentPage)
  }
}