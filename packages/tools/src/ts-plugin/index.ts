/* eslint @typescript-eslint/promise-function-async: "off" */
import ts from 'typescript'
import MagicString from 'magic-string'

import { extname } from 'node:path'
import { createRequire } from 'node:module'

import { createFilter, CreateFilter } from 'qoi-cli'
import { toMinifyLiterals } from './minify-literals'

export type Sass = {
  compile(
    path: string, 
    options?: import('sass-embedded').Options<'sync'>
  ): import('sass-embedded').CompileResult
  compileString(
    source: string, 
    options?: import('sass-embedded').StringOptions<'sync'>
  ): import('sass-embedded').CompileResult;
}

export type PluginOptions = {
  createFilter?: () => Partial<CreateFilter>
}

export type TSConfigOptions = {
  compilerOptions?: ts.CompilerOptions
  transformers?: ts.TransformerFactory<ts.Node>[]
}

export type TransformStyleOptions = {
  importPackage?: string
}

export type StyleClassOptions = {
  superClass?: string
}

export type LiteralsOptions = {
  minify?: boolean
  options?: import('@swc/html').Options
}

export type Options = {
  literals?:LiteralsOptions
  element?: PluginOptions & StyleClassOptions
  css?: PluginOptions & TransformStyleOptions
}

export const createImportModule = <T>(path: string) => {
  /* eslint @typescript-eslint/no-var-requires: "off" */
  /* eslint @typescript-eslint/no-require-imports: "off" */
  try { return require(path) as T } 
  catch { return createRequire(import.meta.url)(path) as T }
}

const getText = (node: ts.StringLiteral | ts.Identifier | ts.Expression | ts.NoSubstitutionTemplateLiteral) => {  
  return ts.isStringLiteral(node) 
    ? node.text
    : (node as ts.Identifier)?.escapedText ?? node.getText()
}

