export class PopoverState {
  #isOpen: boolean = false

  get isOpen() {
    return this.#isOpen
  }

  set isOpen(value: boolean) {
    this.#isOpen = value
  }
}