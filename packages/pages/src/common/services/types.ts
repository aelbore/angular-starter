import type { Constructor } from '../types'

export * from './base/types'
export * from './search/types'

export type WithService<TService, TConstructor> = TService & Constructor<TConstructor>