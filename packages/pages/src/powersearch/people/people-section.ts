import { inject, signal } from '@angular/core'

import { withSortBy, withBaseSection, SearchSectionInput, withEffectSearchSection } from '@lithium/pages/common'

import { SearchPeopleService } from './people.service'

import type { SortButtons } from '@lithium/pages/common/types'
import type { ProfileCardValue } from '@lithium/components/types'

export class PeopleSortBySection 
  extends withSortBy(SearchSectionInput) 
{
  sortButtons = signal<SortButtons[]>([
    { value: 'PublishedDate', label: 'Published Date', hasDivider: true },
    { value: 'Title', label: 'Title' }
  ])
}

export class PeopleSection
 extends withBaseSection(withEffectSearchSection(PeopleSortBySection))
{
  override service = inject(SearchPeopleService)
  
  onRedirect(person: ProfileCardValue) { 
    this.service.onRedirect(person)
  }

  tooltip(person: ProfileCardValue) {
    return `${person.name}\n${person.title}\n${person.role ?? ''}`
  }
}