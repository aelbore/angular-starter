import type { 
  Program, 
  ExportDefaultExpression,
  Identifier, 
  ExprOrSpread, 
  ClassDeclaration, 
  ModuleItem, 
  VariableDeclaration,
  StringLiteral,
  ImportDefaultSpecifier,
  ClassMember,
  ClassProperty,
  ArrayExpression
} from '@swc/core'

import { 
  getClassDeclaration, 
  getStyleImportDefaultDeclarations, 
  hasSuperClassOf, 
  isModule, 
  isVariableDeclaration,
  isVariableDeclarator
} from './ast-helpers'

import type { AstTransformerOptions, TransformStyleOptions } from './types'

import * as swc from 'swc-ast-helpers'

export const StyleClassStatement = (options?: AstTransformerOptions) => {
  return (program: Program) => {
    const node  = program
    
    if  (!isModule(node)) return node

    const { superClass } = options ?? {}

    const moduleItem = getClassDeclaration(node.body)

    if (!(moduleItem && superClass && hasSuperClassOf(moduleItem, superClass))) return node

    const filterStaticStyles = (content: ClassDeclaration) => content.body.filter(item => (!isStyleStaticClassProperty(item)))

    const isStylesExpressionStatement = (item: ModuleItem) => {
      return swc.isExpressionStatement(item)
        && swc.isAssignmentExpression(item.expression)
        && swc.isMemberExpression(item.expression.left)
        && swc.isIdentifer(item.expression.left.property)
        && item.expression.left.property.value.includes('styles')
    }

    const isStyleStaticClassProperty = (item: ClassMember) => {
      return swc.isClassProperty(item) 
        && swc.isIdentifer(item?.key)
        && item?.key?.value?.includes('styles')
    }

    const createStaticStyleProperty = (styles: ImportDefaultSpecifier[], property: ClassProperty) => {
      const propertyValue = (property?.value || {}) as ArrayExpression
      const elements = propertyValue?.elements?.map(element => ((element?.expression) as Identifier).value) || []
    
      const toAddStyles = styles.reduce((p, c) => {
        if (!elements.includes(c.local.value)) p.push(c.local)
        return p
      }, [] as Identifier[]).map(style => ({ expression: style }))
    
      const $elements  = [ 
        ...propertyValue?.elements?.map(el => el as ExprOrSpread) ?? [],
        ...toAddStyles
      ]

      return swc.createClassProperty(
        'styles', 
        swc.createArrayExpression($elements),
        { isStatic: true }
      )
    }

    const updateClassDeclaration = (items: ModuleItem[], styles: ImportDefaultSpecifier[], property?: ClassProperty) => {
      const styleProperty = createStaticStyleProperty(styles, property!)
      return items.filter(content => (!isStylesExpressionStatement(content)))
        .map(content => {
          if (swc.isExportDeclaration(content) && swc.isClasDeclaration(content.declaration)) {
            content.declaration.body = filterStaticStyles(content.declaration)
            content.declaration.body.unshift(styleProperty)
          }
          if (swc.isClasDeclaration(content)) {
            content.body = filterStaticStyles(content)
            content.body.unshift(styleProperty)
          }
          return content
        })
    }

    const styles = getStyleImportDefaultDeclarations(node.body) 
    if (styles.length > 0) {
      const styleProperty = moduleItem.body.find(item => isStyleStaticClassProperty(item)) as ClassProperty
      const contents = updateClassDeclaration(node.body, styles, styleProperty)
  
      node.body = contents
    }

    return node
  }
}

export const TransformStyle = (options?: TransformStyleOptions) => {
  return (program: Program) => {
    const node = program

    if (isModule(node)) {
      const defaultExport = node.body.find(item => swc.isExportDefaultExpression(item)) as ExportDefaultExpression

      if (defaultExport) {
        const cssTag = swc.createIdentifer('cssTag')
  
        const createTaggedTemplate = (value: string) => {
          return swc.createTaggedTemplateExpression(
            cssTag, 
            swc.createTemplateLiteral([ swc.createTemplateElement(value, true) ])
          )
        }
  
        if (swc.isStringLiteral(defaultExport.expression) || swc.isIdentifer(defaultExport.expression)) { 
          const value = defaultExport.expression.value
          const item = node.body.find(isVariableDeclaration(value)) as VariableDeclaration

          if (item) {
            const index = node.body.indexOf(item)
  
            item.declarations = item.declarations.map(declaration => {
              if (isVariableDeclarator(declaration, value)) {
                const rawValue = (declaration.init as StringLiteral).value
                declaration.init = createTaggedTemplate(rawValue)
              }
              return declaration
            })
            node.body[index] = item
          }
  
          if (!item) {
            node.body.forEach(item => {
              if (swc.isExportDefaultExpression(item)) {
                const rawValue = (item.expression as StringLiteral).value
                item.expression = createTaggedTemplate(rawValue)
              }
            })
          }
        }
  
        node.body.forEach(item => {
          if (
            swc.isExportDefaultExpression(item) 
            && swc.isCallExpression(item.expression)
            && swc.isParenthesisExpression(item.expression.callee)
            && swc.isArrowFunctionExpression(item.expression.callee.expression)
            && swc.isStringLiteral(item.expression.callee.expression.body)
          ) {
            const rawValue = item.expression.callee.expression.body.value
            item.expression = createTaggedTemplate(rawValue)
          }
        })      
  
        node.body.unshift(
          swc.createImportDeclaration(
            [ swc.createNamedImportSpecifier(cssTag, 'css') ], 
            swc.createStringLiteral(options?.importPackage ?? 'lit')
          )
        )
      }

    }

    return node
  }
}

export const InlineStyle = () => {
  return (program: Program) => {
    const node = program
    
    if (!isModule(node)) return node

    node.body.forEach(item => {
      if (
        swc.isImportDeclaration(item) 
        && (item.source.value.includes('.css') 
            || item.source.value.includes('.scss'))
      ) {
        item.source = swc.createStringLiteral(item.source.value + '?inline')
      }
    })

    return node
  }
}