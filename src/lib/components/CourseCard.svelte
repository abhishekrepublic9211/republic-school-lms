<script lang="ts">
  import type { Course } from '../stores/dashboard';
  import { BookOpen, Clock, CheckCircle } from 'lucide-svelte';
  
  export let course: Course;
  
  function handleCourseClick() {
    console.log('Course clicked:', course.name);
  }
  
  function handleResumeClick(event: Event) {
    event.stopPropagation();
    console.log('Resume clicked for:', course.name);
  }
</script>

<div 
  class="card-hover p-6 cursor-pointer group animate-fade-in"
  on:click={handleCourseClick}
  role="button"
  tabindex="0"
  on:keydown={(e) => e.key === 'Enter' && handleCourseClick()}
  aria-label="Open course {course.name}"
>
  <!-- Course Header -->
  <div class="flex items-start justify-between mb-4">
    <div class="flex items-center space-x-3">
      <div class="w-12 h-12 rounded-lg {course.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
        <BookOpen class="w-6 h-6" />
      </div>
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
          {course.name}
        </h3>
        <p class="text-sm text-gray-500 mt-1">{course.description}</p>
        <p class="text-xs text-gray-400 mt-1">by {course.instructor}</p>
      </div>
    </div>
    
    <button
      class="btn-primary text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      on:click={handleResumeClick}
    >
      Resume
    </button>
  </div>
  
  <!-- Progress Bar -->
  <div class="mb-4">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">Progress</span>
      <span class="text-sm font-bold text-primary-600">{course.progress}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div 
        class="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-700 ease-out transform hover:scale-105"
        style="width: {course.progress}%"
      ></div>
    </div>
  </div>
  
  <!-- Course Stats -->
  <div class="grid grid-cols-3 gap-4 text-center">
    <div class="group/stat">
      <div class="flex items-center justify-center space-x-1 mb-1">
        <BookOpen class="w-4 h-4 text-blue-500 group-hover/stat:animate-bounce-subtle" />
        <span class="text-xs text-gray-500">Lessons</span>
      </div>
      <p class="text-sm font-bold text-gray-900">{course.completedLessons}/{course.totalLessons}</p>
    </div>
    
    <div class="group/stat">
      <div class="flex items-center justify-center space-x-1 mb-1">
        <Clock class="w-4 h-4 text-orange-500 group-hover/stat:animate-bounce-subtle" />
        <span class="text-xs text-gray-500">Assignments</span>
      </div>
      <p class="text-sm font-bold text-gray-900">{course.completedAssignments}/{course.totalAssignments}</p>
    </div>
    
    <div class="group/stat">
      <div class="flex items-center justify-center space-x-1 mb-1">
        <CheckCircle class="w-4 h-4 text-green-500 group-hover/stat:animate-bounce-subtle" />
        <span class="text-xs text-gray-500">Tests</span>
      </div>
      <p class="text-sm font-bold text-gray-900">{course.completedTests}/{course.totalTests}</p>
    </div>
  </div>
  
  <!-- Due Date (if applicable) -->
  {#if course.dueDate}
    <div class="mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500">Due Date</span>
        <span class="text-xs font-medium text-error-600">{new Date(course.dueDate).toLocaleDateString()}</span>
      </div>
    </div>
  {/if}
</div>