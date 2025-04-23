import { inject, Pipe, PipeTransform, Injector, runInInjectionContext } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

import { assertInjector  } from '@lithium/pages/common/core'

export const safeHtmlPipe = (injector?: Injector) => {
  return runInInjectionContext(
    assertInjector(safeHtmlPipe, injector),
    () => inject(DomSanitizer)
  )
}

@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  #sanitizer = inject(DomSanitizer)

  transform(value: string) {
    return this.#sanitizer.bypassSecurityTrustHtml(value)
  }
}