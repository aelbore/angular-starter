import { OutputEmitterRef } from '@angular/core'

export type Content = {
  title?: string
  description?: string
}

export interface PopoverOutputClose {
  close?: OutputEmitterRef<void>
}