import { Injectable } from '@angular/core'

import { SearchBaseService, withSortByService } from '@lithium/pages/powersearch/common/services'
import { createUrl } from '../common/shared'
import { addSectionToken } from '../common/section-tokens'

@Injectable({ providedIn: 'root' })
export class SearchPeopleService 
  extends withSortByService(SearchBaseService)  
{ 
  override url = createUrl('Bios')
}

addSectionToken('people', SearchPeopleService)