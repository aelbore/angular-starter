declare module '@lithium/tools/eslint.config.js' {
  type EslintFlatConfig = import('eslint').Linter.FlatConfig[]
  export = EslintFlatConfig
}