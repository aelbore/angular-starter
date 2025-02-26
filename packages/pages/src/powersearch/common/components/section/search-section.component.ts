import { 
  ChangeDetectionStrategy, 
  Component, 
  computed,  
  contentChild, 
  CUSTOM_ELEMENTS_SCHEMA, 
  HostAttributeToken, 
  inject, 
  Injector, 
  input, 
  output, 
  TemplateRef 
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

import { NgxPaginationModule, type PaginatePipeArgs } from 'ngx-pagination'
import { PaginationComponent } from '@lithium/components/pagination'
import { getSectionService } from '@lithium/pages/powersearch/common/section-tokens'

import type { PaginateArgs } from '@lithium/components/pagination/types'
import type { SectionType } from '@lithium/pages/powersearch/common/types'

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
        <section class="content">
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
          (pageChange)="onPageChanged.emit($event)" />        
      </li-footer>
    </li-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './search-section.component.scss'
})
export class SearchSectionComponent {
  readonly injector = inject(Injector)
  readonly outlet = contentChild(TemplateRef)

  type = inject(new HostAttributeToken('type'))
  
  paginateArgs = input<PaginatePipeArgs & PaginateArgs>()
  onPageChanged = output<number>()

  results = computed(() => this.section?.result()?.results ?? [])

  get section() {
    const type = this.type as SectionType
    return getSectionService(type, this.injector)
  }
}