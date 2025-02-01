import { Injectable } from '@angular/core'

import { SearchParams } from '../types'
import { createUrl } from '../shared'
import { SearchBaseService } from '../search-base.service'

@Injectable()
export class SearchPeopleService extends SearchBaseService  { 

  constructor() {
    super(createUrl('Bios'))
  }

  override getData<BiosSearchResult>(params: SearchParams) {
    return super.getData<BiosSearchResult>(params)
  }

}