import { inject, signal } from '@angular/core'

import { withSortBy, withBaseSection, withEffectSection, SectionWithInput } from '@lithium/pages/powersearch/common/components'

import { SearchPagesService } from './pages.service'

import type { SortButtons } from '@lithium/pages/powersearch/common/components/types'

class PagesSectionBase extends withBaseSection(withEffectSection(SectionWithInput)) {
  override service = inject(SearchPagesService)
}

export class PagesSection extends withSortBy(PagesSectionBase) {
  override service = inject(SearchPagesService)
  
  sortButtons = signal<SortButtons[]>([
    { value: 'PublishedDate', label: 'Published Date', hasDivider: true },
    { value: 'Title', label: 'Title' }
  ])

  onRedirect() { }
}