import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'typeStripText',
  standalone: true
})
export class StripTextPipe implements PipeTransform {
  #toKebabCase(value: string) {
    return value?.replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
      .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}_${b.toLowerCase()}`)
      .replace(/[^A-Za-z0-9]+|_+/g, '-')
      .toLowerCase()
  }

  #toPascalCase(value: string) {
    return value?.replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '$')
      .replace(/[^A-Za-z0-9]+/g, '$')
      .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}$${b}`)
      .toLowerCase()
      .replace(/(\$)(\w?)/g, (_, a, b) => b.toUpperCase())
  }

  transform(value: string) {
    const v = this.#toKebabCase(
      this.#toPascalCase(value)
    )
    return v.replaceAll(' ', '-').replaceAll('&', '')
  }
}