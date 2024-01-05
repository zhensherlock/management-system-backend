export interface PermissionType {
  moduleId: string;
  operationOptions: object;
}

export interface WorkOrderContentType {
  type: number;
  employee?: {
    id: string;
    details: {
      path: string;
      originalValue: any;
      newValue: any;
    }[];
  };
}
