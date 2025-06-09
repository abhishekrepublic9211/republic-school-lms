import { writable } from 'svelte/store';
import { authAPI } from '$lib/api/auth';
import type { ApiError } from '$lib/api/client';

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
export async function sendOTP(email: string): Promise<{ success: boolean; message?: string; attemptsRemaining?: number }> {
  authLoading.set(true);
  authError.set(null);
  
  try {
    const response = await authAPI.sendOTP(email);
    
    if (response.success) {
      // Store email for OTP verification
      localStorage.setItem('pending_email', email);
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
      // Set user as authenticated
      currentUser.set(response.data.user);
      isAuthenticated.set(true);
      
      // Clear pending email
      localStorage.removeItem('pending_email');
      
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
    
    if (isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('pending_email');
    }
  }
}

export function updateUser(user: User): void {
  currentUser.set(user);
}

// Initialize authentication state from stored tokens
export async function initializeAuth(): Promise<void> {
  if (!isBrowser) return;
  
  authLoading.set(true);
  
  try {
    const hasValidToken = await authAPI.ensureValidToken();
    
    if (hasValidToken) {
      // Get current user data from API
      const response = await authAPI.getCurrentUser();
      
      if (response.success && response.data) {
        currentUser.set(response.data);
        isAuthenticated.set(true);
      } else {
        // Invalid token, clear auth state
        currentUser.set(null);
        isAuthenticated.set(false);
      }
    } else {
      // No valid token
      currentUser.set(null);
      isAuthenticated.set(false);
    }
  } catch (error: any) {
    console.error('Auth initialization error:', error);
    currentUser.set(null);
    isAuthenticated.set(false);
  } finally {
    authLoading.set(false);
  }
}

// Auto-refresh token periodically
if (isBrowser) {
  setInterval(async () => {
    try {
      await authAPI.ensureValidToken();
    } catch (error) {
      console.error('Token refresh error:', error);
      // Force logout on token refresh failure
      logout();
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
}