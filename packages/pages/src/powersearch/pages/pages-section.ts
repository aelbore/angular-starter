import { inject, signal } from '@angular/core'
import { withSortBy, withBaseSection, SearchSectionInput, withEffectSearchSection } from '@lithium/pages/common'

import { SearchPagesService } from './pages.service'

import type { SortButtons } from '@lithium/pages/common/types'
import type { PageValue } from './types'

export class PageSortBySection extends withSortBy(SearchSectionInput) {
  sortButtons = signal<SortButtons[]>([
    { value: 'PublishedDate', label: 'Published Date', hasDivider: true },
    { value: 'Title', label: 'Title' }
  ])
}

export class PagesSection extends withBaseSection(withEffectSearchSection(PageSortBySection)) {
  override service = inject(SearchPagesService)
  
  onRedirect(page: PageValue) { 
    this.service.onRedirect(page)
  }

  hasBookmark(page: PageValue) {
    return this.service.hasBookmark(page)
  }
}