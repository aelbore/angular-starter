import { NgModule } from '@angular/core'

import { Loader } from '@lithium/pages/common'

import { SearchPeopleComponent } from './people'
import { SearchPagesComponent } from './pages'
import { SearchTotalCount } from './total-count'

@NgModule({ 
  imports: [ SearchPeopleComponent, SearchPagesComponent ], 
  exports: [ SearchPeopleComponent, SearchPagesComponent ],
  providers: [ Loader, SearchTotalCount ]
})
export class SearchModule { }