const hasStyles = (item: ts.ImportDeclaration) => {
  const value = getText(item.moduleSpecifier).replace(/'/g, '').replace(/"/g, '')
  return value.includes('.css') || value.includes('.scss')         
}

const RewriteImportStyle = () => {
  const randomId = () => {
    return Math.random().toString(36).substring(2)
  }
  return (context: ts.TransformationContext) => { 
    const visitor = (node: ts.Node): ts.Node => {
      if (ts.isImportDeclaration(node) && hasStyles(node)) {
        node = ts.factory.updateImportDeclaration(
          node, 
          undefined,
          ts.factory.createImportClause(
            false,
            ts.factory.createIdentifier(`styles${randomId()}`),
            undefined
          ),
          node.moduleSpecifier,
          undefined
        )
      }
      return ts.visitEachChild(node, (child) => visitor(child), context)
    }
    return visitor
  }
}

const StyleClassStatement = (options?: StyleClassOptions) => {
  const isStaticKeyword = (member: ts.GetAccessorDeclaration) => {
    return member.modifiers?.find(modifier => {
      return modifier.kind === ts.SyntaxKind.StaticKeyword
    })
  }

  const isPropertyStyles = (member: ts.ClassElement)  => {
    const value = ts.isGetAccessor(member)
      && isStaticKeyword(member)
      && member.name.getFullText().includes('styles')
    return (value ? member: null) as ts.GetAccessorDeclaration
  }

  const createGetAccessorDeclaration = (styles: ts.Identifier[]) => {
    return ts.factory.createGetAccessorDeclaration(
      [ ts.factory.createModifier(ts.SyntaxKind.StaticKeyword) ],
      ts.factory.createIdentifier('styles'),
      [],
      undefined,
      ts.factory.createBlock(
        [ 
          ts.factory.createReturnStatement(
            ts.factory.createArrayLiteralExpression(styles)   
          )
        ]
      )
    )
  }

  const updateGetAccessorDeclaration = (members: ts.NodeArray<ts.ClassElement>, styles: ts.Identifier[]) => {
    return members.map(member => {
      const node = isPropertyStyles(member)
      if (node) {
        member = ts.factory.updateGetAccessorDeclaration(
          node,
          node.modifiers,
          node.name,
          [],
          undefined,
          ts.factory.updateBlock(
            node.body!,
            node.body?.statements?.map(statement => {
              if (ts.isReturnStatement(statement) && ts.isArrayLiteralExpression(statement.expression!)) {
                statement = ts.factory.updateReturnStatement(
                  statement,
                  ts.factory.updateArrayLiteralExpression(
                    statement?.expression,
                    [ ...statement?.expression?.elements, ...styles ]
                  )
                )
              }
              return statement
            }) ?? []
          )
        )
      }
      return member
    })
  }

  const hasSuperClass = (node: ts.ClassDeclaration) => {
    return node.heritageClauses?.find(clause => {
      return ts.isHeritageClause(clause)
        && clause.types.find(type => {
          return ts.isExpressionWithTypeArguments(type)
            && getText(type.expression).includes(options?.superClass ?? '')
        })
    })
  }

  return (context: ts.TransformationContext) => { 
    const importStyles = [] as ts.Identifier[]

    const visitor = (node: ts.Node): ts.Node => {       
      if (ts.isImportDeclaration(node) && hasStyles(node) && node.importClause?.name ) {
        importStyles.push(node.importClause.name)
      }

      if (ts.isClassDeclaration(node) && hasSuperClass(node) && importStyles.length > 0) {    
        node = ts.factory.updateClassDeclaration(node,
          node.modifiers,
          node.name,
          undefined,
          node.heritageClauses,
          node.members.find(member => isPropertyStyles(member))
            ? updateGetAccessorDeclaration(node.members, importStyles)
            : [ createGetAccessorDeclaration(importStyles), ...node.members ])
      }

      return ts.visitEachChild(node, (child) => visitor(child), context)
    }
    return visitor
  }
}

const TransformStyle = (options?: TransformStyleOptions) => {
  const importPackage = options?.importPackage ?? 'lit'
  const tagAlias = 'cssTag'

  const getModuleSpecifer = (statements: ts.NodeArray<ts.Statement>) => {
    return statements.find(statement => {
      return ts.isImportDeclaration(statement)
        && statement.moduleSpecifier
        && ts.isStringLiteral(statement.moduleSpecifier)
        && getText(statement.moduleSpecifier).includes(importPackage)
    })
  }

  return (context: ts.TransformationContext) => {
    const visitor = (node: ts.Node): ts.Node => {
      if (ts.isSourceFile(node)) {
        const speficer = getModuleSpecifer(node.statements)
        
        const statements = node.statements.map(statement => {
          if (ts.isExportAssignment(statement) &&
              (
                ts.isNoSubstitutionTemplateLiteral(statement.expression) 
                || ts.isStringLiteral(statement.expression)
              )
          ) {
            statement = ts.factory.updateExportAssignment(
              statement,
              statement.modifiers,
              ts.factory.createTaggedTemplateExpression(
                ts.factory.createIdentifier(tagAlias),
                undefined,
                ts.factory.createNoSubstitutionTemplateLiteral(statement.expression.text)
              )
            )      
          }
          return statement
        })

        if (!speficer) {
          const importSpecifer = ts.factory.createImportSpecifier(
            false,
            ts.factory.createIdentifier('css'),
            ts.factory.createIdentifier(tagAlias)
          )
          const cssImport = ts.factory.createImportDeclaration(
            undefined,
            ts.factory.createImportClause(
              false,
              undefined,
              ts.factory.createNamedImports([ importSpecifer ])
            ),
            ts.factory.createStringLiteral(importPackage)
          )

          statements.unshift(cssImport)
        }

        node = ts.factory.updateSourceFile(node, statements)
      }
      return ts.visitEachChild(node, (child) => visitor(child), context)
    }
    return visitor
  }
}

const AddInlineCss = () => {
  return (context: ts.TransformationContext) => { 
    const visitor = (node: ts.Node): ts.Node => {
      if (ts.isImportDeclaration(node) && hasStyles(node)) { 
        node = ts.factory.updateImportDeclaration(
          node,
          undefined,
          node.importClause,
          ts.factory.createStringLiteral(
            getText(node.moduleSpecifier) + '?inline'
          ),
          undefined
        )
      }
      return ts.visitEachChild(node, (child) => visitor(child), context)
    }
    return visitor
  }
}

const transformCss = (code: string, id: string, options?: import('sass-embedded').Options<'sync'>) => {
  const css = extname(id).includes('.scss') ? createImportModule<Sass>('sass-embedded').compile(id, options ?? {}).css: code
  const escape = (str: string): string => str
    .replace(/`/g, '\\`')
    .replace(/\\(?!`)/g, '\\\\')
  return { 
    code: `export default '${escape(css).replace(/\r?\n|\r/g, '')}';`, 
    map: { mappings: '' }
  } as import('rollup').SourceDescription
}

const transform = (code: string, file: string, options?: TSConfigOptions) => {
  const magicString = new MagicString(code)
  const sourceFile = ts.createSourceFile(file, magicString.toString(), ts.ScriptTarget.ES2022, false, ts.ScriptKind.TS)

  const result = ts.transform(
    sourceFile, 
    options?.transformers ?? [],
    {
      strict: false,
      skipLibCheck: true,
      noEmit: true,
      ...options?.compilerOptions ?? {}
    }
  )

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const outputText = printer.printNode(ts.EmitHint.Unspecified, result.transformed.at(0)!, undefined!)

  const sourceMap = magicString.generateMap({
    includeContent: true,
    source: file,
    hires: true
  })

  return { code: outputText, map: sourceMap.toString() }
}

const BundleStylePlugin = () => {
  const filter = createFilter()
  return {
    name: 'bundle-style',
    enforce: 'pre',
    transform(code, id) {
      if (filter?.cssFilter?.(id)) {
        return transformCss(code, id, {
          style: 'compressed'
        })
      }
      return
    }
  } as import('rollup').InputPluginOption
}

const inlineElementPlugin = (options?: Options) => {
  const filter = createFilter(), filter$ = options?.element?.createFilter?.()
  return {
    name: 'inline-element',
    enforce: 'pre',
    transform(code: string, id: string) {
      const file = id.split('?')[0]
      if (filter$?.tsFilter?.(file) ?? filter?.tsFilter?.(file)) {
        return transform(code, id, {
          transformers: [ RewriteImportStyle(), StyleClassStatement(options?.element) ]
        })
      }
      return
    }
  } as import('rollup').InputPluginOption
}

const AddInlineCssPlugin = () => {
  const filter = createFilter()
  return {
    name: 'addInlineCss',
    enforce: 'pre',
    transform(code: string, id: string) {
      const file = id.split('?')[0]
      if (filter?.tsFilter?.(file)) {
        return transform(code, id, {
          compilerOptions: {
            paths: {
              '@lithium/components/core': [
                './src/core/index.ts'
              ]
            }
          },
          transformers: [ AddInlineCss() ]
        })
      }
      return
    }
  } as import('rollup').InputPluginOption 
}

const TransformStylePlugin = (options?: Options) => {
  const filter = createFilter(), { css } = options ?? {}
  return {
    name: 'transformStyle',
    enforce: 'post',
    transform(code: string, id: string) {
      const file = id.split('?')[0]
      if (css?.createFilter?.()?.cssFilter?.(file) ?? filter?.cssFilter?.(file)) {
        return transform(code, file, {
          transformers: [ TransformStyle(css) ]
        })
      }
      return
    }
  } as import('rollup').InputPluginOption 
}

export const InlineElementPlugin = <T>(options?: Options) => {
  return [ 
    BundleStylePlugin(),  
    inlineElementPlugin(options), 
    TransformStylePlugin(options),
    ...toMinifyLiterals(options?.literals?.minify)
  ] as T[]
}

export const ViteInlineElementPlugin = <T>(options?: Options) => {
  return [ inlineElementPlugin(options), AddInlineCssPlugin() ] as T[]
}