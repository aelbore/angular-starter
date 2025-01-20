import { minifyLiterals } from 'minify-template-literals/ts'

export const toMinifyLiterals = (isLiterals?: boolean) => {
  if (!isLiterals) return []
  return [ minifyLiterals() ]
}