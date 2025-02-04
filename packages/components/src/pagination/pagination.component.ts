import { Component, input, output } from '@angular/core'
import { NgxPaginationModule } from 'ngx-pagination'

import { NavigationButton } from './nav-button/nav-button.component'
import type { PaginateArgs } from './types'

@Component({
  selector: 'pagination',
  standalone: true,
  imports: [ NgxPaginationModule, NavigationButton ],
  template: `
    <pagination-template 
      #p="paginationApi"
      [maxSize]="paginateArgs()?.maxSize!"
      [id]="paginateArgs()?.id!"
      (pageChange)="pageChange.emit($event)">
      <section>
        <nav-button direction="left" 
          [disabled]="p.isFirstPage()"
          [tabindex]="p.isFirstPage() ? -1: 0" 
          (onClick)="p.previous()" />
        <ul>
          @for (page of p.pages; track page.value) {
            @if (p.getCurrent() !== page.value) {
              <li (click)="p.setCurrent(page.value)">{{ page.label }}</li>
            } @else {
              <li class="current">{{ page.label }}</li>
            }          
          }
        </ul>
        <nav-button direction="right" 
          [disabled]="p.isLastPage()"
          [tabindex]="p.isLastPage() ? -1: 0" 
          (onClick)="p.next()" />
      </section>
    </pagination-template>
  `,
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {  
  paginateArgs = input<PaginateArgs>()
  pageChange = output<number>()
}