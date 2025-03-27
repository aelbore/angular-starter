import { Injectable } from '@angular/core'

import { createUrl, SearchBaseService, addSectionToken } from '@lithium/pages/common'

@Injectable({ providedIn: 'root' })
export class SearchDealsService extends SearchBaseService {
  override url = createUrl('DealDatabase')
}

addSectionToken('search-deals', SearchDealsService)