export type SchoolClassStudent = {
  id: number;
  fullName: string;
  studentCode: string;
};

export type SchoolClassResponse = {
  id: number;
  name: string;
  teacherId: number;
  teacherName: string;
  students?: SchoolClassStudent[];
};
