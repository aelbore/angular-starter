import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'

import { SortButtonComponent } from './sort-button.component'
import { SortButtonsComponent } from './sort-buttons.component'

@NgModule({ 
  declarations: [ SortButtonComponent, SortButtonsComponent ] , 
  exports: [ SortButtonsComponent ] ,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class SortButtonsModule { }