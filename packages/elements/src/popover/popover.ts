import type { ArrowPosition, CalculatePositionOptions, PopoverMode, Position, ViewPort } from '@lithium/elements/types'

import { CustomElement, html } from '@lithium/elements/core'

import { PopoverState } from './state'
import { $calculatePosition, calculateStaticPosition } from './position'
import { EventManager } from './event-manager'
import { PopoverManager } from './popover-manager'
import { ViewportObserver } from './viewport-observer'

import './popover.scss'

export class PopoverElement extends CustomElement {
  static elementName = 'pop-over'

  #placement!: Position
  #for!: string
  #show!: boolean
  #mode!: PopoverMode
  #arrowPosition!: ArrowPosition

  #wasVisible!: boolean
  #mutationObserver!: MutationObserver

  state: PopoverState
  events: EventManager
  manager: PopoverManager
  viewportObserver: ViewportObserver

  constructor() {
    super()
    this.state = new PopoverState()
    this.events = new EventManager(this)
    this.manager = new PopoverManager()
    this.viewportObserver = new ViewportObserver()
    this.#mutationObserver = new MutationObserver(this._checkTriggerExists.bind(this))
    this.#wasVisible = this.show
  }

  get #content() {
    return this.root.querySelector<HTMLDivElement>('.content')
  }

  get #arrow() {
    return this.root.querySelector<HTMLDivElement>('.arrow')
  }

  get placement() {
    return this.#placement ?? 'auto'
  }

  set placement(value: Position) {
    this.#placement = value
    this.setAttribute('placement', this.#placement)
    this.#content?.setAttribute('data-placement', this.#placement)
  }

  get for() {
    return this.#for
  }

  set for(value: string) {
    this.#for = value
    this.setAttribute('for', this.#for)
  }

  get show() {
    return this.#show ?? false
  }

  set show(value: boolean) {
    if (value && !this.manager.canShowPopover()) {
      return
    }
    this.#show = value      
    this.setBooleanAttr('show', this.show)
  }

  get mode() {
    return this.#mode ?? 'auto'
  }

  set mode(value: PopoverMode) {
    this.#mode = value
    this.setAttribute('mode', this.mode)
    this.#content?.setAttribute('data-mode', this.mode)
  }

  get arrow() {
    return this.#arrowPosition ?? 'center'
  }

  set arrow(value: ArrowPosition) {
    this.#arrowPosition = value
    this.setAttribute('arrow', this.#arrowPosition)
    this.#content?.setAttribute('data-arrow', this.#arrowPosition)
  }

  get triggerElement() {
    return document.getElementById(this.for)!
  }

  get closeBtn() {
    return this.root.querySelector<HTMLDivElement>('.close-button')!
  }

  updatePosition() {
    if (!this.triggerElement) {
      this.close()
      return
    }

    const content = this.#content, arrow = this.#arrow
    if (!content || !arrow || !this.triggerElement) return

    const triggerRect = this.triggerElement.getBoundingClientRect()
    const contentRect = content?.getBoundingClientRect()
    const viewport: ViewPort = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    const options = {
      triggerRect,
      contentRect,
      viewport,
      preferredPlacement: this.placement,
      arrowPlacement: this.arrow
    } as CalculatePositionOptions

    const { placement, coords, arrowCoords } = this.mode === 'static' 
      ? calculateStaticPosition(options)
      : $calculatePosition(options)

    this.placement = placement!

    Object.assign(content?.style ?? {}, {
      top: `${coords.top}px`,
      left: `${coords.left}px`
    })

    Object.assign(arrow?.style ?? {}, {
      top: arrowCoords.top === 'auto' ? 'auto' : `${arrowCoords.top}px`,
      right: arrowCoords.right === 'auto' ? 'auto' : `${arrowCoords.right}px`,
      bottom: arrowCoords.bottom === 'auto' ? 'auto' : `${arrowCoords.bottom}px`,
      left: arrowCoords.left === 'auto' ? 'auto' : `${arrowCoords.left}px`
    })
  }

  close() {
    this.#wasVisible = false
    this.show = false
  }

  cleanup() {
    this.events.removeEvents()
    this.manager.removePopover(this)

    if (this.triggerElement) {
      this.viewportObserver.unobserve(this.triggerElement)
    }
    this.#mutationObserver.disconnect()
    if (this.#content) {
      this.#content.removeEventListener('transitionend', this._handleTransitionEnd)
    }
  }

  showContent() {   
    if (!this.triggerElement) {
      this.close()
      return
    }

    if (!this.#content) return
    requestAnimationFrame(() => {
      this.#content?.classList.add('show')
      this.manager.addPopover(this)
      this.updatePosition()
    })
  }

  handleTriggerVisibility(isVisible: boolean) {
    if (!isVisible && this.show) {
      this.#wasVisible = true
      this.hideContent()
    } else if (isVisible && (this.#wasVisible || this.mode === 'static')) {
      this.showContent()
    }
  }

  _handleTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName !== 'opacity') return
    
    if (!this.#content) return
    
    this.#content.removeEventListener('transitionend', this._handleTransitionEnd)
    
    if (!this.show) {
      this.cleanup()
      if (this.parentNode) {
        this.parentNode.removeChild(this)
      }
    }
  }

  _checkTriggerExists() {
    if (!this.triggerElement) {
      this.close()
    }
  }

  hideContent() {
    const content = this.#content
    if (!content) return

    content.removeEventListener('transitionend', this._handleTransitionEnd)
    content.addEventListener('transitionend', this._handleTransitionEnd)
    
    requestAnimationFrame(() => {
      content.classList.remove('show')
    })
  }

  handleShowAttribute() {
    if (!this.#content) return

    if (this.show) {
      if (!this.manager.canShowPopover()) {
        return
      }
      if (!this.triggerElement?.isConnected) {
        this.close()
        return
      }
      this.#wasVisible = true
      this.showContent()
      this.state.isOpen = true
    } else {
      this.#wasVisible = false
      this.hideContent()
      this.state.isOpen = false
    }
  }

  connectedCallback() {
    this.events.setupEvents()

    if (this.triggerElement) {
      this.viewportObserver.observe(
        this.triggerElement, 
        this.handleTriggerVisibility.bind(this)
      )
    }

    if (this.show) {
      requestAnimationFrame(() => {
        this.handleShowAttribute()
      })
    }

    this.#mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this.cleanup()
  }

  override attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue)

    if (name === 'for') {
      if (oldValue) {
        const oldTrigger = document.getElementById(oldValue)
        if (oldTrigger) {
          this.viewportObserver.unobserve(oldTrigger)
        }
      }
      const newTrigger = document.getElementById(newValue)
      if (newTrigger) {
        this.viewportObserver.observe(newTrigger, this.handleTriggerVisibility.bind(this))
      } else {
        this.close()
      }
    }

    if (name === 'show') {
      requestAnimationFrame(() => {
        this.handleShowAttribute()
      })
    }

    // if (name === 'placement' || name === 'mode' || name === 'arrow') {
    //   this.updatePosition()
    // }
  }

  override render() {
    return html `
      <div class="content">
        <button class="close-button" aria-label="Close popover">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M3.646 2.646a.5.5 0 0 1 .708 0L8 6.293l3.646-3.647a.5.5 0 0 1 .708.708L8.707 7l3.647 3.646a.5.5 0 0 1-.708.708L8 7.707l-3.646 3.647a.5.5 0 0 1-.708-.708L7.293 7 3.646 3.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
        <div class="arrow"></div>
        <div class="content-inner">
          <slot></slot>
        </div>
      </div>
    `
  }
}

customElements.define(PopoverElement.elementName, PopoverElement)