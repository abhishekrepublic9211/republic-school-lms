import { writable } from 'svelte/store';

export interface AttendanceRecord {
  id: string;
  lectureId: string;
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'excused' | 'late';
  timestamp?: string;
  checkInMethod?: 'qr' | 'manual' | 'biometric';
  notes?: string;
}

export interface AttendanceSummary {
  studentId: string;
  courseId: string;
  totalLectures: number;
  attendedLectures: number;
  excusedAbsences: number;
  attendancePercentage: number;
  lastUpdated: string;
}

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    lectureId: '1',
    studentId: '1',
    studentName: 'Sarah Johnson',
    status: 'present',
    timestamp: '2024-02-01T09:05:00',
    checkInMethod: 'qr'
  },
  {
    id: '2',
    lectureId: '2',
    studentId: '1',
    studentName: 'Sarah Johnson',
    status: 'present',
    timestamp: '2024-02-03T09:02:00',
    checkInMethod: 'qr'
  },
  {
    id: '3',
    lectureId: '3',
    studentId: '1',
    studentName: 'Sarah Johnson',
    status: 'absent'
  },
  {
    id: '4',
    lectureId: '1',
    studentId: '2',
    studentName: 'Alex Thompson',
    status: 'late',
    timestamp: '2024-02-01T09:15:00',
    checkInMethod: 'manual'
  }
];

const mockAttendanceSummaries: AttendanceSummary[] = [
  {
    studentId: '1',
    courseId: '1',
    totalLectures: 8,
    attendedLectures: 7,
    excusedAbsences: 0,
    attendancePercentage: 87.5,
    lastUpdated: '2024-02-03T09:02:00'
  },
  {
    studentId: '1',
    courseId: '2',
    totalLectures: 5,
    attendedLectures: 4,
    excusedAbsences: 1,
    attendancePercentage: 80.0,
    lastUpdated: '2024-02-02T14:00:00'
  }
];

export const attendanceRecords = writable<AttendanceRecord[]>(mockAttendanceRecords);
export const attendanceSummaries = writable<AttendanceSummary[]>(mockAttendanceSummaries);

// Helper functions
export function calculateAttendancePercentage(attended: number, total: number): number {
  return total > 0 ? Math.round((attended / total) * 100) : 0;
}

export function getAttendanceStatus(percentage: number): 'good' | 'warning' | 'critical' {
  if (percentage >= 75) return 'good';
  if (percentage >= 60) return 'warning';
  return 'critical';
}