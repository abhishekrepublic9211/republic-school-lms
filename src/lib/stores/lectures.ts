import { writable } from 'svelte/store';

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'link' | 'video' | 'slides';
  url: string;
  size?: string;
  uploadDate: string;
}

export interface Lecture {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  instructor: string;
  instructorAvatar: string;
  materials: Resource[];
  recordingUrl?: string;
  discussionForumId?: string;
  description?: string;
  attendanceCount?: number;
  totalStudents?: number;
}

const mockLectures: Lecture[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    title: 'Introduction to Digital Media',
    date: '2024-02-01',
    time: '09:00',
    duration: '90 minutes',
    venue: 'Room 101, Media Building',
    instructor: 'Dr. Michael Chen',
    instructorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Overview of digital journalism landscape and emerging technologies',
    attendanceCount: 28,
    totalStudents: 32,
    materials: [
      {
        id: '1',
        title: 'Introduction Slides',
        type: 'slides',
        url: '/materials/intro-slides.pdf',
        size: '2.1 MB',
        uploadDate: '2024-01-30T10:00:00'
      },
      {
        id: '2',
        title: 'Reading List',
        type: 'pdf',
        url: '/materials/reading-list.pdf',
        size: '450 KB',
        uploadDate: '2024-01-30T10:00:00'
      }
    ],
    recordingUrl: '/recordings/lecture-1.mp4',
    discussionForumId: 'forum-1'
  },
  {
    id: '2',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    title: 'Research Methods in Digital Age',
    date: '2024-02-03',
    time: '09:00',
    duration: '90 minutes',
    venue: 'Room 101, Media Building',
    instructor: 'Dr. Michael Chen',
    instructorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Modern research techniques and source verification methods',
    attendanceCount: 30,
    totalStudents: 32,
    materials: [
      {
        id: '3',
        title: 'Research Methods Guide',
        type: 'pdf',
        url: '/materials/research-methods.pdf',
        size: '1.8 MB',
        uploadDate: '2024-02-01T14:00:00'
      }
    ],
    recordingUrl: '/recordings/lecture-2.mp4',
    discussionForumId: 'forum-2'
  },
  {
    id: '3',
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    title: 'Advanced Source Protection',
    date: '2024-02-02',
    time: '14:00',
    duration: '120 minutes',
    venue: 'Room 205, Media Building',
    instructor: 'Sarah Williams',
    instructorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Protecting sources in the digital age - legal and ethical considerations',
    attendanceCount: 18,
    totalStudents: 20,
    materials: [
      {
        id: '4',
        title: 'Source Protection Guidelines',
        type: 'pdf',
        url: '/materials/source-protection.pdf',
        size: '3.2 MB',
        uploadDate: '2024-01-31T16:00:00'
      },
      {
        id: '5',
        title: 'Legal Framework Video',
        type: 'video',
        url: '/materials/legal-framework.mp4',
        size: '45 MB',
        uploadDate: '2024-01-31T16:00:00'
      }
    ],
    discussionForumId: 'forum-3'
  }
];

export const lectures = writable<Lecture[]>(mockLectures);
export const selectedLecture = writable<Lecture | null>(null);