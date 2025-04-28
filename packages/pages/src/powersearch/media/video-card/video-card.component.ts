import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core'
import { MediaValue } from '../types'

@Component({
  selector: 'video-card',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],  
  template: `
    <li-card>
      
    </li-card>
  `
})
export class VideoCard { 
  value = input.required<MediaValue>()
}