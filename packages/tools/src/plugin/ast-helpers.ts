import type { 
  Module,
  ExportDeclaration, 
  Identifier, 
  ExprOrSpread, 
  ImportDeclaration, 
  ClassDeclaration, 
  ModuleItem, 
  Node,
  VariableDeclarator,
  Expression,
  ImportDefaultSpecifier
} from '@swc/core'

import * as swc from 'swc-ast-helpers'

const removeQuotes = (value: string) => value.replace(/'/g, '').replace(/"/g, '')
const randomId = () => Math.random().toString(36).substring(2)

export const isModule = (node: Node): node is Module => {
  return node.type === 'Module'
}

export const hasStyles = (item: ModuleItem) => {
  return swc.isImportDeclaration(item) 
  && item.specifiers?.length < 1
  && (removeQuotes(item.source.value).includes('.css') || removeQuotes(item.source.value).includes('.scss'))
}

export const  hasImportDefaultSpecifierStyle = (item: ModuleItem) => {
  return (swc.isImportDeclaration(item) 
    && (item.specifiers.length > 0) 
    && (item.source.value.includes('.css') || item.source.value.includes('.scss')))
}

export const getClassDeclaration = (items: ModuleItem[]) => {
  const exportDeclaration = items.find(content => swc.isExportDeclaration(content) && swc.isClasDeclaration(content.declaration))
  return (
    exportDeclaration
      ? (exportDeclaration as ExportDeclaration).declaration
      : items.find(content => swc.isClasDeclaration(content))
  ) as ClassDeclaration
}

export const getStyleImportDefaultDeclarations = (items: ModuleItem[]) => {
  return items.reduce((p: ImportDefaultSpecifier[], c) => {
    if (hasImportDefaultSpecifierStyle(c)) {
      const specifiers = (c as ImportDeclaration).specifiers.filter(s => {
        return swc.isImportDefaultSpecifier(s)
      }) as ImportDefaultSpecifier[]
      p = [ ...p, ...specifiers ]
    }
    return p
  }, [] as ImportDefaultSpecifier[])
}

export const getStyles = (items: ModuleItem[]) => {
  return items.filter(content => hasStyles(content))
    .map((item: ModuleItem) => {
      const content = item as ImportDeclaration
      const specifier = swc.createImportDefaultSpecifier(`styles${randomId()}`)
      return swc.updateImportDeclaration(content, content.source, [ specifier ])
    })
}

export const createStylesStatement = (element: string, elements: Identifier[]) => {
  return swc.createExpressionStatement(
    swc.createAssignmentExpression(
      swc.createMemberExpression(swc.createIdentifer(element), swc.createIdentifer('styles')),
      swc.createArrayExpression(elements.map(el => ({ expression: el } as ExprOrSpread)).reverse())
    )
  )
}

export const isVariableDeclaration = (value: string) => {
  return (item: ModuleItem) => 
    swc.isVariableDeclaration(item) 
    && item.declarations.find(declaration => isVariableDeclarator(declaration, value))
}

export  const isVariableDeclarator = (declaration: VariableDeclarator, value: string) => {
  return swc.isVariableDeclarator(declaration) 
    && swc.isIdentifer(declaration.id)
    && declaration.id.value.includes(value)
    && swc.isStringLiteral(declaration.init as Expression)
}

export const hasSuperClassOf = (item: ModuleItem, value: string | string[]) => {
  return (
    (item && value)
      ? swc.isClasDeclaration(item) 
        && swc.isIdentifer(item.superClass!)
        && (Array.isArray(value) 
          ? value: [ value ]
        ).includes(item.superClass.value)
      : false
  )
}