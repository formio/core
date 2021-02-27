[@formio/core](../README.md) / [Modules](../modules.md) / [index](index.md) / [Util](index.util.md) / dom

# Namespace: dom

[index](index.md).[Util](index.util.md).dom

## Table of contents

### Functions

- [appendTo](index.util.dom.md#appendto)
- [empty](index.util.dom.md#empty)
- [prependTo](index.util.dom.md#prependto)
- [removeChildFrom](index.util.dom.md#removechildfrom)

## Functions

### appendTo

▸ **appendTo**(`element`: HTMLElement \| *undefined*, `container`: HTMLElement \| *undefined*): *void*

Append an HTML DOM element to a container.

#### Parameters:

Name | Type |
:------ | :------ |
`element` | HTMLElement \| *undefined* |
`container` | HTMLElement \| *undefined* |

**Returns:** *void*

Defined in: [util/dom.ts:7](https://github.com/formio/core/blob/0febf17/src/util/dom.ts#L7)

___

### empty

▸ **empty**(`element`: HTMLElement \| *undefined*): *void*

Empty's an HTML DOM element.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`element` | HTMLElement \| *undefined* | The element you wish to empty.    |

**Returns:** *void*

Defined in: [util/dom.ts:58](https://github.com/formio/core/blob/0febf17/src/util/dom.ts#L58)

___

### prependTo

▸ **prependTo**(`element`: HTMLElement \| *undefined*, `container`: HTMLElement \| *undefined*): *void*

Prepend an HTML DOM element to a container.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`element` | HTMLElement \| *undefined* | The DOM element to prepend.   |
`container` | HTMLElement \| *undefined* | The DOM element that is the container of the element getting prepended.    |

**Returns:** *void*

Defined in: [util/dom.ts:19](https://github.com/formio/core/blob/0febf17/src/util/dom.ts#L19)

___

### removeChildFrom

▸ **removeChildFrom**(`element`: HTMLElement \| *undefined*, `container`: HTMLElement \| *undefined*): *void*

Removes an HTML DOM element from its bounding container.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`element` | HTMLElement \| *undefined* | The element to remove.   |
`container` | HTMLElement \| *undefined* | The DOM element that is the container of the element to remove.    |

**Returns:** *void*

Defined in: [util/dom.ts:42](https://github.com/formio/core/blob/0febf17/src/util/dom.ts#L42)
