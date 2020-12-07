export type OperatorType = '=' | '>' | '>=' | '<' | '<=' | '<>' | 'startsWith' | 'endsWith' | 'contains'
  | 'doesNotContain' | 'in' | 'notIn' | 'notEmpty';

export type GroupType = 'AND' | 'OR';

export interface EntityFilter {
  conditions: Array<Condition | ConditionsGroup>;
}

export interface ConditionsGroup {
  group: GroupType;
  conditions: Condition[];
}

export type FilterValue = string | number | string[] | number[] | null;

export interface Condition {
  property: string;
  operator: OperatorType;
  value: FilterValue;
}
