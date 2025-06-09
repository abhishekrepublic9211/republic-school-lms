// @ts-nocheck
import type { PageLoad } from './$types';
import { serverFetch } from '$lib/api/client';
import { mockAPI } from '$lib/api/mockService';
import { dev } from '$app/environment';

export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
  try {
    // In development, use mock data
    if (dev) {
      const profileData = await mockAPI.getProfile();
      
      return {
        profile: profileData.data || null,
        error: profileData.success ? null : profileData.message
      };
    }

    // In production, use real API
    const profileResponse = await serverFetch(fetch, '/api/profile');

    return {
      profile: profileResponse.success ? profileResponse.data : null,
      error: profileResponse.success ? null : profileResponse.message
    };
  } catch (error: any) {
    console.error('Profile load error:', error);
    return {
      profile: null,
      error: error.message || 'Failed to load profile data'
    };
  }
};