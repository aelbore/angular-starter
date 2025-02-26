import { Injectable, InputSignal } from '@angular/core'
import { SearchBaseService } from '@lithium/pages/powersearch/common/services'

import { SectionInput } from '@lithium/pages/powersearch/common/types'

@Injectable()
export class SectionWithInput implements SectionInput {
  service!: SearchBaseService

  searchText!: InputSignal<string>
  itemsPerPage!: InputSignal<string | number>

  ngOnDestroy() { }

  ngOnInit() {}
}