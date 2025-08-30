import { Component, input, output, computed, ChangeDetectionStrategy, viewChild, ElementRef, model } from '@angular/core'
import { NgClass, NgStyle } from '@angular/common'

import { ArrowPosition, Mode, Position } from './types'

@Component({
  selector: 'hx-popover',
  standalone: true,
  imports: [ NgStyle, NgClass ],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'isVisible() && close.emit()',
    '(window:resize)': 'onWindowResizeOrScroll()',
    '(window:scroll)': 'onWindowResizeOrScroll()'
  },
  template: `
    <div
      #popoverContainer
      [class]="'popover-container'"
      [class.active]="isVisible()"
      [ngStyle]="container()"
      (click)="$event.stopPropagation()">
      <div [ngClass]="arrowClasses()" [ngStyle]="arrowStyles()"></div>
      <div class="popover-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrl: './popover.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Popover { 
  isVisible = model<boolean>(false)
  position = model<Position>('bottom')
  arrowPosition = model<ArrowPosition>('center')
  mode = model<Mode>('static')
  disableClickOutside = input<boolean>(false)
  
  popoverContainer = viewChild<ElementRef<HTMLElement>>('popoverContainer')

  close = output<void>()

  #actualPosition: Position = 'bottom'
  #actualArrowPosition: ArrowPosition = 'center'

  container = computed(() => this.#getPopoverStyles())

  arrowClasses = computed(() => {
    const arrow = `arrow-${this.#actualPosition}`
    return [ 'popover-arrow', arrow, `${arrow}-${this.#actualArrowPosition}` ]
  })
  arrowStyles = computed(() => this.#getArrowStyles())

  triggerElement: HTMLElement | null = null

  onDocumentClick(event: MouseEvent) { 
    const target = event.target as HTMLElement
    if (
      this.isVisible()
      && !this.disableClickOutside 
      && this.triggerElement 
      && !this.triggerElement.contains(target)
    ) {
      this.close.emit()
    }
  }

  onWindowResizeOrScroll() {
    if (!(this.isVisible() && this.mode() === 'static')) return
    this.#updatePosition()
  }

  #updatePosition() {
    if (!(this.popoverContainer() && this.triggerElement)) return

    const styles = this.#getPopoverStyles() as CSSStyleDeclaration
    const element = this.popoverContainer()?.nativeElement 

    Object.keys(styles).forEach(key => {
      element!.style.setProperty(key, styles.getPropertyValue(key))
    })
  }

  #getArrowStyles() {
    const styles = {} as CSSStyleDeclaration
    
    if (this.#actualPosition === 'top' || this.#actualPosition === 'bottom') {
      switch (this.#actualArrowPosition) {
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
    } else if (this.#actualPosition === 'left' || this.#actualPosition === 'right') {
      switch (this.#actualArrowPosition) {
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
          styles.transform = 'translateY(-50%)';
          break
      }
    }
    
    return styles
  }

  #getPopoverStyles() {
    if (!this.triggerElement) return {} as CSSStyleDeclaration

    if (this.mode() === 'auto') {
      return this.#getAutoPositionStyles()
    }

    const triggerRect = this.triggerElement.getBoundingClientRect()
    const styles = {
      position: 'fixed',
      zIndex: '1000'
    } as CSSStyleDeclaration

    this.#actualPosition = this.position()
    this.#actualArrowPosition = this.arrowPosition()

    switch (this.#actualPosition) {
      case 'bottom':
        styles.top = `${triggerRect.bottom + 8}px`
        this.#setHorizontalPosition(styles, triggerRect)
        break
      case 'top':
        styles.bottom = `${window.innerHeight - triggerRect.top + 8}px`
        this.#setHorizontalPosition(styles, triggerRect)
        break
      case 'left':
        styles.right = `${window.innerWidth - triggerRect.left + 8}px`
        this.#setVerticalPosition(styles, triggerRect)
        break
      case 'right':
        styles.left = `${triggerRect.right + 8}px`
        this.#setVerticalPosition(styles, triggerRect)
        break
    }

    return styles as CSSStyleDeclaration
  }

  #getAutoPositionStyles() {
    if (!this.triggerElement) return {};

    const triggerRect = this.triggerElement.getBoundingClientRect()
    const popoverWidth = 320, popoverHeight = 200, margin = 16

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    } as VisualViewport

    const spaceTop = triggerRect.top
    const spaceBottom = viewport.height - triggerRect.bottom
    const spaceLeft = triggerRect.left
    const spaceRight = viewport.width - triggerRect.right

    let bestPosition: Position = 'bottom'
    let bestArrowPosition: ArrowPosition = 'center'

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
      const triggerCenter = triggerRect.top + (triggerRect.height / 2);
      
      if (triggerCenter < viewport.height * 0.3) {
        bestArrowPosition = 'top'
      } else if (triggerCenter > viewport.height * 0.7) {
        bestArrowPosition = 'bottom'
      } else {
        bestArrowPosition = 'center'
      }
    }

    this.#actualPosition = bestPosition
    this.#actualArrowPosition = bestArrowPosition

    const styles = {
      position: 'fixed',
      zIndex: '1000'
    } as CSSStyleDeclaration

    switch (this.#actualPosition) {
      case 'bottom':
        styles.top = `${triggerRect.bottom + 8}px`
        this.#setHorizontalPosition(styles, triggerRect)
        break
      case 'top':
        styles.bottom = `${viewport.height - triggerRect.top + 8}px`
        this.#setHorizontalPosition(styles, triggerRect)
        break
      case 'left':
        styles.right = `${viewport.width - triggerRect.left + 8}px`
        this.#setVerticalPosition(styles, triggerRect)
        break
      case 'right':
        styles.left = `${triggerRect.right + 8}px`
        this.#setVerticalPosition(styles, triggerRect)
        break
    }

    return styles as CSSStyleDeclaration
  }

  #setHorizontalPosition(styles: CSSStyleDeclaration, triggerRect: DOMRect) {
    switch (this.#actualArrowPosition) {
      case 'left':
        styles.left = `${triggerRect.left}px`
        styles.transform = 'none'
        break;
      case 'right':
        styles.right = `${window.innerWidth - triggerRect.right}px`;
        styles.left = 'auto'
        styles.transform = 'none'
        break;
      case 'center':
      default:
        styles.left = `${triggerRect.left + (triggerRect.width / 2)}px`;
        styles.transform = 'translateX(-50%)'
        break;
    }
  }

  #setVerticalPosition(styles: CSSStyleDeclaration, triggerRect: DOMRect) {
    switch (this.#actualArrowPosition) {
      case 'top':
        styles.top = `${triggerRect.top}px`;
        styles.transform = 'none'
        break;
      case 'bottom':
        styles.bottom = `${window.innerHeight - triggerRect.bottom}px`;
        styles.top = 'auto'
        styles.transform = 'none'
        break;
      case 'center':
      default:
        styles.top = `${triggerRect.top + (triggerRect.height / 2)}px`;
        styles.transform = 'translateY(-50%)';
        break;
    }
  }
}