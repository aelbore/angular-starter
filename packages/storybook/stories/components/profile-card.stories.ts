import { type Meta, type StoryObj, defineDefaultArgs } from '@lithium/storybook/utils'
import { ProfileCardsComponent } from './profile-card/profile-cards'
import { getProfileCards } from './profile-card/profile-cards.mock'

export default {
  title: 'Components/ProfileCards',
  component: ProfileCardsComponent,
  ...defineDefaultArgs({
    render: () => ({ template: '<sb-profile-cards />' })
  })
} satisfies Meta

export const ProfileCards: StoryObj = {
  args: {},
  parameters: {
    msw: {
      handlers: [ getProfileCards() ]
    }
  }
}