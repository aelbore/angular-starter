import type { ProfileCardValue } from '@lithium/components/types'
import { 
  Component, 
  CUSTOM_ELEMENTS_SCHEMA, 
  ViewEncapsulation, 
  ElementRef, 
  booleanAttribute, 
  viewChild, 
  inject, 
  input, 
  output,
  computed, 
  effect, 
  OnDestroy
} from '@angular/core'

@Component({
  selector: 'profile-card',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <li-card 
      part="card" 
      class="profile-card" 
      (click)="onClick.emit(value()!)">
      <li-content>
        <section>
          <ng-content select="li-checkbox"></ng-content>
          <section>
            @if (!hasContent()) {
              <li-avatar [src]="value().image" [alt]="value().alt"></li-avatar>
            }   
            <div #avatar>
              <ng-content select="avatar"></ng-content>   
            </div>   
            <section class="profile-card--info">
              <label for="name" part="name">{{value().name}}</label>
              @if (value().title) {
                <label for="title" part="title">{{value().title}}</label>
              }
              @if (value().role) {
                <label for="role" part="role ellipsis">{{value().role}}</label>
              }
              @if (value().email) {
                <label for="email" part="email">
                  <a href="mailto:{{value().email}}">{{value().email}}</a>
                </label>
              }
              @if (value().contacts) {
                <section>
                  @if (value().contacts?.office) {
                    <label for="office" part="contacts-office">
                      <span>OFFICE</span>
                      <span>{{value().contacts?.office}}</span>
                    </label>
                  }
                  @if (value().contacts?.mobile) {
                    <label for="mobile" part="contacts-mobile">
                      <span>MOBILE</span>
                      <span>{{value().contacts?.mobile}}</span>
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
export class ProfileCardComponent implements OnDestroy {
  #elementRef = inject<ElementRef<HTMLElement>>(ElementRef)

  #reverseEffect = effect(() => {
    const element = this.#elementRef.nativeElement
    if (this.reverse()) element?.setAttribute('reverse', '')
    else element?.removeAttribute('reverse')
  })

  value = input.required<ProfileCardValue>()
  reverse = input(false, { transform: booleanAttribute })

  avatar = viewChild.required<ElementRef<HTMLDivElement>>('avatar')
  hasContent = computed(() => this.avatar()!.nativeElement?.innerHTML?.length > 0)

  onClick = output<ProfileCardValue>()

  ngOnDestroy() {
    this.#reverseEffect.destroy()
  }
}