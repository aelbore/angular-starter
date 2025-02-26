import { inject, InjectionToken, Injector, ProviderToken, runInInjectionContext } from '@angular/core'
import { SearchService, SectionType } from './types'

/**
 * Why we use sectionTokens type of Map?
 * Since Angular is using class as the ProviderToken
 * adding to sectionTokens will help to find the service
 * by name or type (string)
 */
const sectionTokens: Map<string, InjectionToken<SearchService>> = new Map()

export const addSectionToken = <T extends SearchService>(
  type: SectionType,
  service: ProviderToken<T>
) => {
  const TOKEN = new InjectionToken(type, {
    providedIn: 'root',
    factory: () => inject(service)
  })
  sectionTokens.set(type, TOKEN)
}

export const getSectionToken = (type: SectionType) => {
  return sectionTokens.get(type) as InjectionToken<SearchService>
}

export const getSectionService = (type: SectionType, injector: Injector) => {
  return runInInjectionContext(injector, () => injector.get(getSectionToken(type)))
}