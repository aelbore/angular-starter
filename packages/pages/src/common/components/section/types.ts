import type { InputSignal, OnDestroy, OnInit } from '@angular/core'
import type { SearchService } from '@lithium/pages/common/services/types'

export type SortOrder = 'down' | 'up'

export type SortBy = 'PublishedDate' | 'Title'

export type SortParams = {
  sortOrder?: SortOrder
  sortBy?: SortBy
}

export interface SearchComponent extends OnDestroy, OnInit { 
  service: SearchService
}

export interface SearchInput extends SearchComponent {
  searchText: InputSignal<string>
  itemsPerPage: InputSignal<string | number>
}