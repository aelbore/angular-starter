/// <reference types="vitest" />

import { defineConfig, mergeConfig } from 'vite'
import { getParentDir, vitestAlias } from '../tools/src/utils'
import { ViteInlineElementPlugin as VitePlugin } from '../tools/src/ts-plugin'

import baseConfig from '../tools/vite.config'

export default mergeConfig(
  baseConfig, 
  defineConfig({
    resolve: {
      alias: vitestAlias(getParentDir('packages/tests'))
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
