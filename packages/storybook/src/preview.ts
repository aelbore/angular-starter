import '@lithium/theme'
import 'zone.js'

import { type Preview, applicationConfig } from '@storybook/angular'
import { provideHttpClient } from '@angular/common/http'

import { initialize, mswLoader } from 'msw-storybook-addon'

initialize()

export default {
  loaders: [ mswLoader ],
  decorators: [
    applicationConfig({
      providers: [ provideHttpClient() ]
    })
  ],
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