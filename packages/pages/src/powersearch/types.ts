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