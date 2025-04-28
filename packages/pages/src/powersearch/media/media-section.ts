import { inject, signal } from '@angular/core'
import { withSortBy, withBaseSection, SearchSectionInput, withEffectSearchSection } from '@lithium/pages/common'

import type { SortButtons } from '@lithium/pages/common/types'
import { SearchMediaService } from './media.service'
import { MediaValue } from './types'

export class MediaSortBySection extends withSortBy(SearchSectionInput) {
  sortButtons = signal<SortButtons[]>([
    { value: 'PublishedDate', label: 'Published Date', hasDivider: true },
    { value: 'Title', label: 'Title' }
  ])
}

export class MediaSection 
  extends withBaseSection(withEffectSearchSection(MediaSortBySection)) 
{
  override service = inject(SearchMediaService)
  
  isMediaImage(item: MediaValue) {
    return item.resourceType === 'Logo Library'
  }

  isMediaVideo(item: MediaValue) {
    return item.resourceType === 'Video'
  }

  onRedirect() { }
}