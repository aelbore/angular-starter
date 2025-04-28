import { ChangeDetectionStrategy, input, Component } from '@angular/core'
import { PageSectionComponent, SortButtonsModule } from '@lithium/pages/common'

import { MediaSection } from './media-section'
import { ImageCard } from './image-card/image-card.component'
import { VideoCard } from './video-card/video-card.component'

@Component({
  selector: 'search-media',
  standalone: true,
  imports: [
    PageSectionComponent,
    SortButtonsModule,
    ImageCard,
    VideoCard
  ],
  template: `
    <page-section name="search-media">
      <header>
        <div class="title">Videos and Multimedia</div>
        <sort-buttons class="sort-header" 
          [value]="sortButtons()" 
          [active]="sortState()"
          (onSort)="onSort($event)" />          
      </header>
      <ng-template let-item>
        @if (isMediaImage(item)) {
          <image-card class="media-image-card" [value]="item"></image-card>
        }
        @if (isMediaVideo(item)) {
          <video-card [value]="item"></video-card>
        }
      </ng-template>
    </page-section>
  `,
  styleUrl: './media.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchMediaComponent extends MediaSection { 
  override searchText = input.required<string>()
  override itemsPerPage = input<string | number>(3) 
}