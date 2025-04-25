import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core'
import { TooltipDirective, safeHtmlPipe } from '@lithium/pages/common'

import { StripTextPipe } from './type-strip-text.pipe'

import type { PageValue } from '../types'
import { valueTransform } from './value-transform'

@Component({
  selector: 'page-card',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ StripTextPipe, TooltipDirective ],
  template: `
    <li-card (click)="onClick.emit(value()!)">
      <li-content class="content">
        <header>
          <div [class]="[ 'content--type', value().type! | typeStripText ]">{{value().type}}</div>
          <ng-content selector=".bookmark"></ng-content>
        </header>
        <section>
          <div 
            [class]="'content--title'"             
            [tooltipPosition]="'before'"
            [tooltipClass]="'search-tooltip'"
            [tooltip]="value().title!">{{value().title}}</div>
          <div class="content--section-container">
            @if (value().sectionPath) {
              <div class="content--section-path">{{value().sectionPath}}</div>
            }
            <div 
              [class]="'content--description'" 
              [innerHtml]="description()"></div>
          </div>
        </section>
      </li-content>
    </li-card>
  `,
  styleUrl: './page-card.component.scss'
})
export class PageCardComponent {
  #sanitizer = safeHtmlPipe()

  value = input.required<PageValue, PageValue>({ transform: valueTransform })
  onClick = output<PageValue>()

  description = computed(() => this.#sanitizer.bypassSecurityTrustHtml(this.value().description!))
}