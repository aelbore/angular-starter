import type { ProfileCardValue } from '@lithium/components/types'
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, Output, booleanAttribute, inject, ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'profile-card',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <li-card part="card" class="profile-card" (click)="onClick.emit()">
      <li-content>
        <section>
          <ng-content select="li-checkbox"></ng-content>
          <section>
            <li-avatar [src]="value.image" [alt]=""></li-avatar>
            <section class="col profile-card--info">
              <label for="name" part="name">{{value.name}}</label>
              @if (value.title) {
                <label for="title" part="title">{{value.title}}</label>
              }
              @if (value.role) {
                <label for="role" part="role ellipsis">{{value.role}}</label>
              }
              @if (value.email) {
                <label for="email" part="email">
                  <a href="mailto:{{value.email}}">{{value.email}}</a>
                </label>
              }
              @if (value.contacts) {
                <section>
                  @if (value.contacts.office) {
                    <label for="office">
                      <span>OFFICE</span>
                      <span>{{value.contacts.office}}</span>
                    </label>
                  }
                  @if (value.contacts.mobile) {
                    <label for="mobile">
                      <span>MOBILE</span>
                      <span>{{value.contacts.mobile}}</span>
                    </label>
                  }
                </section>
              }
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

  @Output() onClick = new EventEmitter<void>()
}