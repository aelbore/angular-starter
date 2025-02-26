import '@lithium/elements/card'
import '@lithium/elements/layout'
import '@lithium/elements/checkbox'
import '@lithium/elements/avatar'
import '@lithium/elements/button'

import { Component, input, OnInit, viewChild } from '@angular/core'
import { SearchPagesComponent as SearchPages } from '@lithium/pages/powersearch'
import type { SearchParams } from '@lithium/pages/powersearch/common/types'

@Component({
  selector: 'sb-search-pages',
  standalone: true,
  imports: [ SearchPages ],
  template: `
    <search-pages 
      [searchText]="options().searchText!"
      [itemsPerPage]="options().PageSize!">
      <ng-template let-page>
        <i class="heart"></i>
      </ng-template>
    </search-pages>
  `,
  styleUrl: './pages.scss'
})
export class SearchPagesComponent implements OnInit { 
  options = input<SearchParams>({})

  pages = viewChild(SearchPages)

  ngOnInit() {
    this.pages()?.totalCount$.subscribe(totalCount => {
      console.info(`Storybook Search Pages >> TotalCount: ${totalCount}`)
    })
  }
}