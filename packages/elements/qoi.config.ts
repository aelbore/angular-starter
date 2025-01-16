import { join } from 'node:path'
import { createFilter, defineConfig } from 'qoi-cli'

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
    createFilter() {
      const filter = createFilter()
      return ({
        cssFilter: (id) => filter?.cssFilter?.(id, { 
          include: join(__dirname, './src/**/*.scss')
        }) ?? false
      })
    },
    jsc: {
      paths: elementPaths(getParentDir('packages/elements'))
    }
  }
})