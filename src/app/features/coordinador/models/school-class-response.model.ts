export interface SchoolClassStudent {
  id: number;
  fullName: string;
  studentCode: string;
}

export interface SchoolClassResponse {
  id: number;
  name: string;
  teacherId: number;
  teacherName: string;
  students?: SchoolClassStudent[];
}
