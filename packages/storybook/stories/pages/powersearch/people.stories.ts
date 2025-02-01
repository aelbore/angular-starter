import { 
  type Meta, 
  type StoryObj, 
  argsToTemplate, 
  defineDefaultArgs 
} from '@lithium/storybook/utils'

import { SearchPeopleComponent } from './people/people'
import { handlers } from './people/people-mock'

import type { SearchParams } from '@lithium/pages/powersearch/types'

export default {
  title: 'Pages/Powersearch/People',
  component: SearchPeopleComponent,
  parameters: {
    msw: { 
      handlers 
    }
  },
  ...defineDefaultArgs({
    render: (args: SearchParams) => {
      const props = { options: args }
      return { props, template: `<sb-search-people ${argsToTemplate(props)} />` }
    }
  })
} satisfies Meta

export const People: StoryObj<SearchParams> = {
  args: {
    searchText: 'Bios',
    PageIndex: 1,
    PageSize: 10
  }
}