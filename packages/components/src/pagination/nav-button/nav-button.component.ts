import { Component, effect, ElementRef, inject, input, OnDestroy, output } from '@angular/core'

export type NavigationDirection = 'left' | 'right'

@Component({
  selector: 'nav-button',
  standalone: true,
  template: `
    <button class="nav-button"
      [disabled]="disabled()"
      [attr.tabindex]="tabindex()"
      (click)="onClick.emit()"
      (keyup.enter)="onClick.emit()">
      <i class="chevron" [class.disabled]="disabled()" ></i>
    </button>  
  `,
  styleUrl: './nav-button.component.scss'
})
export class NavigationButton implements OnDestroy { 
  #elementRef = inject<ElementRef<HTMLElement>>(ElementRef)

  #directionEffect = effect(() => {
    this.#elementRef.nativeElement.setAttribute('direction', this.direction())
  })

  disabled = input<boolean>(false)
  tabindex = input<number>(0)
  direction = input<NavigationDirection>('left')

  onClick = output<void>()

  ngOnDestroy() {
    this.#directionEffect.destroy()
  }
}