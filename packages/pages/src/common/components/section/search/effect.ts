import { effect } from '@angular/core'
import { Constructor } from '@lithium/pages/common/types'

import type { SearchInput } from '../types'

export const withEffectSearchSection = <T extends Constructor<SearchInput>>(BaseComponent: T) => {
  return class EffectSection extends BaseComponent {
    #effect = effect(() => {
      const text = this.searchText()
      if (!text || text === this.service.params().searchText) return
      this.service.updateParams({ searchText: text })
    })

    #itemsPerPageEffect = effect(() => {
      const itemsPerPage = Number(this.itemsPerPage())
      if (itemsPerPage < 1 || 
        (itemsPerPage === this.service.paginateArgs?.().itemsPerPage)
      ) return
      this.service.updatePageItems(itemsPerPage)
    })

    override ngOnDestroy() {
      super.ngOnDestroy()
      this.#effect.destroy()
      this.#itemsPerPageEffect.destroy()
    }
  }
}