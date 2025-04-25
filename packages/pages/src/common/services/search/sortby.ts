import type { SearchParams, SearchService, SearchSortByService, WithService } from '@lithium/pages/common/types'

export const withSortByService = <TService>(
  BaseService: WithService<TService, SearchService>
) => {
  return class SearchSortBy extends BaseService implements SearchSortByService {
    sortBy(params: SearchParams) {
      this.updateParams({ ...params, PageIndex: 1 })
    }
  }
}