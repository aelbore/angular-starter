import { computed, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'

import { catchError, debounceTime, map, switchMap } from 'rxjs/operators'
import { of } from 'rxjs/internal/observable/of'

import type { SearchParams, SearchResult } from '../types'

export class SearchBaseService {
  #url: string
  
  protected http = inject(HttpClient)

  constructor(url: string) {
    this.#url = url
  }

  params = signal<SearchParams>({
    searchText: '',
    PageIndex: 1,
    PageSize: 10
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

  totalCount = computed(() => this.result()?.totalCount)

  getData<TResult>(params: SearchParams) {
    return this.http.get<TResult>(
      this.#url, { params, observe: 'response' }
    ).pipe(
      map(response => response.body as TResult),
      catchError(error => of<TResult>(error))
    )
  }

}