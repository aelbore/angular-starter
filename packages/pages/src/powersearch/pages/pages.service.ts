import { Injectable } from '@angular/core'

import { createUrl } from '../shared'
import { SearchBaseService } from '@lithium/pages/powersearch/common/services'

import type { SearchParams } from '@lithium/pages/powersearch/common/types'

@Injectable()
export class SearchPagesService extends SearchBaseService  { 
  constructor() {
    super(createUrl('Page'))
  }

  override getData<PagesSearchResult>(params: SearchParams) {
    return super.getData<PagesSearchResult>(params)
  }
}