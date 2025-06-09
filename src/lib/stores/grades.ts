import { writable } from 'svelte/store';

export interface GradeEntry {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  courseName: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  feedback?: string;
  gradedBy: string;
  gradedDate: string;
  submissionDate: string;
  category: 'assignment' | 'quiz' | 'exam' | 'project' | 'participation';
  weight: number; // Weight in final grade calculation
}

export interface CourseGrade {
  courseId: string;
  courseName: string;
  studentId: string;
  currentGrade: number;
  letterGrade: string;
  totalPoints: number;
  earnedPoints: number;
  assignments: GradeEntry[];
  lastUpdated: string;
}

const mockGradeEntries: GradeEntry[] = [
  {
    id: '1',
    assignmentId: '1',
    assignmentTitle: 'Digital News Article Analysis',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    studentId: '1',
    score: 88,
    maxScore: 100,
    percentage: 88,
    letterGrade: 'B+',
    feedback: 'Excellent analysis of digital media trends. Consider exploring more diverse sources.',
    gradedBy: 'Dr. Michael Chen',
    gradedDate: '2024-02-10T14:30:00',
    submissionDate: '2024-02-08T23:45:00',
    category: 'assignment',
    weight: 0.2
  },
  {
    id: '2',
    assignmentId: '2',
    assignmentTitle: 'Interview Transcript',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    studentId: '1',
    score: 92,
    maxScore: 100,
    percentage: 92,
    letterGrade: 'A-',
    feedback: 'Outstanding interview technique and thorough transcription. Great follow-up questions.',
    gradedBy: 'Dr. Michael Chen',
    gradedDate: '2024-02-12T16:20:00',
    submissionDate: '2024-02-07T18:30:00',
    category: 'assignment',
    weight: 0.15
  },
  {
    id: '3',
    assignmentId: 'quiz-1',
    assignmentTitle: 'Digital Media Quiz 1',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    studentId: '1',
    score: 85,
    maxScore: 100,
    percentage: 85,
    letterGrade: 'B',
    gradedBy: 'Dr. Michael Chen',
    gradedDate: '2024-02-05T10:00:00',
    submissionDate: '2024-02-05T09:45:00',
    category: 'quiz',
    weight: 0.1
  }
];

const mockCourseGrades: CourseGrade[] = [
  {
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    studentId: '1',
    currentGrade: 89.2,
    letterGrade: 'B+',
    totalPoints: 300,
    earnedPoints: 265,
    assignments: mockGradeEntries.filter(g => g.courseId === '1'),
    lastUpdated: '2024-02-12T16:20:00'
  }
];

export const gradeEntries = writable<GradeEntry[]>(mockGradeEntries);
export const courseGrades = writable<CourseGrade[]>(mockCourseGrades);

// Helper functions
export function calculateLetterGrade(percentage: number): string {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
}

export function calculateGPA(letterGrade: string): number {
  const gradePoints: { [key: string]: number } = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };
  return gradePoints[letterGrade] || 0.0;
}