import { 
  Component, 
  computed, 
  effect, 
  ElementRef, 
  inject, 
  input, 
  OnDestroy, 
  OnInit, 
  signal 
} from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { PaginatePipeArgs } from 'ngx-pagination'
import { Subscription } from 'rxjs/internal/Subscription'

import { SearchBaseService } from './search-base.service'

import type { PaginateArgs } from '@lithium/components/pagination/types'
import type { SearchParams } from './types'

@Component({ template: '' })
export class SectionBase implements OnInit, OnDestroy {
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  readonly #subscriptions: Subscription[] = []

  #effect = effect(() => {
    if (!this.searchText()) return
    this.#updateParams({ searchText: this.searchText() })
  })

  protected service!: SearchBaseService
    
  searchText = input('')

  paginateArgs = signal<PaginatePipeArgs & PaginateArgs>({
    itemsPerPage: 2,
    currentPage: 1,
    maxSize: 10,
    totalItems: 0
  })

  results = computed(() => this.service.result()?.results ?? [])
  totalCount = computed(() => this.service.result()?.totalCount ?? 0)

  totalCount$ = toObservable(this.totalCount)

  #updateParams(params: SearchParams) {
    this.service.params.update(value => ({ ...value, ...params }))
  }

  #updatePaginateArgs(args:  PaginatePipeArgs & PaginateArgs) {
    this.paginateArgs.update(current => ({ ...current, ...args }))
  }

  ngOnInit() {
    const dispose = this.totalCount$.subscribe(totalCount => {
      this.#elementRef.nativeElement.setAttribute(
        'total-count', totalCount?.toString() ?? '0'
      )
      this.#updatePaginateArgs({ totalItems: totalCount })
    })
    this.#subscriptions.push(dispose)
  }
  
  ngOnDestroy() {
    this.#effect.destroy()
    this.#subscriptions.forEach(dispose => dispose.unsubscribe())
  }

  onPageChange(currentPage: number) {
    this.#updatePaginateArgs({ currentPage })
    this.#updateParams({ PageIndex: currentPage })
  }
}