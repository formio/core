/**
 * Append an HTML DOM element to a container.
 *
 * @param element
 * @param container
 */
export function appendTo(element: HTMLElement | undefined, container: HTMLElement | undefined) {
  if (container && element) {
    container?.appendChild(element);
  }
}

/**
 * Prepend an HTML DOM element to a container.
 *
 * @param {HTMLElement} element - The DOM element to prepend.
 * @param {HTMLElement} container - The DOM element that is the container of the element getting prepended.
 */
export function prependTo(element: HTMLElement | undefined, container: HTMLElement | undefined) {
  if (container && element) {
    if (container.firstChild) {
      try {
        container.insertBefore(element, container.firstChild);
      } catch (err) {
        console.warn(err);
        container.appendChild(element);
      }
    } else {
      container.appendChild(element);
    }
  }
}

/**
 * Removes an HTML DOM element from its bounding container.
 *
 * @param {HTMLElement} element - The element to remove.
 * @param {HTMLElement} container - The DOM element that is the container of the element to remove.
 */
export function removeChildFrom(
  element: HTMLElement | undefined,
  container: HTMLElement | undefined,
) {
  if (container && element && container.contains(element)) {
    try {
      container.removeChild(element);
    } catch (err) {
      console.warn(err);
    }
  }
}

/**
 * Empty's an HTML DOM element.
 *
 * @param {HTMLElement} element - The element you wish to empty.
 */
export function empty(element: HTMLElement | undefined) {
  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}
