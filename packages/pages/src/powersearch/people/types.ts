import type { ProfileCardValue } from '@lithium/components/types'
import type { SearchResult } from '../types'

export type BiosSearchResult = Omit<SearchResult, 'results'> & {
  results?: ProfileCardValue[]
}