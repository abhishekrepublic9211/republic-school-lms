<script lang="ts">
  import { Calendar, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { attendanceRecords, attendanceSummaries, getAttendanceStatus } from '../stores/attendance';
  import { lectures } from '../stores/lectures';
  import { courses } from '../stores/courses';
  import { currentUser } from '../stores/auth';

  let selectedCourse = 'All';
  let selectedMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

  // Get user's attendance records
  $: userAttendanceRecords = $attendanceRecords.filter(record => 
    record.studentId === $currentUser?.id
  );

  // Get user's attendance summaries
  $: userAttendanceSummaries = $attendanceSummaries.filter(summary => 
    summary.studentId === $currentUser?.id
  );

  // Filter by course
  $: filteredSummaries = selectedCourse === 'All' 
    ? userAttendanceSummaries 
    : userAttendanceSummaries.filter(summary => {
        const course = $courses.find(c => c.id === summary.courseId);
        return course?.title === selectedCourse;
      });

  // Get available courses for filter
  $: availableCourses = ['All', ...$courses
    .filter(course => course.isEnrolled)
    .map(course => course.title)];

  // Calculate overall statistics
  $: overallStats = {
    totalLectures: userAttendanceSummaries.reduce((sum, summary) => sum + summary.totalLectures, 0),
    attendedLectures: userAttendanceSummaries.reduce((sum, summary) => sum + summary.attendedLectures, 0),
    excusedAbsences: userAttendanceSummaries.reduce((sum, summary) => sum + summary.excusedAbsences, 0),
    overallPercentage: userAttendanceSummaries.length > 0 
      ? Math.round(userAttendanceSummaries.reduce((sum, summary) => sum + summary.attendancePercentage, 0) / userAttendanceSummaries.length)
      : 0
  };

  function getStatusIcon(status: string) {
    switch (status) {
      case 'present':
        return CheckCircle;
      case 'absent':
        return XCircle;
      case 'excused':
        return Clock;
      case 'late':
        return AlertTriangle;
      default:
        return XCircle;
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'present':
        return 'text-success-600 bg-success-100';
      case 'absent':
        return 'text-error-600 bg-error-100';
      case 'excused':
        return 'text-blue-600 bg-blue-100';
      case 'late':
        return 'text-warning-600 bg-warning-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  function getAttendanceColor(percentage: number): string {
    const status = getAttendanceStatus(percentage);
    switch (status) {
      case 'good':
        return 'text-success-600';
      case 'warning':
        return 'text-warning-600';
      case 'critical':
        return 'text-error-600';
      default:
        return 'text-gray-600';
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  function formatTime(timeString: string): string {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // Get recent attendance records with lecture details
  $: recentAttendance = userAttendanceRecords
    .map(record => {
      const lecture = $lectures.find(l => l.id === record.lectureId);
      return { ...record, lecture };
    })
    .filter(record => record.lecture)
    .sort((a, b) => new Date(b.lecture.date).getTime() - new Date(a.lecture.date).getTime())
    .slice(0, 10);
</script>

<Layout>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Attendance</h1>
        <p class="text-gray-600 mt-1">Track your lecture attendance and view reports</p>
      </div>
    </div>

    <!-- Overall Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Lectures</p>
            <p class="text-2xl font-bold text-gray-900">{overallStats.totalLectures}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Attended</p>
            <p class="text-2xl font-bold text-success-600">{overallStats.attendedLectures}</p>
          </div>
          <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-success-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Excused</p>
            <p class="text-2xl font-bold text-blue-600">{overallStats.excusedAbsences}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Attendance Rate</p>
            <p class="text-2xl font-bold {getAttendanceColor(overallStats.overallPercentage)}">{overallStats.overallPercentage}%</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <TrendingUp class="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Course</label>
          <select 
            bind:value={selectedCourse}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {#each availableCourses as course}
              <option value={course}>{course}</option>
            {/each}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Month</label>
          <input
            type="month"
            bind:value={selectedMonth}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div class="flex items-end">
          <button class="btn btn-secondary w-full">
            Generate Report
          </button>
        </div>
      </div>
    </div>

    <!-- Course-wise Attendance -->
    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Course-wise Attendance</h2>
      <div class="space-y-4">
        {#each filteredSummaries as summary}
          {@const course = $courses.find(c => c.id === summary.courseId)}
          {#if course}
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h3 class="font-semibold text-gray-900">{course.title}</h3>
                  <p class="text-sm text-gray-600">{course.courseCode} • {course.instructor}</p>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold {getAttendanceColor(summary.attendancePercentage)}">
                    {summary.attendancePercentage}%
                  </div>
                  <div class="text-sm text-gray-500">
                    {summary.attendedLectures}/{summary.totalLectures} lectures
                  </div>
                </div>
              </div>
              
              <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  class="h-3 rounded-full transition-all duration-300 {
                    getAttendanceStatus(summary.attendancePercentage) === 'good' ? 'bg-success-500' :
                    getAttendanceStatus(summary.attendancePercentage) === 'warning' ? 'bg-warning-500' :
                    'bg-error-500'
                  }"
                  style="width: {summary.attendancePercentage}%"
                ></div>
              </div>
              
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">Present:</span>
                  <span class="font-medium text-success-600 ml-1">{summary.attendedLectures}</span>
                </div>
                <div>
                  <span class="text-gray-600">Absent:</span>
                  <span class="font-medium text-error-600 ml-1">{summary.totalLectures - summary.attendedLectures - summary.excusedAbsences}</span>
                </div>
                <div>
                  <span class="text-gray-600">Excused:</span>
                  <span class="font-medium text-blue-600 ml-1">{summary.excusedAbsences}</span>
                </div>
              </div>
              
              {#if summary.attendancePercentage < 75}
                <div class="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <div class="flex items-center space-x-2">
                    <AlertTriangle class="w-4 h-4 text-warning-600" />
                    <span class="text-sm font-medium text-warning-800">Low Attendance Warning</span>
                  </div>
                  <p class="text-sm text-warning-700 mt-1">
                    Your attendance is below the required 75%. Please attend upcoming lectures.
                  </p>
                </div>
              {/if}
            </div>
          {/if}
        {/each}
      </div>
    </div>

    <!-- Recent Attendance -->
    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Recent Attendance</h2>
      <div class="space-y-3">
        {#each recentAttendance as record}
          <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center {getStatusColor(record.status)}">
                <svelte:component this={getStatusIcon(record.status)} class="w-4 h-4" />
              </div>
              <div>
                <p class="font-medium text-gray-900">{record.lecture.title}</p>
                <p class="text-sm text-gray-600">{record.lecture.courseName}</p>
              </div>
            </div>
            
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900 capitalize">{record.status}</div>
              <div class="text-xs text-gray-500">
                {formatDate(record.lecture.date)} • {formatTime(record.lecture.time)}
              </div>
              {#if record.timestamp}
                <div class="text-xs text-gray-400">
                  Checked in: {formatTime(record.timestamp)}
                </div>
              {/if}
            </div>
          </div>
        {/each}
        
        {#if recentAttendance.length === 0}
          <div class="text-center py-8 text-gray-500">
            <Calendar class="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No attendance records found</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Exception Management -->
    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Request Exception</h2>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <Clock class="w-6 h-6 text-blue-600 mt-1" />
          <div class="flex-1">
            <h3 class="font-medium text-blue-900">Medical Leave Request</h3>
            <p class="text-sm text-blue-700 mt-1">
              If you were absent due to medical reasons, you can request an excused absence.
            </p>
            <button class="btn btn-primary mt-3 text-sm">
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</Layout>