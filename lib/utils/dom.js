"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empty = exports.removeChildFrom = exports.prependTo = exports.appendTo = void 0;
/**
 * Append an HTML DOM element to a container.
 *
 * @param element
 * @param container
 */
function appendTo(element, container) {
    if (container && element) {
        container === null || container === void 0 ? void 0 : container.appendChild(element);
    }
}
exports.appendTo = appendTo;
/**
 * Prepend an HTML DOM element to a container.
 *
 * @param {HTMLElement} element - The DOM element to prepend.
 * @param {HTMLElement} container - The DOM element that is the container of the element getting prepended.
 */
function prependTo(element, container) {
    if (container && element) {
        if (container.firstChild) {
            try {
                container.insertBefore(element, container.firstChild);
            }
            catch (err) {
                console.warn(err);
                container.appendChild(element);
            }
        }
        else {
            container.appendChild(element);
        }
    }
}
exports.prependTo = prependTo;
/**
 * Removes an HTML DOM element from its bounding container.
 *
 * @param {HTMLElement} element - The element to remove.
 * @param {HTMLElement} container - The DOM element that is the container of the element to remove.
 */
function removeChildFrom(element, container) {
    if (container && element && container.contains(element)) {
        try {
            container.removeChild(element);
        }
        catch (err) {
            console.warn(err);
        }
    }
}
exports.removeChildFrom = removeChildFrom;
/**
 * Empty's an HTML DOM element.
 *
 * @param {HTMLElement} element - The element you wish to empty.
 */
function empty(element) {
    if (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}
exports.empty = empty;
