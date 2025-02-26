import { computed, ElementRef, inject } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'

import { Subscription } from 'rxjs/internal/Subscription'

import { Constructor } from '@lithium/pages/powersearch/common/constructor'
import type { SectionInput } from '@lithium/pages/powersearch/common/types'

export const withBaseSection = <T extends Constructor<SectionInput>>(BaseComponent: T) => {
  return class BaseSection extends BaseComponent {
    readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
    readonly #subscriptions: Subscription[] = []

    results = computed(() => this.service.result()?.results ?? [])
    totalCount = computed(() => this.service.result()?.totalCount ?? 0)
    paginateArgs = computed(() => this.service.paginateArgs())
  
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

    onPageChange(currentPage: number) {
      this.service.updateCurrentPage(currentPage)
    }
  }
}