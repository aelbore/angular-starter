import { runInInjectionContext } from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'

import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators'
import { identity } from 'rxjs'

import { assertInjector } from '@lithium/pages/common/core'

import type { HttpResultOptions } from '@lithium/pages/common/types'

export const httpResult = <TParams, TResult>(
  options: HttpResultOptions<TParams, TResult>
) => {
  const fnCallback = options.data
  const injector = assertInjector(fnCallback, null)
  return runInInjectionContext(injector, () => {
    const { params, initialValue, loading } = options
    const value = initialValue?.() as TResult
    return toSignal(
      toObservable(params!).pipe(
        switchMap(params => {
          loading?.start?.()
          return fnCallback?.(params).pipe(
            value ? startWith(value): identity,
            debounceTime(50),
            distinctUntilChanged(),
            finalize(() => loading?.done?.())
          )
        })
      ), { initialValue: value })
  })
}