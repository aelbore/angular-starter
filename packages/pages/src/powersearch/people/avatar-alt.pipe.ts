import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'imgAlt',
  standalone: true
})
export class ImageAlt implements PipeTransform {
  transform(value: string) {
    return `${value} Profile Image`
  }
}