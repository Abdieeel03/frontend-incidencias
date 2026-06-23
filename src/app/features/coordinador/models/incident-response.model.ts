export const IncidentStatus = {
  NO_LEIDA: 'NO_LEIDA',
  LEIDA: 'LEIDA',
} as const;

export type IncidentStatusType = (typeof IncidentStatus)[keyof typeof IncidentStatus];

export interface IncidentResponse {
  id: number;
  title: string;
  description: string;
  status: IncidentStatusType;
  incidentDate: string;
  studentId: number;
  studentName: string;
  classId: number;
  className: string;
  teacherId: number;
  teacherName: string;
}
