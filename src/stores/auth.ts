import { writable } from 'svelte/store';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'instructor' | 'admin';
  enrolledCourses: string[];
  completedCourses: string[];
  achievements: Achievement[];
  joinDate: string;
  bio?: string;
  phone?: string;
  location?: string;
  department: string;
  semester: string;
  academicYear: string;
  studentId: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  certificateUrl?: string;
}

const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  role: 'student',
  enrolledCourses: ['1', '2', '3'],
  completedCourses: ['4', '5'],
  achievements: [
    {
      id: '1',
      title: 'First Course Completed',
      description: 'Successfully completed your first journalism course',
      icon: '🎓',
      earnedDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Perfect Assignment',
      description: 'Scored 100% on an assignment',
      icon: '⭐',
      earnedDate: '2024-01-20'
    }
  ],
  joinDate: '2024-01-01',
  bio: 'Aspiring journalist passionate about investigative reporting and digital media.',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  department: 'Journalism',
  semester: 'Spring',
  academicYear: '2024',
  studentId: 'JOUR2024001'
};

// Create writable stores
export const currentUser = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Initialize from localStorage if in browser
if (isBrowser) {
  const storedUser = localStorage.getItem('currentUser');
  const storedAuth = localStorage.getItem('isAuthenticated');
  
  if (storedUser && storedAuth === 'true') {
    try {
      const user = JSON.parse(storedUser);
      currentUser.set(user);
      isAuthenticated.set(true);
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  }
}

// Subscribe to changes and update localStorage
if (isBrowser) {
  currentUser.subscribe(user => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  });

  isAuthenticated.subscribe(auth => {
    localStorage.setItem('isAuthenticated', auth.toString());
  });
}

// Authentication functions
export function login(email: string, password: string): boolean {
  // Mock login - in real app, this would make an API call
  if (email && password) {
    currentUser.set(mockUser);
    isAuthenticated.set(true);
    return true;
  }
  return false;
}

export function logout(): void {
  currentUser.set(null);
  isAuthenticated.set(false);
  if (isBrowser) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  }
}

export function updateUser(user: User): void {
  currentUser.set(user);
}