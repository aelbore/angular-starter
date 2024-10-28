import { join } from 'node:path'
import { createRequire } from 'node:module'

const require$ = <T>(path: string) => {
  return (createRequire(import.meta.url)(path) as unknown) as T
}

export const createFilter = () => {  
  const cli = require$<typeof import('qoi-cli')>('qoi-cli')
  const utils = require$<typeof import('@rollup/pluginutils')>('@rollup/pluginutils')

  const filter = cli.createFilter()
  const createCriteria = (path: string) => join(__dirname, '..', path)

  const include = createCriteria('../elements')
  const exclude = [ './stories/**/*.ts', '../pages/**/*.ts', '../components/**/*.ts' ]

  return {
    tsFilter(id: string) {
      return filter.tsFilter?.(id, {
        include: join(include, '**/*.ts'),
        exclude: exclude.map(e => createCriteria(e))
      })
    },
    cssFilter(id: string) {
      return utils.createFilter(
        join(include, '**/*.scss?inline')
      )(id)
    }
  } as typeof filter
}