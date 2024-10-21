import type { ImportDeclaration, Program } from '@swc/core'
import { isModule } from './ast-helpers'

import * as swc from 'swc-ast-helpers'

const randomId = () => {
  return Math.random().toString(36).substring(2)
}

const hasStyles = (item: ImportDeclaration) => {
  const value = item.source.value.replace(/'/g, '').replace(/"/g, '')
  return item.specifiers?.length < 1 && (
    value.includes('.css') || value.includes('.scss')
  )              
} 

export const RewriteImportStyle = () => {
  return (program: Program) => {
    if (isModule(program)) {
      /**
       * example code:
       * import './button.scss'
       * class Button extends HTMLElement { }
       * 
       * output code:
       * import styles8121 from './button.scss'
       * class Button extends HTMLElement { }
       */
      program.body = program.body.map(item => {
        if (swc.isImportDeclaration(item) && hasStyles(item)) {
          const specifier = swc.createImportDefaultSpecifier(`styles${randomId()}`)
          return swc.updateImportDeclaration(item, item.source, [ specifier ])
        }
        return item
      })
    }
    return program
  }
}