import '@lithium/theme'

import { type Preview, applicationConfig } from '@storybook/angular'
import { provideHttpClient } from '@angular/common/http'

import { initialize, mswLoader } from 'msw-storybook-addon'
import { http, HttpResponse } from 'msw'

initialize()

export default {
  loaders: [ mswLoader ],
  decorators: [
    applicationConfig({
      providers: [ provideHttpClient() ]
    })
  ],
  parameters: {
    msw: {
      handlers: {
        avatar: [
          http.get('/avatar.jpg', async () => {
            const buffer = await fetch('/avatar/arjay-elbore.jpg').then(
              async (response) => response.arrayBuffer()
            )
            return HttpResponse.arrayBuffer(buffer, {
              headers: { 'Content-Type': 'image/jpeg' }
            })
          })
        ]
      }
    },
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