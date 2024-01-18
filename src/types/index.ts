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

// export interface AssessmentTaskContentType {}

export interface AssessmentTaskGradeSetting {
  list: {
    id: string;
    grade: string;
    score: [number, number];
  }[];
}
