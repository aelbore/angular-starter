import { 
  ChangeDetectionStrategy, 
  Component, 
  computed,  
  contentChild, 
  CUSTOM_ELEMENTS_SCHEMA, 
  HostAttributeToken, 
  inject, 
  Injector,
  runInInjectionContext,
  TemplateRef 
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

import { NgxPaginationModule } from 'ngx-pagination'
import { PaginationComponent } from '@lithium/components/pagination'
import { getSectionService } from '@lithium/pages/powersearch/common/section-tokens'

import type { SectionName } from '@lithium/pages/powersearch/common/types'

@Component({
  selector: 'search-section',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ PaginationComponent, NgxPaginationModule, NgTemplateOutlet ],
  template: `
    <li-card class="search-section">
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
  styleUrl: './search-section.component.scss'
})
export class SearchSectionComponent {
  readonly injector = inject(Injector)
  readonly outlet = contentChild(TemplateRef)

  section = runInInjectionContext(this.injector, () => {
    const name = inject(new HostAttributeToken('name')) as SectionName
    return getSectionService(name, this.injector)
  })

  paginateArgs = computed(() => this.section.paginateArgs())
  results = computed(() => this.section.result()?.results ?? [])

  onPageChanged(currentPage: number) {
    this.section.updateCurrentPage(currentPage)
  }
}