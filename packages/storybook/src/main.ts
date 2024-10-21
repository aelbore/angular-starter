import type { StorybookConfig } from '@storybook/web-components-vite'
import type { StorybookConfigVite } from '@storybook/builder-vite'

export default {
  stories: [ 
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)' 
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/web-components-vite'
  },
  docs: {
    autodocs: 'tag'
  }
} as StorybookConfig & StorybookConfigVite