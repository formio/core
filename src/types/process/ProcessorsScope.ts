import { CalculationScope } from "./calculation";
import { ConditionsScope } from "./conditions";
import { DefaultValueScope } from "./defaultValue";
import { FetchScope } from "./fetch";
import { ValidationScope } from "./validation";
export type ProcessorsScope = CalculationScope & ConditionsScope & DefaultValueScope & FetchScope & ValidationScope;
