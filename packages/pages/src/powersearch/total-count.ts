import { inject, Injectable, Injector } from '@angular/core'
import { BehaviorSubject, PartialObserver } from 'rxjs'

import { getSectionServiceByName } from '@lithium/pages/common'
import { SECTION } from '@lithium/pages/powersearch/common'

import type { SearchSectionBaseService } from '@lithium/pages/common/types'

@Injectable({ providedIn: 'root' })
export class SearchTotalCount {
  #injector = inject(Injector)
  #totalCount = new BehaviorSubject<number>(0)

  constructor() {
    const onNext = this.#onNext.bind(this)
    SECTION.forEach(section => {
      const name = `search-${section.toLowerCase()}`
      const service = getSectionServiceByName<SearchSectionBaseService>(name, this.#injector)
      service.totalCount$.subscribe(onNext)
    })
  }

  #onNext(totalCount: number) {
    if (!totalCount || totalCount <= 0) return
    this.#totalCount.next(totalCount)
  }

  subscribe(observer: PartialObserver<number>) {
    this.#totalCount.subscribe(observer)
  }
}