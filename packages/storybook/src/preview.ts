import '@lithium/theme'
import 'zone.js'

import { type Preview, applicationConfig } from '@storybook/angular'
import { provideHttpClient } from '@angular/common/http'
import { ThemeConfig } from 'storybook-addon-data-theme-switcher'

import { initialize, mswLoader } from 'msw-storybook-addon'

initialize()

export default {
  loaders: [ mswLoader ],
  decorators: [
    applicationConfig({
      providers: [ provideHttpClient() ]
    })
  ],
  initialGlobals: {
    dataTheme: 'dark',
    dataThemes: {
      list: [
        { name: 'Dark', dataTheme: 'dark', color: '#232326' },
        { name: 'Light', dataTheme: 'light', color: '#fff' }
      ],
      clearable: true,
      dataAttribute: 'theme'
    } satisfies ThemeConfig
  },
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