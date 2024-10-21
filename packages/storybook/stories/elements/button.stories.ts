import '@lithium/elements/button'

import type { Meta, StoryObj } from '@storybook/web-components'
import type { ButtonElement } from '@lithium/elements/types'

import { html } from 'lit-html'

type ButtonProps = ButtonElement

type Story = StoryObj<ButtonProps>;

export default {
  title: 'Components/Button',
  render({ type, disabled }: ButtonProps) {
    return html `
      <li-button
        type=${type} 
        ?disabled=${disabled}>Button</li-button>
    `
  }
} satisfies Meta<ButtonProps>

export const Button: Story = {
  args: { type: 'button', disabled: true }
}