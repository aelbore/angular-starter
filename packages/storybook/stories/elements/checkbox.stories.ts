import '@lithium/elements/checkbox'

import type { Meta, StoryObj } from '@storybook/web-components'
import type { Checkbox as CheckboxElement } from '@lithium/elements/types'

import { html } from 'lit-html'

type CheckboxProps = CheckboxElement

type Story = StoryObj<CheckboxProps>;

export default {
  title: 'Components/Checkbox',
  render() {
    return html `
      <li-checkbox-group>
        <li-checkbox value="1" checked>Apples</li-checkbox>
        <li-checkbox value="2">Oranges</li-checkbox>
        <li-checkbox value="3" checked>Grapes</li-checkbox>
      </li-checkbox-group>
    `
  }
} satisfies Meta<CheckboxProps>

export const Checkbox: Story = {
  args: { }
}