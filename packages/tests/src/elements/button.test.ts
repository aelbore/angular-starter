import '@lithium/elements/button'

import type { ButtonElement } from '@lithium/elements/types'

import { html } from 'lit-html'
import { fixture, fixtureCleanUp } from '../utils'

describe('Button', () => {

  afterEach(() => {
    fixtureCleanUp()
    vi.restoreAllMocks()
  })

  it('should have element', async () => {
    const button = await fixture<ButtonElement>(html `<li-button></li-button>`)
    
    expect(button).toBeTruthy()
    expect(button.shadowRoot).toBeTruthy()
  })

  it('should have default attributes and props', async () => {
    const button = await fixture<ButtonElement>(html `<li-button></li-button>`)
    console.log(button.innerHTML)

    expect(button.type).toStrictEqual('button')
    expect(button.disabled).toStrictEqual(false)

    expect(button.getAttribute('type')).toStrictEqual('button')
    expect(button.hasAttribute('disabled')).toBeFalsy()
  })

  it('should set props and child props on attribute changed', async () => {
    const type = 'submit', disabled = true

    const button = await fixture<ButtonElement>(html `
      <li-button type=${type} ?disabled=${disabled}></li-button>`
    )

    expect(button.type).toStrictEqual(type)
    expect(button.disabled).toStrictEqual(disabled)

    const btnElement = button.root?.querySelector('button')

    expect(btnElement?.type).toStrictEqual(type)
    expect(btnElement?.disabled).toStrictEqual(disabled)
  })

  it('should submit on button click', async () => {
    const SubmitMock = { onSubmit: (_: Event) => {} }
    const onSubmit = vi.spyOn(SubmitMock, 'onSubmit')

    const button = await fixture<ButtonElement>(html `
      <li-button type="submit">Close</li-button>`
    )
    
    button.addEventListener('click', SubmitMock.onSubmit)
    button.root?.querySelector?.('button')?.click()

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

})