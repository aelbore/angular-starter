import { computed } from '@angular/core'

import { of } from 'rxjs/internal/observable/of'

import { withPaginationService, GetDataBaseService } from '@lithium/pages/common/services/base'
import { httpResult, withLoader } from '@lithium/pages/common/services/core'

import type { SearchParams, SearchResult, SearchService } from '@lithium/pages/common/types'
import { computedPrevious } from '@lithium/pages/common/core'

export class SearchBaseService 
  extends withPaginationService(GetDataBaseService) 
  implements SearchService 
{  
  #prev = computedPrevious<SearchParams>(this.params)

  override result = httpResult(withLoader({
    initialValue: computed(() => {
      const current = this.params() as SearchParams
      return this.#prev().searchText === current.searchText
        ? undefined: { result: [] } as SearchResult
    }),
    params: computed(() => this.params()),
    data: (params: SearchParams) => {
      return params.searchText && params.PageSize! > 0
       ? this.getData<SearchResult>(params!)
       : of({ totalCount: 0, results: []  })
    }
  }))
}