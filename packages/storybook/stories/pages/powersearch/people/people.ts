import '@lithium/elements/card'
import '@lithium/elements/layout'
import '@lithium/elements/checkbox'
import '@lithium/elements/avatar'
import '@lithium/elements/button'

import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core'
import { SearchPeopleComponent as SearchPeople } from '@lithium/pages/powersearch'
import type { SearchParams } from '@lithium/pages/powersearch/types'

@Component({
  selector: 'sb-search-people',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ SearchPeople ],
  template: `
    <search-people [searchText]="options().searchText!" />
  `,
  styleUrl: './people.scss'
})
export class SearchPeopleComponent { 
  options = input<SearchParams>({})
}