import { SECTION } from './section'

export type SearchSectionType = typeof SECTION[number]

export type SearchFeatureToggle = Record<`is${SearchSectionType}Feature`, () => boolean>