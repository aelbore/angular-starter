import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'typeStripText',
  standalone: true
})
export class StripTextPipe implements PipeTransform {
  transform(value: string) {
    return value.replaceAll(' ', '-').replaceAll('&', '')
  }
}