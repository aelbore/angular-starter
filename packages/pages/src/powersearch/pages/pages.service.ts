import { Injectable } from '@angular/core'
import { createUrl, SearchBaseService, withSortByService, addSectionToken } from '@lithium/pages/common'

@Injectable({ providedIn: 'root' })
export class SearchPagesService
  extends withSortByService(SearchBaseService)
{ 
  override url = createUrl('Page')
}

addSectionToken('search-pages', SearchPagesService)