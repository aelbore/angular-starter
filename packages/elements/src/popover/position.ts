import { Position, ViewPort } from '@lithium/elements/types'

const ARROW_SIZE = 8
const PADDING = 16

const PLACEMENTS = {
  top: { opposite: 'bottom', axis: 'y' },
  bottom: { opposite: 'top', axis: 'y' },
  left: { opposite: 'right', axis: 'x' },
  right: { opposite: 'left', axis: 'x' }
}

export function calculatePosition(triggerRect: DOMRect, contentRect: DOMRect, viewport: ViewPort, preferredPlacement: Position = 'bottom') {
  // Try preferred placement first, then try others if it doesn't fit
  const allPlacements = [
    preferredPlacement,
    ...Object.keys(PLACEMENTS).filter(p => p !== preferredPlacement)
  ] as Position[]
  
  let bestPlacement = null as Position | null
  let bestCoords = null as Record<Position, number> | null
  let bestFitness = -Infinity

  for (const placement of allPlacements) {
    const coords = getCoordinates(placement, triggerRect, contentRect) as  Record<Position, number>
    const fitness = calculateFitness(coords, contentRect, viewport)
    
    if (fitness > bestFitness) {
      bestFitness = fitness
      bestPlacement = placement
      bestCoords = coords
    }

    // If we found a good fit with preferred placement, use it
    if (placement === preferredPlacement && fitness > 0) {
      break
    }
  }

  // Adjust position to stay within viewport
  const adjustedCoords = adjustPosition(bestCoords!, contentRect, viewport) as Record<Position, number>
  const arrowCoords = calculateArrowPosition(bestPlacement!, triggerRect, adjustedCoords, contentRect)

  return {
    placement: bestPlacement,
    coords: adjustedCoords,
    arrowCoords
  }
}

function getCoordinates(placement: Position, triggerRect: DOMRect, contentRect: DOMRect) {
  const coords = { top: 0, left: 0 }

  switch (placement) {
    case 'bottom':
      coords.top = triggerRect.bottom + ARROW_SIZE
      coords.left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2)
      break
    case 'top':
      coords.top = triggerRect.top - contentRect.height - ARROW_SIZE
      coords.left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2)
      break
    case 'right':
      coords.top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2)
      coords.left = triggerRect.right + ARROW_SIZE
      break
    case 'left':
      coords.top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2)
      coords.left = triggerRect.left - contentRect.width - ARROW_SIZE
      break
  }

  return coords
}

function calculateFitness(coords: Record<Position, number>, contentRect: DOMRect, viewport: ViewPort) {
  let fitness = 0
  
  // Check if content is fully visible
  const isVisible = (
    coords.top >= PADDING &&
    coords.left >= PADDING &&
    coords.top + contentRect.height <= viewport.height - PADDING &&
    coords.left + contentRect.width <= viewport.width - PADDING
  )

  if (isVisible) fitness += 1000

  // Prefer centered alignment when possible
  const centerAlignment = Math.abs(
    (coords.left + contentRect.width / 2) - (viewport.width / 2)
  )
  fitness -= centerAlignment * 0.1

  // Penalize positions that are partially off-screen
  if (coords.top < 0) fitness -= Math.abs(coords.top)
  if (coords.left < 0) fitness -= Math.abs(coords.left)
  if (coords.top + contentRect.height > viewport.height) {
    fitness -= (coords.top + contentRect.height - viewport.height)
  }
  if (coords.left + contentRect.width > viewport.width) {
    fitness -= (coords.left + contentRect.width - viewport.width)
  }

  return fitness
}

function adjustPosition(coords: Record<Position, number>, contentRect: DOMRect, viewport: ViewPort) {
  return {
    top: Math.min(
      Math.max(PADDING, coords.top),
      viewport.height - contentRect.height - PADDING
    ),
    left: Math.min(
      Math.max(PADDING, coords.left),
      viewport.width - contentRect.width - PADDING
    )
  }
}

function calculateArrowPosition(placement: Position, triggerRect: DOMRect, coords: Record<Position, number>, contentRect: DOMRect) {
  const isVertical = placement === 'top' || placement === 'bottom'
  const arrowCoords = { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' } as Record<Position, string | number>

  if (isVertical) {
    arrowCoords.left = Math.max(
      PADDING,
      Math.min(
        triggerRect.left + (triggerRect.width / 2) - coords.left - ARROW_SIZE,
        contentRect.width - ARROW_SIZE * 2
      )
    )
    
    if (placement === 'top') {
      arrowCoords.bottom = -ARROW_SIZE
    } else {
      arrowCoords.top = -ARROW_SIZE
    }
  } else {
    arrowCoords.top = Math.max(
      PADDING,
      Math.min(
        triggerRect.top + (triggerRect.height / 2) - coords.top - ARROW_SIZE,
        contentRect.height - ARROW_SIZE * 2
      )
    )
    
    if (placement === 'left') {
      arrowCoords.right = -ARROW_SIZE
    } else {
      arrowCoords.left = -ARROW_SIZE
    }
  }

  return arrowCoords
}