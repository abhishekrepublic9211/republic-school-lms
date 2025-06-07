<script lang="ts">
  import { onMount } from 'svelte';
  import { Star, Users, Clock, BookOpen, Play, Download, CheckCircle, Lock } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { courses, selectedCourse } from '../stores/courses';
  import { lectures } from '../stores/lectures';

  export let params: { id: string };

  let activeTab = 'overview';
  let currentLesson = 0;
  
  // Get lectures for this course
  $: courseLectures = $lectures.filter(lecture => lecture.courseId === params.id);

  onMount(() => {
    const course = $courses.find(c => c.id === params.id);
    if (course) {
      selectedCourse.set(course);
    }
  });

  function handleEnroll() {
    if ($selectedCourse) {
      courses.update(courseList => 
        courseList.map(course => 
          course.id === $selectedCourse.id 
            ? { ...course, isEnrolled: true, progress: 0 }
            : course
        )
      );
      selectedCourse.update(course => 
        course ? { ...course, isEnrolled: true, progress: 0 } : course
      );
    }
  }

  function markLessonComplete(lessonIndex: number) {
    if ($selectedCourse && $selectedCourse.isEnrolled) {
      const updatedCourse = { ...$selectedCourse };
      if (updatedCourse.lessons[lessonIndex]) {
        updatedCourse.lessons[lessonIndex].isCompleted = true;
        
        // Calculate new progress
        const completedLessons = updatedCourse.lessons.filter(l => l.isCompleted).length;
        updatedCourse.progress = Math.round((completedLessons / updatedCourse.lessons.length) * 100);
        
        selectedCourse.set(updatedCourse);
        
        // Update in courses store
        courses.update(courseList => 
          courseList.map(course => 
            course.id === updatedCourse.id ? updatedCourse : course
          )
        );
      }
    }
  }

  function getLessonIcon(type: string) {
    switch (type) {
      case 'video':
        return Play;
      case 'reading':
        return BookOpen;
      case 'quiz':
        return CheckCircle;
      case 'assignment':
        return Download;
      default:
        return BookOpen;
    }
  }
</script>

