import { SearchResult } from '@lithium/pages/common/types'

export type MediaResourceType = 'Video' | 'Logo Library'

export type MediaValue = {
  id?: number
  name?: string
  description?: string
  resourceType?: MediaResourceType
  imageContent?: string
  videoUrl?: string
}

export type MediaSearchResult = Omit<SearchResult, 'results'> & {
  results?: MediaValue[]
}