import { Injectable } from '@angular/core'

import { SearchBaseService, withSortByService, addSectionToken } from '@lithium/pages/common'
import { createUrl } from '@lithium/pages/powersearch/common'

@Injectable({ providedIn: 'root' })
export class SearchMediaService
  extends withSortByService(SearchBaseService)
{ 
  override url = createUrl('Media')

}

addSectionToken('search-media', SearchMediaService)