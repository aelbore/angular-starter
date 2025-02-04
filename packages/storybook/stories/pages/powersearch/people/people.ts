import '@lithium/elements/card'
import '@lithium/elements/layout'
import '@lithium/elements/checkbox'
import '@lithium/elements/avatar'
import '@lithium/elements/button'

import { Component, input, OnInit, viewChild } from '@angular/core'
import { SearchPeopleComponent as SearchPeople } from '@lithium/pages/powersearch'
import type { SearchParams } from '@lithium/pages/powersearch/types'

@Component({
  selector: 'sb-search-people',
  standalone: true,
  imports: [ SearchPeople ],
  template: `
    <search-people [searchText]="options().searchText!" />
  `,
  styleUrl: './people.scss'
})
export class SearchPeopleComponent implements OnInit { 
  options = input<SearchParams>({})

  people = viewChild(SearchPeople)

  ngOnInit() {
    this.people()?.totalCount$.subscribe(totalCount => {
      console.info(`Storybook Search People >> TotalCount: ${totalCount}`)
    })
  }
}