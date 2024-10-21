
import type { Options } from 'sass'
import type { SourceDescription } from 'rollup'
import type { Sass } from './types'

import { extname } from 'node:path'
import { createRequire } from 'node:module'

const createImportModule = <T extends Sass>(path: string) => {
  /* eslint @typescript-eslint/no-var-requires: "off" */
  /* eslint @typescript-eslint/no-require-imports: "off" */
  try { return require(path) as T } 
  catch { return createRequire(import.meta.url)(path) as T }
}

export const transformCss = (
  code: string, 
  id: string, 
  options?: Options<'sync'>
) => {
  const css = extname(id).includes('.scss') ? createImportModule('sass').compile(id, options ?? {}).css: code
  const escape = (str: string): string => str
    .replace(/`/g, '\\`')
    .replace(/\\(?!`)/g, '\\\\')
  return { 
    code: `export default '${escape(css).replace(/\r?\n|\r/g, '')}';`, 
    map: { mappings: '' }
  } as SourceDescription
}