<script lang="ts">
  import { BarChart3, TrendingUp, Award, FileText, Calendar } from 'lucide-svelte';
  import { gradeEntries, courseGrades, calculateLetterGrade, calculateGPA } from '$lib/stores/grades';
  import { courses } from '$lib/stores/courses';

  let selectedCourse = '';
  let selectedCategory = '';

  // Filter grades
  $: filteredGrades = $gradeEntries.filter(grade => {
    const matchesCourse = !selectedCourse || grade.courseId === selectedCourse;
    const matchesCategory = !selectedCategory || grade.category === selectedCategory;
    return matchesCourse && matchesCategory;
  });

  // Get enrolled courses for filter
  $: enrolledCourses = $courses.filter(course => course.isEnrolled);

  // Calculate overall GPA
  $: overallGPA = $courseGrades.length > 0 
    ? $courseGrades.reduce((sum, course) => sum + calculateGPA(course.letterGrade), 0) / $courseGrades.length
    : 0;

  // Get recent grades
  $: recentGrades = $gradeEntries
    .sort((a, b) => new Date(b.gradedDate).getTime() - new Date(a.gradedDate).getTime())
    .slice(0, 5);

  function getGradeColor(percentage: number): string {
    if (percentage >= 90) return 'text-success-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-warning-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-error-600';
  }

  function getCategoryIcon(category: string) {
    switch (category) {
      case 'assignment': return FileText;
      case 'quiz': return BarChart3;
      case 'exam': return Award;
      case 'project': return TrendingUp;
      case 'participation': return Award;
      default: return FileText;
    }
  }

  function getCategoryColor(category: string): string {
    switch (category) {
      case 'assignment': return 'bg-blue-100 text-blue-700';
      case 'quiz': return 'bg-green-100 text-green-700';
      case 'exam': return 'bg-purple-100 text-purple-700';
      case 'project': return 'bg-orange-100 text-orange-700';
      case 'participation': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
</script>

<svelte:head>
  <title>Grades - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Grades</h1>
      <p class="text-gray-600 mt-1">Track your academic performance and progress</p>
    </div>
    
    <!-- Filters -->
    <div class="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
      <select
        bind:value={selectedCourse}
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Courses</option>
        {#each enrolledCourses as course}
          <option value={course.id}>{course.title}</option>
        {/each}
      </select>
      
      <select
        bind:value={selectedCategory}
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Categories</option>
        <option value="assignment">Assignments</option>
        <option value="quiz">Quizzes</option>
        <option value="exam">Exams</option>
        <option value="project">Projects</option>
        <option value="participation">Participation</option>
      </select>
    </div>
  </div>

  <!-- Overall Performance -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Overall GPA</p>
          <p class="text-2xl font-bold text-primary-600">{overallGPA.toFixed(2)}</p>
        </div>
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <Award class="w-6 h-6 text-primary-600" />
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Total Assignments</p>
          <p class="text-2xl font-bold text-gray-900">{$gradeEntries.length}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText class="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Average Score</p>
          <p class="text-2xl font-bold text-success-600">
            {$gradeEntries.length > 0 
              ? Math.round($gradeEntries.reduce((sum, grade) => sum + grade.percentage, 0) / $gradeEntries.length)
              : 0}%
          </p>
        </div>
        <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
          <TrendingUp class="w-6 h-6 text-success-600" />
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Courses</p>
          <p class="text-2xl font-bold text-gray-900">{$courseGrades.length}</p>
        </div>
        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <BarChart3 class="w-6 h-6 text-orange-600" />
        </div>
      </div>
    </div>
  </div>

  <!-- Course Grades Summary -->
  <section>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Course Performance</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {#each $courseGrades as courseGrade}
        {@const course = $courses.find(c => c.id === courseGrade.courseId)}
        <div class="card p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                {courseGrade.courseName}
              </h3>
              <p class="text-sm text-gray-600">{course?.instructor}</p>
            </div>
            
            <div class="text-right">
              <p class="text-2xl font-bold {getGradeColor(courseGrade.currentGrade)}">
                {courseGrade.letterGrade}
              </p>
              <p class="text-sm text-gray-500">
                {courseGrade.currentGrade.toFixed(1)}%
              </p>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium text-gray-700">Points Earned</span>
              <span class="text-sm text-gray-500">
                {courseGrade.earnedPoints}/{courseGrade.totalPoints}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="h-3 rounded-full transition-all duration-300 {
                  courseGrade.currentGrade >= 90 ? 'bg-success-500' :
                  courseGrade.currentGrade >= 80 ? 'bg-blue-500' :
                  courseGrade.currentGrade >= 70 ? 'bg-warning-500' : 'bg-error-500'
                }"
                style="width: {(courseGrade.earnedPoints / courseGrade.totalPoints) * 100}%"
              ></div>
            </div>
          </div>
          
          <div class="text-sm text-gray-500">
            Last updated: {new Date(courseGrade.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Recent Grades -->
  <section>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Recent Grades</h2>
    <div class="space-y-4">
      {#each recentGrades as grade}
        {@const CategoryIcon = getCategoryIcon(grade.category)}
        <div class="card p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div class="flex-1">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">{grade.assignmentTitle}</h3>
                  <p class="text-sm text-gray-600 mb-2">{grade.courseName}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <div class="flex items-center space-x-1">
                      <CategoryIcon class="w-4 h-4" />
                      <span class="capitalize">{grade.category}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Calendar class="w-4 h-4" />
                      <span>Graded: {new Date(grade.gradedDate).toLocaleDateString()}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <span>Weight: {(grade.weight * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex flex-col items-end space-y-2 ml-4">
                  <span class="px-3 py-1 text-xs font-medium rounded-full {getCategoryColor(grade.category)}">
                    {grade.category.charAt(0).toUpperCase() + grade.category.slice(1)}
                  </span>
                  <div class="text-right">
                    <p class="text-xl font-bold {getGradeColor(grade.percentage)}">
                      {grade.score}/{grade.maxScore}
                    </p>
                    <p class="text-sm font-medium {getGradeColor(grade.percentage)}">
                      {grade.letterGrade} ({grade.percentage}%)
                    </p>
                  </div>
                </div>
              </div>
              
              {#if grade.feedback}
                <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 class="text-sm font-medium text-blue-900 mb-1">Instructor Feedback</h4>
                  <p class="text-sm text-blue-700">{grade.feedback}</p>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Detailed Grades Table -->
  <section>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">All Grades</h2>
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignment
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each filteredGrades as grade}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {grade.assignmentTitle}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600">
                    {grade.courseName}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full {getCategoryColor(grade.category)}">
                    {grade.category.charAt(0).toUpperCase() + grade.category.slice(1)}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {grade.score}/{grade.maxScore}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-bold {getGradeColor(grade.percentage)}">
                      {grade.letterGrade}
                    </span>
                    <span class="text-sm text-gray-500">
                      ({grade.percentage}%)
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {new Date(grade.gradedDate).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
      {#if filteredGrades.length === 0}
        <div class="text-center py-12">
          <BarChart3 class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No grades found</h3>
          <p class="text-gray-500">Your grades will appear here once assignments are graded</p>
        </div>
      {/if}
    </div>
  </section>
</div>