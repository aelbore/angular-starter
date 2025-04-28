import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core'
import { MediaValue } from '../types'

@Component({
  selector: 'image-card',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],  
  template: `
    <li-card>
      <li-content>
        <section>
          <img [src]="value().imageContent" loading="lazy" />
        </section>
        <footer>

        </footer>
      </li-content>
    </li-card>
  `,
  styleUrl: './image-card.component.scss'
})
export class ImageCard { 
  value = input.required<MediaValue, MediaValue>({
    transform: (value) => ({ 
      ...value, 
      imageContent: `data:image/png;base64,${value.imageContent}` 
    })
  })
}