[@formio/core](../README.md) / [Modules](../modules.md) / [index](index.md) / [Util](index.util.md) / util

# Namespace: util

[index](index.md).[Util](index.util.md).util

## Table of contents

### Functions

- [defaults](index.util.util.md#defaults)
- [each](index.util.util.md#each)
- [eachComponent](index.util.util.md#eachcomponent)
- [fastCloneDeep](index.util.util.md#fastclonedeep)
- [get](index.util.util.md#get)
- [guid](index.util.util.md#guid)
- [intersection](index.util.util.md#intersection)
- [isBoolean](index.util.util.md#isboolean)
- [isNil](index.util.util.md#isnil)
- [isObject](index.util.util.md#isobject)
- [keys](index.util.util.md#keys)
- [last](index.util.util.md#last)
- [merge](index.util.util.md#merge)
- [noop](index.util.util.md#noop)
- [set](index.util.util.md#set)
- [trim](index.util.util.md#trim)
- [uniqueName](index.util.util.md#uniquename)

## Functions

### defaults

▸ **defaults**(`obj`: *any*, `defs`: *any*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *any* |
`defs` | *any* |

**Returns:** *any*

Defined in: [util/util.ts:64](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L64)

___

### each

▸ **each**(`collection`: *any*, `_each`: *any*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`collection` | *any* |
`_each` | *any* |

**Returns:** *void*

Defined in: [util/util.ts:10](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L10)

___

### eachComponent

▸ **eachComponent**(`components`: *any*, `fn`: *any*, `includeAll?`: *boolean*, `path?`: *string*, `parent?`: *any*): *void*

Iterate through each component within a form.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`components` | *any* |    The components to iterate.   |
`fn` | *any* |    The iteration function to invoke for each component.   |
`includeAll?` | *boolean* |    Whether or not to include layout components.   |
`path?` | *string* |    The current data path of the element. Example: data.user.firstName   |
`parent?` | *any* |    The parent object.    |

**Returns:** *void*

Defined in: util/formUtil.ts:18

___

### fastCloneDeep

▸ **fastCloneDeep**(`obj`: *any*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *any* |

**Returns:** *any*

Defined in: [util/util.ts:54](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L54)

___

### get

▸ **get**(`obj`: *any*, `path`: *string*, `def?`: *any*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *any* |
`path` | *string* |
`def?` | *any* |

**Returns:** *any*

Defined in: [util/util.ts:21](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L21)

___

### guid

▸ **guid**(): *string*

**Returns:** *string*

Defined in: util/formUtil.ts:90

___

### intersection

▸ **intersection**(`a`: *any*, `b`: *any*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`a` | *any* |
`b` | *any* |

**Returns:** *any*

Defined in: [util/util.ts:85](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L85)

___

### isBoolean

▸ **isBoolean**(`value`: *any*): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *any* |

**Returns:** *boolean*

Defined in: [util/util.ts:73](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L73)

___

### isNil

▸ **isNil**(`value`: *any*): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *any* |

**Returns:** *boolean*

Defined in: [util/util.ts:77](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L77)

___

### isObject

▸ **isObject**(`value`: *any*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *any* |

**Returns:** *any*

Defined in: [util/util.ts:81](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L81)

___

### keys

▸ **keys**(`obj`: *any*): *string*[]

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *any* |

**Returns:** *string*[]

Defined in: [util/util.ts:2](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L2)

___

### last

▸ **last**(`arr`: *any*[]): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`arr` | *any*[] |

**Returns:** *any*

Defined in: [util/util.ts:94](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L94)

___

### merge

▸ **merge**(`a`: *any*, `b`: *any*, `options?`: *any*): *unknown*

#### Parameters:

Name | Type |
:------ | :------ |
`a` | *any* |
`b` | *any* |
`options?` | *any* |

**Returns:** *unknown*

Defined in: [util/util.ts:50](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L50)

___

### noop

▸ **noop**(): *void*

**Returns:** *void*

Defined in: [util/util.ts:6](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L6)

___

### set

▸ **set**(`obj`: *any*, `path`: *string*, `value`: *any*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *any* |
`path` | *string* |
`value` | *any* |

**Returns:** *any*

Defined in: [util/util.ts:33](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L33)

___

### trim

▸ **trim**(`str`: *string*, `c?`: *string*): *string*

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`str` | *string* | - |
`c` | *string* | '\\s' |

**Returns:** *string*

Defined in: [util/util.ts:90](https://github.com/formio/core/blob/0febf17/src/util/util.ts#L90)

___

### uniqueName

▸ **uniqueName**(`name`: *string*, `template?`: *string*, `evalContext?`: *any*): *string*

Make a filename guaranteed to be unique.

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |
`template?` | *string* |
`evalContext?` | *any* |

**Returns:** *string*

Defined in: util/formUtil.ts:107
