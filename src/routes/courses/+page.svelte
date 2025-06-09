<script lang="ts">
  import { BookOpen, Clock, Users, Star, Filter, Search } from 'lucide-svelte';
  import { courses } from '$lib/stores/courses';
  import { currentUser } from '$lib/stores/auth';

  let searchQuery = '';
  let selectedLevel = '';
  let selectedCategory = '';

  // Filter courses based on search and filters
  $: filteredCourses = $courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  $: enrolledCourses = $courses.filter(course => course.isEnrolled);
  $: availableCourses = $courses.filter(course => !course.isEnrolled);

  function enrollInCourse(courseId: string) {
    courses.update(courseList => 
      courseList.map(course => 
        course.id === courseId 
          ? { ...course, isEnrolled: true, progress: 0 }
          : course
      )
    );
  }

  function continueCourse(courseId: string) {
    // Navigate to course details or continue learning
    console.log('Continue course:', courseId);
  }
</script>

<svelte:head>
  <title>Courses - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Courses</h1>
      <p class="text-gray-600 mt-1">Explore our comprehensive journalism programs</p>
    </div>
    
    <!-- Search and Filters -->
    <div class="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses..."
          bind:value={searchQuery}
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      
      <select
        bind:value={selectedLevel}
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Levels</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
      
      <select
        bind:value={selectedCategory}
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Categories</option>
        <option value="Digital Media">Digital Media</option>
        <option value="Investigative">Investigative</option>
        <option value="Broadcast">Broadcast</option>
      </select>
    </div>
  </div>

  <!-- My Courses -->
  {#if enrolledCourses.length > 0}
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">My Courses</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each enrolledCourses as course}
          <div class="card p-6 hover:shadow-lg transition-shadow duration-200">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              class="w-full h-40 object-cover rounded-lg mb-4"
            />
            
            <div class="flex items-start justify-between mb-2">
              <span class="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                {course.level}
              </span>
              <div class="flex items-center space-x-1">
                <Star class="w-4 h-4 text-yellow-400 fill-current" />
                <span class="text-sm text-gray-600">{course.rating}</span>
              </div>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
            <p class="text-sm text-gray-600 mb-3">{course.description}</p>
            
            <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div class="flex items-center space-x-1">
                <Users class="w-4 h-4" />
                <span>{course.instructor}</span>
              </div>
              <div class="flex items-center space-x-1">
                <Clock class="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700">Progress</span>
                <span class="text-sm font-bold text-primary-600">{course.progress}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style="width: {course.progress}%"
                ></div>
              </div>
            </div>
            
            <button 
              on:click={() => continueCourse(course.id)}
              class="w-full btn btn-primary"
            >
              Continue Learning
            </button>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Available Courses -->
  <section>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">
      {enrolledCourses.length > 0 ? 'Explore More Courses' : 'Available Courses'}
    </h2>
    
    {#if filteredCourses.filter(c => !c.isEnrolled).length === 0}
      <div class="text-center py-12">
        <BookOpen class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
        <p class="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredCourses.filter(c => !c.isEnrolled) as course}
          <div class="card p-6 hover:shadow-lg transition-shadow duration-200">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              class="w-full h-40 object-cover rounded-lg mb-4"
            />
            
            <div class="flex items-start justify-between mb-2">
              <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {course.level}
              </span>
              <div class="flex items-center space-x-1">
                <Star class="w-4 h-4 text-yellow-400 fill-current" />
                <span class="text-sm text-gray-600">{course.rating}</span>
              </div>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
            <p class="text-sm text-gray-600 mb-3">{course.description}</p>
            
            <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div class="flex items-center space-x-1">
                <Users class="w-4 h-4" />
                <span>{course.instructor}</span>
              </div>
              <div class="flex items-center space-x-1">
                <Clock class="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between mb-4">
              <span class="text-2xl font-bold text-gray-900">${course.price}</span>
              <span class="text-sm text-gray-500">{course.studentsEnrolled} students</span>
            </div>
            
            <button 
              on:click={() => enrollInCourse(course.id)}
              class="w-full btn btn-primary"
            >
              Enroll Now
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>