import { NgModule } from '@angular/core'
import { NgxPaginationModule } from 'ngx-pagination'

import { PaginationComponent } from './pagination.component'

@NgModule({
  imports: [ PaginationComponent ],
  exports: [ PaginationComponent, NgxPaginationModule ]
})
export class PaginationModule { }