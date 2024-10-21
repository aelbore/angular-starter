export interface Detail<T> {
  detail?: T
}

export interface CoreEventTarget<T> {
  target: (EventTarget | null) & T
  currentTarget: (EventTarget | null) & T
  keyCode?: number
  key?: string
  charCode?: number
}

export type CoreEvent<T> = Event & Detail<T> & CoreEventTarget<T>

export type EventResult<T> = { value: T }