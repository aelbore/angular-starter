import { Component } from '@angular/core'
import { LegendDotComponent } from '../legend/legend-dot.component'

@Component({
  selector: 'deal',
  standalone: true,
  imports: [ LegendDotComponent ],
  template: `
    <ul>
      
    </ul>
  `,
  styleUrl: './deal.component.scss'
})
export class SearchDealComponent { }