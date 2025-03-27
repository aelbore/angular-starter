import { signal, untracked } from '@angular/core'

import type { Constructor, SearchComponent, SearchSortByService, SortOrder, SortParams } from '@lithium/pages/common/types'

export const withSortBy = <T extends Constructor<SearchComponent>>(BaseComponent: T) => {
  return class SortByComponent extends BaseComponent  {
    override service!: SearchSortByService

    sortState = signal<SortParams>({ sortOrder: 'down', sortBy: 'PublishedDate' })

    #sortOrder: Record<SortOrder, number> = { 'down': 1, 'up': 0 }

    onSort(event: SortParams | Event) {
      const value = event as SortParams
      const prevActiveSort = untracked(() => this.sortState())
      
      this.sortState.set({
        sortBy: value.sortBy,
        sortOrder: value.sortOrder === prevActiveSort.sortOrder 
          ? value.sortOrder === 'down' ? 'up': 'down'
          : prevActiveSort.sortOrder
      })
      const params = this.sortState()

      this.service.sortBy({
        SortBy: params.sortBy,
        SortOrder: this.#sortOrder[params.sortOrder!]
      })
    }
  }
}