const ALLOWED_TAGS = [
  'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'span', 'button', 'strong', 'em', 'b', 'i',
  'ul', 'ol', 'li', 'a', 'img'
]

const ALLOWED_ATTRIBUTES = {
  'all': ['class', 'id', 'style'],
  'a': ['href', 'target', 'rel'],
  'img': ['src', 'alt', 'width', 'height']
}

export function sanitizeHTML(content: string) {
  const template = document.createElement('template')
  template.innerHTML = content.trim()
  
  const fragment = template.content
  sanitizeNode(fragment)
  
  return fragment
}

function sanitizeNode(node: DocumentFragment | Node | Element) {
  const childNodes = Array.from(node.childNodes)
  
  childNodes.forEach(child => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const c = child as Element
      const tagName = c.tagName.toLowerCase()
      
      // Remove disallowed elements
      if (!ALLOWED_TAGS.includes(tagName)) {
        child.remove()
        return
      }
      
      // Clean attributes
      const attributes = Array.from(c.attributes)
      attributes.forEach(attr => {
        const attrName = attr.name.toLowerCase()
        
        // Check if attribute is allowed
        const isAllowed = 
          (ALLOWED_ATTRIBUTES['all']?.includes(attrName)) ||
          // @ts-expect-error string cannot use as index
          (ALLOWED_ATTRIBUTES[tagName]?.includes(attrName))
        
        if (!isAllowed) {
          c.removeAttribute(attrName)
        }
      })
      
      // Recursively sanitize children
      sanitizeNode(child)
    } else if (child.nodeType === Node.TEXT_NODE) {
      // Preserve text nodes
      return
    } else {
      // Remove other node types
      child.remove()
    }
  })
}