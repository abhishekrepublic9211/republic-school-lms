<script lang="ts">
  import { courses, assignments, announcements } from '../stores/dashboard';
  import ProgressCard from './ProgressCard.svelte';
  import CourseCard from './CourseCard.svelte';
  import AssignmentCard from './AssignmentCard.svelte';
  import Calendar from './Calendar.svelte';
  import { BookOpen, FileText, CheckCircle, Bell } from 'lucide-svelte';
  
  // Calculate totals for progress cards
  $: totalLessons = $courses.reduce((sum, course) => sum + course.totalLessons, 0);
  $: completedLessons = $courses.reduce((sum, course) => sum + course.completedLessons, 0);
  $: totalAssignments = $courses.reduce((sum, course) => sum + course.totalAssignments, 0);
  $: completedAssignments = $courses.reduce((sum, course) => sum + course.completedAssignments, 0);
  $: totalTests = $courses.reduce((sum, course) => sum + course.totalTests, 0);
  $: completedTests = $courses.reduce((sum, course) => sum + course.completedTests, 0);
  
  // Get upcoming assignments (not completed, sorted by due date)
  $: upcomingAssignments = $assignments
    .filter(assignment => !assignment.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);
  
  // Get recent announcements
  $: recentAnnouncements = $announcements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
</script>

<main class="flex-1 p-4 md:p-6 space-y-6 animate-fade-in">
  <!-- Progress Overview -->
  <section aria-labelledby="progress-heading">
    <h2 id="progress-heading" class="text-xl font-semibold text-gray-900 mb-4">Status Overview</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ProgressCard
        title="Lessons"
        count={completedLessons}
        total={totalLessons}
        color="primary"
        icon="📚"
      />
      <ProgressCard
        title="Assignments"
        count={completedAssignments}
        total={totalAssignments}
        color="warning"
        icon="📝"
      />
      <ProgressCard
        title="Tests"
        count={completedTests}
        total={totalTests}
        color="success"
        icon="✅"
      />
    </div>
  </section>

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <!-- Left Column - Courses and Assignments -->
    <div class="xl:col-span-2 space-y-6">
      <!-- My Courses -->
      <section aria-labelledby="courses-heading">
        <div class="flex items-center justify-between mb-4">
          <h2 id="courses-heading" class="text-xl font-semibold text-gray-900">My Courses</h2>
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg font-medium">
              Active
            </button>
            <button class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 rounded-lg">
              Completed
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {#each $courses as course}
            <CourseCard {course} />
          {/each}
        </div>
      </section>

      <!-- Recent Announcements -->
      <section aria-labelledby="announcements-heading">
        <h2 id="announcements-heading" class="text-xl font-semibold text-gray-900 mb-4">Recent Announcements</h2>
        <div class="space-y-3">
          {#each recentAnnouncements as announcement}
            <div class="card p-4 hover:shadow-md transition-all duration-200">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center {
                    announcement.type === 'info' ? 'bg-blue-100 text-blue-600' :
                    announcement.type === 'warning' ? 'bg-warning-100 text-warning-600' :
                    'bg-success-100 text-success-600'
                  }">
                    <Bell class="w-4 h-4" />
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-medium text-gray-900">{announcement.title}</h4>
                    <span class="text-xs text-gray-500">{new Date(announcement.date).toLocaleDateString()}</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{announcement.content}</p>
                  {#if announcement.courseName}
                    <span class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {announcement.courseName}
                    </span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </section>
    </div>

    <!-- Right Column - Calendar and Upcoming -->
    <div class="space-y-6">
      <!-- Calendar -->
      <Calendar />

      <!-- Upcoming Assignments -->
      <section aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" class="text-xl font-semibold text-gray-900 mb-4">Upcoming</h2>
        <div class="space-y-3">
          {#each upcomingAssignments as assignment}
            <AssignmentCard {assignment} />
          {/each}
        </div>
        
        {#if upcomingAssignments.length === 0}
          <div class="card p-6 text-center">
            <CheckCircle class="w-12 h-12 text-success-500 mx-auto mb-3" />
            <h3 class="font-medium text-gray-900 mb-1">All caught up!</h3>
            <p class="text-sm text-gray-500">No upcoming assignments or tests</p>
          </div>
        {/if}
      </section>
    </div>
  </div>
</main>