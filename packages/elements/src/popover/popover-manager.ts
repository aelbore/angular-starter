import type { PopoverElement } from './types'

export class PopoverManager {
  activePopovers!: Set<unknown>

  constructor() {
    this.activePopovers = new Set()
  }

  canShowPopover() {
    return true
  }

  addPopover(popover: PopoverElement) {
    this.activePopovers.add(popover)
  }

  removePopover(popover: PopoverElement) {
    this.activePopovers.delete(popover)
  }
}