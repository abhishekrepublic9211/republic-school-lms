<script lang="ts">
  import { Star, MessageSquare, Send, Filter, Calendar, TrendingUp } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { courseFeedback, feedbackSummaries, calculateOverallRating, getFeedbackColor } from '../stores/feedback';
  import { courses } from '../stores/courses';
  import { currentUser } from '../stores/auth';

  let selectedCourse = 'All';
  let selectedSemester = 'All';
  let showFeedbackModal = false;
  let selectedCourseForFeedback: any = null;

  // New feedback form data
  let newFeedback = {
    rating: 5,
    categories: {
      contentQuality: 5,
      teachingEffectiveness: 5,
      courseOrganization: 5,
      assignmentRelevance: 5,
      overallSatisfaction: 5
    },
    comment: '',
    suggestions: '',
    isAnonymous: false
  };

  // Get user's enrolled courses for feedback
  $: enrolledCourses = $courses.filter(course => course.isEnrolled);
  $: availableCourses = ['All', ...enrolledCourses.map(course => course.title)];
  
  const semesters = ['All', 'Spring 2024', 'Fall 2023', 'Summer 2023'];
  const categoryLabels = {
    contentQuality: 'Content Quality',
    teachingEffectiveness: 'Teaching Effectiveness',
    courseOrganization: 'Course Organization',
    assignmentRelevance: 'Assignment Relevance',
    overallSatisfaction: 'Overall Satisfaction'
  };

  // Filter feedback summaries
  $: filteredSummaries = $feedbackSummaries.filter(summary => {
    const matchesCourse = selectedCourse === 'All' || summary.courseName === selectedCourse;
    return matchesCourse;
  });

  // Get user's feedback entries
  $: userFeedback = $courseFeedback.filter(feedback => feedback.studentId === $currentUser?.id);

  function openFeedbackModal(course: any) {
    selectedCourseForFeedback = course;
    showFeedbackModal = true;
    // Reset form
    newFeedback = {
      rating: 5,
      categories: {
        contentQuality: 5,
        teachingEffectiveness: 5,
        courseOrganization: 5,
        assignmentRelevance: 5,
        overallSatisfaction: 5
      },
      comment: '',
      suggestions: '',
      isAnonymous: false
    };
  }

  function closeFeedbackModal() {
    showFeedbackModal = false;
    selectedCourseForFeedback = null;
  }

  function submitFeedback() {
    if (!selectedCourseForFeedback || !$currentUser) return;

    const feedback = {
      id: Date.now().toString(),
      courseId: selectedCourseForFeedback.id,
      courseName: selectedCourseForFeedback.title,
      studentId: $currentUser.id,
      studentName: newFeedback.isAnonymous ? 'Anonymous' : $currentUser.name,
      instructorId: '2', // Mock instructor ID
      instructorName: selectedCourseForFeedback.instructor,
      rating: calculateOverallRating(newFeedback.categories),
      categories: newFeedback.categories,
      comment: newFeedback.comment,
      suggestions: newFeedback.suggestions,
      timestamp: new Date().toISOString(),
      isAnonymous: newFeedback.isAnonymous,
      semester: 'Spring',
      academicYear: '2024'
    };

    courseFeedback.update(feedbackList => [...feedbackList, feedback]);
    closeFeedbackModal();
  }

  function renderStars(rating: number, size: string = 'w-4 h-4') {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
</script>

<Layout>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Course Feedback</h1>
        <p class="text-gray-600 mt-1">Provide feedback on your courses and view instructor ratings</p>
      </div>
      <button 
        class="btn btn-primary flex items-center space-x-2"
        on:click={() => {
          if (enrolledCourses.length > 0) {
            openFeedbackModal(enrolledCourses[0]);
          }
        }}
      >
        <MessageSquare class="w-4 h-4" />
        <span>Give Feedback</span>
      </button>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Courses Enrolled</p>
            <p class="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <MessageSquare class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Feedback Given</p>
            <p class="text-2xl font-bold text-gray-900">{userFeedback.length}</p>
          </div>
          <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
            <Send class="w-6 h-6 text-success-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Avg. Rating Given</p>
            <p class="text-2xl font-bold text-gray-900">
              {userFeedback.length > 0 
                ? Math.round((userFeedback.reduce((sum, f) => sum + f.rating, 0) / userFeedback.length) * 10) / 10
                : 0}
            </p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Star class="w-6 h-6 text-yellow-600" />
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
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Course Feedback Summaries -->
    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Course Ratings & Feedback</h2>
      <div class="space-y-4">
        {#each filteredSummaries as summary}
          <div class="border border-gray-200 rounded-lg p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{summary.courseName}</h3>
                <p class="text-gray-600">Instructor: {summary.instructorName}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <div class="flex items-center space-x-1">
                    {#each renderStars(summary.averageRating) as filled}
                      <Star class="w-4 h-4 {filled ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
                    {/each}
                    <span class="text-sm font-medium {getFeedbackColor(summary.averageRating)}">
                      {summary.averageRating}
                    </span>
                  </div>
                  <span class="text-sm text-gray-500">
                    {summary.totalResponses} responses ({summary.responseRate}% response rate)
                  </span>
                </div>
              </div>
              
              <div class="text-right">
                <div class="text-2xl font-bold {getFeedbackColor(summary.averageRating)}">
                  {summary.averageRating}/5
                </div>
                <div class="text-sm text-gray-500">Overall Rating</div>
              </div>
            </div>
            
            <!-- Category Breakdown -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              {#each Object.entries(summary.categoryAverages) as [category, rating]}
                <div class="text-center">
                  <div class="text-lg font-bold {getFeedbackColor(rating)}">{rating}</div>
                  <div class="text-xs text-gray-600">{categoryLabels[category]}</div>
                  <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      class="h-2 rounded-full {
                        rating >= 4.5 ? 'bg-green-500' :
                        rating >= 4.0 ? 'bg-blue-500' :
                        rating >= 3.5 ? 'bg-yellow-500' :
                        rating >= 3.0 ? 'bg-orange-500' :
                        'bg-red-500'
                      }"
                      style="width: {(rating / 5) * 100}%"
                    ></div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Your Feedback History -->
    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Your Feedback History</h2>
      <div class="space-y-4">
        {#each userFeedback as feedback}
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="font-semibold text-gray-900">{feedback.courseName}</h3>
                <p class="text-sm text-gray-600">Submitted {formatDate(feedback.timestamp)}</p>
                <div class="flex items-center space-x-1 mt-1">
                  {#each renderStars(feedback.rating) as filled}
                    <Star class="w-3 h-3 {filled ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
                  {/each}
                  <span class="text-sm font-medium ml-1">{feedback.rating}/5</span>
                </div>
              </div>
              <div class="text-right">
                {#if feedback.isAnonymous}
                  <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Anonymous</span>
                {/if}
              </div>
            </div>
            
            {#if feedback.comment}
              <div class="mb-3">
                <p class="text-sm text-gray-700">
                  <span class="font-medium">Comment:</span> {feedback.comment}
                </p>
              </div>
            {/if}
            
            {#if feedback.suggestions}
              <div>
                <p class="text-sm text-gray-700">
                  <span class="font-medium">Suggestions:</span> {feedback.suggestions}
                </p>
              </div>
            {/if}
          </div>
        {/each}
        
        {#if userFeedback.length === 0}
          <div class="text-center py-8 text-gray-500">
            <MessageSquare class="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No feedback submitted yet</p>
            <p class="text-sm">Share your thoughts on your courses to help improve the learning experience</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Available Courses for Feedback -->
    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Give Feedback</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each enrolledCourses as course}
          {@const hasGivenFeedback = userFeedback.some(f => f.courseId === course.id)}
          <div class="border border-gray-200 rounded-lg p-4 {hasGivenFeedback ? 'opacity-60' : ''}">
            <div class="flex items-start space-x-3">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                class="w-12 h-12 rounded-lg object-cover"
              />
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{course.title}</h3>
                <p class="text-sm text-gray-600">{course.instructor}</p>
                <p class="text-xs text-gray-500">{course.courseCode}</p>
                
                {#if hasGivenFeedback}
                  <div class="mt-2">
                    <span class="px-2 py-1 bg-success-100 text-success-700 text-xs rounded-full">
                      Feedback Submitted
                    </span>
                  </div>
                {:else}
                  <button 
                    class="mt-2 btn btn-primary text-xs px-3 py-1"
                    on:click={() => openFeedbackModal(course)}
                  >
                    Give Feedback
                  </button>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Feedback Modal -->
  {#if showFeedbackModal && selectedCourseForFeedback}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">Course Feedback</h3>
        
        <div class="mb-4">
          <h4 class="font-medium text-gray-900">{selectedCourseForFeedback.title}</h4>
          <p class="text-sm text-gray-600">Instructor: {selectedCourseForFeedback.instructor}</p>
        </div>
        
        <div class="space-y-6">
          <!-- Category Ratings -->
          <div>
            <h4 class="font-medium text-gray-900 mb-4">Rate the following aspects:</h4>
            <div class="space-y-4">
              {#each Object.entries(categoryLabels) as [key, label]}
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">{label}</span>
                  <div class="flex items-center space-x-1">
                    {#each [1, 2, 3, 4, 5] as rating}
                      <button
                        class="w-6 h-6"
                        on:click={() => newFeedback.categories[key] = rating}
                      >
                        <Star class="w-6 h-6 {rating <= newFeedback.categories[key] ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
                      </button>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
          
          <!-- Comment -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Comments</label>
            <textarea
              bind:value={newFeedback.comment}
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Share your thoughts about this course..."
            ></textarea>
          </div>
          
          <!-- Suggestions -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Suggestions for Improvement</label>
            <textarea
              bind:value={newFeedback.suggestions}
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="How can this course be improved?"
            ></textarea>
          </div>
          
          <!-- Anonymous Option -->
          <div class="flex items-center">
            <input
              type="checkbox"
              bind:checked={newFeedback.isAnonymous}
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-700">
              Submit feedback anonymously
            </label>
          </div>
        </div>
        
        <div class="flex space-x-3 mt-6">
          <button
            class="flex-1 btn btn-primary"
            on:click={submitFeedback}
          >
            Submit Feedback
          </button>
          <button
            class="flex-1 btn btn-secondary"
            on:click={closeFeedbackModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}
</Layout>