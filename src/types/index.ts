import { AssessmentScoreType } from '../constant';

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
  list: {
    maximumScore: number;
    children: [];
  }[];
}

export interface AssessmentTaskGradeSetting {
  list: {
    id: string;
    grade: string;
    score: [number, number];
  }[];
}

export interface AssessmentTaskStatisticType {
  total: number;
  submitted: number;
  pending: number;
  returned: number;
  done: number;
  donePercentage: number;
}

export interface AssessmentTaskDetailScoreContentType {
  totalScore?: number;
  grade?: string;
  list: {
    id: string;
    scoreType: AssessmentScoreType;
    score: number;
    message: string;
    files: string[];
  }[];
}
