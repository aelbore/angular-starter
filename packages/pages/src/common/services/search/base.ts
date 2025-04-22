import { of } from 'rxjs/internal/observable/of'
import { map } from 'rxjs/internal/operators/map'

import { withPaginationService, GetDataBaseService, fetchResult } from '../base'

import type { SearchParams, SearchResult, SearchService } from '@lithium/pages/common/types'

export class SearchBaseService 
  extends withPaginationService(GetDataBaseService) 
  implements SearchService 
{  
  override result = fetchResult(
    this.params, 
    (params: SearchParams) => {
      return params.searchText && params.PageSize! > 0 
        ? this.getData<SearchResult>(params)
        : of<SearchResult>({})
  })

  override getData<TResult>(params: SearchParams) {
    this.setLoading(true)
    return super.getData<TResult>(params).pipe(
      map(results => {
        this.setLoading(false)
        return results
      }))
  }
}