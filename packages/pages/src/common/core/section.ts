import { HostAttributeToken, inject, InjectionToken, Injector, ProviderToken, runInInjectionContext } from '@angular/core'
import { SearchService, SectionName } from '../types/types'
import { assertInjector } from './injector'

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

export const getSectionToken = <T>(name: SectionName) => {
  return sectionTokens.get(name) as InjectionToken<T>
}

export const getSectionServiceByName = <T>(name: string, injector?: Injector) => {
  const injector$ = assertInjector(getSectionServiceByName, injector!)
  return runInInjectionContext(injector$ , () => {
    return injector$.get(getSectionToken<T>(name as SectionName)) as T
  })
}

export const getSectionService = <T>(injector?: Injector) => {
  const injector$ = assertInjector(getSectionService, injector!)
  return runInInjectionContext(injector$ , () => {
    const name = inject(new HostAttributeToken('name')) as SectionName
    return injector$.get(getSectionToken<T>(name)) as T
  })
}