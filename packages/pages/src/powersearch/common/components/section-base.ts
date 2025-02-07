import { 
  Component, 
  computed, 
  effect, 
  ElementRef, 
  inject, 
  input, 
  model, 
  OnDestroy, 
  OnInit
} from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { PaginatePipeArgs } from 'ngx-pagination'
import { Subscription } from 'rxjs/internal/Subscription'

import { SearchBaseService } from '../services/search-base.service'

import type { PaginateArgs } from '@lithium/components/pagination/types'
import type { SearchParams } from '../types'

@Component({ template: '' })
export class SectionBase implements OnInit, OnDestroy {
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  readonly #subscriptions: Subscription[] = []

  #effect = effect(() => {
    const text = this.searchText()
    if (!text) return
    if (text === this.service.params().searchText) return
    this.#updateParams({ searchText: text })
  })

  #itemsPerPageEffect = effect(() => {
    const itemsPerPage = Number(this.itemsPerPage())
    if (itemsPerPage < 1) return
    if (itemsPerPage === this.paginateArgs().itemsPerPage) return
    this.#updatePaginateArgs({ itemsPerPage })
  })

  protected service!: SearchBaseService
    
  searchText = input.required<string>()
  itemsPerPage = input<string | number>(3)

  paginateArgs = model<PaginatePipeArgs & PaginateArgs>({
    itemsPerPage: 3,
    currentPage: 1,
    maxSize: 7,
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
    this.#itemsPerPageEffect.destroy()
    this.#subscriptions.forEach(dispose => dispose.unsubscribe())
  }

  onPageChange(currentPage: number) {
    this.#updatePaginateArgs({ currentPage })
    this.#updateParams({ PageIndex: currentPage })
  }
}