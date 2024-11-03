export class ViewportObserver {
  observers!: Map<HTMLElement, IntersectionObserver>

  constructor() {
    this.observers = new Map()
  }

  observe(
    element: HTMLElement, 
    callback: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void
  ) {
    if (!element || this.observers.has(element)) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        callback(entry.isIntersecting, entry)
      })
    }, { root: null, rootMargin: '0px', threshold: [0, 0.1] })

    observer.observe(element)
    this.observers.set(element, observer)
  }

  unobserve(element: HTMLElement) {
    const observer = this.observers.get(element)
    if (observer) {
      observer.disconnect()
      this.observers.delete(element)
    }
  }
}