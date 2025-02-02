import { booleanAttribute, Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, inject, input, OnDestroy } from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { switchMap } from 'rxjs/internal/operators/switchMap'

@Component({
  selector: 'avatar',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  template: `
    <li-avatar [src]="imgSrc()" [alt]="alt()"></li-avatar>
  `
})
export class AvatarComponent implements OnDestroy { 
  #elementRef = inject(ElementRef)

  #base64Effect = effect(() => {
    const element = this.#elementRef.nativeElement as HTMLElement
    if (this.base64()) element?.setAttribute('base64', '')
    else element?.removeAttribute('base64')
  })

  base64 = input(false, { transform: booleanAttribute })
  src = input<string>()
  alt = input<string>()

  imgSrc = toSignal(
    toObservable(this.base64)
      .pipe(
        switchMap(async value => {
          return value
            ? this.#toBase64(this.src()!)
            : this.#imageToBase64(this.src()!).then(this.#toBase64)
        })
      )
  )

  #toBase64(value: string) {
    return `data:image/png;base64,${value}`
  }

  async #imageToBase64(imageUrl: string) {
    const response = await fetch(imageUrl)
    const buffer = await response.arrayBuffer()  
    const base64String = btoa(
      new Uint8Array(buffer)
        .reduce((data, byte) =>
          data + String.fromCharCode(byte) , '')
    )
    return base64String
  }

  ngOnDestroy() {
    this.#base64Effect.destroy()
  }
}