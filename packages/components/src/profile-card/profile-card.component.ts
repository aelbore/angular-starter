import type { ProfileCardValue } from '@lithium/components/types'
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, Output, booleanAttribute, inject, HostBinding, ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'profile-card',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  encapsulation: ViewEncapsulation.ShadowDom,
  host: {
    '[class]': 'profileCard'
  }, 
  template: `
    <li-card part="card" class="profile-card" (click)="onClick.emit()">
      <li-content>
        <section>
          <ng-content select="li-checkbox"></ng-content>
          <section>
            <li-avatar [src]="value.image" [alt]=""></li-avatar>
            <section class="profile-card--info">
              <label for="name">{{value.name}}</label>
              @if (value.title) {
                <label for="title">{{value.title}}</label>
              }
              @if (value.email) {
                <label for="email">
                  <a href="mailto:{{value.email}}">{{value.email}}</a>
                </label>
              }
              <section>
                <label for="office">
                  <span>OFFICE</span>
                  <span>{{value.phone?.office}}</span>
                </label>
                <label for="mobile">
                  <span>MOBILE</span>
                  <span>{{value.phone?.mobile}}</span>
                </label>
              </section>
            </section>
          </section>
        </section>
      </li-content>
    </li-card>
  `,
  styleUrl: './profile-card.component.scss'  
})
export class ProfileCardComponent { 
  #elementRef = inject(ElementRef)

  @Input() value!: ProfileCardValue

  @Input({ transform: booleanAttribute })
  set reverse(value: boolean) {
    const element = this.#elementRef.nativeElement as HTMLElement

    if (value) element.setAttribute('reverse', '')
    else element.removeAttribute('reverse')
  }

  @HostBinding('class') profileCard: string = ''

  @Output() onClick = new EventEmitter<void>()
}