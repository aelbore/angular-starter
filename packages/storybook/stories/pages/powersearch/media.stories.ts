import { SbSearchMedia } from './media/media'

import { type Meta, type StoryObj, argsToTemplate, defineDefaultArgs } from '@lithium/storybook/utils'
import type { SearchParams } from '@lithium/pages/common/types'
import { handlers } from './media/media.mock'

export default {
  title: 'Pages/Powersearch/Media',
  component: SbSearchMedia,
  parameters: {
    msw: { 
       handlers
    }
  },
  ...defineDefaultArgs({
    render: (args: SearchParams) => {
      const props = { options: args }
      return { props, template: `<sb-search-media ${argsToTemplate(props)} />` }
    }
  })
} satisfies Meta

export const Media: StoryObj<SearchParams> = {
  args: {
    searchText: 'Media',
    PageIndex: 1,
    PageSize: 2
  }
}