<Layout>
  {#if $selectedCourse}
    <div class="p-6 max-w-6xl mx-auto space-y-6">
      <!-- Course Header -->
      <div class="card p-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <span class="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-700">
                {$selectedCourse.category}
              </span>
              <span class="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
                {$selectedCourse.level}
              </span>
              <span class="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                {$selectedCourse.courseCode}
              </span>
            </div>
            
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{$selectedCourse.title}</h1>
            <p class="text-lg text-gray-600 mb-6">{$selectedCourse.description}</p>
            
            <div class="flex items-center space-x-6 mb-6">
              <div class="flex items-center space-x-2">
                <img 
                  src={$selectedCourse.instructorAvatar} 
                  alt={$selectedCourse.instructor}
                  class="w-8 h-8 rounded-full object-cover"
                />
                <span class="font-medium text-gray-900">{$selectedCourse.instructor}</span>
              </div>
              <div class="flex items-center space-x-1">
                <Star class="w-5 h-5 text-yellow-400 fill-current" />
                <span class="font-medium">{$selectedCourse.rating}</span>
                <span class="text-gray-500">({$selectedCourse.studentsEnrolled} students)</span>
              </div>
              <div class="flex items-center space-x-1">
                <Clock class="w-5 h-5 text-gray-400" />
                <span class="text-gray-600">{$selectedCourse.duration}</span>
              </div>
              <div class="flex items-center space-x-1">
                <BookOpen class="w-5 h-5 text-gray-400" />
                <span class="text-gray-600">{$selectedCourse.credits} credits</span>
              </div>
            </div>
            
            {#if $selectedCourse.schedule}
              <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Class Schedule</h4>
                <div class="text-sm text-gray-600">
                  <div><strong>Days:</strong> {$selectedCourse.schedule.days.join(', ')}</div>
                  <div><strong>Time:</strong> {$selectedCourse.schedule.time}</div>
                  <div><strong>Venue:</strong> {$selectedCourse.schedule.venue}</div>
                </div>
              </div>
            {/if}
            
            {#if $selectedCourse.isEnrolled && $selectedCourse.progress !== undefined}
              <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-gray-700">Your Progress</span>
                  <span class="font-bold text-primary-600">{$selectedCourse.progress}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                    style="width: {$selectedCourse.progress}%"
                  ></div>
                </div>
              </div>
            {/if}
          </div>
          
          <div class="lg:col-span-1">
            <div class="card p-6 sticky top-6">
              <img 
                src={$selectedCourse.thumbnail} 
                alt={$selectedCourse.title}
                class="w-full h-48 object-cover rounded-lg mb-6"
              />
              
              <div class="text-center mb-6">
                <div class="text-3xl font-bold text-primary-600 mb-2">${$selectedCourse.price}</div>
                <div class="text-sm text-gray-500">One-time payment</div>
              </div>
              
              {#if $selectedCourse.isEnrolled}
                <button class="w-full btn bg-success-600 text-white hover:bg-success-700 mb-4">
                  <CheckCircle class="w-5 h-5 mr-2" />
                  Enrolled
                </button>
              {:else}
                <button 
                  class="w-full btn btn-primary mb-4"
                  on:click={handleEnroll}
                >
                  Enroll Now
                </button>
              {/if}
              
              <div class="space-y-3 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Duration</span>
                  <span class="font-medium">{$selectedCourse.duration}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Lessons</span>
                  <span class="font-medium">{$selectedCourse.lessons.length}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Level</span>
                  <span class="font-medium">{$selectedCourse.level}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Credits</span>
                  <span class="font-medium">{$selectedCourse.credits}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Certificate</span>
                  <span class="font-medium">Yes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="card">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button 
              class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
              on:click={() => activeTab = 'overview'}
            >
              Overview
            </button>
            <button 
              class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'curriculum' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
              on:click={() => activeTab = 'curriculum'}
            >
              Curriculum
            </button>
            <button 
              class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'lectures' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
              on:click={() => activeTab = 'lectures'}
            >
              Lecture Schedule
            </button>
            <button 
              class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'instructor' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
              on:click={() => activeTab = 'instructor'}
            >
              Instructor
            </button>
          </nav>
        </div>

        <div class="p-6">
          {#if activeTab === 'overview'}
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {#each $selectedCourse.syllabus as item}
                    <div class="flex items-start space-x-3">
                      <CheckCircle class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                      <span class="text-gray-700">{item}</span>
                    </div>
                  {/each}
                </div>
              </div>
              
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-4">Course Description</h3>
                <div class="prose max-w-none text-gray-700">
                  <p>This comprehensive course is designed to provide you with the essential skills and knowledge needed to excel in modern journalism. Whether you're a beginner looking to start your career or an experienced professional seeking to update your skills, this course offers practical, hands-on learning experiences.</p>
                  
                  <p>Throughout the course, you'll work on real-world projects, receive personalized feedback from industry experts, and build a portfolio that showcases your abilities to potential employers.</p>
                  
                  <p>By the end of this course, you'll have the confidence and skills to pursue opportunities in digital journalism, traditional media, or freelance reporting.</p>
                </div>
              </div>
            </div>
          
          {:else if activeTab === 'curriculum'}
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-6">Course Curriculum</h3>
              <div class="space-y-4">
                {#each $selectedCourse.lessons as lesson, index}
                  <div class="border border-gray-200 rounded-lg p-4 {$selectedCourse.isEnrolled ? 'hover:shadow-md transition-shadow duration-200' : ''}">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          {#if lesson.isCompleted}
                            <CheckCircle class="w-5 h-5 text-success-500" />
                          {:else if !$selectedCourse.isEnrolled}
                            <Lock class="w-5 h-5 text-gray-400" />
                          {:else}
                            <svelte:component this={getLessonIcon(lesson.type)} class="w-5 h-5 text-gray-600" />
                          {/if}
                        </div>
                        <div>
                          <h4 class="font-medium text-gray-900">{lesson.title}</h4>
                          <div class="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{lesson.type}</span>
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      {#if $selectedCourse.isEnrolled && !lesson.isCompleted}
                        <button 
                          class="btn btn-primary text-sm"
                          on:click={() => markLessonComplete(index)}
                        >
                          {lesson.type === 'video' ? 'Watch' : lesson.type === 'reading' ? 'Read' : 'Start'}
                        </button>
                      {:else if lesson.isCompleted}
                        <span class="text-sm text-success-600 font-medium">Completed</span>
                      {/if}
                    </div>
                    
                    {#if lesson.resources && lesson.resources.length > 0}
                      <div class="mt-3 pt-3 border-t border-gray-100">
                        <div class="flex items-center space-x-4">
                          <span class="text-sm text-gray-600">Resources:</span>
                          {#each lesson.resources as resource}
                            <a 
                              href={resource.url} 
                              class="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download class="w-4 h-4" />
                              <span>{resource.title}</span>
                            </a>
                          {/each}
                        </div>
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          
          {:else if activeTab === 'lectures'}
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-6">Lecture Schedule</h3>
              {#if courseLectures.length > 0}
                <div class="space-y-4">
                  {#each courseLectures as lecture}
                    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <h4 class="font-semibold text-gray-900 mb-2">{lecture.title}</h4>
                          <p class="text-sm text-gray-600 mb-3">{lecture.description}</p>
                          
                          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span class="text-gray-500">Date:</span>
                              <div class="font-medium">{new Date(lecture.date).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <span class="text-gray-500">Time:</span>
                              <div class="font-medium">{lecture.time}</div>
                            </div>
                            <div>
                              <span class="text-gray-500">Duration:</span>
                              <div class="font-medium">{lecture.duration}</div>
                            </div>
                            <div>
                              <span class="text-gray-500">Venue:</span>
                              <div class="font-medium">{lecture.venue}</div>
                            </div>
                          </div>
                          
                          {#if lecture.materials.length > 0}
                            <div class="mt-3 pt-3 border-t border-gray-100">
                              <span class="text-sm text-gray-600 mb-2 block">Materials:</span>
                              <div class="flex flex-wrap gap-2">
                                {#each lecture.materials as material}
                                  <a 
                                    href={material.url} 
                                    class="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 transition-colors duration-200"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Download class="w-3 h-3" />
                                    <span>{material.title}</span>
                                  </a>
                                {/each}
                              </div>
                            </div>
                          {/if}
                          
                          {#if lecture.attendanceCount !== undefined}
                            <div class="mt-3 pt-3 border-t border-gray-100">
                              <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600">Attendance:</span>
                                <span class="font-medium text-gray-900">
                                  {lecture.attendanceCount}/{lecture.totalStudents} students
                                </span>
                              </div>
                            </div>
                          {/if}
                        </div>
                        
                        <div class="ml-4">
                          <a 
                            href="#/lectures/{lecture.id}" 
                            class="btn btn-primary text-sm px-4 py-2"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-center py-8 text-gray-500">
                  <BookOpen class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No lectures scheduled yet</p>
                </div>
              {/if}
            </div>
          
          {:else if activeTab === 'instructor'}
            <div class="space-y-6">
              <div class="flex items-start space-x-6">
                <img 
                  src={$selectedCourse.instructorAvatar} 
                  alt={$selectedCourse.instructor}
                  class="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">{$selectedCourse.instructor}</h3>
                  <p class="text-gray-600 mb-4">Senior Journalism Instructor</p>
                  <div class="flex items-center space-x-6 text-sm text-gray-500">
                    <div class="flex items-center space-x-1">
                      <Star class="w-4 h-4 text-yellow-400 fill-current" />
                      <span>4.9 Instructor Rating</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Users class="w-4 h-4" />
                      <span>15,000+ Students</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <BookOpen class="w-4 h-4" />
                      <span>12 Courses</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 class="text-lg font-bold text-gray-900 mb-3">About the Instructor</h4>
                <div class="prose max-w-none text-gray-700">
                  <p>With over 15 years of experience in journalism and media, our instructor brings real-world expertise to every lesson. They have worked with major news organizations and have been recognized for their contributions to digital journalism education.</p>
                  
                  <p>Their teaching approach combines theoretical knowledge with practical application, ensuring students gain both understanding and hands-on experience in modern journalism practices.</p>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <div class="p-6">
      <div class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
        <p class="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
        <a href="#/courses" class="btn btn-primary">Browse Courses</a>
      </div>
    </div>
  {/if}
</Layout>