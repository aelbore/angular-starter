import { signal, untracked } from '@angular/core'

import { SearchBaseService } from '@lithium/pages/powersearch/common/services'
import { Constructor } from '@lithium/pages/powersearch/common/constructor'

import type { SearchSortByService, SectionInput, SortParams } from '@lithium/pages/powersearch/common/types'

export interface SectionWithSortBy extends SectionInput {
  service: SearchBaseService & SearchSortByService
}

export const withSortBy = <T extends Constructor<SectionWithSortBy>>(BaseComponent: T) => {
  return class SortByComponent extends BaseComponent  {
    sortState = signal<SortParams>({ arrow: 'down', name: 'PublishedDate' })

    onSort(event: SortParams | Event) {
      const value = event as SortParams
      const prevActiveSort = untracked(() => this.sortState())
      this.sortState.set({
        name: value.name,
        arrow: value.name === prevActiveSort.name 
          ? value.arrow === 'down' ? 'up': value.arrow
          : prevActiveSort.arrow
      })
      this.service.sortBy(this.sortState())
    }
  }
}