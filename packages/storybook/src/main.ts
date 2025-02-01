import type { StorybookConfig } from '@storybook/angular'
import type { StorybookConfigVite } from '@storybook/builder-vite'

import { join } from 'node:path'

export default {
  stories: [ '../**/*.stories.@(js|jsx|mjs|ts|tsx)' ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/angular',
    options: {}
  },
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: join(__dirname, '../vite.config.ts')
      }
    }
  },
  staticDirs: ['../public']
} as StorybookConfig & StorybookConfigVite