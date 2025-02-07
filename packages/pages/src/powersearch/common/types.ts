export type SearchParams = {
  searchText?: string
  PageSize?: number
  PageIndex?: number
}

export type SearchResultTotalCount = {
  totalCount?: number
}

export type SearchResult = {
  totalCount?: number
  results?: unknown[]
} & SearchResultTotalCount

export type ArrowState = 'down' | 'up'

export type ButtonOutputValue = {
  state: ArrowState
  name: SortState
}

export type SortState = 'date' | 'title'