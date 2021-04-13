/**
 * Append an HTML DOM element to a container.
 *
 * @param element
 * @param container
 */
export declare function appendTo(element: (HTMLElement | undefined), container: (HTMLElement | undefined)): void;
/**
 * Prepend an HTML DOM element to a container.
 *
 * @param {HTMLElement} element - The DOM element to prepend.
 * @param {HTMLElement} container - The DOM element that is the container of the element getting prepended.
 */
export declare function prependTo(element: (HTMLElement | undefined), container: (HTMLElement | undefined)): void;
/**
 * Removes an HTML DOM element from its bounding container.
 *
 * @param {HTMLElement} element - The element to remove.
 * @param {HTMLElement} container - The DOM element that is the container of the element to remove.
 */
export declare function removeChildFrom(element: (HTMLElement | undefined), container: (HTMLElement | undefined)): void;
/**
 * Empty's an HTML DOM element.
 *
 * @param {HTMLElement} element - The element you wish to empty.
 */
export declare function empty(element: (HTMLElement | undefined)): void;
