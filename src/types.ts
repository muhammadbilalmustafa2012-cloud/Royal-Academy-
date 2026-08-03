export type CourseCategory = 
  | 'Matric'
  | 'Intermediate'
  | 'Entry Test Preparation'
  | 'Spoken English'
  | 'Computer Courses'
  | 'Tuition Classes';

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  fee: number;
  feePeriod: string; // e.g. "per month" or "total"
  image: string;
  features: string[];
  schedule: string;
  instructor: string;
  appliesCount?: number;
  featured?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  qualification: string;
  experience: string;
  subject: string;
  photo: string;
  bio: string;
  email: string;
  phone: string;
  featured?: boolean;
}

export type AdmissionStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

export interface AdmissionApplication {
  id: string; // e.g. "APP-2026-104"
  studentName: string;
  fatherName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  courseId: string;
  courseName: string;
  previousEducation: string;
  cnicBForm: string;
  guardianPhone: string;
  status: AdmissionStatus;
  createdAt: string;
  adminNotes?: string;
}

export type MessageStatus = 'Unread' | 'Read' | 'Replied';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: MessageStatus;
}

export type GalleryCategory = 'Classroom' | 'Events' | 'Activities' | 'Achievements';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  date: string;
  description: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Academic' | 'Exam' | 'Holiday' | 'Event' | 'General';
  content: string;
  date: string;
  urgent?: boolean;
}

export interface StudentResult {
  id: string;
  rollNumber: string;
  studentName: string;
  fatherName: string;
  className: string;
  examName: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  status: 'Pass' | 'Fail';
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  pendingAdmissions: number;
  totalTeachers: number;
  unreadMessages: number;
  totalApplications: number;
}
