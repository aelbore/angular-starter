import { defineConfig, mergeConfig } from 'vite'

import { ViteInlineElementPlugin as VitePlugin } from '../tools/src/ts-plugin'

import { Angular, createFilter, SwcPlugin, Watcher } from './tools'
import { getParentDir, viteResolvePaths, defaultConfig } from 'toolsetx'

export default mergeConfig(
  defaultConfig, 
  defineConfig({
    optimizeDeps: {
      include: [
        '@storybook/angular/dist/client/index.js',
        '@angular/compiler',
        '@angular/platform-browser',
        '@angular/platform-browser/animations',
        'tslib',
        'zone.js'
      ]
    },
    resolve: {
      alias: viteResolvePaths({
        rootDir: getParentDir('packages/storybook')
      })
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
      SwcPlugin()
    ],
    define: {
      STORYBOOK_ANGULAR_OPTIONS: JSON.stringify({ experimentalZoneless: false }) 
    }
  })
)