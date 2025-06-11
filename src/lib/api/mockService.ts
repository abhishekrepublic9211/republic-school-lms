// Mock API service that provides all data functionality
// This replaces external API calls with local mock data

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

import { mockApiResponses, mockErrorResponses, MOCK_OTP } from '$lib/data/mockData';

// Mock API service that simulates real API behavior
class MockAPIService {
  private baseDelay: number;

  constructor() {
    this.baseDelay = 800; // Base delay in milliseconds
  }

  // Simulate network delay
  private async delay(ms?: number): Promise<void> {
    const delayTime = ms || this.baseDelay + Math.random() * 500; // Add some randomness
    return new Promise(resolve => setTimeout(resolve, delayTime));
  }

  // Mock Authentication API
  async sendOTP(email: string): Promise<ApiResponse> {
    await this.delay();

    // Simulate validation
    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Please enter a valid email address',
        errors: { email: ['Invalid email format'] }
      };
    }

    // Log OTP for development
    console.log(`🔐 Mock OTP sent to ${email}: ${MOCK_OTP}`);

    return mockApiResponses.sendOTP;
  }

  async verifyOTP(email: string, otp: string): Promise<ApiResponse> {
    await this.delay();

    // Simulate validation
    if (!email || !otp) {
      return {
        success: false,
        message: 'Email and OTP are required',
        errors: { otp: ['OTP is required'] }
      };
    }

    // Check OTP
    if (otp !== MOCK_OTP) {
      return mockErrorResponses.invalidOTP;
    }

    return mockApiResponses.verifyOTP;
  }

  async refreshToken(): Promise<ApiResponse> {
    await this.delay(300);

    return {
      success: true,
      data: {
        token: 'mock_refreshed_token_' + Date.now(),
        expiresIn: 3600
      }
    };
  }

  async logout(): Promise<ApiResponse> {
    await this.delay(200);

    return {
      success: true,
      data: { message: 'Logged out successfully' }
    };
  }

  async getCurrentUser(): Promise<ApiResponse> {
    await this.delay(400);

    return {
      success: true,
      data: mockApiResponses.getProfile.data
    };
  }

  // Mock Profile API
  async getProfile(): Promise<ApiResponse> {
    await this.delay();

    return mockApiResponses.getProfile;
  }

  async updateProfile(data: any): Promise<ApiResponse> {
    await this.delay(1200); // Longer delay for update operations

    // Simulate validation errors
    if (data.personal?.name && data.personal.name.length < 2) {
      return {
        success: false,
        message: 'Validation failed',
        errors: { 'personal.name': ['Name must be at least 2 characters long'] }
      };
    }

    return mockApiResponses.updateProfile;
  }

  async uploadAvatar(file: File): Promise<ApiResponse> {
    await this.delay(2000); // Longer delay for file uploads

    // Simulate file validation
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: 'File too large',
        errors: { file: ['File size must be less than 5MB'] }
      };
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return {
        success: false,
        message: 'Invalid file type',
        errors: { file: ['Only JPEG, PNG, and WebP images are allowed'] }
      };
    }

    return mockApiResponses.uploadAvatar;
  }

  // Mock Course API
  async getCourses(): Promise<ApiResponse> {
    await this.delay();
    
    return {
      success: true,
      data: mockApiResponses.getCourses.data
    };
  }

  // Mock Assignment API
  async getAssignments(): Promise<ApiResponse> {
    await this.delay();
    
    return {
      success: true,
      data: mockApiResponses.getAssignments.data
    };
  }

  // Mock Grades API
  async getGrades(): Promise<ApiResponse> {
    await this.delay();
    
    return {
      success: true,
      data: mockApiResponses.getGrades.data
    };
  }

  // Mock Attendance API
  async getAttendance(): Promise<ApiResponse> {
    await this.delay();
    
    return {
      success: true,
      data: mockApiResponses.getAttendance.data
    };
  }

  // Additional profile methods
  async updateProfileSection(section: string, data: any): Promise<ApiResponse> {
    await this.delay(800);
    
    return {
      success: true,
      data: mockApiResponses.updateProfile.data
    };
  }

  async deleteAvatar(): Promise<ApiResponse> {
    await this.delay(600);
    
    return {
      success: true,
      data: { message: 'Avatar deleted successfully' }
    };
  }

  async getProfileCompletion(): Promise<ApiResponse> {
    await this.delay(400);
    
    return {
      success: true,
      data: { 
        percentage: 75, 
        missingFields: ['phone', 'bio', 'location'] 
      }
    };
  }
}

export const mockAPI = new MockAPIService();