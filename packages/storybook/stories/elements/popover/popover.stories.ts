
import { PopoverComponent } from './popover'

import { 
  type Meta, 
  type StoryObj, 
  defineDefaultArgs
} from '@lithium/storybook/utils'

export default {
  title: 'Elements/Popover',
  component: PopoverComponent,
  ...defineDefaultArgs({
    render() {
      return { template: '<sb-popover />' }
    }
  })
} satisfies Meta

export const Popover: StoryObj = {
  args: {}
}