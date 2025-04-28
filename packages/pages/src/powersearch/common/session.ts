import { SECTION } from './section'

import type { SearchFeatureToggle, SearchSectionType } from './types'

export const getFeatureToggle = (key: SearchSectionType) => {
  const item = sessionStorage.getItem(`POWERSEARCH_FEATURE_TO_${key.toLocaleUpperCase()}`)
  return item ? Boolean(JSON.parse(item)): false
}

export const PowerSearchFeatureToggle = SECTION.reduce((p, c) => {
  const value = { [`is${c}Feature`]: () => getFeatureToggle(c) }
  return Object.assign(p, value)
}, {} as SearchFeatureToggle)