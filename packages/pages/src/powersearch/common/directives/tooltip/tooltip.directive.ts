import { Directive, effect, inject, input, OnDestroy } from '@angular/core'
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip'

@Directive({
  selector: '[tooltip]',
  standalone: true,
  providers: [ MatTooltip ],
  host: {
    '(mouseover)': 'onMouseHover($event)',
    '(mouseleave)': 'onMouseLeave($event)'
  }
})
export class TooltipDirective implements OnDestroy {
  #tooltip = inject(MatTooltip)

  tooltip = input.required<string>()
  tooltipClass = input<string>()
  tooltipPosition = input<TooltipPosition>('below')

  onMouseHover() {
    this.#tooltip.show()
  }

  onMouseLeave() {
    this.#tooltip.hide()
  }
  
  #effect = effect(() => {
    this.#tooltip.message = this.tooltip()
    this.#tooltip.tooltipClass = this.tooltipClass()!
    this.#tooltip.position = this.tooltipPosition()!
  })

  ngOnDestroy() {
    this.#effect.destroy()
  }
}