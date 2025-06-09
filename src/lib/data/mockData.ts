// Mock Data Constants
import type { User } from '$lib/stores/auth';
import type { Course } from '$lib/stores/courses';
import type { Assignment } from '$lib/stores/assignments';
import type { Lecture } from '$lib/stores/lectures';
import type { GradeEntry } from '$lib/stores/grades';
import type { AttendanceRecord } from '$lib/stores/attendance';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    role: 'student',
    enrolledCourses: ['1', '2'],
    completedCourses: ['3'],
    achievements: [
      {
        id: '1',
        title: 'First Course Completed',
        description: 'Successfully completed your first journalism course',
        icon: '🎓',
        earnedDate: '2024-01-15'
      }
    ],
    joinDate: '2024-01-01',
    department: 'Journalism',
    semester: 'Spring',
    academicYear: '2024',
    studentId: 'JOUR2024001',
    phone: '+1 (555) 123-4567',
    bio: 'Aspiring investigative journalist with a passion for uncovering truth',
    location: 'New York, NY'
  }
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Digital Journalism Fundamentals',
    description: 'Master the basics of digital journalism, from research to publication in the digital age.',
    instructor: 'Dr. Michael Chen',
    instructorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    duration: '8 weeks',
    level: 'Beginner',
    category: 'Digital Media',
    department: 'Journalism',
    semester: 'Spring',
    academicYear: '2024',
    courseCode: 'JOUR 101',
    credits: 3,
    thumbnail: 'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    price: 299,
    rating: 4.8,
    studentsEnrolled: 1247,
    progress: 65,
    isEnrolled: true,
    lectures: ['1', '2'],
    schedule: {
      days: ['Monday', 'Wednesday'],
      time: '09:00-10:30',
      venue: 'Room 101, Media Building'
    },
    lessons: [
      {
        id: '1',
        title: 'Introduction to Digital Journalism',
        duration: '45 min',
        type: 'video',
        isCompleted: true
      },
      {
        id: '2',
        title: 'Research Techniques',
        duration: '60 min',
        type: 'video',
        isCompleted: true
      },
      {
        id: '3',
        title: 'Writing for Digital Platforms',
        duration: '50 min',
        type: 'video',
        isCompleted: false
      }
    ],
    syllabus: [
      'Introduction to Digital Journalism',
      'Research and Fact-Checking',
      'Writing for Digital Platforms',
      'Multimedia Storytelling'
    ]
  },
  {
    id: '2',
    title: 'Investigative Reporting Masterclass',
    description: 'Advanced techniques for investigative journalism, including data analysis and source protection.',
    instructor: 'Sarah Williams',
    instructorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    duration: '12 weeks',
    level: 'Advanced',
    category: 'Investigative',
    department: 'Journalism',
    semester: 'Spring',
    academicYear: '2024',
    courseCode: 'JOUR 401',
    credits: 4,
    thumbnail: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    price: 599,
    rating: 4.9,
    studentsEnrolled: 543,
    progress: 30,
    isEnrolled: true,
    lectures: ['3'],
    schedule: {
      days: ['Tuesday', 'Thursday'],
      time: '14:00-16:00',
      venue: 'Room 205, Media Building'
    },
    lessons: [
      {
        id: '1',
        title: 'Investigative Methodology',
        duration: '75 min',
        type: 'video',
        isCompleted: true
      },
      {
        id: '2',
        title: 'Source Protection',
        duration: '60 min',
        type: 'video',
        isCompleted: false
      }
    ],
    syllabus: [
      'Investigative Methodology',
      'Source Development and Protection',
      'Data Analysis Techniques',
      'Legal Considerations'
    ]
  }
];

// Mock Assignments
export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Digital News Article Analysis',
    description: 'Analyze a recent digital news article and evaluate its effectiveness.',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    dueDate: '2024-02-15T23:59:00',
    status: 'pending',
    maxGrade: 100,
    type: 'assignment',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Interview Transcript',
    description: 'Conduct and transcribe a 15-minute interview.',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    dueDate: '2024-02-08T23:59:00',
    submissionDate: '2024-02-07T18:30:00',
    status: 'graded',
    grade: 88,
    maxGrade: 100,
    type: 'assignment',
    priority: 'medium',
    feedback: 'Excellent interview technique and thorough transcription.'
  }
];

// Mock Lectures
export const mockLectures: Lecture[] = [
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
      }
    ],
    recordingUrl: '/recordings/lecture-1.mp4'
  }
];

// Mock Grades
export const mockGrades: GradeEntry[] = [
  {
    id: '1',
    assignmentId: '2',
    assignmentTitle: 'Interview Transcript',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    studentId: '1',
    score: 88,
    maxScore: 100,
    percentage: 88,
    letterGrade: 'B+',
    feedback: 'Excellent interview technique and thorough transcription.',
    gradedBy: 'Dr. Michael Chen',
    gradedDate: '2024-02-10T14:30:00',
    submissionDate: '2024-02-08T23:45:00',
    category: 'assignment',
    weight: 0.2
  }
];

// Mock Attendance
export const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    lectureId: '1',
    studentId: '1',
    studentName: 'Sarah Johnson',
    status: 'present',
    timestamp: '2024-02-01T09:05:00',
    checkInMethod: 'qr'
  }
];

// Mock OTP for development
export const MOCK_OTP = '123456';

// Mock API responses
export const mockApiResponses = {
  // Authentication responses
  sendOTP: {
    success: true,
    data: {
      message: 'OTP sent successfully to your email',
      expiresIn: 300,
      attemptsRemaining: 3
    }
  },
  
  verifyOTP: {
    success: true,
    data: {
      user: mockUsers[0],
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresIn: 3600
    }
  },
  
  // Profile responses
  getProfile: {
    success: true,
    data: {
      ...mockUsers[0],
      completionPercentage: 75,
      lastUpdated: new Date().toISOString()
    }
  },
  
  updateProfile: {
    success: true,
    data: {
      ...mockUsers[0],
      completionPercentage: 85,
      lastUpdated: new Date().toISOString()
    }
  },
  
  uploadAvatar: {
    success: true,
    data: {
      avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      message: 'Avatar uploaded successfully'
    }
  },

  // Course responses
  getCourses: {
    success: true,
    data: mockCourses
  },

  // Assignment responses
  getAssignments: {
    success: true,
    data: mockAssignments
  },

  // Grade responses
  getGrades: {
    success: true,
    data: mockGrades
  },

  // Attendance responses
  getAttendance: {
    success: true,
    data: mockAttendance
  }
};

// Error responses
export const mockErrorResponses = {
  invalidOTP: {
    success: false,
    message: 'Invalid OTP. Please try again.',
    errors: { otp: ['The provided OTP is incorrect'] }
  },
  
  expiredOTP: {
    success: false,
    message: 'OTP has expired. Please request a new one.',
    errors: { otp: ['OTP has expired'] }
  },
  
  tooManyAttempts: {
    success: false,
    message: 'Too many failed attempts. Please try again later.',
    errors: { otp: ['Maximum attempts exceeded'] }
  },
  
  networkError: {
    success: false,
    message: 'Network error. Please check your connection.',
    errors: { network: ['Unable to connect to server'] }
  }
};