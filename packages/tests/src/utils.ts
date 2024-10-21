import { render, TemplateResult, ReactiveElement } from 'lit'

const elements = [] as ChildNode[]

type UsefulNodeOptions = {
  nodeType?: number
  textContent?: string
}

export const NODE_TYPES = Object.freeze({
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  COMMENT_NODE: 8,
  DOCUMENT_FRAGMENT_NODE: 11,
})

const isUsefulNode = ({ nodeType, textContent }: UsefulNodeOptions) => {
  switch (nodeType) {
    case NODE_TYPES.COMMENT_NODE:
      return false;
    case NODE_TYPES.TEXT_NODE:
      return textContent?.trim();
    default:
      return true;
  }
}

export async function fixture<T>(template: TemplateResult) {
  render(template, document.body)
  // @ts-ignore
  const [ node ] = Array.from(document.body.childNodes).filter(isUsefulNode);
  elements.push(node)
  await (node as ReactiveElement).updateComplete
  return node as T
}

export function fixtureCleanUp() {
  elements.forEach(element => element.remove())
}