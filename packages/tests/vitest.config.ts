/// <reference types="vitest" />

import { defineConfig, mergeConfig } from 'vitest/config'
import { ViteInlineElementPlugin as VitePlugin } from '../tools/src/ts-plugin'

import { defaultConfig, getParentDir, viteResolvePaths } from 'toolsetx'

export default mergeConfig(
  defaultConfig, 
  defineConfig({
    resolve: {
      alias: viteResolvePaths({
        rootDir: getParentDir('packages/tests'),
        paths: { excludes: [ '@lithium/elements' ] }
      })
    },
    plugins: [ 
      VitePlugin({
        element: {
          superClass: 'CustomElement'
        },
        css: {
          importPackage: '@lithium/elements/core'
        }
      })
    ],            
    test: {
      globals: true,
      include: [ './**/*.{test,spec}.{js,ts,jsx,tsx}' ],
      reporters: [ 'basic' ],
      coverage: {
        provider: 'v8',
        allowExternal: true,
        cleanOnRerun: true,
        reporter: [ 'lcov', 'html', 'text' ]
      },
      environment: 'jsdom',
      disableConsoleIntercept: true      
    }
  })
)
