import { defineConfig } from 'qoi-cli'

import { InlineElementPlugin } from '../tools/src/ts-plugin'
import { elementPaths, getParentDir } from '../tools/src/utils'

export default defineConfig({
  input: './src/index.ts',
  plugins: [
    InlineElementPlugin({
      element: {
        superClass: 'CustomElement'
      },
      css: {
        importPackage: '@lithium/elements/core'
      }
    })
  ],
  swc: {
    jsc: {
      paths: elementPaths(getParentDir('packages/elements'))
    }
  }
})