import { sanitizeHTML } from './sanitize'
import { PopoverElement, PopoverOptions } from '@lithium/elements/types'

export const createPopover = (options: PopoverOptions) => {
  if (!options.target) return

  const { target, placement, content } = options

  const existingPopover = document.querySelector(`pop-over[for="${target}"]`)
  if (existingPopover) {
    return
  }

  const popover = document.createElement('pop-over') as PopoverElement
  popover.for = target
  popover.placement = placement

  const sanitizedContent = sanitizeHTML(content!)
  popover.appendChild(sanitizedContent)

  document.body.appendChild(popover)

  requestAnimationFrame(() => {
    popover.show = true
  })

  return popover
}

window.createPopover = createPopover

declare global {
  interface Window {
    createPopover(options: PopoverOptions): PopoverElement | undefined
  }
}