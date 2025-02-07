import { NgModule } from '@angular/core'

import { SearchPeopleComponent } from './people/people.component'
import { SearchPagesComponent } from './pages'

@NgModule({
  imports: [ SearchPeopleComponent, SearchPagesComponent ]
})
export class SearchModule { }