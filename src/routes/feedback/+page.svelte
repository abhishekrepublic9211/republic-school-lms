<script lang="ts">
  import { Star, Send, Filter, TrendingUp, MessageSquare } from 'lucide-svelte';
  import { courseFeedback, feedbackSummaries, calculateOverallRating, getFeedbackColor } from '$lib/stores/feedback';
  import { courses } from '$lib/stores/courses';
  import { currentUser } from '$lib/stores/auth';
  import type { FeedbackEntry } from '$lib/stores/feedback';

  let selectedTab = 'submit'; // 'submit', 'history', 'analytics'
  let selectedCourse = '';
  let showFeedbackForm = false;
  
  // Feedback form data
  let feedbackCourse = '';
  let rating = 0;
  let categories = {
    contentQuality: 0,
    teachingEffectiveness: 0,
    courseOrganization: 0,
    assignmentRelevance: 0,
    overallSatisfaction: 0
  };
  let comment = '';
  let suggestions = '';
  let isAnonymous = false;

  // Get enrolled courses for feedback
  $: enrolledCourses = $courses.filter(course => course.isEnrolled);

  // Filter feedback history
  $: filteredFeedback = selectedCourse 
    ? $courseFeedback.filter(feedback => feedback.courseId === selectedCourse)
    : $courseFeedback;

  function setRating(value: number, category?: string) {
    if (category) {
      categories[category] = value;
    } else {
      rating = value;
    }
  }

  function submitFeedback() {
    if (!feedbackCourse || rating === 0) return;

    const course = $courses.find(c => c.id === feedbackCourse);
    if (!course) return;

    const newFeedback: FeedbackEntry = {
      id: Date.now().toString(),
      courseId: feedbackCourse,
      courseName: course.title,
      studentId: $currentUser?.id || '1',
      studentName: isAnonymous ? 'Anonymous' : ($currentUser?.name || 'Student'),
      instructorId: '2', // This would come from course data
      instructorName: course.instructor,
      rating: calculateOverallRating(categories),
      categories,
      comment: comment.trim(),
      suggestions: suggestions.trim(),
      timestamp: new Date().toISOString(),
      isAnonymous,
      semester: 'Spring',
      academicYear: '2024'
    };

    courseFeedback.update(feedbackList => [newFeedback, ...feedbackList]);
    
    // Reset form
    feedbackCourse = '';
    rating = 0;
    categories = {
      contentQuality: 0,
      teachingEffectiveness: 0,
      courseOrganization: 0,
      assignmentRelevance: 0,
      overallSatisfaction: 0
    };
    comment = '';
    suggestions = '';
    isAnonymous = false;
    showFeedbackForm = false;
  }

  function renderStars(currentRating: number, onRate: (rating: number) => void, readonly = false) {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }
</script>

