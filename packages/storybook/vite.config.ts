import { defineConfig, mergeConfig, type PluginOption } from 'vite'
import { swcPlugin } from 'qoi-cli'

import { ViteInlineElementPlugin as VitePlugin } from '../tools/src/ts-plugin'

import { Angular, createFilter, Watcher } from './tools'
import { getParentDir, viteResolvePaths, defaultConfig } from 'toolsetx'

export default mergeConfig(
  defaultConfig, 
  defineConfig({
    logLevel: 'silent',
    optimizeDeps: {
      include: [
        '@storybook/angular',
        '@angular/compiler',
        '@storybook/blocks',
        'tslib' 
      ]
    },
    resolve: {
      alias: viteResolvePaths({
        rootDir: getParentDir('packages/storybook')
      })
    },
    plugins: [
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
    ],
    define: {
      STORYBOOK_ANGULAR_OPTIONS: JSON.stringify({ experimentalZoneless: false }) 
    }
  })
)