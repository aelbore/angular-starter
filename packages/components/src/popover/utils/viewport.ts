/**
 * Utility functions for checking element visibility in the viewport
 */
export interface ViewportOptions {
  /** Threshold for intersection (0 to 1, where 1 means fully visible) */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Timeout in milliseconds for waiting (default: 10000ms) */
  timeout?: number;
  /** Parent element to observe for DOM changes (default: document.body) */
  parentElement?: HTMLElement;
}

/**
 * Checks if an element is currently visible in the viewport
 * @param elementId The ID of the element to check
 * @param options Configuration options
 * @returns Promise<boolean> - true if element is visible, false otherwise
 */
export function isElementVisible(
  elementId: string, 
  options: ViewportOptions = {}
): Promise<boolean> {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.warn(`ViewportUtil: Element with ID '${elementId}' not found`);
      resolve(false);
      return;
    }

    const { threshold = 0, rootMargin = '0px' } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        observer.disconnect();
        resolve(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
  });
}

/**
 * Waits for an element to become visible in the viewport
 * @param elementId The ID of the element to wait for
 * @param options Configuration options
 * @returns Promise<boolean> - true if element became visible, false if timeout
 */
export function waitForElementVisible(
  elementId: string,
  options: ViewportOptions = {}
): Promise<boolean> {
  return new Promise((resolve) => {
    const { threshold = 0, rootMargin = '0px', parentElement = null } = options;
    
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (mutationObserver) {
        mutationObserver.disconnect();
        mutationObserver = null;
      }
    };

    const checkElement = () => {
      const element = document.getElementById(elementId);
      
      if (!element) {
        // Element doesn't exist yet, keep checking
        return;
      }

      // Element exists, start observing
      if (mutationObserver) {
        mutationObserver.disconnect();
        mutationObserver = null;
      }

      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            cleanup();
            resolve(true);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(element);
    };

    // Initial check - element might already exist
    checkElement();
    
    // If element doesn't exist yet, start observing DOM changes
    const observeTarget = parentElement || document.body;
    mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added nodes contain our target element
          for (const node of Array.from(mutation.addedNodes)) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Check if the added node is our target element
              if (element.id === elementId) {
                checkElement();
                return;
              }
              // Check if the added node contains our target element
              if (element.querySelector && element.querySelector(`#${elementId}`)) {
                checkElement();
                return;
              }
            }
          }
        }
      }
    });

    mutationObserver.observe(observeTarget, {
      childList: true,
      subtree: true
    });
  });
}

/**
 * Synchronously checks if an element is visible using getBoundingClientRect
 * This is less accurate than IntersectionObserver but works immediately
 * @param elementId The ID of the element to check
 * @param options Configuration options
 * @returns boolean - true if element is visible, false otherwise
 */
export function isElementVisibleSync(
  elementId: string,
  options: ViewportOptions = {}
): boolean {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.warn(`ViewportUtil: Element with ID '${elementId}' not found`);
    return false;
  }

  const rect = element.getBoundingClientRect();
  const { threshold = 0 } = options;
  
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  // Calculate visible area
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
  
  if (visibleHeight <= 0 || visibleWidth <= 0) {
    return false;
  }

  // Calculate intersection ratio
  const elementArea = rect.width * rect.height;
  const visibleArea = visibleHeight * visibleWidth;
  const intersectionRatio = elementArea > 0 ? visibleArea / elementArea : 0;

  return intersectionRatio >= threshold;
}

/**
 * Scrolls an element into view if it's not visible
 * @param elementId The ID of the element to scroll to
 * @param options Scroll behavior options
 * @returns Promise<boolean> - true if element was found and scrolled to
 */
export function scrollElementIntoView(
  elementId: string,
  options: ScrollIntoViewOptions = {}
): Promise<boolean> {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.warn(`ViewportUtil: Element with ID '${elementId}' not found`);
      resolve(false);
      return;
    }

    const defaultOptions: ScrollIntoViewOptions = {
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
      ...options
    };

    element.scrollIntoView(defaultOptions);
    
    // Wait a bit for scroll to complete
    setTimeout(() => resolve(true), 500);
  });
}

/**
 * Waits for an element to exist in the DOM (not necessarily visible)
 * @param elementId The ID of the element to wait for
 * @param parentElement Parent element to observe for DOM changes (default: document.body)
 * @returns Promise<HTMLElement | null> - the element if found, null if timeout
 */
export function waitForElement(
  elementId: string,
  parentElement: HTMLElement | null = null
): Promise<HTMLElement> {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId);
    
    if (element) {
      resolve(element);
      return;
    }

    let mutationObserver: MutationObserver | null = null;
    const observeTarget = parentElement || document.body;

    const cleanup = () => {
      if (mutationObserver) {
        mutationObserver.disconnect();
        mutationObserver = null;
      }
    };

    const checkElement = () => {
      const el = document.getElementById(elementId);
      if (el) {
        cleanup();
        resolve(el);
      }
    };

    // Use MutationObserver to watch for DOM changes
    mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of Array.from(mutation.addedNodes)) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Check if the added node is our target element
              if (element.id === elementId) {
                checkElement();
                return;
              }
              // Check if the added node contains our target element
              if (element.querySelector && element.querySelector(`#${elementId}`)) {
                checkElement();
                return;
              }
            }
          }
        }
      }
    });

    // Start observing DOM changes
    mutationObserver.observe(observeTarget, {
      childList: true,
      subtree: true
    });
  });
}
