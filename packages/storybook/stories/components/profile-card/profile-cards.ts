import '@lithium/elements/card'
import '@lithium/elements/layout'
import '@lithium/elements/checkbox'
import '@lithium/elements/avatar'

import type { ProfileCardValue } from '@lithium/components/types'

import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ProfileCardComponent } from '@lithium/components/profile-card'

@Component({
  selector: 'sb-profile-cards',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ ProfileCardComponent ],
  template: `
    <article class="profile-cards">
      <li-checkbox-group (selected-changed)="selectedChanged($event)">
        @for (value of data; track value.nbkId) {
          <profile-card [value]="value">
            <li-checkbox [value]="value.nbkId"></li-checkbox>
          </profile-card>
        }
      </li-checkbox-group>
    </article>
  `,
  styleUrl: './profile-cards.scss'
})
export class ProfileCardsComponent { 
  data: ProfileCardValue[] = [
    {
      nbkId: 'zkzujo6',
      name: 'Arjay Elbore',
      image: 'https://2019.ng-my.org/assets/imgs/speakers/arjay-elbore.webp',
      title: 'Managing Director',
      role: 'Head Corporate Banking',
      email: 'arjay.elbore@bofa.com',
      phone: {
        office: '121212121',
        mobile: '+6598142033'
      }
    }
  ]

  selectedChanged($event: Event) {
    console.info($event)
  }
}