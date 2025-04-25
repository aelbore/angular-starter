import type { SearchResult } from '@lithium/pages/common/types'

export type PageSourceType = 
  'Initiative'    |
  'Deal Process'  |
  'QuickLink'     |
  'Resource Type' 

export type PageValue = {
  id?: number
  type?: string
  title?: string
  description?: string
  sourceType?: PageSourceType
  linkType?: string
  sectionPath?: string
}

export type PagesSearchResult = Omit<SearchResult, 'results'> & {
  results?: PageValue[]
}