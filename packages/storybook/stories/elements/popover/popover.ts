import '@lithium/elements/popover'

import type { PopoverOptions } from '@lithium/elements/types'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@Component({
  selector: 'sb-popover',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  template: `
    <div class="container">
      <h1>Webex-style Popover Demo</h1>

      <div class="demo-grid">
        <div class="demo-section">
          <button 
            id="bottom-trigger" 
            class="trigger-button"
            (click)="openBottomPopover()">
            Bottom Popover
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './popover.scss'
})
export class PopoverComponent {
  popover!: ReturnType<typeof window.createPopover>

  ngAfterViewInit() {
    this.#createBottomPopover()
  }

  #createPopover(options: PopoverOptions) {
    const popover = window.createPopover(options)
    const gotIdBtn = popover?.querySelector('.popover-actions .action-button')

    const close = popover?.close.bind(popover)

    popover?.addEventListener('click', () => close?.())
    gotIdBtn?.addEventListener('click', () => close?.())

    return popover
  }

  #createBottomPopover() {
    this.#createPopover({
      target: 'bottom-trigger',
      placement: 'bottom',
      arrow: 'left',
      mode: 'auto',
      content: `
        <div class="popover-content">
          <div class="popover-body">
            <h3>Features has moved</h3>
            <p>
              We made a few updates. The look may different, but your
              familiar features are still here
            </p>
          </div>
          <div class="popover-actions">
            <button class="action-button">Got it</button>
          </div>
        </div>      
      `
    })
  }

  openBottomPopover() {
    this.#createBottomPopover()
  }
}