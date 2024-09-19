export const Departments = [
  "administration",
  "admissions",
  "finance",
  "human_resources",
  "it",
  "marketing",
  "student_affairs",
  "academic_affairs",
  "research",
] as const;

export const DepartmentTitles = [
  "Administration",
  "Admissions",
  "Finance",
  "Human Resources",
  "IT",
  "Marketing",
  "Student Affairs",
  "Academic Affairs",
  "Research",
] as const;

export type Department = (typeof Departments)[number];
