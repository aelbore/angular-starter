import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input, output, signal } from '@angular/core'
import { TooltipDirective, SafeHtmlPipe } from '@lithium/pages/common'

import { StripTextPipe } from './type-strip-text.pipe'
import { KeywordHighlight } from './page-card.directive'

import type { PageValue } from '../types'

@Component({
  selector: 'page-card',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ 
    SafeHtmlPipe, 
    StripTextPipe,
    TooltipDirective,
    KeywordHighlight
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
            [tooltip]="value().title!">{{value().title}}</div>
          <div 
            [class]="'content--description'" 
            [keywordHighlight]="value().keywords ?? keywords()"
            [innerHtml]="value().description! | safeHtml"></div>
        </section>
      </li-content>
    </li-card>
  `,
  styleUrl: './page-card.component.scss'
})
export class PageCardComponent {
  value = input.required<PageValue>()
  onClick = output<PageValue>()

  type = computed(() => (this.value()?.type ?? '').toLowerCase())
  keywords = signal<string[]>([ 'em' ])
}