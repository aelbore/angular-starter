import { type Meta, type StoryObj, defineDefaultArgs } from '@lithium/storybook/utils'
import { ProfileCardsComponent } from './profile-card/profile-cards'

export default {
  title: 'Components/ProfileCards',
  component: ProfileCardsComponent,
  ...defineDefaultArgs({
    render: () => ({ template: '<sb-profile-cards />' })
  })
} satisfies Meta

export const ProfileCards: StoryObj = {
  args: {}
}