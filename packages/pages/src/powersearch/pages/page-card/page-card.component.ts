import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core'
import { MatTooltipModule } from '@angular/material/tooltip'

import { SafeHtmlPipe } from '@lithium/pages/powersearch/common/pipes'

import type { PageValue } from '../types'

@Component({
  selector: 'page-card',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ SafeHtmlPipe, MatTooltipModule ],
  template: `
    <li-card (click)="onClick.emit(value()!)">
      <li-content class="content">
        <header>
          <div [class]="[ 'content--type', type() ]">{{value().type}}</div>
          <ng-content selector=".bookmark"></ng-content>
        </header>
        <section>
          <div 
            [class]="'content--title'"             
            [matTooltipPosition]="'before'"
            [matTooltipClass]="'search-tooltip'"
            [matTooltip]="value().title">{{value().title}}</div>
          <div 
            class="content--description" 
            [innerHtml]="value().description! | safeHtml"></div>
        </section>
      </li-content>
    </li-card>
  `,
  styleUrl: './page-card.component.scss'
})
export class PageCardComponent  { 
  value = input.required<PageValue>()

  type = computed(() => {
    return this.#stripTypeText((this.value()?.type ?? '').toLowerCase())      
  })

  onClick = output<PageValue>()

  #stripTypeText(value: string) {
    return value.replaceAll(' ', '-').replaceAll('&', '')
  }
}