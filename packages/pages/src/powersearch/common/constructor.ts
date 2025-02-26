// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Constructor<T = {}> = new (
  ...args: any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */
) => T