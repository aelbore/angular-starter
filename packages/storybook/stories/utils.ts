import type { Meta, StoryObj } from '@storybook/angular'
import type { Args } from '@storybook/types'

import { moduleMetadata, argsToTemplate } from '@storybook/angular'

type Parameters<Type extends (...args: any) => any> = Type extends (...args: infer Args) => any ? Args : never

export type NgModuleMetadata = Parameters<typeof moduleMetadata>[0]

export type StorybookTheme = 'dark' | 'light'

export { StoryObj, Meta, argsToTemplate, moduleMetadata }

export type StoryThemeObj = { 
  theme?: StorybookTheme
} 

export type ComponentMeta = {
  template?: string
  styles?: string[]
}

export type Renderer<T> = (args: T) => ({ props?: Args } & ComponentMeta)

export type Options<T> = {
  render?: Renderer<T>
  defaultTheme?: StorybookTheme
  metaArgs?: Meta<T>
  moduleMetadataOptions?: Partial<NgModuleMetadata>
}

export function defineDefaultArgs<T = Args>(options?: Options<T>) {
  const { defaultTheme = 'dark', render, metaArgs = {} } = options ?? {}
  return {
    ...options?.moduleMetadataOptions 
      ? { decorators: [ moduleMetadata(options.moduleMetadataOptions) ] } 
      : {},
    render<TRender extends T & StoryThemeObj>(args: TRender) {
      document.documentElement.setAttribute('theme', args.theme ?? defaultTheme)
      return render?.(args) ?? {
        props: args
      }
    },
    argTypes: {
      theme: { 
        options: [ 'dark', 'light' ],
        control: { 
          type: 'select'
        },
        defaultValue: defaultTheme
      },
      ...metaArgs.argTypes ?? {}
    },
    args: {
      theme: defaultTheme,
      ...metaArgs.args ?? {}
    }
  } as Meta<T>
}