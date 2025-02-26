import type { SearchResult } from '@lithium/pages/powersearch/common/types'

export type PageValue = {
  id?: number
  type?: string
  title?: string
  description?: string
  keywords?: string | string[]
}

export type PagesSearchResult = Omit<SearchResult, 'results'> & {
  results?: PageValue[]
}