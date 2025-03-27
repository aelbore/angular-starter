import { NgModule } from '@angular/core'

import { SearchPeopleComponent } from './people/people.component'
import { SearchPagesComponent } from './pages'

export const modules = [ SearchPeopleComponent, SearchPagesComponent ]

@NgModule({ imports: modules, exports: modules })
export class SearchModule { }