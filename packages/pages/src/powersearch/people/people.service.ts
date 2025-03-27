import { Injectable } from '@angular/core'
import { createUrl, SearchBaseService, withSortByService, addSectionToken } from '@lithium/pages/common'

@Injectable({ providedIn: 'root' })
export class SearchPeopleService 
  extends withSortByService(SearchBaseService)  
{ 
  override url = createUrl('Bios')
}

addSectionToken('search-people', SearchPeopleService)