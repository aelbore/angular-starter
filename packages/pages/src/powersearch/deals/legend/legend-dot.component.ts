import { Component, input } from '@angular/core'

@Component({
  selector: 'legend-dot',
  standalone: true,
  template: `
    <span [class]="[ 'dot' ]">{{value()}}</span>
  `,
  styleUrl: './legend-dot.component.scss'
})
export class LegendDotComponent { 
  value = input('', {
    transform(v: string) {
      return v.substring(0, 1).toUpperCase()
    }
  })
}