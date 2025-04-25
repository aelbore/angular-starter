import { PageValue } from '../types'

export const valueTransform = (value: PageValue) => {
  let type = value.type
  if (value.sourceType === 'Resource Type') {
    const linkType = value.linkType?.toLowerCase()
    if (linkType?.includes('mywork')) {
      type = 'myWork'
    }
    if (linkType?.includes('deal')) {
      type = 'myDeal'
    }
  }
  value.type = type
  return value
}