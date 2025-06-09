<script lang="ts">
  import { CheckSquare, X, Clock, Calendar, TrendingUp, AlertTriangle } from 'lucide-svelte';
  import { attendanceSummaries, attendanceRecords, getAttendanceStatus } from '$lib/stores/attendance';
  import { lectures } from '$lib/stores/lectures';
  import { courses } from '$lib/stores/courses';
  import { currentUser } from '$lib/stores/auth';

  let selectedCourse = '';

  // Filter attendance by course
  $: filteredSummaries = selectedCourse 
    ? $attendanceSummaries.filter(summary => summary.courseId === selectedCourse)
    : $attendanceSummaries;

  // Get enrolled courses for filter
  $: enrolledCourses = $courses.filter(course => course.isEnrolled);

  // Calculate overall attendance
  $: overallAttendance = $attendanceSummaries.length > 0 
    ? Math.round($attendanceSummaries.reduce((sum, summary) => sum + summary.attendancePercentage, 0) / $attendanceSummaries.length)
    : 0;

  // Get recent attendance records
  $: recentRecords = $attendanceRecords
    .filter(record => record.studentId === $currentUser?.id)
    .sort((a, b) => new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime())
    .slice(0, 10);

  function getStatusIcon(status: string) {
    switch (status) {
      case 'present': return CheckSquare;
      case 'late': return Clock;
      case 'absent': return X;
      case 'excused': return CheckSquare;
      default: return X;
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'present': return 'text-success-600';
      case 'late': return 'text-warning-600';
      case 'absent': return 'text-error-600';
      case 'excused': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  }

  function getAttendanceColor(percentage: number): string {
    if (percentage >= 75) return 'text-success-600';
    if (percentage >= 60) return 'text-warning-600';
    return 'text-error-600';
  }

  function getLectureTitle(lectureId: string): string {
    const lecture = $lectures.find(l => l.id === lectureId);
    return lecture?.title || 'Unknown Lecture';
  }

  function getCourseName(lectureId: string): string {
    const lecture = $lectures.find(l => l.id === lectureId);
    return lecture?.courseName || 'Unknown Course';
  }
</script>

<svelte:head>
  <title>Attendance - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Attendance</h1>
      <p class="text-gray-600 mt-1">Track your lecture attendance and performance</p>
    </div>
    
    <!-- Course Filter -->
    <div class="mt-4 md:mt-0">
      <select
        bind:value={selectedCourse}
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Courses</option>
        {#each enrolledCourses as course}
          <option value={course.id}>{course.title}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Overall Stats -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Overall Attendance</p>
          <p class="text-2xl font-bold {getAttendanceColor(overallAttendance)}">{overallAttendance}%</p>
        </div>
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <TrendingUp class="w-6 h-6 text-primary-600" />
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Total Lectures</p>
          <p class="text-2xl font-bold text-gray-900">
            {$attendanceSummaries.reduce((sum, summary) => sum + summary.totalLectures, 0)}
          </p>
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
          <p class="text-2xl font-bold text-success-600">
            {$attendanceSummaries.reduce((sum, summary) => sum + summary.attendedLectures, 0)}
          </p>
        </div>
        <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
          <CheckSquare class="w-6 h-6 text-success-600" />
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Missed</p>
          <p class="text-2xl font-bold text-error-600">
            {$attendanceSummaries.reduce((sum, summary) => sum + (summary.totalLectures - summary.attendedLectures), 0)}
          </p>
        </div>
        <div class="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
          <X class="w-6 h-6 text-error-600" />
        </div>
      </div>
    </div>
  </div>

  <!-- Course-wise Attendance -->
  <section>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Course-wise Attendance</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {#each filteredSummaries as summary}
        {@const course = $courses.find(c => c.id === summary.courseId)}
        <div class="card p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                {course?.title || 'Unknown Course'}
              </h3>
              <p class="text-sm text-gray-600">{course?.instructor}</p>
            </div>
            
            <div class="text-right">
              <p class="text-2xl font-bold {getAttendanceColor(summary.attendancePercentage)}">
                {summary.attendancePercentage}%
              </p>
              <p class="text-sm text-gray-500">
                {summary.attendedLectures}/{summary.totalLectures} lectures
              </p>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="mb-4">
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="h-3 rounded-full transition-all duration-300 {
                  summary.attendancePercentage >= 75 ? 'bg-success-500' :
                  summary.attendancePercentage >= 60 ? 'bg-warning-500' : 'bg-error-500'
                }"
                style="width: {summary.attendancePercentage}%"
              ></div>
            </div>
          </div>
          
          <!-- Attendance Status -->
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Status:</span>
            <span class="font-medium {
              summary.attendancePercentage >= 75 ? 'text-success-600' :
              summary.attendancePercentage >= 60 ? 'text-warning-600' : 'text-error-600'
            }">
              {getAttendanceStatus(summary.attendancePercentage)}
            </span>
          </div>
          
          {#if summary.excusedAbsences > 0}
            <div class="mt-2 text-sm text-blue-600">
              {summary.excusedAbsences} excused absence{summary.excusedAbsences !== 1 ? 's' : ''}
            </div>
          {/if}
          
          {#if summary.attendancePercentage < 75}
            <div class="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <div class="flex items-start space-x-2">
                <AlertTriangle class="w-4 h-4 text-warning-600 mt-0.5" />
                <div class="text-sm text-warning-700">
                  <p class="font-medium">Attendance Warning</p>
                  <p>You need to maintain at least 75% attendance. Consider attending upcoming lectures.</p>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </section>

  <!-- Recent Attendance Records -->
  <section>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Recent Attendance</h2>
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lecture
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in Method
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each recentRecords as record}
              {@const StatusIcon = getStatusIcon(record.status)}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {getLectureTitle(record.lectureId)}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600">
                    {getCourseName(record.lectureId)}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {record.timestamp ? new Date(record.timestamp).toLocaleString() : 'N/A'}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <StatusIcon class="w-4 h-4 {getStatusColor(record.status)}" />
                    <span class="text-sm font-medium {getStatusColor(record.status)} capitalize">
                      {record.status}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                    {record.checkInMethod || 'Manual'}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
      {#if recentRecords.length === 0}
        <div class="text-center py-12">
          <Calendar class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
          <p class="text-gray-500">Your attendance records will appear here</p>
        </div>
      {/if}
    </div>
  </section>
</div>