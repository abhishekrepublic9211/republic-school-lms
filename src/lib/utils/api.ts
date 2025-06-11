import { authStore } from '$lib/stores/auth';
import { get } from 'svelte/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002'; // Default, should be in .env

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  isFormData?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { method = 'GET', headers = {}, body, isFormData = false } = options;
  const { token } = get(authStore);

  const defaultHeaders: Record<string, string> = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        errorData?.message || `API request failed to ${endpoint}`,
        response.status,
        errorData
      );
    }

    // Handle cases where response might be empty (e.g., 204 No Content)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    } else {
      // For non-JSON responses or empty responses, return null or handle as appropriate
      // For now, returning the response object itself if not JSON, or null for empty
      const text = await response.text();
      return text ? (text as unknown as T) : (null as unknown as T) ;
    }

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors or other unexpected issues
    console.error(`API Request Error to ${endpoint}:`, error);
    throw new ApiError(
      (error as Error).message || 'An unexpected error occurred',
      0, // Or some other status to indicate non-HTTP error
      error
    );
  }
};

// Specific API functions can be added here or in separate service files

// Example: Auth Service
export const authService = {
  requestOtp: (email: string) =>
    apiRequest<{ status: number; message: string; data: boolean }>('/auth/request-otp', {
      method: 'POST',
      body: { email },
    }),
  verifyOtp: (email: string, otp: string) =>
    apiRequest<{ status: number; message: string; data: { user: any; access_token: string } }>('/auth/verify-otp', {
      method: 'POST',
      body: { email, otp },
    }),
  getProfile: () =>
    apiRequest<{ status: number; message: string; data: any }>('/auth/profile'),
};

// Example: User Service
export const userService = {
  // According to apidocs/users.md, Get User by ID is GET /users/get/:id
  getUserById: (userId: string) =>
    apiRequest<{ status: number; message: string; data: any }>(`/users/get/${userId}`),
  // According to apidocs/users.md, Update User is POST /users/update/:id
  updateUser: (userId: string, data: any) => 
    apiRequest<{ status: number; message: string; data: any }>(`/users/update/${userId}`, {
      method: 'POST', // Changed from PATCH
      body: data,
    }),
};

// Example: Payment Service
export const paymentService = {
  getPaymentHistory: (applicationId: string) =>
    apiRequest<{ status: number; message: string; data: any }>(`/payment/get-payment-history/${applicationId}`),
};
