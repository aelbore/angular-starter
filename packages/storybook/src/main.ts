import { join } from 'node:path'

export default {
  stories: [ '../**/*.stories.@(js|jsx|mjs|ts|tsx)' ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-docs'
  ],
  framework: {
    name: '@storybook/angular',
    options: {}
  },
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: 
          join(__dirname, '../vite.config.ts')
      }
    }
  },
  staticDirs: ['../public']
} as import('./types').StorybookConfig