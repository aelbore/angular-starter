import { inject, signal } from '@angular/core'

import { 
  withSortBy, 
  withBaseSection,
  withEffectSection, 
  SectionWithInput 
} from '@lithium/pages/powersearch/common/components'

import { SearchPeopleService } from './people.service'

import type { SortButtons } from '@lithium/pages/powersearch/common/components/types'
import type { ProfileCardValue } from '@lithium/components/types'

class PeopleSectionBase extends withBaseSection(withEffectSection(SectionWithInput)) {
  override service = inject(SearchPeopleService)
}

export class PeopleSection extends withSortBy(PeopleSectionBase) {
  sortButtons = signal<SortButtons[]>([
    { value: 'PublishedDate', label: 'Published Date', hasDivider: true },
    { value: 'Title', label: 'Title' }
  ])

  onRedirect() { }

  tooltip(person: ProfileCardValue) {
    return `${person.name}\n${person.title}\n${person.role ?? ''}`
  }
}