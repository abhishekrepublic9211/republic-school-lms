import { mockAPI, type ApiResponse } from './mockService';
import type { User } from '$lib/stores/auth';

export interface LoginRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
  deviceInfo?: {
    userAgent: string;
    platform: string;
    language: string;
  };
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface OTPResponse {
  message: string;
  expiresIn: number;
  attemptsRemaining: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

class AuthAPI {
  // Send OTP to user's email
  async sendOTP(email: string): Promise<ApiResponse<OTPResponse>> {
    try {
      return await mockAPI.sendOTP(email);
    } catch (error: any) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  // Verify OTP and login
  async verifyOTP(request: VerifyOTPRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      return await mockAPI.verifyOTP(request.email, request.otp);
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(): Promise<ApiResponse<{ token: string; expiresIn: number }>> {
    try {
      return await mockAPI.refreshToken();
    } catch (error: any) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<ApiResponse<{ message: string }>> {
    try {
      return await mockAPI.logout();
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      return await mockAPI.getCurrentUser();
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
}

export const authAPI = new AuthAPI();