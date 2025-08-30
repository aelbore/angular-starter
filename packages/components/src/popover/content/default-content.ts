import { Component, ViewContainerRef } from '@angular/core'

@Component({ selector: 'temp-component', template: '', standalone: true })
export class TempComponent {
  constructor(public viewContainerRef: ViewContainerRef) { }
}