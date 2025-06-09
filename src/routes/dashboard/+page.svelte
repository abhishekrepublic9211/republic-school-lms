<script lang="ts">
  import { onMount } from 'svelte';
  import { BookOpen, FileText, Calendar as CalendarIcon, TrendingUp, Clock, Award, Users, CheckSquare, BarChart3 } from 'lucide-svelte';
  import { courses } from '$lib/stores/courses';
  import { assignments } from '$lib/stores/assignments';
  import { lectures } from '$lib/stores/lectures';
  import { attendanceSummaries } from '$lib/stores/attendance';
  import { gradeEntries } from '$lib/stores/grades';
  import { currentUser } from '$lib/stores/auth';

  // Recent activity combining multiple data sources
  let recentActivity = [
    {
      type: 'course',
      title: 'Completed lesson: Research Techniques',
      course: 'Digital Journalism Fundamentals',
      time: '2 hours ago',
      icon: BookOpen
    },
    {
      type: 'assignment',
      title: 'Submitted: Interview Transcript',
      course: 'Digital Journalism Fundamentals',
      time: '1 day ago',
      icon: FileText
    },
    {
      type: 'grade',
      title: 'Grade received: 88/100',
      course: 'Digital Journalism Fundamentals',
      time: '2 days ago',
      icon: Award
    },
    {
      type: 'lecture',
      title: 'Attended: Advanced Source Protection',
      course: 'Investigative Reporting Masterclass',
      time: '3 days ago',
      icon: Users
    }
  ];

  // Get upcoming lectures for the current user
  $: upcomingLectures = $lectures
    .filter(lecture => {
      const lectureDate = new Date(lecture.date);
      const today = new Date();
      return lectureDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Combine assignments and lectures for upcoming deadlines
  $: upcomingDeadlines = [
    ...$assignments
      .filter(assignment => assignment.status === 'pending')
      .map(assignment => ({
        title: assignment.title,
        course: assignment.courseName,
        dueDate: assignment.dueDate,
        type: 'assignment' as const
      })),
    ...upcomingLectures.map(lecture => ({
      title: lecture.title,
      course: lecture.courseName,
      dueDate: `${lecture.date}T${lecture.time}:00`,
      type: 'lecture' as const
    }))
  ].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 4);

  $: enrolledCourses = $courses.filter(course => course.isEnrolled);
  $: pendingAssignments = $assignments.filter(assignment => assignment.status === 'pending');
  $: overallAttendance = $attendanceSummaries.length > 0 
    ? Math.round($attendanceSummaries.reduce((sum, summary) => sum + summary.attendancePercentage, 0) / $attendanceSummaries.length)
    : 0;
  $: recentGrades = $gradeEntries.slice(0, 3);
  $: averageProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / enrolledCourses.length)
    : 0;
</script>

<svelte:head>
  <title>Dashboard - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 space-y-6">
  <!-- Welcome Header -->
  <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
    <h1 class="text-2xl font-bold mb-2">Welcome back, {$currentUser?.name || 'Student'}!</h1>
    <p class="text-primary-100">Ready to continue your journalism journey? Let's see what's new today.</p>
    {#if $currentUser}
      <div class="mt-3 text-sm text-primary-100">
        <span class="font-medium">{$currentUser.department}</span> • 
        <span>{$currentUser.semester} {$currentUser.academicYear}</span> • 
        <span>ID: {$currentUser.studentId}</span>
      </div>
    {/if}
  </div>

  <!-- Stats Overview -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Enrolled Courses</p>
          <p class="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
        </div>
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <BookOpen class="w-6 h-6 text-primary-600" />
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Pending Assignments</p>
          <p class="text-2xl font-bold text-gray-900">{pendingAssignments.length}</p>
        </div>
        <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
          <FileText class="w-6 h-6 text-warning-600" />
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Attendance Rate</p>
          <p class="text-2xl font-bold text-gray-900">{overallAttendance}%</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <CheckSquare class="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Course Progress</p>
          <p class="text-2xl font-bold text-gray-900">{averageProgress}%</p>
        </div>
        <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
          <TrendingUp class="w-6 h-6 text-success-600" />
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Current Courses -->
    <div class="lg:col-span-2">
      <div class="card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Continue Learning</h2>
        <div class="space-y-4">
          {#each enrolledCourses as course}
            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-start space-x-4">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  class="w-16 h-16 rounded-lg object-cover"
                />
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1">{course.title}</h3>
                  <p class="text-sm text-gray-600 mb-1">by {course.instructor}</p>
                  <p class="text-xs text-gray-500 mb-2">{course.courseCode} • {course.credits} credits</p>
                  <div class="flex items-center justify-between">
                    <div class="flex-1 mr-4">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-xs text-gray-500">Progress</span>
                        <span class="text-xs font-medium text-primary-600">{course.progress}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style="width: {course.progress}%"
                        ></div>
                      </div>
                    </div>
                    <a href="/courses/{course.id}" class="btn btn-primary text-sm px-4 py-2">
                      Continue
                    </a>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="space-y-6">
      <!-- Upcoming Deadlines -->
      <div class="card p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Upcoming Deadlines</h3>
        <div class="space-y-3">
          {#each upcomingDeadlines as deadline}
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock class="w-4 h-4 text-error-600" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 text-sm">{deadline.title}</p>
                <p class="text-xs text-gray-600">{deadline.course}</p>
                <p class="text-xs text-error-600 font-medium">
                  Due {new Date(deadline.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          {/each}
        </div>
        <a href="/assignments" class="block mt-4 text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All Assignments
        </a>
      </div>

      <!-- Recent Grades -->
      <div class="card p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Recent Grades</h3>
        <div class="space-y-3">
          {#each recentGrades as grade}
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 class="w-4 h-4 text-success-600" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 text-sm">{grade.assignmentTitle}</p>
                <p class="text-xs text-gray-600">{grade.courseName}</p>
                <div class="flex items-center justify-between mt-1">
                  <span class="text-xs text-gray-500">Score</span>
                  <span class="text-sm font-bold text-success-600">{grade.score}/{grade.maxScore}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
        <a href="/grades" class="block mt-4 text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All Grades
        </a>
      </div>

      <!-- Recent Activity -->
      <div class="card p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-3">
          {#each recentActivity as activity}
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svelte:component this={activity.icon} class="w-4 h-4 text-gray-600" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 text-sm">{activity.title}</p>
                <p class="text-xs text-gray-600">{activity.course}</p>
                <p class="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div class="space-y-2">
          <a href="/courses" class="w-full btn btn-secondary text-sm py-2">
            Browse Courses
          </a>
          <a href="/assignments" class="w-full btn btn-secondary text-sm py-2">
            View Assignments
          </a>
          <a href="/lectures" class="w-full btn btn-secondary text-sm py-2">
            Today's Lectures
          </a>
          <a href="/chat" class="w-full btn btn-secondary text-sm py-2">
            Join Discussion
          </a>
        </div>
      </div>
    </div>
  </div>
</div>