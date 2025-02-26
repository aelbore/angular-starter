import { Injectable } from '@angular/core'

import { createUrl } from '../common/shared'
import { SearchBaseService, withSortByService } from '@lithium/pages/powersearch/common/services'
import { addSectionToken } from '@lithium/pages/powersearch/common/section-tokens'

@Injectable({ providedIn: 'root' })
export class SearchPagesService
  extends withSortByService(SearchBaseService)
{ 
  override url = createUrl('Page')
}

addSectionToken('pages', SearchPagesService)