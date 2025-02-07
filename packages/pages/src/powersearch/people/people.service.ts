import { Injectable } from '@angular/core'

import { createUrl } from '../shared'
import { SearchBaseService } from '@lithium/pages/powersearch/common/services'

import type { SearchParams } from '@lithium/pages/powersearch/common/types'

@Injectable()
export class SearchPeopleService extends SearchBaseService  { 
  constructor() {
    super(createUrl('Bios'))
  }

  override getData<BiosSearchResult>(params: SearchParams) {
    return super.getData<BiosSearchResult>(params)
  }
}