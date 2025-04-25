import { signal } from '@angular/core'

import type { GetDataBase, PaginationArgs, PaginationBaseService, WithService } from '@lithium/pages/common/types'

export const withPaginationService = <TService>(
  BaseService: WithService<TService, GetDataBase>
) => {
  class PaginationService 
    extends BaseService 
    implements PaginationBaseService 
  {
    paginateArgs = signal<PaginationArgs>({ itemsPerPage: 5, currentPage: 1, maxSize: 7, totalItems: 0 })

    updatePaginateArgs(args: PaginationArgs) {
      this.paginateArgs.update(current => ({ ...current, ...args }))
    }
  
    updateCurrentPage(currentPage: number) {
      this.updatePaginateArgs({ currentPage })
      this.updateParams({ PageIndex: currentPage })
    }
  
    updatePageItems(itemsPerPage: number) {
      this.updatePaginateArgs({ itemsPerPage })
      this.updateParams({ PageSize: itemsPerPage })
    }
  }
  return PaginationService
}