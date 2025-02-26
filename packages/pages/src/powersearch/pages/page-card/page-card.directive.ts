import { AfterViewInit, Directive, ElementRef, inject, input } from '@angular/core'

@Directive({
  selector: '[keywordHighlight]',
  standalone: true
})
export class KeywordHighlight implements AfterViewInit {
  #elementRef = inject<ElementRef<HTMLElement>>(ElementRef)

  keywordHighlight = input.required<string | string[]>()

  ngAfterViewInit() {
    const element = this.#elementRef.nativeElement

    const keywordHighlight = this.keywordHighlight()
    const keywords = (
      Array.isArray(keywordHighlight) ? keywordHighlight: [ keywordHighlight ]
    ) as string[]

    keywords.forEach(keyword => {
      const elements = element.querySelectorAll<HTMLElement>(keyword)
      elements.forEach(element => {
        element!.style!.fontWeight = 'bold'
        element!.style!.textDecoration = 'underline'
      })
    })
  }
}