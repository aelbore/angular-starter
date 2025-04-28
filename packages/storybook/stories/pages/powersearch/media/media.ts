import '@lithium/elements/card'
import '@lithium/elements/layout'

import { Component, input } from '@angular/core'
import { SearchMediaComponent } from '@lithium/pages/powersearch'

import type { SearchParams } from '@lithium/pages/common/types'

@Component({
  selector: 'sb-search-media',
  standalone: true,
  imports: [ 
    SearchMediaComponent
  ],
  template: `
    <search-media 
      [searchText]="options().searchText!"
      [itemsPerPage]="options().PageSize!" />
  `
})
export class SbSearchMedia { 
  options = input<SearchParams>({})
}