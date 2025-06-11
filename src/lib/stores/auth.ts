import { writable } from 'svelte/store';
import { authAPI } from '$lib/api/auth';

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
  bio: null,
  phone: null,
  location: null,
  department: 'Journalism',
  semester: 'Spring',
  academicYear: '2024',
  studentId: 'JOUR2024001'
};

// Create writable stores
export const currentUser = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);
export const authLoading = writable<boolean>(false);
export const authError = writable<string | null>(null);

// Authentication functions
export async function sendOTP(email: string): Promise<{ success: boolean; message?: string; attemptsRemaining?: number }> {
  authLoading.set(true);
  authError.set(null);
  
  try {
    const response = await authAPI.sendOTP(email);
    
    if (response.success) {
      return {
        success: true,
        message: response.data?.message || 'OTP sent successfully',
        attemptsRemaining: response.data?.attemptsRemaining
      };
    } else {
      authError.set(response.message || 'Failed to send OTP');
      return { success: false, message: response.message };
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to send OTP. Please try again.';
    authError.set(errorMessage);
    return { success: false, message: errorMessage };
  } finally {
    authLoading.set(false);
  }
}

export async function verifyOTP(email: string, otp: string): Promise<{ success: boolean; message?: string }> {
  authLoading.set(true);
  authError.set(null);
  
  try {
    const response = await authAPI.verifyOTP({ email, otp });
    
    if (response.success && response.data) {
      // Set user as authenticated with mock user data
      currentUser.set(mockUser);
      isAuthenticated.set(true);
      
      return { success: true, message: 'Login successful' };
    } else {
      authError.set(response.message || 'Invalid OTP');
      return { success: false, message: response.message };
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Invalid OTP. Please try again.';
    authError.set(errorMessage);
    return { success: false, message: errorMessage };
  } finally {
    authLoading.set(false);
  }
}

export async function logout(): Promise<void> {
  authLoading.set(true);
  authError.set(null);
  
  try {
    await authAPI.logout();
  } catch (error: any) {
    console.error('Logout error:', error);
    // Continue with local logout even if API call fails
  } finally {
    // Clear local state
    currentUser.set(null);
    isAuthenticated.set(false);
    authLoading.set(false);
  }
}

export function updateUser(user: User): void {
  currentUser.set(user);
}