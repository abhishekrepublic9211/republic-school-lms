import type { PageLoad } from './$types';
import { mockAPI } from '$lib/api/mockService';

export const load: PageLoad = async ({ fetch }) => {
  try {
    // Always use mock data
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