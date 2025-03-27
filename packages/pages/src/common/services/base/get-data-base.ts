import { computed, inject, signal } from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { HttpClient } from '@angular/common/http'

import { catchError, debounceTime, map, switchMap } from 'rxjs/operators'
import { of } from 'rxjs/internal/observable/of'

import type { GetDataBase, SectionParams, SectionResult } from '@lithium/pages/common/types'

export class GetDataBaseService implements GetDataBase {
  protected readonly http = inject(HttpClient)
  protected readonly url!: string

  params = signal<SectionParams>({ PageIndex: 1, PageSize: 10 })

  result = toSignal(
    toObservable(this.params)
      .pipe(
        debounceTime(100),
        switchMap(params => {
          return this.getData<SectionResult>(params)
        })
      )
  ) 

  totalCount = computed(() => this.result()?.totalCount ?? 0)

  getData<TResult>(params: SectionParams) {
    return this.http.get<TResult>(
      this.url, { params, observe: 'response' }
    ).pipe(
      map(response => response.body as TResult),
      catchError(error => of<TResult>(error))
    )
  }

  updateParams(value: SectionParams) {
    this.params.update(params => ({ ...params, ...value }))
  }
}