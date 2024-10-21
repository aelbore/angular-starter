import type { Plugin } from '@swc/core'

import { type FilterPattern } from '@rollup/pluginutils'
import type { Options, CompileResult, StringOptions } from 'sass'

export type SwcOptions = {
  plugins?: Plugin[] | Plugin
  paths?: {
    [from: string]: [string];
  }
  baseUrl?: string
}

export type Sass = {
  compile(path: string, options?: Options<'sync'>): CompileResult
  compileString(source: string, options?: StringOptions<'sync'>): CompileResult;
}

export type FilterOptions = {
  include?: FilterPattern
  exclude?: FilterPattern
}

export type PluginOptions = {
  createFilter?: () => Partial<CreateFilter>
}

export type BundlePluginOptions = {
  styles?: PluginOptions & ElementSuperClass
  css?: PluginOptions & TransformStyleOptions
  inline?: PluginOptions
  swc?: Omit<SwcOptions, 'plugins'>
}

export type TransformStyleOptions = {
  importPackage?: string
} 

export type CreateFilter = {
  tsFilter?: FilterFn
  cssFilter?: FilterFn
  excludes?: RegExp[]
}

export type ElementSuperClass = {
  superClass?: string | string[]
}

export type VitePluginOptions = BundlePluginOptions

export type FilterFn = (id: string, options?: FilterOptions) => boolean

export type AstTransformerOptions = ElementSuperClass