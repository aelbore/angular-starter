import { 
  ChangeDetectionStrategy, 
  Component, 
  contentChild,
  input,
  TemplateRef 
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

import { SearchSectionComponent, SortButtonsComponent } from '@lithium/pages/powersearch/common/components'

import { PageCardComponent } from './page-card/page-card.component'
import { PagesSection } from './pages-section'

@Component({
  selector: 'search-pages',
  standalone: true,
  imports: [
    PageCardComponent, 
    NgTemplateOutlet,
    SearchSectionComponent,
    SortButtonsComponent
  ],
  template: ` 
    <search-section name="pages">
      <header>
        <div class="title">Pages</div>
        <sort-buttons class="sort-header" 
          [value]="sortButtons()" 
          [active]="sortState()"
          (onSort)="onSort($event)" />
      </header>
      <ng-template let-item>
        <page-card [value]="item" class="page-card">
          <ng-container 
            [class]="'bookmark'"
            [ngTemplateOutlet]="bookmark()!" 
            [ngTemplateOutletContext]="{ $implicit: item }"
          />
        </page-card>
      </ng-template>
    </search-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './pages.component.scss'
})
export class SearchPagesComponent extends PagesSection { 
  bookmark = contentChild(TemplateRef)

  override searchText = input.required<string>()
  override itemsPerPage = input<string | number>(3) 
}