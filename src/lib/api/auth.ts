import { mockAPI } from './mockService';
import type { User } from '$lib/stores/auth';


const API_URL = import.meta.env.VITE_API_BASE_URL


export interface LoginRequest {
  email: string;
}

interface emailOtp{
  email: string;
  otp: string;
}

export interface ApiResponse<T = any> {
  status: number;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
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


   async sendOTP(email: string): Promise<ApiResponse> {
    console.log("Sending OTP to:", email);
  
  try{
      // Simulate validation
      if (!email || !email.includes('@')) {
        return {
          status: 400,
          message: 'Please enter a valid email address',
          errors: { email: ['Invalid email format'] }
        };
      }
      else{
        let response = await fetch(`${API_URL}auth/request-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email:email })
        });
        response = await response.json();
        return response;
      }
    }
    catch(error:any){
    console.log("Sending OTP error:", error.message);

      throw error
    }

    }
  
    async verifyOTP(email: emailOtp): Promise<ApiResponse> {
   

      
      try{
  
      // Simulate validation
      if (!email.email || !email.otp) {
        return {
          status: 400,
          message: 'Email and OTP are required',
          errors: { otp: ['OTP is required'] }
        };
      }
      else{
        let response = await fetch(`${API_URL}auth/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email:email.email, otp:email.otp })
        });
        response = await response.json();
        return response;
      }
  
      }
      catch(error:any){
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