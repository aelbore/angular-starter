import { computed, ElementRef, inject } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'

import { Subscription } from 'rxjs/internal/Subscription'
import { WithComponent } from '@lithium/pages/common/types'

import { SearchComponent } from '../types'

export * from './effect'
export *  from './input'

export const withBaseSection = <TComponent>(
  BaseComponent: WithComponent<TComponent, SearchComponent>
) => {
  return class BaseSection extends BaseComponent {
    readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
    readonly #subscriptions: Subscription[] = []

    results = computed(() => this.service.result()?.results ?? [])
    totalCount = computed(() => this.service.totalCount())

    totalCount$ = toObservable(this.totalCount)
    results$ = toObservable(this.results)

    override ngOnInit() {
      super.ngOnInit()
      const dispose = this.totalCount$.subscribe(totalCount => {
        this.#elementRef.nativeElement.setAttribute(
          'total-count', totalCount?.toString() ?? '0'
        )
        this.service.updatePaginateArgs({ totalItems: totalCount })
      })
      this.#subscriptions.push(dispose)

      this.service.updatePaginateArgs({ 
        id: this.#elementRef.nativeElement.tagName.toLowerCase() 
      })
    }

    override ngOnDestroy() {
      super.ngOnDestroy()
      this.#subscriptions.forEach(dispose => dispose.unsubscribe())
    }
  }
}