export interface PermissionType {
  moduleId: string;
  operationOptions: object;
}

export interface WorkOrderContentType {
  type: number;
  employee?: {
    id?: string;
    details: {
      path: string;
      label: string;
      originalValue: any;
      newValue: any;
    }[];
  };
}

export interface AssessmentTaskScopeType {
  type: string;
  list: string[];
}

export interface AssessmentTaskContentType {
  list: any[];
}

export interface AssessmentTaskGradeSetting {
  list: {
    id: string;
    grade: string;
    score: [number, number];
  }[];
}

export interface AssessmentTaskStatistic {
  total: number;
  submitted: number;
  pending: number;
  returned: number;
  done: number;
  donePercentage: number;
}
