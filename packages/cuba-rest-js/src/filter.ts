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

export interface Condition {
  property: string;
  operator: OperatorType;
  value: string | number | string[] | number[] | null;
}
