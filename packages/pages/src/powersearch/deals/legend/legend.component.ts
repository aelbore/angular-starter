import { Component, signal } from '@angular/core'
import { LegendDotComponent } from './legend-dot.component'

@Component({
  selector: 'legend',
  standalone: true,
  imports: [ LegendDotComponent ],
  template: `
    <ul>  
      @for (legend of legends(); track legend) {
        <li>
          <legend-dot [value]="legend" />
          <span>{{legend}}</span>
        </li>
      }      
    </ul>
  `,
  styles: `
    :host {
      ul {
        list-style
      }
    }
  `
})
export class LegendComponent { 
  legends = signal<string[]>([ 'M&A', 'ECM', 'IG', 'LevFin' ])
}