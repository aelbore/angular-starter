import { inject, Injectable, runInInjectionContext, signal } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'

import { Subject } from 'rxjs/internal/Subject'
import { assertInjector } from '@lithium/pages/common/core'

import type { HttpResultOptions } from '@lithium/pages/common/types'

@Injectable({
  providedIn: 'root'
})
export class Loader {
  totalCount = signal(0)
  #totalCount = toObservable(this.totalCount)

  loading$ = new Subject<boolean>()

  constructor() {
    this.#totalCount.subscribe(count => {
      this.loading$.next(!(count < 1))
    })
  }
  
  increment(value?: number) {
    this.totalCount.update(c => c + (value ?? 1))
  }

  decrement(value?: number) {
    this.totalCount.update(c => c + (value ?? 1))
  } 
}

export const withLoader = <TParams, TResult>(
  options: HttpResultOptions<TParams, TResult>
) => {
  const injector = assertInjector(withLoader, null)
  return runInInjectionContext(injector, () => {
    const loader = inject(Loader)
    return Object.assign(options, {
      loading: {
        start: () => loader.increment(),
        done: () => loader.decrement()
      }
    })
  })
}