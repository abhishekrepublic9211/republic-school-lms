// @ts-nocheck
import type { PageLoad } from './$types';
import { serverFetch } from '$lib/api/client';
import { mockAPI } from '$lib/api/mockService';
import { dev } from '$app/environment';

export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
  try {
    // In development, use mock data
    if (dev) {
      const [coursesData, assignmentsData, gradesData, attendanceData] = await Promise.all([
        mockAPI.getCourses(),
        mockAPI.getAssignments(),
        mockAPI.getGrades(),
        mockAPI.getAttendance()
      ]);

      return {
        courses: coursesData.data || [],
        assignments: assignmentsData.data || [],
        grades: gradesData.data || [],
        attendance: attendanceData.data || [],
        error: null
      };
    }

    // In production, use real API
    const [coursesResponse, assignmentsResponse, gradesResponse, attendanceResponse] = await Promise.all([
      serverFetch(fetch, '/api/courses'),
      serverFetch(fetch, '/api/assignments'),
      serverFetch(fetch, '/api/grades'),
      serverFetch(fetch, '/api/attendance')
    ]);

    return {
      courses: coursesResponse.success ? coursesResponse.data : [],
      assignments: assignmentsResponse.success ? assignmentsResponse.data : [],
      grades: gradesResponse.success ? gradesResponse.data : [],
      attendance: attendanceResponse.success ? attendanceResponse.data : [],
      error: !coursesResponse.success ? coursesResponse.message : null
    };
  } catch (error: any) {
    console.error('Dashboard load error:', error);
    return {
      courses: [],
      assignments: [],
      grades: [],
      attendance: [],
      error: error.message || 'Failed to load dashboard data'
    };
  }
};