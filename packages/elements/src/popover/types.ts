import { PopoverState } from './state'

export interface ShadowRootElement {
  root?: ShadowRoot | HTMLElement
}

export interface CoreEventTarget<T> {
  target: (EventTarget | null | Node) & T 
  currentTarget: (EventTarget | null) & T
  keyCode?: number
  key?: string
  charCode?: number
}

export interface Detail<T> {
  detail?: T
}

export type CoreEvent<T> = Event & Detail<T> & CoreEventTarget<T>

export type Position = 'auto' | 'top' | 'left' | 'right' | 'bottom'

export type Positions = Record<Position, () => ({ left: number, top: number })>

export type ViewPort = Record<keyof { width: number, height: number  }, number>

export type PopoverOptions = {
  target: string
  placement?: Position
  content?: string
}

export interface PopoverElement extends HTMLElement, ShadowRootElement {
  placement?: Position
  show?: boolean
  for?: string
  triggerElement?: HTMLElement
  state?: PopoverState
  updatePosition(): void
  closeBtn?: HTMLElement
  close(): void
}