<svelte:head>
  <title>Feedback - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Course Feedback</h1>
      <p class="text-gray-600 mt-1">Share your experience and help improve our courses</p>
    </div>
    
    <button 
      on:click={() => showFeedbackForm = true}
      class="mt-4 md:mt-0 btn btn-primary flex items-center space-x-2"
    >
      <MessageSquare class="w-4 h-4" />
      <span>Give Feedback</span>
    </button>
  </div>

  <!-- Tab Navigation -->
  <div class="border-b border-gray-200">
    <nav class="-mb-px flex space-x-8">
      <button
        class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'submit' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        on:click={() => selectedTab = 'submit'}
      >
        Submit Feedback
      </button>
      <button
        class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'history' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        on:click={() => selectedTab = 'history'}
      >
        My Feedback
      </button>
      <button
        class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'analytics' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        on:click={() => selectedTab = 'analytics'}
      >
        Course Analytics
      </button>
    </nav>
  </div>

  <!-- Tab Content -->
  {#if selectedTab === 'submit'}
    <!-- Submit Feedback Tab -->
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each enrolledCourses as course}
          <div class="card p-6 hover:shadow-md transition-shadow duration-200">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              class="w-full h-32 object-cover rounded-lg mb-4"
            />
            
            <h3 class="font-semibold text-gray-900 mb-2">{course.title}</h3>
            <p class="text-sm text-gray-600 mb-3">by {course.instructor}</p>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">Progress: {course.progress}%</span>
              <button 
                on:click={() => {
                  feedbackCourse = course.id;
                  showFeedbackForm = true;
                }}
                class="btn btn-primary text-sm px-4 py-2"
              >
                Give Feedback
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>

  {:else if selectedTab === 'history'}
    <!-- Feedback History Tab -->
    <div class="space-y-6">
      <!-- Filter -->
      <div class="flex items-center space-x-4">
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

      <!-- Feedback List -->
      <div class="space-y-4">
        {#each filteredFeedback as feedback}
          <div class="card p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">{feedback.courseName}</h3>
                <p class="text-sm text-gray-600">Instructor: {feedback.instructorName}</p>
                <p class="text-xs text-gray-500 mt-1">
                  Submitted on {new Date(feedback.timestamp).toLocaleDateString()}
                </p>
              </div>
              
              <div class="text-right">
                <div class="flex items-center space-x-1 mb-1">
                  {#each renderStars(feedback.rating, () => {}, true) as star}
                    <Star class="w-4 h-4 {star <= feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
                  {/each}
                </div>
                <span class="text-sm font-medium {getFeedbackColor(feedback.rating)}">
                  {feedback.rating.toFixed(1)}/5.0
                </span>
              </div>
            </div>
            
            <!-- Category Ratings -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div class="text-center">
                <p class="text-xs text-gray-500 mb-1">Content</p>
                <p class="text-sm font-medium">{feedback.categories.contentQuality}/5</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-500 mb-1">Teaching</p>
                <p class="text-sm font-medium">{feedback.categories.teachingEffectiveness}/5</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-500 mb-1">Organization</p>
                <p class="text-sm font-medium">{feedback.categories.courseOrganization}/5</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-500 mb-1">Assignments</p>
                <p class="text-sm font-medium">{feedback.categories.assignmentRelevance}/5</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-500 mb-1">Overall</p>
                <p class="text-sm font-medium">{feedback.categories.overallSatisfaction}/5</p>
              </div>
            </div>
            
            {#if feedback.comment}
              <div class="mb-3">
                <h4 class="text-sm font-medium text-gray-900 mb-1">Comments</h4>
                <p class="text-sm text-gray-600">{feedback.comment}</p>
              </div>
            {/if}
            
            {#if feedback.suggestions}
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-1">Suggestions</h4>
                <p class="text-sm text-gray-600">{feedback.suggestions}</p>
              </div>
            {/if}
          </div>
        {/each}
        
        {#if filteredFeedback.length === 0}
          <div class="text-center py-12">
            <MessageSquare class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No feedback submitted</h3>
            <p class="text-gray-500">Start by giving feedback on your enrolled courses</p>
          </div>
        {/if}
      </div>
    </div>

  {:else if selectedTab === 'analytics'}
    <!-- Course Analytics Tab -->
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {#each $feedbackSummaries as summary}
          <div class="card p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">{summary.courseName}</h3>
                <p class="text-sm text-gray-600">Instructor: {summary.instructorName}</p>
              </div>
              
              <div class="text-right">
                <div class="flex items-center space-x-1 mb-1">
                  {#each renderStars(summary.averageRating, () => {}, true) as star}
                    <Star class="w-4 h-4 {star <= summary.averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
                  {/each}
                </div>
                <span class="text-sm font-medium {getFeedbackColor(summary.averageRating)}">
                  {summary.averageRating.toFixed(1)}/5.0
                </span>
              </div>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-lg font-bold text-gray-900">{summary.totalResponses}</p>
                <p class="text-xs text-gray-500">Total Responses</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-lg font-bold text-gray-900">{summary.responseRate}%</p>
                <p class="text-xs text-gray-500">Response Rate</p>
              </div>
            </div>
            
            <!-- Category Breakdown -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-900">Category Ratings</h4>
              
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-600">Content Quality</span>
                  <span class="text-xs font-medium">{summary.categoryAverages.contentQuality.toFixed(1)}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary-600 h-2 rounded-full"
                    style="width: {(summary.categoryAverages.contentQuality / 5) * 100}%"
                  ></div>
                </div>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-600">Teaching Effectiveness</span>
                  <span class="text-xs font-medium">{summary.categoryAverages.teachingEffectiveness.toFixed(1)}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary-600 h-2 rounded-full"
                    style="width: {(summary.categoryAverages.teachingEffectiveness / 5) * 100}%"
                  ></div>
                </div>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-600">Course Organization</span>
                  <span class="text-xs font-medium">{summary.categoryAverages.courseOrganization.toFixed(1)}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary-600 h-2 rounded-full"
                    style="width: {(summary.categoryAverages.courseOrganization / 5) * 100}%"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<!-- Feedback Form Modal -->
{#if showFeedbackForm}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Course Feedback</h2>
        <button 
          on:click={() => showFeedbackForm = false}
          class="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      
      <form on:submit|preventDefault={submitFeedback} class="space-y-6">
        <!-- Course Selection -->
        <div>
          <label for="course" class="block text-sm font-medium text-gray-700 mb-1">
            Select Course
          </label>
          <select
            id="course"
            bind:value={feedbackCourse}
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Choose a course</option>
            {#each enrolledCourses as course}
              <option value={course.id}>{course.title}</option>
            {/each}
          </select>
        </div>
        
        <!-- Category Ratings -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Rate Different Aspects</h3>
          
          {#each Object.entries(categories) as [category, value]}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <div class="flex items-center space-x-1">
                {#each renderStars(value, (rating) => setRating(rating, category)) as star}
                  <button
                    type="button"
                    on:click={() => setRating(star, category)}
                    class="focus:outline-none"
                  >
                    <Star class="w-6 h-6 {star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'} hover:text-yellow-400 transition-colors duration-200" />
                  </button>
                {/each}
                <span class="ml-2 text-sm text-gray-600">{value}/5</span>
              </div>
            </div>
          {/each}
        </div>
        
        <!-- Comments -->
        <div>
          <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">
            Comments
          </label>
          <textarea
            id="comment"
            bind:value={comment}
            placeholder="Share your thoughts about the course..."
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
        </div>
        
        <!-- Suggestions -->
        <div>
          <label for="suggestions" class="block text-sm font-medium text-gray-700 mb-1">
            Suggestions for Improvement
          </label>
          <textarea
            id="suggestions"
            bind:value={suggestions}
            placeholder="How can we make this course better?"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
        </div>
        
        <!-- Anonymous Option -->
        <div class="flex items-center space-x-2">
          <input
            id="anonymous"
            type="checkbox"
            bind:checked={isAnonymous}
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label for="anonymous" class="text-sm text-gray-700">
            Submit feedback anonymously
          </label>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button 
            type="button"
            on:click={() => showFeedbackForm = false}
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={!feedbackCourse || Object.values(categories).every(v => v === 0)}
            class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send class="w-4 h-4" />
            <span>Submit Feedback</span>
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}