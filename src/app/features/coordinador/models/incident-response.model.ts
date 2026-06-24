export const IncidentStatus = {
  NO_LEIDA: 'NO_LEIDA',
  LEIDA: 'LEIDA',
} as const;

export type IncidentStatus = (typeof IncidentStatus)[keyof typeof IncidentStatus];

export type IncidentResponse = {
  id: number;
  title: string;
  description: string;
  status: IncidentStatus;
  incidentDate: string;
  studentId: number;
  studentName: string;
  classId: number;
  className: string;
  teacherId: number;
  teacherName: string;
  isDeleted?: boolean;
};


export type CreateIncidentRequest = {
  title: string;
  description: string;
  studentId: number;
  classId: number;
};

export type UpdateIncidentRequest = {
  title?: string;
  description: string;
  studentId: number;
  classId: number;
};