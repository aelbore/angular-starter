import type { AddEventListenerOptions, CSSStyles } from './types'

type TargetElement = {
  prototype?: unknown
}

const toCamelCase = (str: string) => {
  /* eslint no-useless-escape: "off" */
  return str?.toLowerCase()?.replace(/(\-\w)/g, (m) => m[1]?.toUpperCase()) || ''
}

const getSetProps = (target: TargetElement) => {
  const proto = target.prototype ?? target
  return Object.getOwnPropertyNames(proto)
    // @ts-expect-error string cannot use as index
    .filter(s => (typeof target[s] != 'function'))
    .filter(key => !/^(|length|arguments|caller|connectedCallback|disconnecteCallback|render)$/.test(key))
    .reduce((acc, cur) => {
      acc[cur] = null
      return acc
    }, {} as Record<string, string | null>)
}

const toKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

function setStyles(root: ShadowRoot | HTMLElement, styles: CSSStyles) {
  const sheets = Array.isArray(styles) ? styles: [ styles ]
  const adoptedStyleSheets = document.adoptedStyleSheets
  if (adoptedStyleSheets) {
    root.adoptedStyleSheets = [ 
      ...(adoptedStyleSheets || []), 
      ...sheets.map(sheet => {
        if ((sheet as CSSStyleSheet)?.type) {
          return sheet as CSSStyleSheet
        }
        return creatStyleSheet(sheet as string)
      })
    ]
  } else {
    const style = document.createElement('style')
    style.textContent = sheets.map(sheet => {
      return sheet
    })?.join(' ')
    root.appendChild(style)
  }
}

export function css(template: TemplateStringsArray, ...args: unknown[]) {
  const text = (template.raw || template)
  const cssText = text.reduce((cssText, part, i) => cssText + part + (args[i] || ''), '')
  return creatStyleSheet(cssText)
}

export function creatStyleSheet(style: string) {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(style)
  return sheet
}

export function html(strings: TemplateStringsArray, ...values: unknown[]) {
  return strings.reduce((prev, cur, i) => {
    return (prev + cur + (values[i] || ''))
  }, '')
}

export abstract class CustomElement extends HTMLElement {
  #disposes: (() => void)[] = [] 
  #root: ShadowRoot | HTMLElement
  
  constructor() {
    super()
    this.#root = this.createRenderRoot()

    const template = document.createElement('template')
    template.innerHTML = this.render() as string
    this.root.appendChild(document.importNode(template.content, true))

    // @ts-expect-error string cannot use as index
    setStyles(this.root, this.constructor['styles'] ?? [])
  }

  static get observedAttributes() { 
    const props = getSetProps(this)
    return Object.keys(props).map(prop => {
      return toKebabCase(prop)
    })
  }

  get root() {
    return this.#root
  }

  protected get disposes() {
    return this.#disposes
  }

  protected createRenderRoot() {
    return this.attachShadow({ mode: 'open' }) as ShadowRoot | HTMLElement
  }

  protected setBooleanAttr(name: string, value: boolean, el: HTMLElement = this) {
    if (value) el.setAttribute(name, '')
    if (!value) el.removeAttribute(name)
  }

  protected createEventListener(type: string, listener: (event: Event) => void, opitions?: AddEventListenerOptions) {
    const { attachTo, bindTo } = opitions ?? {}
    createAddEventListener(type, listener, {
      disposables: this.#disposes,
      attachTo: attachTo ?? this,
      bindTo: bindTo ?? this
    })
  }

  attributeChangedCallback(n: string, _: string, v: string) {
    const prop = toCamelCase(n)
    // @ts-expect-error string cannot use as index
    const value = this[prop]
    const propValue = typeof value == 'boolean'
      ? !!({ true: 1, '': 1, 1: 1 }[v])
      : typeof value == 'number'
        ? Number(v)
        : typeof value == 'object'
          ? JSON.parse(v)
          : v
    // @ts-expect-error string cannot use as index
    if (propValue !== value) this[prop] = propValue
  }

  disconnectedCallback() {
    this.disposes.forEach(dispose => dispose())
  }

  abstract render(): string
}

export const createAddEventListener = (
  type: string,
  listener: (event: Event) => void,
  { bindTo, attachTo, disposables }: AddEventListenerOptions
) => {
  const host = attachTo ?? window
  const listener$ = bindTo ? listener.bind(bindTo): listener
  host.addEventListener(type, listener$)
  const dispose = () => host.removeEventListener(type, listener$)
  disposables?.push(dispose)
}