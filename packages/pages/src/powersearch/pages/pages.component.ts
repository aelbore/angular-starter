import { 
  ChangeDetectionStrategy, 
  Component, 
  contentChild,
  input,
  TemplateRef 
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

import { PageSectionComponent, SortButtonsModule } from '@lithium/pages/common'

import { PageCardComponent } from './page-card/page-card.component'
import { PagesSection } from './pages-section'

@Component({
  selector: 'search-pages',
  standalone: true,
  imports: [
    PageCardComponent,
    NgTemplateOutlet,
    SortButtonsModule,
    PageSectionComponent
],
  template: ` 
    <page-section name="search-pages">
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
    </page-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './pages.component.scss'
})
export class SearchPagesComponent extends PagesSection { 
  bookmark = contentChild(TemplateRef)

  override searchText = input.required<string>()
  override itemsPerPage = input<string | number>(3) 
}