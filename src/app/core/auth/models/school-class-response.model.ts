import { StudentSummary } from './student-response.model';

export type SchoolClassResponse = {
  id: number;
  name: string;
  teacherId?: number;
  teacherName?: string;
  students: StudentSummary[];
  isDeleted?: boolean;
};

export type CreateClassRequest = {
  name: string;
  teacherId: number;
  studentIds?: number[];
};

export type UpdateSchoolClassRequest = {
  name?: string;
  teacherId: number;
  studentIds?: number[];
};

export type AddStudentsRequest = {
  studentIds: number[];
};
