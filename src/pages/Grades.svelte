<script lang="ts">
  import { BarChart3, TrendingUp, Award, FileText, Calendar, Filter } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { gradeEntries, courseGrades, calculateLetterGrade } from '../stores/grades';
  import { courses } from '../stores/courses';
  import { currentUser } from '../stores/auth';

  let selectedCourse = 'All';
  let selectedCategory = 'All';
  let selectedSemester = 'All';

  // Filter grades by current user
  $: userGrades = $gradeEntries.filter(grade => grade.studentId === $currentUser?.id);
  $: userCourseGrades = $courseGrades.filter(grade => grade.studentId === $currentUser?.id);

  // Get available courses for filter
  $: availableCourses = ['All', ...new Set(userGrades.map(grade => grade.courseName))];
  
  // Categories for filtering
  const categories = ['All', 'assignment', 'quiz', 'exam', 'project', 'participation'];
  const semesters = ['All', 'Spring 2024', 'Fall 2023', 'Summer 2023'];

  // Filter grades
  $: filteredGrades = userGrades.filter(grade => {
    const matchesCourse = selectedCourse === 'All' || grade.courseName === selectedCourse;
    const matchesCategory = selectedCategory === 'All' || grade.category === selectedCategory;
    return matchesCourse && matchesCategory;
  }).sort((a, b) => new Date(b.gradedDate).getTime() - new Date(a.gradedDate).getTime());

  // Calculate overall statistics
  $: overallStats = {
    totalAssignments: userGrades.length,
    averageGrade: userGrades.length > 0 
      ? Math.round(userGrades.reduce((sum, grade) => sum + grade.percentage, 0) / userGrades.length)
      : 0,
    highestGrade: userGrades.length > 0 
      ? Math.max(...userGrades.map(grade => grade.percentage))
      : 0,
    gpa: userCourseGrades.length > 0
      ? Math.round((userCourseGrades.reduce((sum, course) => sum + course.currentGrade, 0) / userCourseGrades.length) * 100) / 100
      : 0
  };

  function getGradeColor(percentage: number): string {
    if (percentage >= 90) return 'text-success-600 bg-success-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-warning-600 bg-warning-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-error-600 bg-error-100';
  }

  function getCategoryIcon(category: string) {
    switch (category) {
      case 'assignment':
        return FileText;
      case 'quiz':
      case 'exam':
        return BarChart3;
      case 'project':
        return Award;
      default:
        return FileText;
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function getLetterGradeColor(letterGrade: string): string {
    if (letterGrade.startsWith('A')) return 'text-success-600';
    if (letterGrade.startsWith('B')) return 'text-blue-600';
    if (letterGrade.startsWith('C')) return 'text-warning-600';
    if (letterGrade.startsWith('D')) return 'text-orange-600';
    return 'text-error-600';
  }
</script>

<Layout>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Grades</h1>
        <p class="text-gray-600 mt-1">View your academic performance and grade reports</p>
      </div>
    </div>

    <!-- Overall Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Assignments</p>
            <p class="text-2xl font-bold text-gray-900">{overallStats.totalAssignments}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Average Grade</p>
            <p class="text-2xl font-bold {getLetterGradeColor(calculateLetterGrade(overallStats.averageGrade))}">{overallStats.averageGrade}%</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <BarChart3 class="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Highest Grade</p>
            <p class="text-2xl font-bold text-success-600">{overallStats.highestGrade}%</p>
          </div>
          <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
            <TrendingUp class="w-6 h-6 text-success-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Current GPA</p>
            <p class="text-2xl font-bold text-primary-600">{overallStats.gpa}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Award class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Course Grades Summary -->
    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Course Grades</h2>
      <div class="space-y-4">
        {#each userCourseGrades as courseGrade}
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h3 class="font-semibold text-gray-900">{courseGrade.courseName}</h3>
                <p class="text-sm text-gray-600">
                  {courseGrade.assignments.length} assignments • Last updated {formatDate(courseGrade.lastUpdated)}
                </p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold {getLetterGradeColor(courseGrade.letterGrade)}">
                  {courseGrade.letterGrade}
                </div>
                <div class="text-sm text-gray-600">
                  {courseGrade.currentGrade}%
                </div>
              </div>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div 
                class="h-3 rounded-full transition-all duration-300 {
                  courseGrade.currentGrade >= 90 ? 'bg-success-500' :
                  courseGrade.currentGrade >= 80 ? 'bg-blue-500' :
                  courseGrade.currentGrade >= 70 ? 'bg-warning-500' :
                  courseGrade.currentGrade >= 60 ? 'bg-orange-500' :
                  'bg-error-500'
                }"
                style="width: {courseGrade.currentGrade}%"
              ></div>
            </div>
            
            <div class="flex items-center justify-between text-sm text-gray-600">
              <span>Points: {courseGrade.earnedPoints}/{courseGrade.totalPoints}</span>
              <a href="#/courses/{courseGrade.courseId}" class="text-primary-600 hover:text-primary-700 font-medium">
                View Course
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select 
            bind:value={selectedCategory}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {#each categories as category}
              <option value={category}>{category === 'All' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}</option>
            {/each}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
          <select 
            bind:value={selectedSemester}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {#each semesters as semester}
              <option value={semester}>{semester}</option>
            {/each}
          </select>
        </div>

        <div class="flex items-end">
          <button class="btn btn-secondary w-full flex items-center justify-center space-x-2">
            <Filter class="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Individual Grades -->
    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Assignment Grades</h2>
      <div class="space-y-3">
        {#each filteredGrades as grade}
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center {getGradeColor(grade.percentage)}">
                  <svelte:component this={getCategoryIcon(grade.category)} class="w-5 h-5" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{grade.assignmentTitle}</h3>
                  <p class="text-sm text-gray-600">{grade.courseName}</p>
                  <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span class="capitalize">{grade.category}</span>
                    <span>Graded by {grade.gradedBy}</span>
                    <span>{formatDate(grade.gradedDate)}</span>
                  </div>
                </div>
              </div>
              
              <div class="text-right">
                <div class="text-2xl font-bold {getLetterGradeColor(grade.letterGrade)}">
                  {grade.letterGrade}
                </div>
                <div class="text-sm text-gray-600">
                  {grade.score}/{grade.maxScore}
                </div>
                <div class="text-xs text-gray-500">
                  {grade.percentage}%
                </div>
              </div>
            </div>
            
            {#if grade.feedback}
              <div class="mt-3 pt-3 border-t border-gray-100">
                <p class="text-sm text-gray-700">
                  <span class="font-medium">Feedback:</span> {grade.feedback}
                </p>
              </div>
            {/if}
          </div>
        {/each}
        
        {#if filteredGrades.length === 0}
          <div class="text-center py-8 text-gray-500">
            <BarChart3 class="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No grades found</p>
            <p class="text-sm">Try adjusting your filters</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Grade Distribution Chart Placeholder -->
    <div class="card p-6">
      <h2  class="text-xl font-semibold text-gray-900 mb-6">Grade Distribution</h2>
      <div class="bg-gray-50 rounded-lg p-8 text-center">
        <BarChart3 class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-600">Grade distribution chart would be displayed here</p>
        <p class="text-sm text-gray-500">Visual representation of your performance across different categories</p>
      </div>
    </div>
  </div>
</Layout>