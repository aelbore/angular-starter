import { InputSignal, OnDestroy, OnInit, Signal } from '@angular/core'
import { SearchBaseService } from './services'

export type SearchParams = {
  searchText?: string
  PageSize?: number
  PageIndex?: number
  SortBy?: string
  SortOrder?: number
}

export type SearchResultTotalCount = {
  totalCount?: number
}

export type SearchResult = { results?: unknown[] } & SearchResultTotalCount

export type ArrowState = 'down' | 'up'

export type ButtonOutputValue = {
  state: ArrowState
  name: SortState
}

export type SortParams = {
  arrow?: ArrowState
  name?: SortState
}

export type SortState = 'PublishedDate' | 'Title'

export interface SearchService {
  updateParams: (value: SearchParams) => void
  result:  Signal<SearchResult | undefined>
}

export interface SearchSortByService {
  sortBy(params: SortParams): void
}

export interface SectionInput extends OnDestroy, OnInit {
  service: SearchBaseService
  searchText: InputSignal<string>
  itemsPerPage: InputSignal<string | number>
}

export type SectionType = 'pages' | 'people' | 'media'