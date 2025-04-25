import { Constructor } from '../types'

export * from './section/types'
export * from './sort-buttons/types'

export type WithComponent<TComponent, TConstructor> = TComponent 
  & Constructor<TConstructor>