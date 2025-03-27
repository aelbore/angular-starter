// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Constructor<T = {}> = new (
  ...args: any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */
) => T

export type ArrowState = 'down' | 'up'

export * from '../services/types'
export * from '../core/types'
export * from '../components/types'