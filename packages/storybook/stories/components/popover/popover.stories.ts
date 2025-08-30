import { type Meta, type StoryObj, argsToTemplate, defineDefaultArgs } from '@lithium/storybook/utils'

import { PopoverStory } from './popover'
import { PopoverStoryProps } from './types'

export default {
  title: 'Components/Popover',
  component: PopoverStory,
  ...defineDefaultArgs({
    render: (args: PopoverStoryProps) => {
      const props = { 
        position: args.position, 
        arrow: args.arrow 
      } as PopoverStoryProps
      return { 
        props,
        template: `<hx-popover-story ${argsToTemplate(props)} />`
      }
    }
  })
} satisfies Meta

export const Popover: StoryObj<PopoverStoryProps> = {
  argTypes: {
    position: { 
      options: [ 'top', 'bottom', 'left', 'right' ],
      control: { 
        type: 'select'
      },
      defaultValue: 'top'
    },
    arrow: {
      options: [ 'left', 'center', 'right', 'top', 'bottom' ],
      control: { 
        type: 'select'
      },
      defaultValue: 'left'
    }
  },
  args: { 
    position: 'top',
    arrow: 'top' 
  }
}