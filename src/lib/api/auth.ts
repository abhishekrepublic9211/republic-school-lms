import { apiClient, type ApiResponse } from './client';
import { mockAPI, makeAPICall } from './mockService';
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
      return await makeAPICall(
        '/auth/send-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.toLowerCase().trim() })
        },
        () => mockAPI.sendOTP(email)
      );
    } catch (error: any) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  // Verify OTP and login
  async verifyOTP(request: VerifyOTPRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await makeAPICall(
        '/auth/verify-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request)
        },
        () => mockAPI.verifyOTP(request.email, request.otp)
      );

      // Store tokens if login successful
      if (response.success && response.data) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('refresh_token', response.data.refreshToken);
        localStorage.setItem('token_expires_at', (Date.now() + response.data.expiresIn * 1000).toString());
      }

      return response;
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(): Promise<ApiResponse<{ token: string; expiresIn: number }>> {
    try {
      const response = await makeAPICall(
        '/auth/refresh',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: localStorage.getItem('refresh_token') })
        },
        () => mockAPI.refreshToken()
      );

      // Update stored token
      if (response.success && response.data) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('token_expires_at', (Date.now() + response.data.expiresIn * 1000).toString());
      }

      return response;
    } catch (error: any) {
      console.error('Refresh token error:', error);
      // Clear invalid tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires_at');
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await makeAPICall(
        '/auth/logout',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: localStorage.getItem('refresh_token') })
        },
        () => mockAPI.logout()
      );

      // Clear all stored tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires_at');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');

      return response;
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear tokens even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires_at');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      throw error;
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      return await makeAPICall(
        '/auth/me',
        {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        },
        () => mockAPI.getCurrentUser()
      );
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('token_expires_at');
    if (!expiresAt) return true;
    
    return Date.now() >= parseInt(expiresAt);
  }

  // Auto-refresh token if needed
  async ensureValidToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      if (this.isTokenExpired()) {
        await this.refreshToken();
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}

export const authAPI = new AuthAPI();