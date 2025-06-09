import { mockApiResponses, mockErrorResponses, MOCK_OTP } from '$lib/data/mockData';
import type { ApiResponse } from './client';

// Mock API service that simulates real API behavior
class MockAPIService {
  private _isEnabled: boolean;
  private baseDelay: number;
  private failureRate: number;

  constructor() {
    this._isEnabled = import.meta.env.VITE_ENABLE_MOCK_API === 'true' || import.meta.env.DEV;
    this.baseDelay = 800; // Base delay in milliseconds
    this.failureRate = 0.1; // 10% chance of random failures in dev mode
  }

  // Simulate network delay
  private async delay(ms?: number): Promise<void> {
    const delayTime = ms || this.baseDelay + Math.random() * 500; // Add some randomness
    return new Promise(resolve => setTimeout(resolve, delayTime));
  }

  // Simulate random failures for testing
  private shouldSimulateFailure(): boolean {
    return import.meta.env.DEV && Math.random() < this.failureRate;
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

    // Simulate random failure
    if (this.shouldSimulateFailure()) {
      return mockErrorResponses.networkError;
    }

    // Log OTP for development
    if (import.meta.env.DEV) {
      console.log(`🔐 Mock OTP sent to ${email}: ${MOCK_OTP}`);
    }

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

    // Simulate random failure
    if (this.shouldSimulateFailure()) {
      return mockErrorResponses.networkError;
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

    // Simulate random failure
    if (this.shouldSimulateFailure()) {
      return mockErrorResponses.networkError;
    }

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

    // Simulate random failure
    if (this.shouldSimulateFailure()) {
      return mockErrorResponses.networkError;
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

    // Simulate random failure
    if (this.shouldSimulateFailure()) {
      return mockErrorResponses.networkError;
    }

    return mockApiResponses.uploadAvatar;
  }

  // Mock Course API
  async getCourses(): Promise<ApiResponse> {
    await this.delay();
    
    if (this.shouldSimulateFailure()) {
      return mockErrorResponses.networkError;
    }
    
    return {
      success: true,
      data: mockApiResponses.getCourses.data
    };
  }

  // Mock Assignment API
  async getAssignments(): Promise<ApiResponse> {
    await this.delay();
    
    if (this.shouldSimulateFailure()) {
      return mockErrorResponses.networkError;
    }
    
    return {
      success: true,
      data: mockApiResponses.getAssignments.data
    };
  }

  // Mock Grades API
  async getGrades(): Promise<ApiResponse> {
    await this.delay();
    
    if (this.shouldSimulateFailure()) {
      return mockErrorResponses.networkError;
    }
    
    return {
      success: true,
      data: mockApiResponses.getGrades.data
    };
  }

  // Mock Attendance API
  async getAttendance(): Promise<ApiResponse> {
    await this.delay();
    
    if (this.shouldSimulateFailure()) {
      return mockErrorResponses.networkError;
    }
    
    return {
      success: true,
      data: mockApiResponses.getAttendance.data
    };
  }

  // Utility methods
  isEnabled(): boolean {
    return this._isEnabled;
  }

  setFailureRate(rate: number): void {
    this.failureRate = Math.max(0, Math.min(1, rate));
  }

  setBaseDelay(ms: number): void {
    this.baseDelay = Math.max(0, ms);
  }
}

export const mockAPI = new MockAPIService();

// Enhanced API client that uses mock service when enabled
export async function makeAPICall<T>(
  endpoint: string,
  options: RequestInit = {},
  mockHandler?: () => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> {
  // Use mock service if enabled and handler provided
  if (mockAPI.isEnabled() && mockHandler) {
    try {
      return await mockHandler();
    } catch (error) {
      console.error('Mock API error:', error);
      return mockErrorResponses.networkError as ApiResponse<T>;
    }
  }

  // Fall back to real API call
  const response = await fetch(endpoint, options);
  return response.json();
}