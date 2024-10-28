
import { CheckboxComponent } from './checkbox'

import { defineDefaultArgs, type Meta, type StoryObj } from '@lithium/storybook/utils'

export default {
  title: 'Elements/Checkbox',
  component: CheckboxComponent,
  ...defineDefaultArgs({
    render: () => ({ template: '<sb-checkbox />' })
  })
} satisfies Meta  

export const Checkbox: StoryObj = {
  args: { }
}