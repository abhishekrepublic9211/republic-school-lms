import { writable } from 'svelte/store';

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: number;
  completedCourses: number;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  totalAssignments: number;
  completedAssignments: number;
  totalTests: number;
  completedTests: number;
  instructor: string;
  color: string;
  thumbnail: string;
  dueDate?: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  type: 'assignment' | 'test' | 'project';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'warning' | 'success';
  courseId?: string;
  courseName?: string;
}

// Mock data
const mockStudent: Student = {
  id: '1',
  name: 'Dipu Paul',
  email: 'dipu.paul@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  enrolledCourses: 4,
  completedCourses: 2
};

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Web Design: From Figma to Website',
    description: 'Learn to convert Figma designs to responsive websites',
    progress: 73,
    totalLessons: 42,
    completedLessons: 31,
    totalAssignments: 8,
    completedAssignments: 5,
    totalTests: 3,
    completedTests: 2,
    instructor: 'Sarah Johnson',
    color: 'bg-gradient-to-br from-purple-500 to-pink-600',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    dueDate: '2024-02-15'
  },
  {
    id: '2',
    name: 'HTML Basics',
    description: 'Master the fundamentals of HTML markup',
    progress: 45,
    totalLessons: 25,
    completedLessons: 11,
    totalAssignments: 6,
    completedAssignments: 3,
    totalTests: 2,
    completedTests: 1,
    instructor: 'Mike Chen',
    color: 'bg-gradient-to-br from-orange-500 to-red-600',
    thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    dueDate: '2024-01-30'
  },
  {
    id: '3',
    name: 'Data with Python',
    description: 'Data analysis and visualization using Python',
    progress: 62,
    totalLessons: 35,
    completedLessons: 22,
    totalAssignments: 10,
    completedAssignments: 6,
    totalTests: 4,
    completedTests: 2,
    instructor: 'Dr. Emily Rodriguez',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    dueDate: '2024-03-10'
  },
  {
    id: '4',
    name: 'JavaScript Fundamentals',
    description: 'Build interactive web applications with JavaScript',
    progress: 28,
    totalLessons: 48,
    completedLessons: 13,
    totalAssignments: 12,
    completedAssignments: 3,
    totalTests: 5,
    completedTests: 1,
    instructor: 'Alex Thompson',
    color: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    dueDate: '2024-04-20'
  }
];

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Practical Theory',
    courseId: '1',
    courseName: 'Web Design',
    dueDate: '2024-01-29',
    type: 'assignment',
    priority: 'high',
    completed: false
  },
  {
    id: '2',
    title: 'Practical Theory 1',
    courseId: '2',
    courseName: 'HTML Basics',
    dueDate: '2024-01-29',
    type: 'test',
    priority: 'medium',
    completed: false
  },
  {
    id: '3',
    title: 'Practical Theory 2',
    courseId: '3',
    courseName: 'Data with Python',
    dueDate: '2024-01-29',
    type: 'assignment',
    priority: 'medium',
    completed: false
  },
  {
    id: '4',
    title: 'Practical Theory 3',
    courseId: '4',
    courseName: 'JavaScript',
    dueDate: '2024-01-29',
    type: 'assignment',
    priority: 'low',
    completed: false
  }
];

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'New Course Materials Available',
    content: 'Updated course materials for Web Design are now available in your library.',
    date: '2024-01-25',
    type: 'info',
    courseId: '1',
    courseName: 'Web Design'
  },
  {
    id: '2',
    title: 'Assignment Deadline Extension',
    content: 'The deadline for Practical Theory assignment has been extended to January 31st.',
    date: '2024-01-24',
    type: 'warning',
    courseId: '2',
    courseName: 'HTML Basics'
  },
  {
    id: '3',
    title: 'Congratulations on Course Completion!',
    content: 'You have successfully completed the Python Basics course. Certificate available for download.',
    date: '2024-01-23',
    type: 'success'
  }
];

// Stores
export const student = writable<Student>(mockStudent);
export const courses = writable<Course[]>(mockCourses);
export const assignments = writable<Assignment[]>(mockAssignments);
export const announcements = writable<Announcement[]>(mockAnnouncements);
export const sidebarOpen = writable<boolean>(false);
export const currentView = writable<string>('dashboard');