import '@lithium/elements/card'
import '@lithium/elements/layout'
import '@lithium/elements/checkbox'
import '@lithium/elements/avatar'

import type { ProfileCardValue } from '@lithium/components/types'

import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core'

import { ProfileCardComponent } from '@lithium/components/profile-card'
import { toSignal } from '@angular/core/rxjs-interop'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/internal/operators/map'
import { catchError, of } from 'rxjs'

@Component({
  selector: 'sb-profile-cards',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ ProfileCardComponent ],
  template: `
    <article class="profile-cards">
      <li-checkbox-group (selected-changed)="selectedChanged($event)">
        @for (value of cards(); track value.nbkId) {
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
  #http = inject(HttpClient)

  cards = toSignal(this.#getProfileCards())

  #getProfileCards() {
    return this.#http.get<ProfileCardValue[]>(
      '/api/profile-cards', { observe: 'response' }
    ).pipe(
      map(response => response.body),
      catchError(error => of(error))
    )
  }

  selectedChanged($event: Event) {
    console.info($event)
  }
}