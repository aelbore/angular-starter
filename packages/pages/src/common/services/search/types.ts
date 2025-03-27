import type { Signal } from '@angular/core'

import { GetDataBase, PaginationBaseService, SectionParams, SectionResult } from '../base/types'

export type SortByParams = {
  SortBy?: string
  SortOrder?: number
}

export type SearchResult = SectionResult

export type SearchParams = { searchText?: string } & SortByParams & SectionParams

export interface SectionBaseService { }

export interface SearchSectionBaseService extends GetDataBase, PaginationBaseService {
  params: Signal<SearchParams>
  result: Signal<SearchResult | undefined>
}

export interface SearchService extends SearchSectionBaseService {
  updateParams(value: SearchParams): void
}

export interface SearchSortByService extends SearchService {
  sortBy(params: SearchParams): void
}