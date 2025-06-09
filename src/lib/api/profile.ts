import { apiClient, type ApiResponse } from './client';
import { mockAPI, makeAPICall } from './mockService';
import type { User } from '$lib/stores/auth';

export interface ProfileUpdateRequest {
  personal?: {
    name?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    religion?: string;
    category?: string;
    maritalStatus?: string;
  };
  address?: {
    currentAddress?: string;
    currentCity?: string;
    currentState?: string;
    currentPincode?: string;
    permanentAddress?: string;
    permanentCity?: string;
    permanentState?: string;
    permanentPincode?: string;
    sameAsCurrent?: boolean;
  };
  education?: {
    tenthBoard?: string;
    tenthSchool?: string;
    tenthYear?: string;
    tenthPercentage?: string;
    twelfthBoard?: string;
    twelfthSchool?: string;
    twelfthYear?: string;
    twelfthPercentage?: string;
    graduationDegree?: string;
    graduationUniversity?: string;
    graduationYear?: string;
    graduationPercentage?: string;
    postGraduationDegree?: string;
    postGraduationUniversity?: string;
    postGraduationYear?: string;
    postGraduationPercentage?: string;
    lastQualificationDegree?: string;
    lastQualificationInstitution?: string;
    lastQualificationYear?: string;
  };
  parentGuardian?: {
    name?: string;
    relationship?: string;
    contactNumber?: string;
    email?: string;
    occupation?: string;
    address?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    contactNumber?: string;
    email?: string;
    address?: string;
  };
  medical?: {
    bloodGroup?: string;
    medicalConditions?: string;
    allergies?: string;
    medications?: string;
  };
  professional?: {
    currentEmployment?: string;
    designation?: string;
    organization?: string;
    workExperience?: string;
    previousEmployment?: string;
    skills?: string;
  };
  learning?: {
    courseInterests?: string;
    careerGoals?: string;
    technicalSkills?: string;
    preferredLearningStyle?: string;
    expectations?: string;
  };
  additional?: {
    languages?: string;
    hobbies?: string;
    achievements?: string;
    extracurricular?: string;
    socialMedia?: string;
  };
  references?: {
    academicRefName?: string;
    academicRefDesignation?: string;
    academicRefInstitution?: string;
    academicRefContact?: string;
    professionalRefName?: string;
    professionalRefDesignation?: string;
    professionalRefOrganization?: string;
    professionalRefContact?: string;
  };
}

export interface ProfileResponse extends User {
  profileData?: ProfileUpdateRequest;
  completionPercentage: number;
  lastUpdated: string;
}

export interface AvatarUploadResponse {
  avatarUrl: string;
  message: string;
}

export interface ProfileValidationError {
  field: string;
  message: string;
}

class ProfileAPI {
  // Get complete profile data
  async getProfile(): Promise<ApiResponse<ProfileResponse>> {
    try {
      return await makeAPICall(
        '/profile',
        {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        },
        () => mockAPI.getProfile()
      );
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Update profile data
  async updateProfile(data: ProfileUpdateRequest): Promise<ApiResponse<ProfileResponse>> {
    try {
      // Validate required fields before sending
      this.validateProfileData(data);

      return await makeAPICall(
        '/profile',
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify(data)
        },
        () => mockAPI.updateProfile(data)
      );
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Update specific profile section
  async updateProfileSection(section: keyof ProfileUpdateRequest, data: any): Promise<ApiResponse<ProfileResponse>> {
    try {
      const updateData = { [section]: data };
      const response = await apiClient.patch<ApiResponse<ProfileResponse>>('/profile/section', updateData);
      return response;
    } catch (error: any) {
      console.error('Update profile section error:', error);
      throw error;
    }
  }

  // Upload profile avatar
  async uploadAvatar(file: File): Promise<ApiResponse<AvatarUploadResponse>> {
    try {
      // Validate file
      this.validateAvatarFile(file);

      return await makeAPICall(
        '/profile/avatar',
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
          body: (() => {
            const formData = new FormData();
            formData.append('file', file);
            return formData;
          })()
        },
        () => mockAPI.uploadAvatar(file)
      );
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  }

  // Delete profile avatar
  async deleteAvatar(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.delete<ApiResponse<{ message: string }>>('/profile/avatar');
      return response;
    } catch (error: any) {
      console.error('Delete avatar error:', error);
      throw error;
    }
  }

  // Get profile completion status
  async getProfileCompletion(): Promise<ApiResponse<{ percentage: number; missingFields: string[] }>> {
    try {
      const response = await apiClient.get<ApiResponse<{ percentage: number; missingFields: string[] }>>('/profile/completion');
      return response;
    } catch (error: any) {
      console.error('Get profile completion error:', error);
      throw error;
    }
  }

  // Validate profile data
  private validateProfileData(data: ProfileUpdateRequest): void {
    const errors: ProfileValidationError[] = [];

    // Validate email format if provided
    if (data.personal?.name && data.personal.name.trim().length < 2) {
      errors.push({ field: 'personal.name', message: 'Name must be at least 2 characters long' });
    }

    // Validate phone number format
    if (data.personal?.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(data.personal.phone)) {
      errors.push({ field: 'personal.phone', message: 'Please enter a valid phone number' });
    }

    // Validate date of birth
    if (data.personal?.dateOfBirth) {
      const dob = new Date(data.personal.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      
      if (age < 16 || age > 100) {
        errors.push({ field: 'personal.dateOfBirth', message: 'Age must be between 16 and 100 years' });
      }
    }

    // Validate emergency contact
    if (data.emergencyContact?.contactNumber && !/^\+?[\d\s\-\(\)]{10,}$/.test(data.emergencyContact.contactNumber)) {
      errors.push({ field: 'emergencyContact.contactNumber', message: 'Please enter a valid emergency contact number' });
    }

    if (errors.length > 0) {
      throw {
        message: 'Validation failed',
        status: 400,
        errors: errors.reduce((acc, error) => {
          acc[error.field] = [error.message];
          return acc;
        }, {} as Record<string, string[]>)
      };
    }
  }

  // Validate avatar file
  private validateAvatarFile(file: File): void {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      throw {
        message: 'File size too large',
        status: 400,
        errors: { file: ['File size must be less than 5MB'] }
      };
    }

    if (!allowedTypes.includes(file.type)) {
      throw {
        message: 'Invalid file type',
        status: 400,
        errors: { file: ['Only JPEG, PNG, and WebP images are allowed'] }
      };
    }
  }
}

export const profileAPI = new ProfileAPI();