import { sanitizeHTML } from './sanitize'
import { PopoverElement, PopoverOptions } from './types'

const createTempate = (options: PopoverOptions) => {
  const { target, placement, mode, arrow } = options
  const template = document.createElement('template')
  template.innerHTML = `
    <pop-over 
      for=${target} 
      placement=${placement} 
      mode=${mode} 
      arrow=${arrow}></pop-over>
  `
  return document.importNode(template.content, true)
}

export const createPopover = (options: PopoverOptions) => {
  if (!options?.target) return

  const { target, content } = options
  const selector = `pop-over[for=${target}]`

  if (document.querySelector(selector)) return

  document.body.appendChild(createTempate(options))

  const popover = document.querySelector<PopoverElement>(selector)
  popover?.appendChild(sanitizeHTML(content!))

  requestAnimationFrame(() => {
    popover!.show = true
  })

  return popover
}

window.createPopover = createPopover

declare global {
  interface Window {
    createPopover?(options: PopoverOptions): PopoverElement | null | undefined
  }
}