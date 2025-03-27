import { inject, InjectionToken, Injector, ProviderToken, runInInjectionContext } from '@angular/core'
import { SearchService, SectionName } from '../types/types'

/**
 * Why we use sectionTokens type of Map?
 * Since Angular is using class as the ProviderToken
 * adding to sectionTokens will help to find the service
 * by name or type (string)
 */
const sectionTokens: Map<string, InjectionToken<SearchService>> = new Map()

export const addSectionToken = <T extends SearchService>(
  name: SectionName,
  service: ProviderToken<T>
) => {
  const TOKEN = new InjectionToken(name, {
    providedIn: 'root',
    factory: () => inject(service)
  })
  sectionTokens.set(name, TOKEN)
}

export const getSectionToken = (name: SectionName) => {
  return sectionTokens.get(name) as InjectionToken<SearchService>
}

export const getSectionService = (name: SectionName, injector: Injector) => {
  return runInInjectionContext(injector, () => injector.get(getSectionToken(name)))
}