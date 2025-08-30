import '@lithium/elements/button'

import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, OnDestroy, OnInit, signal, TemplateRef, viewChild } from '@angular/core'
import { PopoverRef } from '@lithium/components/popover/ref/popover-ref'
import { waitForElementVisible } from '@lithium/components/popover/utils/viewport'
import { PopoverContent } from '@lithium/components/popover/content/popover-content'
import { PopoverPosition } from '@lithium/components/popover'
import { ArrowPosition } from '@lithium/elements/types'

@Component({
  selector: 'hx-popover-story',
  standalone: true,
  template: `
    <div>
      @if (isVisible()) {
        <button id="triggerButton">Click me to toggle Popover</button>
      }
    </div>
  `,
  styles: `
    :host {
      margin: 200px;
      display: grid;
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopoverStory implements OnDestroy, OnInit {
  #popoverRef = inject(PopoverRef)
  #elementRef = inject(ElementRef)

  position = input<PopoverPosition>('left')
  arrow = input<ArrowPosition>('center')

  isVisible = signal(false)

  #effect = effect(() => {
    console.log(this.position(), this.arrow())
    const elementId = 'triggerButton'

    waitForElementVisible(elementId, { 
      threshold: 0.5,
      parentElement: this.#elementRef.nativeElement
    })
    .then(visible => {
      if (!visible) return
      this.#popoverRef.openPopover({
        elementId,
        content: PopoverContent,
        componentInputs: {
          content: computed(() => ({ 
            title: 'Popover Title',
            description: `
              This is a description for the popover content. 
              You can put any information here.`
          }))
        },
        position: this.position(),
        arrowPosition: this.arrow(),
        mode: 'static',
        disableClickOutside: true,
        customClass: 'custom-popover'
      })
    })

  })

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible.set(true)
    }, 3000)
  }

  ngOnDestroy(): void {
    this.#effect.destroy()
  }

  onClose() { 

  }

  onOpen() { 

  }

}