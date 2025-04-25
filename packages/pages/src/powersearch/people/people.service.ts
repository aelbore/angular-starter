import { Injectable } from '@angular/core'
import { ProfileCardValue } from '@lithium/components/types'
import { SearchBaseService, withSortByService, addSectionToken } from '@lithium/pages/common'
import { createUrl } from '@lithium/pages/powersearch/common'

@Injectable({ providedIn: 'root' })
export class SearchPeopleService 
  extends withSortByService(SearchBaseService)  
{ 
  override url = createUrl('Bios')

  onRedirect(person: ProfileCardValue) { }
}

addSectionToken('search-people', SearchPeopleService)