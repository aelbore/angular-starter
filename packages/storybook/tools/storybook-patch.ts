import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { getParentDir } from 'toolsetx/alias'

type StorybookPackage = typeof import('@storybook/angular/package.json')

const storybookPkgFile = join(
  getParentDir('packages/storybook'),
  'node_modules',
  '@storybook',
  'angular',
  'package.json'
)

if (existsSync(storybookPkgFile)) {
  const exports$ = {
    "./dist/client/docs/config.js": "./dist/client/docs/config.js",
    "./dist/client/config.js": "./dist/client/config.js",
    "./dist/client": "./dist/client/index.js"
  } as Record<string, string>
  
  const storybookPkg: StorybookPackage = JSON.parse(
    readFileSync(storybookPkgFile, 'utf-8')
  )

  Object.keys(exports$).forEach(e => {
    const keys = Object.keys(storybookPkg.exports)
    if (!keys.find(k => k === e)) {
      storybookPkg.exports = { ...storybookPkg.exports, [e]: exports$[e] }
    }
  })

  writeFileSync(storybookPkgFile, JSON.stringify(storybookPkg, null, '\t'))
}