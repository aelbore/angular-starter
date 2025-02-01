import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, output, input, ViewEncapsulation } from '@angular/core'
import { ArrowState, ButtonOutputValue, SortState } from './types'

@Component({
  selector: 'sort-button',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <li-button exportparts="button,span" (click)="onSortClick()">
      <span>
        <ng-content></ng-content>
      </span>
      @if (active()) {
        <svg part="arrow" viewBox="0 0 24 24" class="arrow-{{state()}}">
          <path
            d="M11.0001 
              3.67157L13.0001 3.67157L13.0001 16.4999L16.2426 
              13.2574L17.6568 14.6716L12 20.3284L6.34314
              14.6716L7.75735 13.2574L11.0001 16.5001L11.0001 3.67157Z"
            fill="currentColor"
          />
        </svg>
      }
    </li-button>
  `,
  styles: `
    :host {
      li-button {        
        --button-bg-color: transparent;
        --button-font-size: 14px;
        --button-border-radius: 4px;
        --button-padding: 8px;
        --button-min-width: 64px;

        --arrow-down-bottom: 8px;

        .arrow-up {
          transform: rotate(180deg);
        }

        svg {
          width: 20px;
          height: 20px;
          fill: none;
          color: var(--sort-button-color);
        }

        &::part(span) {
          display: grid;
          grid-template-columns: 1fr auto;
          column-gap: 5px;
        }
      }
    }
  `
})
export class SortButtonComponent { 
  state = signal<ArrowState>('down')

  active = input<boolean>(false)
  name = input<SortState>()
  onSort = output<ButtonOutputValue>()

  onSortClick() {
    if (this.state() === 'down') this.state.set('up')
    else this.state.set('down')

    this.onSort.emit({ state: this.state(), name: this.name()! })
  }
}