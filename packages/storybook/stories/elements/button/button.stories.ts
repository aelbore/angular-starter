
import { ButtonComponent, type ButtonProps } from './button'

import { 
  type Meta, 
  type StoryObj, 
  defineDefaultArgs, 
  argsToTemplate 
} from '@lithium/storybook/utils'

export default {
  title: 'Elements/Button',
  component: ButtonComponent,
  ...defineDefaultArgs({
    render(args: ButtonProps) {
      const props = { options: args }
      return { props, template: `<sb-button ${argsToTemplate(props)} />` }
    }
  })
} satisfies Meta<ButtonProps>

export const Button: StoryObj<ButtonProps> = {
  args: { 
    text: 'Button',
    type: 'button', 
    disabled: true 
  }
}