export type StudentResponse = {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  studentCode: string;
  parentId: number;
  parentName: string;
  isDeleted: boolean;
}

export type CreateStudentRequest = {
  firstName: string;
  lastName: string;
  dni: string;
  parentId: number;
}

export type UpdateStudentRequest ={
  firstName?: string;
  lastName?: string;
  dni?: string;
  parentId: number;
}

export type StudentSummary = {
  id: number;
  fullName: string;
  studentCode: string;
}

export type ClassSummary = {
  id: number;
  name: string;
  teacher_name?: string;
}

export type IncidentSummary = {
  id: number;
  title: string;
  schoolClass_name?: string;
  status: string;
}

export type StudentDetailResponse = {
  id: number;
  fullName: string;
  studentCode: string;
  classes: ClassSummary[];
  incidents: IncidentSummary[];
}