import { PopoverElement } from '@lithium/elements/types'

export class EventManager {
  popover!: PopoverElement
  resizeTicking!: boolean

  constructor(popover: PopoverElement) {
    this.popover = popover
    this._handleResize = this._handleResize.bind(this)
    this.resizeTicking = false
  }

  setupEvents() {
    window.addEventListener('resize', this._handleResize)
    window.addEventListener('scroll', this._handleResize, true)
  }

  removeEvents() {
    window.removeEventListener('resize', this._handleResize)
    window.removeEventListener('scroll', this._handleResize, true)
  }

  _handleResize() {
    if (!this.popover.state?.isOpen) return

    if (!this.resizeTicking) {
      requestAnimationFrame(() => {
        this.popover.updatePosition()
        this.resizeTicking = false
      })
      this.resizeTicking = true
    }
  }
}