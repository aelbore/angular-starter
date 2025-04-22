import { computed, inject, Signal, signal, WritableSignal } from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { HttpClient } from '@angular/common/http'

import { catchError, debounceTime, map, switchMap } from 'rxjs/operators'
import { of } from 'rxjs/internal/observable/of'
import { Observable } from 'rxjs/internal/Observable'

import type { GetDataBase, SectionParams, SectionResult } from '@lithium/pages/common/types'

export const fetchResult = <T extends SectionParams>(
  params: WritableSignal<T>,
  fn: (params: T) => Observable<SectionResult>
) => {
  return toSignal(
    toObservable(params)
      .pipe(debounceTime(100), switchMap(params => fn(params)))
  )
}

export class GetDataBaseService implements GetDataBase {
  protected readonly http = inject(HttpClient)
  protected readonly url!: string

  params = signal<SectionParams>({ PageIndex: 1, PageSize: 10 })
  loading = signal<boolean>(true)

  result!: Signal<SectionResult | undefined>

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

  setLoading(value: boolean) {
    this.loading.set(value)
  }
}