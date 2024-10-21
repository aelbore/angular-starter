export type AddEventListenerOptions = {
  bindTo?: unknown
  attachTo?: Window | HTMLElement | null
  disposables?: (() => void)[]
}

export type CSSStyles = string | string[] | CSSStyleSheet | CSSStyleSheet[]

declare global {
  interface Document {
    adoptedStyleSheets?: CSSStyleSheet[]
  }
  interface ShadowRoot {
    adoptedStyleSheets?: CSSStyleSheet[]
  }
  interface HTMLElement {
    adoptedStyleSheets?: CSSStyleSheet[]
  }
  interface CSSStyleSheet {
    replaceSync(text: string): void
  }
}