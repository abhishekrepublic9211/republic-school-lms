import { writable } from 'svelte/store';

export interface Doubt {
  id: string;
  title: string;
  content: string;
  category: string;
  courseId?: string;
  courseName?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  upvotes: number;
  isResolved: boolean;
  tags: string[];
  responses: DoubtResponse[];
}

export interface DoubtResponse {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: 'student' | 'instructor' | 'admin';
  timestamp: string;
  upvotes: number;
  isAccepted?: boolean;
}

const mockDoubts: Doubt[] = [
  {
    id: '1',
    title: 'How to verify sources in digital journalism?',
    content: 'I\'m working on my first investigative piece and struggling with source verification. What are the best practices for verifying online sources?',
    category: 'Research',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    authorId: '3',
    authorName: 'Alex Thompson',
    authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    timestamp: '2024-01-27T15:30:00',
    upvotes: 12,
    isResolved: true,
    tags: ['verification', 'sources', 'research'],
    responses: [
      {
        id: '1',
        content: 'Great question! Start with cross-referencing multiple sources, checking the original source, and verifying the author\'s credentials. Always look for primary sources when possible.',
        authorId: '2',
        authorName: 'Dr. Michael Chen',
        authorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        authorRole: 'instructor',
        timestamp: '2024-01-27T16:00:00',
        upvotes: 8,
        isAccepted: true
      }
    ]
  },
  {
    id: '2',
    title: 'Best tools for data journalism?',
    content: 'What are the recommended tools and software for data analysis in journalism? I\'m particularly interested in visualization tools.',
    category: 'Tools',
    authorId: '4',
    authorName: 'Maria Garcia',
    authorAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    timestamp: '2024-01-26T11:20:00',
    upvotes: 8,
    isResolved: false,
    tags: ['data-journalism', 'tools', 'visualization'],
    responses: [
      {
        id: '2',
        content: 'I\'ve found Tableau and D3.js to be excellent for visualizations. For data analysis, Python with pandas is very powerful.',
        authorId: '5',
        authorName: 'John Smith',
        authorAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        authorRole: 'student',
        timestamp: '2024-01-26T12:00:00',
        upvotes: 3
      }
    ]
  }
];

export const doubts = writable<Doubt[]>(mockDoubts);
export const doubtCategories = writable<string[]>([
  'Research', 'Writing', 'Ethics', 'Tools', 'Career', 'Technical', 'General'
]);