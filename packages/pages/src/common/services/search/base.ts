import { signal } from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'

import { debounceTime, switchMap } from 'rxjs/operators'
import { of } from 'rxjs/internal/observable/of'

import { withPaginationService, GetDataBaseService } from '../base'

import type { SearchParams, SearchResult, SearchService } from '@lithium/pages/common/types'

export class SearchBaseService 
  extends withPaginationService(GetDataBaseService) 
  implements SearchService 
{  
  override params = signal<SearchParams>({ PageIndex: 1, PageSize: 10 })

  override result = toSignal(
    toObservable(this.params)
      .pipe(
        debounceTime(100),
        switchMap(params => {
          return params.searchText
            ? this.getData<SearchResult>(params)
            : of<SearchResult>({})
        })
      )
  ) 
}