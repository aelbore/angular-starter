import { defineConfig, mergeConfig, PluginOption } from 'vite'
import { swcPlugin } from 'qoi-cli'

import { getParentDir, vitestAlias } from '../tools/src/utils'
import { ViteInlineElementPlugin as VitePlugin } from '../tools/src/ts-plugin'

import { Angular, createFilter, Watcher } from './tools'

import baseConfig from '../tools/vite.config'

export default mergeConfig(
  baseConfig, 
  defineConfig({
    logLevel: 'silent',
    optimizeDeps: {
      include: [
        '@storybook/angular',
        '@storybook/angular/dist/client',
        '@angular/compiler',
        '@storybook/blocks',
        'tslib'
      ]
    },
    resolve: {
      alias: vitestAlias(getParentDir('packages/storybook'))
    },
    plugins: [
      Watcher(),
      Angular(createFilter()),
      VitePlugin({
        element: {
          createFilter,
          superClass: 'CustomElement'
        },
        css: {
          createFilter,
          importPackage: '@lithium/elements/core'
        }
      }),
      swcPlugin() as PluginOption
    ]
  })
)