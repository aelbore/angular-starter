import { computed } from '@angular/core'

import { of } from 'rxjs/internal/observable/of'
import { toObservable } from '@angular/core/rxjs-interop'

import { withPaginationService, GetDataBaseService } from '@lithium/pages/common/services/base'
import { httpResult, withLoader } from '@lithium/pages/common/services/core'
import { computedPrevious } from '@lithium/pages/common/core'

import type { SearchParams, SearchResult, SearchService } from '@lithium/pages/common/types'

export class SearchBaseService 
  extends withPaginationService(GetDataBaseService) 
  implements SearchService 
{  
  #prev = computedPrevious<SearchParams>(this.params)

  totalCount$ = toObservable(this.totalCount)

  override result = httpResult(withLoader({
    initialValue: computed(() => {
      const current = this.params() as SearchParams
      return this.#prev().searchText === current.searchText
        ? undefined: { totalCount: 0, result: [] } as SearchResult
    }),
    params: computed(() => this.params()),
    data: (params: SearchParams) => this.search<SearchResult>(params)
  }))

  protected search<TResult>(params: SearchParams) {
    return params.searchText && params.PageSize! > 0
      ? this.getData<TResult>(params!)
      : of({ totalCount: 0, results: []  })
  }
}