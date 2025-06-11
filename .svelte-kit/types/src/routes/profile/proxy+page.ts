// @ts-nocheck
import type { PageLoad } from './$types';
import { mockAPI } from '$lib/api/mockService';

export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
  try {
    // Always use mock data
    const profileData = await mockAPI.getProfile();
    
    return {
      profile: profileData.data || null,
      error: profileData.success ? null : profileData.message
    };
  } catch (error: any) {
    console.error('Profile load error:', error);
    return {
      profile: null,
      error: error.message || 'Failed to load profile data'
    };
  }
};