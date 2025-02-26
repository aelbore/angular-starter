import { ChangeDetectionStrategy, Component, input } from '@angular/core'

import { ProfileCardComponent } from '@lithium/components/profile-card'
import { AvatarComponent } from '@lithium/components/avatar'
import { SearchSectionComponent, SortButtonsComponent } from '@lithium/pages/powersearch/common/components'
import { TooltipDirective } from '@lithium/pages/powersearch/common/directives'

import { ImageAlt } from './avatar-alt.pipe'

import { PeopleSection } from './people-section'

@Component({
  selector: 'search-people',
  standalone: true,
  imports: [ 
    ProfileCardComponent, 
    SortButtonsComponent, 
    ImageAlt, 
    AvatarComponent,
    TooltipDirective,
    SearchSectionComponent
  ],
  template: `
    <search-section type="people"
      [paginateArgs]="paginateArgs()" 
      (onPageChanged)="onPageChange($event)">
      <header>
        <div class="title">People</div>
        <sort-buttons class="sort-header" 
          [value]="sortButtons()" 
          [active]="sortState()"
          (onSort)="onSort($event)" />
      </header>
      <ng-template let-item>
        <profile-card reverse
            class="people-profile-card"
            exportparts="card:profile-card,name,title,role,ellipsis" 
            [value]="item"        
            [tooltipPosition]="'left'"
            [tooltipClass]="'search-tooltip'"
            [tooltip]="tooltip(item)"
            (onClick)="onRedirect()">
            <avatar base64 [src]="item.image!" [alt]="item.name! | imgAlt" />
          </profile-card>
      </ng-template>
    </search-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './people.component.scss'
})
export class SearchPeopleComponent extends PeopleSection { 
  override searchText = input.required<string>()
  override itemsPerPage = input<string | number>(3) 
}