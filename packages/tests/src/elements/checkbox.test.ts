import '@lithium/elements/checkbox'

import type { Checkbox, CheckboxGroup } from '@lithium/elements/types'

import { html } from 'lit-html'
import { fixture, fixtureCleanUp } from '../utils'

describe('Checkbox', () => {
  
  afterEach(() => {
    fixtureCleanUp()
  })

  it('should set props changed [checkbox-group]', async () => { 
    const selected = [ 1, 2 ]
    const checkbox = await fixture<CheckboxGroup>(html `
      <li-checkbox-group .selected=${selected}></li-checkbox-group>`
    )
    expect(checkbox.selected).toStrictEqual(selected)
    expect(checkbox.selected?.length).toStrictEqual(2)
  })

  it('should have element', async () => {
    const element = await fixture<CheckboxGroup>(
      html `
        <li-checkbox-group>
          <li-checkbox></li-checkbox>
        </li-checkbox-group>
      `
    )

    expect(element).toBeTruthy()
    expect(element?.root).toBeTruthy()

    const checkboxes = element.slots?.assignedElements()
    expect(checkboxes).toBeTruthy()
    expect(Array.isArray(checkboxes)).toBe(true)

    checkboxes?.forEach(c => {
      const checkbox = c as Checkbox
      expect(checkbox).toBeTruthy()
      expect(checkbox.root).toBeTruthy()
    })
  })

  it('should have default attributes and props', async () => { 
    const element = await fixture<CheckboxGroup>(
      html `
        <li-checkbox-group>
          <li-checkbox></li-checkbox>
        </li-checkbox-group>
      `)

    expect(element.selected).toStrictEqual([])
    expect(element.selected?.length).toStrictEqual(0)

    const checkboxes = element.slots?.assignedElements()
    expect(checkboxes?.length).toStrictEqual(1)
    
    const checkbox = checkboxes?.at(0) as Checkbox
    expect(checkbox.type).toStrictEqual('checkbox')
    expect(checkbox.disabled).toStrictEqual(false)
    expect(checkbox.checked).toStrictEqual(false)
    expect(checkbox.value).toBeUndefined()

    expect(checkbox.getAttribute('type')).toStrictEqual('checkbox')
    expect(checkbox.hasAttribute('disabled')).toBeFalsy()
    expect(checkbox.hasAttribute('checked')).toBeFalsy()
    expect(checkbox.getAttribute('value')).toBeUndefined()
  })

  it('should set props and child props on attribute changed', async () => { 
    const type = 'button', checked = true, value = 4

    const element = await fixture<CheckboxGroup>(
      html `
        <li-checkbox-group>
          <li-checkbox type=${type} value=${value} ?checked=${checked}></li-checkbox>
        </li-checkbox-group>
      `)

    expect(element.selected?.length).toStrictEqual(1)
    
    const checkbox = element.slots?.assignedElements().at(0) as Checkbox
    expect(checkbox.type).toStrictEqual(type)
    expect(checkbox.value).toStrictEqual(value.toString())
    expect(checkbox.checked).toStrictEqual(checked)
  })

  it('should set selected property with child checked', async () => { 
    const selected = [ 1 ]
    const element = await fixture<CheckboxGroup>(
      html `
      <li-checkbox-group .selected=${selected}>
        <li-checkbox .value=${1}>Apple</li-checkbox>
        <li-checkbox .value=${2} checked>Orange</li-checkbox>
      </li-checkbox-group>`
    )

    const slots = element.slots?.assignedElements()
    expect(slots?.length).toStrictEqual(2)

    slots?.forEach(slot => {
      const s = slot as Checkbox
      expect(s.checked).toStrictEqual(true)
    })
  })

  it('should set child slot elements checkbox', async () => {
    const selected = [ 1 ]
    const checkbox = await fixture<CheckboxGroup>(
      html `
      <li-checkbox-group .selected=${selected}>
        <li-checkbox .value=${1}>Apple</li-checkbox>
        <li-checkbox .value=${2}>Orange</li-checkbox>
      </li-checkbox-group>`
    )
    
    const slots = checkbox.slots?.assignedElements()
    expect(slots?.length).toStrictEqual(2)

    expect((slots?.at(0) as Checkbox).checked).toStrictEqual(true)
    expect((slots?.at(1) as Checkbox).checked).toStrictEqual(false)
  })

})