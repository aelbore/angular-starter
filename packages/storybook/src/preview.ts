import '@lithium/theme'
import 'zone.js'

import type { Preview } from '@storybook/angular'

export default {
  parameters: {
    backgrounds: { disable: true },
    actions: { 
      argTypesRegex: '^on[A-Z].*' 
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
} satisfies Preview