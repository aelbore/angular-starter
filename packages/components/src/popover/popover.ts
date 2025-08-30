import { Component, ElementRef, model, effect, output, viewChild, OnDestroy, ViewContainerRef, input } from '@angular/core'
import { NgClass, NgStyle } from '@angular/common'

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right'
export type PopoverArrowPosition = 'left' | 'center' | 'right' | 'top' | 'bottom'
export type PopoverMode = 'auto' | 'static'

@Component({
  selector: 'popover',
  standalone: true,
  imports: [ NgClass, NgStyle ],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'isVisible() && close.emit()',
    '(window:resize)': 'onWindowScrollOrResize()',
    '(window:scroll)': 'onWindowScrollOrResize()'
  },
  template: `
    <div 
      #popoverContainer
      class="popover-container"
      [class.active]="isVisible()"
      [ngStyle]="getPopoverStyles()"
      (click)="$event.stopPropagation()">
      <div 
        [class]="'popover-arrow'" 
        [ngClass]="getArrowClasses()" 
        [ngStyle]="getArrowStyles()">
      </div>
      <div class="popover-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrl: './popover.scss'
})
export class PopoverComponent implements OnDestroy {
  isVisible = model<boolean>(false)
  position = model<PopoverPosition>('bottom')
  arrowPosition = model<PopoverArrowPosition>('center')
  triggerElement = model<HTMLElement | null>(null)
  mode = model<PopoverMode>('static')
  disableClickOutside = model<boolean>(false)

  custom = input<string>('')
  
  close = output<void>()

  popoverContainer = viewChild<ElementRef>('popoverContainer')
  tempComponent = viewChild('tempComponent', { read: ViewContainerRef })

  private actualPosition: PopoverPosition = 'bottom'
  private actualArrowPosition: PopoverArrowPosition = 'center'

  #effects = effect(() => {
    if (
      (this.isVisible() && this.triggerElement()) || 
      (this.isVisible() && (this.position() || this.mode()))
    ) {
      setTimeout(() => this.updatePosition(), 0)
    }
  })

  ngOnDestroy(): void {
    this.#effects.destroy()
  }

  onDocumentClick(event: Event): void {
    const target = event.target as Node
    if (!(
      this.isVisible() && 
      !this.disableClickOutside() && 
      this.triggerElement() && 
      !this.triggerElement()!.contains(target)
    )) return
    this.close.emit()
  }

  onWindowScrollOrResize(): void {
    if (this.isVisible() && this.mode() === 'static') {
      this.updatePosition()
    }
  }

  private updatePosition(): void {
    if (this.popoverContainer() && this.triggerElement()) {
      const styles = this.getPopoverStyles()
      const element = this.popoverContainer()?.nativeElement
      
      Object.keys(styles).forEach(key => {
        const k = key as keyof CSSStyleDeclaration
        element!.style.setProperty(k, styles[k])
      })
    }
  }

  getArrowClasses(): string {
    return `arrow-${this.actualPosition} arrow-${this.actualPosition}-${this.actualArrowPosition}`
  }

  getArrowStyles() {
    const styles = {} as CSSStyleDeclaration
    
    if (this.actualPosition === 'top' || this.actualPosition === 'bottom') {
      switch (this.actualArrowPosition) {
        case 'left':
          styles.left = '20px'
          styles.transform = 'none'
          break
        case 'right':
          styles.right = '20px'
          styles.left = 'auto'
          styles.transform = 'none'
          break
        case 'center':
        default:
          styles.left = '50%'
          styles.transform = 'translateX(-50%)'
          break
      }
    } else if (this.actualPosition === 'left' || this.actualPosition === 'right') {
      switch (this.actualArrowPosition) {
        case 'top':
          styles.top = '20px'
          styles.transform = 'none'
          break
        case 'bottom':
          styles.bottom = '20px'
          styles.top = 'auto'
          styles.transform = 'none'
          break
        case 'center':
        default:
          styles.top = '50%'
          styles.transform = 'translateY(-50%)'
          break
      }
    }
    
    return styles
  }

  getPopoverStyles() {
    if (!this.triggerElement()) return {} as CSSStyleDeclaration

    if (this.mode() === 'auto') {
      return this.getAutoPositionStyles()
    }

    const triggerRect = this.triggerElement()!.getBoundingClientRect()
    const styles = {
      position: 'fixed',
      zIndex: '1000'
    } as CSSStyleDeclaration

    this.actualPosition = this.position()
    this.actualArrowPosition = this.arrowPosition()

    switch (this.actualPosition) {
      case 'bottom':
        styles.top = `${triggerRect.bottom + 8}px`
        this.setHorizontalPosition(styles, triggerRect)
        break
      case 'top':
        styles.bottom = `${window.innerHeight - triggerRect.top + 8}px`
        this.setHorizontalPosition(styles, triggerRect)
        break
      case 'left':
        styles.right = `${window.innerWidth - triggerRect.left + 8}px`
        this.setVerticalPosition(styles, triggerRect)
        break
      case 'right':
        styles.left = `${triggerRect.right + 8}px`
        this.setVerticalPosition(styles, triggerRect)
        break
    }

    return styles
  }

  private getAutoPositionStyles() {
    if (!this.triggerElement()) return {} as CSSStyleDeclaration

    const triggerRect = this.triggerElement()!.getBoundingClientRect()
    const popoverWidth = 320
    const popoverHeight = 200 
    const margin = 16

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    } as VisualViewport

    const spaceTop = triggerRect.top
    const spaceBottom = viewport.height - triggerRect.bottom
    const spaceLeft = triggerRect.left
    const spaceRight = viewport.width - triggerRect.right

    let bestPosition: PopoverPosition = 'bottom'
    let bestArrowPosition: PopoverArrowPosition = 'center'

    if (spaceBottom >= popoverHeight + margin) {
      bestPosition = 'bottom'
    } else if (spaceTop >= popoverHeight + margin) {
      bestPosition = 'top'
    } else if (spaceRight >= popoverWidth + margin) {
      bestPosition = 'right'
    } else if (spaceLeft >= popoverWidth + margin) {
      bestPosition = 'left'
    } else {
      const maxSpace = Math.max(spaceTop, spaceBottom, spaceLeft, spaceRight)
      if (maxSpace === spaceBottom) bestPosition = 'bottom'
      else if (maxSpace === spaceTop) bestPosition = 'top'
      else if (maxSpace === spaceRight) bestPosition = 'right'
      else bestPosition = 'left'
    }

    if (bestPosition === 'top' || bestPosition === 'bottom') {
      const triggerCenter = triggerRect.left + (triggerRect.width / 2)
      
      if (triggerCenter < viewport.width * 0.3) {
        bestArrowPosition = 'left'
      } else if (triggerCenter > viewport.width * 0.7) {
        bestArrowPosition = 'right'
      } else {
        bestArrowPosition = 'center'
      }
    } else {
      const triggerCenter = triggerRect.top + (triggerRect.height / 2)
      
      if (triggerCenter < viewport.height * 0.3) {
        bestArrowPosition = 'top'
      } else if (triggerCenter > viewport.height * 0.7) {
        bestArrowPosition = 'bottom'
      } else {
        bestArrowPosition = 'center'
      }
    }

    this.actualPosition = bestPosition
    this.actualArrowPosition = bestArrowPosition

    // Generate styles using the determined position
    const styles = {
      position: 'fixed',
      zIndex: '1000'
    } as CSSStyleDeclaration

    switch (this.actualPosition) {
      case 'bottom':
        styles.top = `${triggerRect.bottom + 8}px`
        this.setHorizontalPosition(styles, triggerRect)
        break
      case 'top':
        styles.bottom = `${viewport.height - triggerRect.top + 8}px`
        this.setHorizontalPosition(styles, triggerRect)
        break
      case 'left':
        styles.right = `${viewport.width - triggerRect.left + 8}px`
        this.setVerticalPosition(styles, triggerRect)
        break
      case 'right':
        styles.left = `${triggerRect.right + 8}px`
        this.setVerticalPosition(styles, triggerRect)
        break
    }

    return styles
  }

  private setHorizontalPosition(styles: CSSStyleDeclaration, triggerRect: DOMRect): void {
    switch (this.actualArrowPosition) {
      case 'left':
        styles.left = `${triggerRect.left}px`
        styles.transform = 'none'
        break
      case 'right':
        styles.right = `${window.innerWidth - triggerRect.right}px`
        styles.left = 'auto'
        styles.transform = 'none'
        break
      case 'center':
      default:
        styles.left = `${triggerRect.left + (triggerRect.width / 2)}px`
        styles.transform = 'translateX(-50%)'
        break
    }
  }

  private setVerticalPosition(styles: CSSStyleDeclaration, triggerRect: DOMRect): void {
    switch (this.actualArrowPosition) {
      case 'top':
        styles.top = `${triggerRect.top}px`
        styles.transform = 'none'
        break
      case 'bottom':
        styles.bottom = `${window.innerHeight - triggerRect.bottom}px`
        styles.top = 'auto'
        styles.transform = 'none'
        break
      case 'center':
      default:
        styles.top = `${triggerRect.top + (triggerRect.height / 2)}px`
        styles.transform = 'translateY(-50%)'
        break
    }
  }
}