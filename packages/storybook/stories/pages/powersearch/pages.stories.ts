import { type Meta, type StoryObj, argsToTemplate, defineDefaultArgs } from '@lithium/storybook/utils'
import { handlers } from './pages/pages-mock'

import type { SearchParams } from '@lithium/pages/powersearch/common/types'
import { SearchPagesComponent } from './pages/pages'

export default {
  title: 'Pages/Powersearch/Pages',
  component: SearchPagesComponent,
  parameters: {
    msw: { 
      handlers 
    }
  },
  ...defineDefaultArgs({
    render: (args: SearchParams) => {
      const props = { options: args }
      return { props, template: `<sb-search-pages ${argsToTemplate(props)} />` }
    }
  })
} satisfies Meta

export const Pages: StoryObj<SearchParams> = {
  args: {
    searchText: 'banking',
    PageIndex: 1,
    PageSize: 2
  }
}