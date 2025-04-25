import { Injectable } from '@angular/core'

import { SearchBaseService, withSortByService, addSectionToken } from '@lithium/pages/common'
import { createUrl } from '@lithium/pages/powersearch/common'
import { PageValue } from './types'
import { SearchParams } from '@lithium/pages/common/types'

@Injectable({ providedIn: 'root' })
export class SearchPagesService
  extends withSortByService(SearchBaseService)
{ 
  override url = createUrl('Page')

  override updateCurrentPage(currentPage: number) {
    this.updatePaginateArgs({ currentPage })    
  }

  override search<TResult>(params: SearchParams) {
    params.PageSize = 10000
    return super.search<TResult>(params)
  }

  hasBookmark(page: PageValue) { }

  onRedirect(page: PageValue) { }
}

addSectionToken('search-pages', SearchPagesService)