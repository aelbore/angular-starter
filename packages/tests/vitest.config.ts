/// <reference types="vitest" />

import { defineConfig, mergeConfig } from 'vitest/config'
import { ViteInlineElementPlugin as VitePlugin } from '../tools/src/ts-plugin'
import { viteResolvePaths, getParentDir } from 'toolsetx'

import { createFilter } from '../storybook/tools/filter'
import { Angular, SwcPlugin } from '../storybook/tools'

import baseConfig from '../tools/vite.config'

export default mergeConfig(
  baseConfig, 
  defineConfig({
    resolve: {
      alias: viteResolvePaths({
        rootDir: getParentDir('packages/tests'),
        paths: { 
          excludes: [ 
            '@lithium/elements', 
            '@lithium/components',
            '@lithium/pages' 
          ] 
      }})
    },
    plugins: [ 
      SwcPlugin(),
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
      Angular(createFilter())
    ],            
    test: {
      globals: true,
      include: [ './**/*.{test,spec}.{js,ts,jsx,tsx}' ],
      reporters: [ 'basic' ],
      setupFiles: [ './src/test-setup.ts' ],
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
