import { computed, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'

import { catchError, debounceTime, map, switchMap } from 'rxjs/operators'
import { of } from 'rxjs/internal/observable/of'

import type { PaginatePipeArgs } from 'ngx-pagination'
import type { PaginateArgs } from '@lithium/components/pagination/types'
import type { SearchParams, SearchResult, SearchService } from '../types'

export class SearchBaseService implements SearchService  {  
  protected http = inject(HttpClient)
  protected url!: string

  params = signal<SearchParams>({})
  paginateArgs = signal<PaginatePipeArgs & PaginateArgs>({
    itemsPerPage: 5, currentPage: 1, maxSize: 7, totalItems: 0
  })

  result = toSignal(
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

  totalCount = computed(() => this.result()?.totalCount ?? 0)

  getData<TResult>(params: SearchParams) {
    const { PageIndex = 1, PageSize = 10, searchText = ''  } = params
    return this.http.get<TResult>(
      this.url, { 
        params: { searchText, PageIndex, PageSize }, 
        observe: 'response' 
      }
    ).pipe(
      map(response => response.body as TResult),
      catchError(error => of<TResult>(error))
    )
  }

  updateParams(value: SearchParams) {
    this.params.update(params => ({ ...params, ...value }))
  }

  updatePaginateArgs(args: PaginatePipeArgs & PaginateArgs) {
    this.paginateArgs.update(current => ({ ...current, ...args }))
  }

  updateCurrentPage(currentPage: number) {
    this.updatePaginateArgs({ currentPage })
    this.updateParams({ PageIndex: currentPage })
  }

  updatePageItems(itemsPerPage: number) {
    this.updatePaginateArgs({ itemsPerPage })
    this.updateParams({ PageSize: itemsPerPage })
  }
}