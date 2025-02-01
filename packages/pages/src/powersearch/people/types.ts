import type { ProfileCardValue } from '@lithium/components/types'
import type { SearchResult } from '../types'

export type BiosSearchResult = Omit<SearchResult, 'results'> & {
  results?: ProfileCardValue[]
}

export type ArrowState = 'down' | 'up'

export type ButtonOutputValue = {
  state: ArrowState
  name: SortState
}

export type SortState = 'date' | 'title'