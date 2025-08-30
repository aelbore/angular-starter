import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core'
import { Content } from './types'

@Component({
  selector: 'popover-content',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  template: `
    <li-card class="card">
      <li-header>
        <h3>{{content()?.title}}</h3>
        <button class="x-button" (click)="close.emit()">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="
              M3.646 2.646a.5.5 0 0 1 .708 
              0L8 6.293l3.646-3.647a.5.5 0 0 1 .708.708L8.707 7l3.647 
              3.646a.5.5 0 0 1-.708.708L8 7.707l-3.646 3.647a.5.5 
              0 0 1-.708-.708L7.293 7 3.646 3.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
      </li-header>
      <li-content>
        <section>
          <p>{{content()?.description}}</p>
        </section>
      </li-content>
      <li-footer>
        <li-button (click)="close.emit()">Got it</li-button>
      </li-footer>
    </li-card>
  `,
  styleUrl: './popover-content.scss'
})
export class PopoverContent { 
  content = input<Content>()
  close = output<void>()
}