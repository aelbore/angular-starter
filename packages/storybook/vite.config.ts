import { defineConfig, mergeConfig } from 'vite'

import { getParentDir, vitestAlias } from '../tools/src/utils'
import { ViteInlineElementPlugin as VitePlugin } from '../tools/src/ts-plugin'

import baseConfig from '../tools/vite.config'

export default mergeConfig(
  baseConfig, 
  defineConfig({
    resolve: {
      alias: vitestAlias(getParentDir('packages/storybook'))
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
    ]
  })
)