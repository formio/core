[@formio/core](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / [Util](../modules/index.util.md) / Evaluator

# Class: Evaluator

[index](../modules/index.md).[Util](../modules/index.util.md).Evaluator

## Table of contents

### Constructors

- [constructor](index.util.evaluator.md#constructor)

### Properties

- [noeval](index.util.evaluator.md#noeval)

### Methods

- [evaluator](index.util.evaluator.md#evaluator)
- [interpolate](index.util.evaluator.md#interpolate)
- [interpolateString](index.util.evaluator.md#interpolatestring)

## Constructors

### constructor

\+ **new Evaluator**(): [*Evaluator*](index.util.evaluator.md)

**Returns:** [*Evaluator*](index.util.evaluator.md)

## Properties

### noeval

▪ `Static` **noeval**: *boolean*= false

Defined in: [util/Evaluator.ts:3](https://github.com/formio/core/blob/0febf17/src/util/Evaluator.ts#L3)

## Methods

### evaluator

▸ `Static`**evaluator**(`func`: *any*, ...`params`: *any*): Function

#### Parameters:

Name | Type |
:------ | :------ |
`func` | *any* |
`...params` | *any* |

**Returns:** Function

Defined in: [util/Evaluator.ts:4](https://github.com/formio/core/blob/0febf17/src/util/Evaluator.ts#L4)

___

### interpolate

▸ `Static`**interpolate**(`rawTemplate`: *any*, `data`: *any*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`rawTemplate` | *any* |
`data` | *any* |

**Returns:** *any*

Defined in: [util/Evaluator.ts:20](https://github.com/formio/core/blob/0febf17/src/util/Evaluator.ts#L20)

___

### interpolateString

▸ `Static`**interpolateString**(`rawTemplate`: *string*, `data`: *any*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`rawTemplate` | *string* |
`data` | *any* |

**Returns:** *string*

Defined in: [util/Evaluator.ts:16](https://github.com/formio/core/blob/0febf17/src/util/Evaluator.ts#L16)
