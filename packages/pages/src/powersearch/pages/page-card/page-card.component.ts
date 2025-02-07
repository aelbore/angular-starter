import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core'

import { SafeHtmlPipe } from '@lithium/pages/powersearch/common/pipes'
import { TooltipDirective } from '@lithium/pages/powersearch/common/directives'

import type { PageValue } from '../types'
import { StripTextPipe } from './type-strip-text.pipe'

@Component({
  selector: 'page-card',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ 
    SafeHtmlPipe, 
    StripTextPipe,
    TooltipDirective 
  ],
  template: `
    <li-card (click)="onClick.emit(value()!)">
      <li-content class="content">
        <header>
          <div [class]="[ 'content--type', type() | typeStripText ]">{{value().type}}</div>
          <ng-content selector=".bookmark"></ng-content>
        </header>
        <section>
          <div 
            [class]="'content--title'"             
            [tooltipPosition]="'before'"
            [tooltipClass]="'search-tooltip'"
            [tooltip]="value().title">{{value().title}}</div>
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

  type = computed(() => (this.value()?.type ?? '').toLowerCase())

  onClick = output<PageValue>()
}