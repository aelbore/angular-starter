import '@lithium/elements/popover'

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

  constructor() {
    this.#createBottomPopover()
  }

  #createBottomPopover() {
    window.createPopover({
      target: 'bottom-trigger',
      placement: 'bottom',
      content: `
        <div class="popover-content">
          <h3>Bottom Placement</h3>
          <p>This popover appears below the trigger with smart positioning.</p>
          <div class="popover-actions">
            <button class="action-button">Action 1</button>
            <button class="action-button">Action 2</button>
          </div>
        </div>      
      `})
  }

  openBottomPopover() {
    this.#createBottomPopover()
  }
}