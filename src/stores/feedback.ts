import { writable } from 'svelte/store';

export interface FeedbackEntry {
  id: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  instructorId: string;
  instructorName: string;
  rating: number; // 1-5 scale
  categories: {
    contentQuality: number;
    teachingEffectiveness: number;
    courseOrganization: number;
    assignmentRelevance: number;
    overallSatisfaction: number;
  };
  comment: string;
  suggestions?: string;
  timestamp: string;
  isAnonymous: boolean;
  semester: string;
  academicYear: string;
}

export interface CourseFeedbackSummary {
  courseId: string;
  courseName: string;
  instructorName: string;
  totalResponses: number;
  averageRating: number;
  categoryAverages: {
    contentQuality: number;
    teachingEffectiveness: number;
    courseOrganization: number;
    assignmentRelevance: number;
    overallSatisfaction: number;
  };
  responseRate: number;
  lastUpdated: string;
}

const mockFeedbackEntries: FeedbackEntry[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    studentId: '1',
    studentName: 'Sarah Johnson',
    instructorId: '2',
    instructorName: 'Dr. Michael Chen',
    rating: 4,
    categories: {
      contentQuality: 5,
      teachingEffectiveness: 4,
      courseOrganization: 4,
      assignmentRelevance: 4,
      overallSatisfaction: 4
    },
    comment: 'Excellent course content and very engaging lectures. The assignments are practical and help reinforce learning.',
    suggestions: 'More guest speakers from the industry would be valuable.',
    timestamp: '2024-02-15T10:30:00',
    isAnonymous: false,
    semester: 'Spring',
    academicYear: '2024'
  },
  {
    id: '2',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    studentId: '3',
    studentName: 'Anonymous',
    instructorId: '2',
    instructorName: 'Dr. Michael Chen',
    rating: 5,
    categories: {
      contentQuality: 5,
      teachingEffectiveness: 5,
      courseOrganization: 5,
      assignmentRelevance: 5,
      overallSatisfaction: 5
    },
    comment: 'Outstanding course! Dr. Chen is an excellent instructor who makes complex topics easy to understand.',
    timestamp: '2024-02-14T14:20:00',
    isAnonymous: true,
    semester: 'Spring',
    academicYear: '2024'
  }
];

const mockFeedbackSummaries: CourseFeedbackSummary[] = [
  {
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    instructorName: 'Dr. Michael Chen',
    totalResponses: 28,
    averageRating: 4.3,
    categoryAverages: {
      contentQuality: 4.5,
      teachingEffectiveness: 4.2,
      courseOrganization: 4.1,
      assignmentRelevance: 4.3,
      overallSatisfaction: 4.4
    },
    responseRate: 87.5, // 28 out of 32 students
    lastUpdated: '2024-02-15T10:30:00'
  }
];

export const courseFeedback = writable<FeedbackEntry[]>(mockFeedbackEntries);
export const feedbackSummaries = writable<CourseFeedbackSummary[]>(mockFeedbackSummaries);

// Helper functions
export function calculateOverallRating(categories: FeedbackEntry['categories']): number {
  const values = Object.values(categories);
  return Math.round((values.reduce((sum, val) => sum + val, 0) / values.length) * 10) / 10;
}

export function getFeedbackColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-blue-600';
  if (rating >= 3.5) return 'text-yellow-600';
  if (rating >= 3.0) return 'text-orange-600';
  return 'text-red-600';
}