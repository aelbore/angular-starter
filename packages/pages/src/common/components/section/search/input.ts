import { Injectable, InputSignal } from '@angular/core'

import { SearchInput } from '../types'
import { SearchService } from '@lithium/pages/common/services/types'

@Injectable()
export class SearchSectionInput implements SearchInput {
  service!: SearchService

  searchText!: InputSignal<string>
  itemsPerPage!: InputSignal<string | number>

  ngOnDestroy() { }

  ngOnInit() { }
}