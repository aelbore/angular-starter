import { effect } from '@angular/core'
import { WithComponent } from '@lithium/pages/common/types'

import type { SearchInput } from '../types'

export const withEffectSearchSection = <TComponent>(
  BaseComponent: WithComponent<TComponent, SearchInput>
) => {
  return class EffectSection extends BaseComponent {
    #effect = effect(() => {
      const text = this.searchText(), itemsPerPage = Number(this.itemsPerPage())
      this.service.updateParams({ searchText: text, PageIndex: 1 })
      this.service.updatePaginateArgs({ currentPage: 1, itemsPerPage })
      this.service.updatePageItems(itemsPerPage)
    })

    override ngOnDestroy() {
      super.ngOnDestroy()
      this.#effect.destroy()
    }
  }
}