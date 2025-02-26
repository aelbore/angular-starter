import { Constructor } from '../constructor'

import type { ArrowState, SearchService, SortParams } from '../types'

export const SortOrder: Record<ArrowState, number> = {
  'down': 1,
  'up': 0
} as const

export const withSortByService = <T extends Constructor<SearchService>>(
  BaseService: T
) => {
  return class SortByService extends BaseService {
    sortBy(params: SortParams) {
      this.updateParams({
        SortBy: params.name,
        SortOrder: SortOrder[params.arrow!]
      })
    }
  }
}