import type { Constructor, SearchParams, SearchService, SearchSortByService } from '@lithium/pages/common/types'

export const withSortByService = <T extends Constructor<SearchService>>(
  BaseService: T
) => {
  return class SearchSortBy extends BaseService implements SearchSortByService {
    sortBy(params: SearchParams) {
      this.updateParams({ ...params, PageIndex: 1 })
    }
  }
}