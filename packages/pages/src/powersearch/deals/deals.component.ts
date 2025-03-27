import { ChangeDetectionStrategy, Component } from '@angular/core'

import { LegendComponent } from './legend/legend.component'
import { SearchDealComponent } from './deal/deal.component'
import { PageSectionComponent, TooltipDirective } from '@lithium/pages/common'

@Component({
  selector: 'search-deals',
  standalone: true,
  imports: [
    SearchDealComponent,
    LegendComponent,
    TooltipDirective,
    PageSectionComponent
],
  template: `
    <page-section name="deals">
      <header>
        <div class="title">Deal Database</div>
        <legend></legend>
      </header>
      <ng-template let-item>
        <deal>
          
        </deal>
      </ng-template>
    </page-section>
  
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './deals.component.scss'
})
export class SearchDealsComponent { 

}