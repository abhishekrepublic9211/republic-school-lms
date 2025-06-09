import { writable } from 'svelte/store';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  submissionDate?: string;
  submissionUrl?: string;
  submittedDate?: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: number;
  maxGrade: number;
  feedback?: string;
  attachments?: AssignmentFile[];
  submittedFiles?: AssignmentFile[];
  rubric?: RubricCriteria[];
  type: 'assignment' | 'test' | 'project';
  priority: 'high' | 'medium' | 'low';
}

export interface AssignmentFile {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadDate: string;
}

export interface RubricCriteria {
  id: string;
  criteria: string;
  description: string;
  maxPoints: number;
  earnedPoints?: number;
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Digital News Article Analysis',
    description: 'Analyze a recent digital news article and evaluate its effectiveness in terms of structure, sources, and digital presentation.',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    dueDate: '2024-02-15T23:59:00',
    status: 'pending',
    maxGrade: 100,
    submissionUrl: null,
    type: 'assignment',
    priority: 'high',
    attachments: [
      {
        id: '1',
        name: 'Assignment Guidelines.pdf',
        size: '1.2 MB',
        type: 'pdf',
        url: '/assignments/guidelines.pdf',
        uploadDate: '2024-01-20T10:00:00'
      }
    ],
    rubric: [
      {
        id: '1',
        criteria: 'Analysis Quality',
        description: 'Depth and accuracy of article analysis',
        maxPoints: 40
      },
      {
        id: '2',
        criteria: 'Writing Quality',
        description: 'Clarity, grammar, and structure',
        maxPoints: 30
      },
      {
        id: '3',
        criteria: 'Critical Thinking',
        description: 'Evidence of critical evaluation',
        maxPoints: 30
      }
    ]
  },
  {
    id: '2',
    title: 'Interview Transcript',
    description: 'Conduct and transcribe a 15-minute interview with a local community member about a current issue.',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    dueDate: '2024-02-08T23:59:00',
    submissionDate: '2024-02-07T18:30:00',
    submissionUrl: '/submissions/interview_transcript_sarah.docx',
    submittedDate: '2024-02-07T18:30:00',
    status: 'graded',
    grade: 88,
    maxGrade: 100,
    type: 'assignment',
    priority: 'medium',
    feedback: 'Excellent interview technique and thorough transcription. Consider asking more follow-up questions to deepen the responses.',
    submittedFiles: [
      {
        id: '1',
        name: 'Interview_Transcript.docx',
        size: '45 KB',
        type: 'docx',
        url: '/submissions/interview.docx',
        uploadDate: '2024-02-07T18:30:00'
      }
    ]
  },
  {
    id: '3',
    title: 'Source Verification Exercise',
    description: 'Practice source verification techniques on provided materials and document your process.',
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    dueDate: '2024-02-20T23:59:00',
    status: 'pending',
    maxGrade: 100,
    submissionUrl: null,
    type: 'project',
    priority: 'low'
  }
];

export const assignments = writable<Assignment[]>(mockAssignments);
