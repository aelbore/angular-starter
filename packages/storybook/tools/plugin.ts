
import { join } from 'node:path'
import angular from '@analogjs/vite-plugin-angular'

export const Angular = (filter?: import('qoi-cli').CreateFilter) => {
  return [
    angular({ 
      jit: true, 
      tsconfig: join(process.cwd(), 'tsconfig.json'),
      inlineStylesExtension: 'scss',
      transformFilter(_, id) {
        if (filter?.tsFilter?.(id) || filter?.cssFilter?.(id)) {
          return false
        }
        return true
      }
    })
  ] as import('rollup').Plugin[][]
}